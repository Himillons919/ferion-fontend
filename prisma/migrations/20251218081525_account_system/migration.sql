/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `orgId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `User` table. All the data in the column will be lost.
  - Added the required column `enterpriseId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ProjectRole_projectId_userId_role_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Document";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Organization";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProjectRole";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Enterprise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "kybStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "creatorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Enterprise_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "uploader" TEXT,
    "uploadTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "origin" TEXT NOT NULL,
    CONSTRAINT "ProjectFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimal" INTEGER NOT NULL,
    "contractAddress" TEXT,
    "totalSupply" INTEGER,
    "NAV" INTEGER,
    CONSTRAINT "ProjectToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    CONSTRAINT "UserProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InvitationRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "acceptTime" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InvitationRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enterpriseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT,
    "legal" TEXT,
    "ops" TEXT,
    "auditor" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "assetType" TEXT NOT NULL,
    "description" TEXT,
    "acceptInstitutionalInvestors" BOOLEAN NOT NULL DEFAULT false,
    "walletAddress" TEXT,
    "network" TEXT,
    "assetLocation" TEXT,
    "assetDescription" TEXT,
    "assetValue" REAL,
    "tokenName" TEXT,
    "tokenSymbol" TEXT,
    "totalSupply" INTEGER,
    "tokenDecimals" INTEGER DEFAULT 18,
    "initialPrice" REAL,
    "revenueMode" TEXT,
    "annualReturn" REAL,
    "payoutFrequency" TEXT,
    "capitalProfile" TEXT,
    "distributionPolicy" TEXT,
    "distributionNotes" TEXT,
    "lifecycleStage" TEXT NOT NULL DEFAULT 'CreatingInProgress',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("acceptInstitutionalInvestors", "annualReturn", "assetDescription", "assetLocation", "assetType", "assetValue", "capitalProfile", "createdAt", "createdBy", "currentStep", "description", "distributionNotes", "distributionPolicy", "id", "initialPrice", "lifecycleStage", "name", "network", "payoutFrequency", "revenueMode", "status", "tokenDecimals", "tokenName", "tokenSymbol", "totalSupply", "updatedAt", "updatedBy", "walletAddress") SELECT "acceptInstitutionalInvestors", "annualReturn", "assetDescription", "assetLocation", "assetType", "assetValue", "capitalProfile", "createdAt", "createdBy", "currentStep", "description", "distributionNotes", "distributionPolicy", "id", "initialPrice", "lifecycleStage", "name", "network", "payoutFrequency", "revenueMode", "status", "tokenDecimals", "tokenName", "tokenSymbol", "totalSupply", "updatedAt", "updatedBy", "walletAddress" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE INDEX "Project_enterpriseId_idx" ON "Project"("enterpriseId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "isCreator" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'ISSUER_MEMBER',
    "enterpriseId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectToken_projectId_symbol_key" ON "ProjectToken"("projectId", "symbol");

-- CreateIndex
CREATE UNIQUE INDEX "UserProject_userId_projectId_role_key" ON "UserProject"("userId", "projectId", "role");
