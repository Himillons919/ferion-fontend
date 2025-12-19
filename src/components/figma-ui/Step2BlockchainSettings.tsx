import { ProjectData } from './ProjectCreationWizard';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Step2Props {
  data: ProjectData;
  onUpdate: (updates: Partial<ProjectData>) => void;
}

const BLOCKCHAIN_NETWORKS = [
  { value: '', label: 'Select network...' },
  { 
    category: 'Mainnet',
    options: [
      { value: 'ethereum', label: 'Ethereum Mainnet' },
      { value: 'polygon', label: 'Polygon' },
      { value: 'bsc', label: 'BNB Smart Chain' },
      { value: 'avalanche', label: 'Avalanche C-Chain' },
    ]
  },
  { 
    category: 'Testnet',
    options: [
      { value: 'sepolia', label: 'Sepolia (Ethereum Testnet)' },
      { value: 'mumbai', label: 'Mumbai (Polygon Testnet)' },
      { value: 'bsc_testnet', label: 'BNB Testnet' },
    ]
  },
];

export function Step2BlockchainSettings({ data, onUpdate }: Step2Props) {
  const [walletValidation, setWalletValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (data.walletAddress) {
      validateWalletAddress(data.walletAddress);
    } else {
      setWalletValidation(null);
    }
  }, [data.walletAddress]);

  const validateWalletAddress = (address: string) => {
    // EVM format: 42 characters, starts with 0x
    const evmRegex = /^0x[a-fA-F0-9]{40}$/;
    
    if (evmRegex.test(address)) {
      setWalletValidation({
        isValid: true,
        message: 'Valid EVM wallet address',
      });
    } else if (address.length > 0) {
      setWalletValidation({
        isValid: false,
        message: 'Invalid format. Must be 42 characters starting with 0x',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-slate-900 mb-1">Blockchain Settings</h3>
        <p className="text-sm text-slate-600">
          Configure wallet and network for on-chain operations
        </p>
      </div>

      <div className="space-y-5">
        {/* Wallet Address */}
        <div>
          <label htmlFor="walletAddress" className="block text-sm text-slate-700 mb-2">
            Wallet Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="walletAddress"
            value={data.walletAddress}
            onChange={(e) => onUpdate({ walletAddress: e.target.value })}
            placeholder="0x..."
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              walletValidation?.isValid === false
                ? 'border-red-300 focus:ring-red-500'
                : walletValidation?.isValid === true
                ? 'border-green-300 focus:ring-green-500'
                : 'border-slate-300 focus:ring-blue-500'
            }`}
          />
          
          {walletValidation && (
            <div className={`flex items-center gap-2 mt-2 text-sm ${
              walletValidation.isValid ? 'text-green-700' : 'text-red-700'
            }`}>
              {walletValidation.isValid ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>{walletValidation.message}</span>
            </div>
          )}
          
          <p className="text-xs text-slate-500 mt-1.5">
            Enter the EVM-compatible wallet address you control for this project
          </p>
        </div>

        {/* Blockchain Network */}
        <div>
          <label htmlFor="blockchainNetwork" className="block text-sm text-slate-700 mb-2">
            Blockchain Network <span className="text-red-500">*</span>
          </label>
          <select
            id="blockchainNetwork"
            value={data.blockchainNetwork}
            onChange={(e) => onUpdate({ blockchainNetwork: e.target.value })}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">Select network...</option>
            {BLOCKCHAIN_NETWORKS.slice(1).map((group) => (
              <optgroup key={group.category} label={group.category}>
                {(group.options ?? []).map((network) => (
                  <option key={network.value} value={network.value}>
                    {network.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1.5">
            Select mainnet for production or testnet for development
          </p>
        </div>
      </div>

      {/* Warning Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900">
              <strong>Important:</strong> The blockchain network you select here will determine where your tokens are deployed. This cannot be changed after smart contract deployment.
            </p>
          </div>
        </div>
      </div>

      {/* Network Info Card */}
      {data.blockchainNetwork && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="text-sm text-slate-900 mb-2">Selected Network</h4>
          <p className="text-sm text-slate-700">
            {BLOCKCHAIN_NETWORKS.flatMap(g => g.options || []).find(
              n => n.value === data.blockchainNetwork
            )?.label}
          </p>
        </div>
      )}
    </div>
  );
}
