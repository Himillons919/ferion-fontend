import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const LIVE_STATUSES = new Set(["LIVE", "ACTIVE"]);
const CLOSED_SUCCESS_STATUSES = new Set([
  "CLOSED_SUCCESS",
  "CLOSED",
  "SUCCESSFUL",
]);
const COUNTED_SUBSCRIPTION_STATUSES = new Set(["CONFIRMED", "SETTLED"]);

const normalizeStatus = (status?: string | null) =>
  (status ?? "").trim().toUpperCase();

const DEFAULT_INTERVAL = "month";
const DEFAULT_BUCKETS = 6;

type Interval = "day" | "week" | "month";

function parseInterval(value?: string | null): Interval {
  if (value === "day" || value === "week" || value === "month") return value;
  return DEFAULT_INTERVAL;
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff));
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function floorToInterval(date: Date, interval: Interval) {
  if (interval === "month") return startOfMonth(date);
  if (interval === "week") return startOfWeek(date);
  return startOfDay(date);
}

function addInterval(date: Date, interval: Interval, amount: number) {
  if (interval === "month") {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }
  if (interval === "week") {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount * 7);
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function formatDateKey(date: Date, interval: Interval) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  if (interval === "month") {
    return `${yyyy}-${mm}`;
  }
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildBuckets(start: Date, end: Date, interval: Interval) {
  const buckets: Date[] = [];
  let cursor = start;
  while (cursor <= end) {
    buckets.push(cursor);
    cursor = addInterval(cursor, interval, 1);
  }
  return buckets;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const interval = parseInterval(searchParams.get("interval"));
    const startParam = parseDate(searchParams.get("startDate"));
    const endParam = parseDate(searchParams.get("endDate"));
    const endDate = endParam ?? new Date();
    const alignedEnd = floorToInterval(endDate, interval);
    const startDate = startParam
      ? floorToInterval(startParam, interval)
      : addInterval(alignedEnd, interval, -(DEFAULT_BUCKETS - 1));

    if (startDate > endDate) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 },
      );
    }

    const buckets = buildBuckets(startDate, endDate, interval);
    const bucketCount = buckets.length;

    const createdAggregate = await prisma.project.aggregate({
      where: { enterpriseId: user.enterpriseId },
      _sum: { assetValue: true },
    });

    const offerings = await prisma.offering.findMany({
      where: { project: { enterpriseId: user.enterpriseId } },
      select: {
        status: true,
        capAmountUsd: true,
        subscriptions: {
          select: { amountUsd: true, status: true },
        },
      },
    });

    let activeRemaining = 0;
    let activeSubscribed = 0;
    let closedRaised = 0;

    for (const offering of offerings) {
      const offeringStatus = normalizeStatus(offering.status);
      const subscribedAmount = offering.subscriptions.reduce((sum, sub) => {
        const subStatus = normalizeStatus(sub.status);
        if (!COUNTED_SUBSCRIPTION_STATUSES.has(subStatus)) return sum;
        return sum + (sub.amountUsd || 0);
      }, 0);

      if (LIVE_STATUSES.has(offeringStatus)) {
        activeSubscribed += subscribedAmount;
        activeRemaining += Math.max(
          (offering.capAmountUsd || 0) - subscribedAmount,
          0,
        );
      } else if (CLOSED_SUCCESS_STATUSES.has(offeringStatus)) {
        closedRaised += subscribedAmount;
      }
    }

    const assetsInRange = await prisma.project.findMany({
      where: {
        enterpriseId: user.enterpriseId,
        createdAt: {
          gte: startDate,
          lte: endOfDay(endDate),
        },
      },
      select: { createdAt: true, assetValue: true },
    });

    const bucketMap = new Map<string, number>();
    for (const bucket of buckets) {
      bucketMap.set(formatDateKey(bucket, interval), 0);
    }
    for (const project of assetsInRange) {
      const bucket = floorToInterval(project.createdAt, interval);
      const key = formatDateKey(bucket, interval);
      if (!bucketMap.has(key)) continue;
      bucketMap.set(key, (bucketMap.get(key) ?? 0) + (project.assetValue ?? 0));
    }

    const points = buckets.map((bucket) => {
      const key = formatDateKey(bucket, interval);
      return { date: key, value: bucketMap.get(key) ?? 0 };
    });
    const total = points.reduce((sum, point) => sum + point.value, 0);

    const previousStart = addInterval(startDate, interval, -bucketCount);
    const previousEnd = addDays(startDate, -1);
    const previousAggregate = await prisma.project.aggregate({
      where: {
        enterpriseId: user.enterpriseId,
        createdAt: {
          gte: previousStart,
          lte: endOfDay(previousEnd),
        },
      },
      _sum: { assetValue: true },
    });
    const previousTotal = previousAggregate._sum.assetValue ?? 0;
    const changePct =
      previousTotal > 0 ? (total - previousTotal) / previousTotal : 0;

    const totalCreated = createdAggregate._sum.assetValue ?? 0;
    const notYetOffered = Math.max(
      totalCreated - activeRemaining - activeSubscribed - closedRaised,
      0,
    );

    return NextResponse.json({
      metrics: {
        totalCreated,
        activeRemaining,
        activeSubscribed,
        closedRaised,
        notYetOffered,
      },
      newAssets: {
        interval,
        startDate: formatDateKey(startDate, interval),
        endDate: formatDateKey(endDate, interval),
        points,
        total,
        previousTotal,
        changePct,
      },
    });
  } catch (error) {
    console.error("Overview metrics error", error);
    return NextResponse.json(
      { error: "Failed to fetch overview metrics" },
      { status: 500 },
    );
  }
}
