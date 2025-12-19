import { z } from "zod";

const preprocessNumber = (value: unknown) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
};

export const projectBasicsSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, { message: "Project name is required" })
    .max(100, { message: "Must be 100 characters or fewer" }),
  assetType: z.string().min(1, { message: "Asset type is required" }),
  projectDescription: z
    .string()
    .trim()
    .max(4000, { message: "Description is too long" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  acceptInstitutionalInvestors: z.boolean().optional().default(false),
});

export const blockchainSchema = z.object({
  walletAddress: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Wallet must be a valid EVM address",
    }),
  network: z.string().min(1, { message: "Network is required" }),
});

export const assetDetailsSchema = z.object({
  assetLocation: z
    .string()
    .trim()
    .min(1, { message: "Asset location is required" }),
  assetDescription: z
    .string()
    .trim()
    .min(1, { message: "Asset description is required" }),
  assetValue: z
    .preprocess(
      preprocessNumber,
      z.number().positive({ message: "Asset value is required" }),
    ),
});

export const tokenSettingsSchema = z.object({
  tokenName: z
    .string()
    .trim()
    .min(1, { message: "Token name is required" })
    .max(50, { message: "Token name is too long" }),
  tokenSymbol: z
    .string()
    .trim()
    .regex(/^[A-Z0-9]{2,8}$/, {
      message: "2-8 chars, uppercase letters or numbers",
    }),
  totalSupply: z
    .preprocess(
      preprocessNumber,
      z
        .number()
        .int()
        .positive({ message: "Total supply must be greater than 0" }),
    )
    .optional(),
  tokenDecimals: z.literal(18).default(18),
  initialPrice: z
    .preprocess(preprocessNumber, z.number().positive({ message: "Initial price must be greater than 0" })),
});

export const revenueModelSchema = z.object({
  revenueMode: z.string().min(1, { message: "Revenue mode is required" }),
  capitalProfile: z.string().min(1, { message: "Capital profile is required" }),
  distributionPolicy: z
    .string()
    .min(1, { message: "Distribution policy is required" }),
  payoutFrequency: z
    .string()
    .min(1, { message: "Distribution frequency is required" }),
  annualReturn: z.preprocess(
    preprocessNumber,
    z
      .number()
      .min(-100, { message: "Too low" })
      .max(1000, { message: "Too high" })
  ),
  distributionNotes: z
    .string()
    .max(4000, { message: "Notes are too long" })
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

export type ProjectBasicsInput = z.infer<typeof projectBasicsSchema>;
export type BlockchainInput = z.infer<typeof blockchainSchema>;
export type AssetDetailsInput = z.infer<typeof assetDetailsSchema>;
export type TokenSettingsInput = z.infer<typeof tokenSettingsSchema>;
export type RevenueModelInput = z.infer<typeof revenueModelSchema>;

export type WizardFormValues = ProjectBasicsInput &
  BlockchainInput &
  AssetDetailsInput &
  TokenSettingsInput &
  RevenueModelInput & {
    distributionNotes?: string;
  };
