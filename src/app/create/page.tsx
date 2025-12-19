"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assetDetailsSchema,
  blockchainSchema,
  projectBasicsSchema,
  revenueModelSchema,
  tokenSettingsSchema,
  type AssetDetailsInput,
  type BlockchainInput,
  type ProjectBasicsInput,
  type RevenueModelInput,
  type TokenSettingsInput,
} from "@/lib/validators";
import { WizardLayout } from "@/components/figma-ui/WizardLayout";
import { StepContainer } from "@/components/figma-ui/StepContainer";
import { StepProjectBasics } from "@/components/figma-ui/StepProjectBasics";
import { StepBlockchainSettings } from "@/components/figma-ui/StepBlockchainSettings";
import { StepAssetDetails } from "@/components/figma-ui/StepAssetDetails";
import { StepTokenSettings } from "@/components/figma-ui/StepTokenSettings";
import { StepRevenueModel } from "@/components/figma-ui/StepRevenueModel";
import { StepReviewCreate } from "@/components/figma-ui/StepReviewCreate";
import { Project, Doc } from "@/types/project";

const assetTypes = [
  "Private equity stakes",
  "Venture capital investments",
  "Debt instruments",
  "Art & collectibles",
  "Commodities",
  "Intellectual property",
  "Revenue streams",
  "Infrastructure products",
  "Sports teams and clubs",
  "Carbon credits",
  "Music and film rights",
  "Luxury goods",
  "Precious metals",
  "Agricultural assets",
  "Gaming",
  "Healthcare",
  "Others",
];

const networks = [
  { label: "Ethereum (Mainnet)", value: "Ethereum" },
  { label: "Polygon (Mainnet)", value: "Polygon" },
  { label: "BNB Smart Chain", value: "BSC" },
  { label: "Arbitrum", value: "Arbitrum" },
  { label: "Avalanche", value: "Avalanche" },
  { label: "Sepolia (Testnet)", value: "Sepolia" },
  { label: "Mumbai (Testnet)", value: "Mumbai" },
];

const revenueModes = [
  "Fixed return",
  "Variable / performance-based return",
  "Hybrid / structured return",
  "Other",
];

const capitalProfiles = [
  "Bullet",
  "Amortizing",
  "Perpetual",
  "Open-ended",
];

const distributionPolicies = ["Distribute", "Reinvest", "Mixed"];
const payoutFrequencies = [
  "Monthly",
  "Quarterly",
  "Semi-annual",
  "Annual",
  "Event-based",
];

const wizardSteps = [
  { id: 1, title: "Project Basics" },
  { id: 2, title: "Blockchain Settings" },
  { id: 3, title: "Asset Details" },
  { id: 4, title: "Token Settings" },
  { id: 5, title: "Revenue Model" },
  { id: 6, title: "Review & Create" },
];

const revenueModeOptions = [
  { value: revenueModes[0], label: revenueModes[0], description: "稳定的固定收益结构" },
  { value: revenueModes[1], label: revenueModes[1], description: "收益随项目表现波动" },
  { value: revenueModes[2], label: revenueModes[2], description: "兼具固定与绩效收益" },
  { value: revenueModes[3], label: revenueModes[3], description: "自定义收益模型" },
];

const capitalProfileOptions = [
  { value: capitalProfiles[0], label: capitalProfiles[0], description: "到期一次性支付" },
  { value: capitalProfiles[1], label: capitalProfiles[1], description: "分期偿还本金" },
  { value: capitalProfiles[2], label: capitalProfiles[2], description: "无固定到期日的持续结构" },
  { value: capitalProfiles[3], label: capitalProfiles[3], description: "开放式流动结构" },
];

const distributionPolicyOptions = [
  { value: distributionPolicies[0], label: distributionPolicies[0], description: "收益现金分派" },
  { value: distributionPolicies[1], label: distributionPolicies[1], description: "自动再投资" },
  { value: distributionPolicies[2], label: distributionPolicies[2], description: "现金与再投资混合" },
];

const payoutFrequencyOptions = payoutFrequencies.map((freq) => ({
  value: freq,
  label: freq,
}));

function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function SuccessBox({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
      {message}
    </div>
  );
}

export default function CreateWizardPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [finalizing, setFinalizing] = useState(false);

  const basicsForm = useForm<ProjectBasicsInput, any, ProjectBasicsInput>({
    resolver: zodResolver(projectBasicsSchema),
    defaultValues: {
      projectName: "",
      assetType: "",
      projectDescription: "",
      acceptInstitutionalInvestors: false,
    },
  });

  const chainForm = useForm<BlockchainInput, any, BlockchainInput>({
    resolver: zodResolver(blockchainSchema),
    defaultValues: {
      walletAddress: "",
      network: "",
    },
  });

  const assetForm = useForm<AssetDetailsInput, any, AssetDetailsInput>({
    resolver: zodResolver(assetDetailsSchema),
    defaultValues: {
      assetLocation: "",
      assetDescription: "",
      assetValue: undefined,
    },
  });

  const tokenForm = useForm<TokenSettingsInput, any, TokenSettingsInput>({
    resolver: zodResolver(tokenSettingsSchema),
    defaultValues: {
      tokenName: "",
      tokenSymbol: "",
      totalSupply: undefined,
      tokenDecimals: 18,
      initialPrice: undefined,
    },
  });

  const revenueForm = useForm<RevenueModelInput, any, RevenueModelInput>({
    resolver: zodResolver(revenueModelSchema),
    defaultValues: {
      revenueMode: "",
      capitalProfile: "",
      distributionPolicy: "",
      payoutFrequency: "",
      annualReturn: 0,
      distributionNotes: "",
    },
  });

  useEffect(() => {
    if (!project) return;
    basicsForm.reset({
      projectName: project.name ?? "",
      assetType: project.assetType ?? "",
      projectDescription: project.description ?? "",
      acceptInstitutionalInvestors: project.acceptInstitutionalInvestors,
    });
    chainForm.reset({
      walletAddress: project.walletAddress ?? "",
      network: project.network ?? "",
    });
    assetForm.reset({
      assetLocation: project.assetLocation ?? "",
      assetDescription: project.assetDescription ?? "",
      assetValue: project.assetValue ?? undefined,
    });
    tokenForm.reset({
      tokenName: project.tokenName ?? "",
      tokenSymbol: project.tokenSymbol ?? "",
      totalSupply: project.totalSupply ?? undefined,
      tokenDecimals: project.tokenDecimals ?? 18,
      initialPrice: project.initialPrice ?? undefined,
    });
    revenueForm.reset({
      revenueMode: project.revenueMode ?? "",
      capitalProfile: project.capitalProfile ?? "",
      distributionPolicy: project.distributionPolicy ?? "",
      payoutFrequency: project.payoutFrequency ?? "",
      annualReturn: project.annualReturn ?? 0,
      distributionNotes: project.distributionNotes ?? "",
    });
  }, [project, basicsForm, chainForm, assetForm, tokenForm, revenueForm]);

  useEffect(() => {
    if (!projectId) return;
    const loadDocs = async () => {
      const res = await fetch(`/api/projects/${projectId}/documents`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents ?? []);
      }
    };
    loadDocs();
  }, [projectId]);

  useEffect(() => {
    const handleBack = () => setCurrentStep((prev) => Math.max(1, prev - 1));
    window.addEventListener("wizardBack", handleBack);
    return () => window.removeEventListener("wizardBack", handleBack);
  }, []);

  const handleStep1 = async (values: ProjectBasicsInput) => {
    setError(null);
    setSuccess(null);
    const res = await fetch("/api/projects/step1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, projectId }),
    });
    if (!res.ok) {
      setError("保存项目信息失败，请检查输入。");
      return;
    }
    const data = await res.json();
    setProject(data.project);
    setProjectId(data.project.id);
    setCurrentStep(2);
    setSuccess("已保存项目基础信息。");
  };

  const handleStep2 = async (values: BlockchainInput) => {
    if (!projectId) {
      setError("请先完成第 1 步创建项目。");
      return;
    }
    setError(null);
    setSuccess(null);
    const res = await fetch(`/api/projects/${projectId}/step2`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setError("保存链上设置失败，请检查输入。");
      return;
    }
    const data = await res.json();
    setProject(data.project);
    setCurrentStep(3);
    setSuccess("已保存链上设置。");
  };

  const handleStep3 = async (values: AssetDetailsInput) => {
    if (!projectId) {
      setError("请先完成第 1 步创建项目。");
      return;
    }
    setError(null);
    setSuccess(null);
    const res = await fetch(`/api/projects/${projectId}/step3`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setError("保存资产信息失败，请检查输入。");
      return;
    }
    const data = await res.json();
    setProject(data.project);
    setCurrentStep(4);
    setSuccess("已保存资产信息。");
  };

  const handleStep4 = async (values: TokenSettingsInput) => {
    if (!projectId) {
      setError("请先完成第 1 步创建项目。");
      return;
    }
    const assetValueForTokens =
      project?.assetValue ?? assetForm.getValues("assetValue");
    if (!assetValueForTokens) {
      setError("请先在资产信息中填写 Asset Value，用于计算发行总量。");
      return;
    }
    if (!values.initialPrice) {
      setError("请先填写 Initial Token Price。");
      return;
    }
    const computedSupply = Math.floor(
      Number(assetValueForTokens) / Number(values.initialPrice),
    );
    if (!Number.isFinite(computedSupply) || computedSupply <= 0) {
      setError("资产估值与初始单价的组合无效，无法计算总发行量。");
      return;
    }

    setError(null);
    setSuccess(null);
    const res = await fetch(`/api/projects/${projectId}/step4`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        totalSupply: computedSupply,
        tokenDecimals: 18,
      }),
    });
    if (!res.ok) {
      setError("保存 Token 信息失败，请检查输入。");
      return;
    }
    const data = await res.json();
    setProject(data.project);
    setCurrentStep(5);
    setSuccess("已保存 Token 参数。");
  };

  const handleStep5 = async (values: RevenueModelInput) => {
    if (!projectId) {
      setError("请先完成第 1 步创建项目。");
      return;
    }
    setError(null);
    setSuccess(null);
    const res = await fetch(`/api/projects/${projectId}/step5`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setError("保存收益模型失败，请检查输入。");
      return;
    }
    const data = await res.json();
    setProject(data.project);
    setCurrentStep(6);
    setSuccess("已保存收益模型。");
  };

  const uploadDocuments = async (files: FileList | null) => {
    if (!files || files.length === 0 || !projectId) return;
    setError(null);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        setError(`上传文件 ${file.name} 失败，请确认格式与大小。`);
        return;
      }
    }
    const refreshed = await fetch(`/api/projects/${projectId}/documents`);
    if (refreshed.ok) {
      const data = await refreshed.json();
      setDocuments(data.documents ?? []);
      setSuccess("已上传文件。");
    }
  };

  const handleFinalize = async () => {
    if (!projectId) {
      setError("请先完成各步骤信息。");
      return;
    }
    try {
      setFinalizing(true);
      setError(null);
      setSuccess(null);
      const res = await fetch(`/api/projects/${projectId}/finalize`, {
        method: "POST",
      });
      const data = await res.json();
      setFinalizing(false);
      if (!res.ok) {
        const missing = data?.missing?.join("，");
        setError(missing ? `缺失必填信息：${missing}` : "创建草案失败。");
        return;
      }
      setProject(data.project);
      setSuccess("项目草案已创建，正在跳转到控制台...");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setFinalizing(false);
      setError("创建草案失败，请稍后再试。");
    }
  };

  const basicsValues = basicsForm.watch();
  const chainValues = chainForm.watch();
  const assetValues = assetForm.watch();
  const tokenValues = tokenForm.watch();
  const revenueValues = revenueForm.watch();

  const basicsErrors = {
    projectName: basicsForm.formState.errors.projectName?.message,
    assetType: basicsForm.formState.errors.assetType?.message,
    projectDescription: basicsForm.formState.errors.projectDescription?.message,
    acceptInstitutionalInvestors:
      basicsForm.formState.errors.acceptInstitutionalInvestors?.message,
  };
  const chainErrors = {
    walletAddress: chainForm.formState.errors.walletAddress?.message,
    network: chainForm.formState.errors.network?.message,
  };
  const assetErrors = {
    assetLocation: assetForm.formState.errors.assetLocation?.message,
    assetDescription: assetForm.formState.errors.assetDescription?.message,
    assetValue: assetForm.formState.errors.assetValue?.message,
  };
  const tokenErrors = {
    tokenName: tokenForm.formState.errors.tokenName?.message,
    tokenSymbol: tokenForm.formState.errors.tokenSymbol?.message,
    initialPrice: tokenForm.formState.errors.initialPrice?.message,
  };
  const revenueErrors = {
    revenueMode: revenueForm.formState.errors.revenueMode?.message,
    capitalProfile: revenueForm.formState.errors.capitalProfile?.message,
    distributionPolicy: revenueForm.formState.errors.distributionPolicy?.message,
    payoutFrequency: revenueForm.formState.errors.payoutFrequency?.message,
    annualReturn: revenueForm.formState.errors.annualReturn?.message,
    distributionNotes: revenueForm.formState.errors.distributionNotes?.message,
  };

  const updateBasics = <K extends keyof ProjectBasicsInput>(
    key: K,
    value: ProjectBasicsInput[K]
  ) => {
    basicsForm.setValue(key, value, { shouldValidate: true, shouldDirty: true });
  };

  const updateChain = <K extends keyof BlockchainInput>(
    key: K,
    value: BlockchainInput[K]
  ) => {
    chainForm.setValue(key, value, { shouldValidate: true, shouldDirty: true });
  };

  const updateAsset = <K extends keyof AssetDetailsInput>(
    key: K,
    value: AssetDetailsInput[K]
  ) => {
    assetForm.setValue(key, value, { shouldValidate: true, shouldDirty: true });
  };

  const updateToken = <K extends keyof TokenSettingsInput>(
    key: K,
    value: TokenSettingsInput[K] | undefined
  ) => {
    tokenForm.setValue(key, value as TokenSettingsInput[K], { shouldValidate: true, shouldDirty: true });
  };

  const updateRevenue = <K extends keyof RevenueModelInput>(
    key: K,
    value: RevenueModelInput[K] | undefined
  ) => {
    revenueForm.setValue(key, value as RevenueModelInput[K], { shouldValidate: true, shouldDirty: true });
  };

  const submitStep1 = () => {
    basicsForm.handleSubmit(handleStep1)();
    return false;
  };

  const submitStep2 = () => {
    chainForm.handleSubmit(handleStep2)();
    return false;
  };

  const submitStep3 = () => {
    assetForm.handleSubmit(handleStep3)();
    return false;
  };

  const submitStep4 = () => {
    tokenForm.handleSubmit(handleStep4)();
    return false;
  };

  const submitStep5 = () => {
    revenueForm.handleSubmit(handleStep5)();
    return false;
  };

  const submitFinalize = () => {
    if (finalizing) return false;
    void handleFinalize();
    return false;
  };

  const tokenPreviewAssetValue = project?.assetValue ?? assetValues.assetValue ?? null;
  const autoTotalSupply =
    tokenPreviewAssetValue &&
    tokenValues.initialPrice &&
    Number(tokenValues.initialPrice) > 0
      ? Math.floor(
          Number(tokenPreviewAssetValue) / Number(tokenValues.initialPrice),
        )
      : null;
  const revenueProjectPreview = {
    assetType: project?.assetType ?? basicsValues.assetType,
    tokenSymbol: project?.tokenSymbol ?? tokenValues.tokenSymbol,
    totalSupply: project?.totalSupply ?? autoTotalSupply ?? null,
  };

  return (
    <WizardLayout
      currentStep={currentStep}
      totalSteps={wizardSteps.length}
      steps={wizardSteps}
      onNext={() => {}}
      onBack={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
      className="bg-gradient-to-br from-orange-50 via-white to-orange-100"
      contentClassName="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="space-y-6">
        <ErrorBox message={error} />
        <SuccessBox message={success} />

        {currentStep === 1 && (
          <StepContainer
            title="Project Basics"
            description="Define the fundamental information about your RWA project"
            onValidate={submitStep1}
          >
            <StepProjectBasics
              values={basicsValues}
              errors={basicsErrors}
              assetTypes={assetTypes}
              onChange={updateBasics}
            />
          </StepContainer>
        )}

        {currentStep === 2 && (
          <StepContainer
            title="Blockchain Settings"
            description="Configure wallet address and network"
            onValidate={submitStep2}
          >
            <StepBlockchainSettings
              values={chainValues}
              errors={chainErrors}
              networks={networks}
              onChange={updateChain}
            />
          </StepContainer>
        )}

        {currentStep === 3 && (
          <StepContainer
            title="Asset Details"
            description="Provide details and upload supporting documents"
            onValidate={submitStep3}
          >
            <StepAssetDetails
              values={assetValues}
              errors={assetErrors}
              documents={documents}
              onChange={updateAsset}
              onUpload={uploadDocuments}
            />
          </StepContainer>
        )}

        {currentStep === 4 && (
          <StepContainer
            title="Token Settings"
            description="Configure token parameters"
            onValidate={submitStep4}
          >
            <StepTokenSettings
              values={tokenValues}
              errors={tokenErrors}
              assetValue={tokenPreviewAssetValue}
              onChange={updateToken}
            />
          </StepContainer>
        )}

        {currentStep === 5 && (
          <StepContainer
            title="Revenue Model"
            description="Define the revenue structure and distribution strategy"
            onValidate={submitStep5}
          >
            <StepRevenueModel
              values={revenueValues}
              errors={revenueErrors}
              revenueModes={revenueModeOptions}
              capitalProfiles={capitalProfileOptions}
              distributionPolicies={distributionPolicyOptions}
              distributionFrequencies={payoutFrequencyOptions}
              projectPreview={revenueProjectPreview}
              onChange={updateRevenue}
            />
          </StepContainer>
        )}

        {currentStep === 6 && (
          <StepContainer
            title="Review & Create"
            description="复核所有设置，准备创建草案"
            onValidate={submitFinalize}
            isLastStep
          >
            <StepReviewCreate project={project} documents={documents} />
            {finalizing && (
              <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
                正在创建草案，请稍候...
              </div>
            )}
          </StepContainer>
        )}
      </div>
    </WizardLayout>
  );
}
