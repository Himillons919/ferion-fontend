import { Wallet, AlertCircle } from 'lucide-react';
import { BlockchainInput } from '@/lib/validators';

type ChainErrors = Partial<Record<keyof BlockchainInput, string | undefined>>;
type NetworkOption = { label: string; value: string };

interface StepProps {
  values: BlockchainInput;
  errors?: ChainErrors;
  networks: NetworkOption[];
  onChange: <K extends keyof BlockchainInput>(
    key: K,
    value: BlockchainInput[K]
  ) => void;
}

export function StepBlockchainSettings({ values, errors, networks, onChange }: StepProps) {
  const isValidWallet = /^0x[a-fA-F0-9]{40}$/.test(values.walletAddress);
  const showWalletError = values.walletAddress.length > 0 && !isValidWallet;
  const mainnets = networks.filter((n) => !n.label.toLowerCase().includes('testnet'));
  const testnets = networks.filter((n) => n.label.toLowerCase().includes('testnet'));

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 pb-4 border-b border-slate-200">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Wallet className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-slate-900">Blockchain Settings</h2>
          <p className="text-slate-600 mt-1">
            Configure wallet address and network for your project
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Wallet Address */}
        <div>
          <label className="block text-slate-700 mb-2">
            Wallet Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={values.walletAddress}
            onChange={(e) => onChange('walletAddress', e.target.value)}
            placeholder="0x..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono ${
              showWalletError
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-300 focus:border-blue-500'
            }`}
          />
          {errors?.walletAddress && (
            <div className="mt-2 text-sm text-red-600">{errors.walletAddress}</div>
          )}
          {showWalletError && (
            <div className="mt-2 flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>Invalid EVM wallet address. Must be 42 characters starting with 0x</span>
            </div>
          )}
          {isValidWallet && (
            <div className="mt-2 flex items-center gap-2 text-emerald-600">
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span>Valid wallet address</span>
            </div>
          )}
          <div className="mt-2 text-slate-500">
            Ensure you control this wallet address
          </div>
        </div>

        {/* Blockchain Network */}
        <div>
          <label className="block text-slate-700 mb-2">
            Blockchain Network <span className="text-red-500">*</span>
          </label>
          <select
            value={values.network}
            onChange={(e) => onChange('network', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Select network</option>
            <optgroup label="Mainnet">
              {mainnets.map((network) => (
                <option key={network.value} value={network.value}>
                  {network.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Testnet">
              {testnets.map((network) => (
                <option key={network.value} value={network.value}>
                  {network.label}
                </option>
              ))}
            </optgroup>
          </select>
          {errors?.network && (
            <div className="mt-1 text-sm text-red-600">{errors.network}</div>
          )}
          <div className="mt-2 text-slate-500">
            Network selection will affect token deployment and gas fees
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-blue-900">Important Note</div>
              <div className="text-blue-700 mt-1">
                Once you proceed to the Developing phase and deploy smart contracts, 
                the blockchain network cannot be changed. Choose carefully.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
