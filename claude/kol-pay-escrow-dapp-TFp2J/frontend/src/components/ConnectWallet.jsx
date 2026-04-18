import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { monadTestnet } from "../wagmiConfig";
import { shortAddr } from "../hooks/useKOLPay";

export default function ConnectWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== monadTestnet.id;

  if (!isConnected) {
    return (
      <div className="flex gap-2 flex-wrap">
        {connectors.map((c) => (
          <button key={c.id} className="btn-secondary text-sm py-2" onClick={() => connect({ connector: c })}>
            {c.name === "Injected" ? "MetaMask / Browser" : c.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {isWrongNetwork && (
        <button className="btn-danger text-sm py-2" onClick={() => switchChain({ chainId: monadTestnet.id })}>
          Switch to Monad
        </button>
      )}
      <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
        <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
        <span className="text-sm text-gray-300">{shortAddr(address)}</span>
      </div>
      <button className="text-sm text-gray-500 hover:text-red-400 transition-colors" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
