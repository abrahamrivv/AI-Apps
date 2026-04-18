import { useState } from "react";
import { useAccount } from "wagmi";
import ConnectWallet from "./components/ConnectWallet";
import BrandView from "./components/BrandView";
import KOLView from "./components/KOLView";

const ROLES = { HOME: "home", BRAND: "brand", KOL: "kol" };

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold">
        <span className="text-neon">KOL</span>
        <span className="text-white">Pay</span>
      </span>
      <span className="text-xs text-gray-600 border border-gray-700 rounded px-1.5 py-0.5">Monad Testnet</span>
    </div>
  );
}

function HomeScreen({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <Logo />
        <p className="text-gray-400 mt-3 max-w-sm mx-auto">
          Pagos seguros entre marcas e influencers.<br />
          Fondos en escrow on-chain. Sin intermediarios.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          className="btn-primary flex-1 py-5 text-lg"
          onClick={() => onSelect(ROLES.BRAND)}
        >
          Soy Marca
        </button>
        <button
          className="btn-secondary flex-1 py-5 text-lg"
          onClick={() => onSelect(ROLES.KOL)}
        >
          Soy KOL
        </button>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg text-center">
        {[
          { icon: "🔒", title: "Escrow seguro", desc: "Fondos bloqueados hasta cumplir el entregable" },
          { icon: "⚡", title: "On-chain", desc: "Todo en Monad — rápido, barato, transparente" },
          { icon: "🤝", title: "Sin fricción", desc: "Conecta wallet y listo, sin registro" }
        ].map((f) => (
          <div key={f.title} className="card py-5">
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="text-xs font-semibold text-gray-300">{f.title}</p>
            <p className="text-xs text-gray-600 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppShell({ role, onBack, children }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
              onClick={onBack}
            >
              ← Volver
            </button>
            <Logo />
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              role === ROLES.BRAND
                ? "bg-purple-500/10 text-purple-300 border border-purple-500/30"
                : "bg-neon/10 text-neon border border-neon/30"
            }`}>
              {role === ROLES.BRAND ? "Marca" : "KOL"}
            </span>
          </div>
          <ConnectWallet />
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}

function WalletGate({ children }) {
  const { isConnected } = useAccount();
  if (!isConnected) {
    return (
      <div className="card text-center py-12 max-w-sm mx-auto mt-8">
        <p className="text-gray-300 font-semibold mb-2">Conecta tu wallet para continuar</p>
        <p className="text-gray-500 text-sm mb-6">Necesitas una wallet en Monad Testnet</p>
        <ConnectWallet />
      </div>
    );
  }
  return children;
}

export default function App() {
  const [role, setRole] = useState(ROLES.HOME);

  if (role === ROLES.HOME) {
    return <HomeScreen onSelect={setRole} />;
  }

  return (
    <AppShell role={role} onBack={() => setRole(ROLES.HOME)}>
      <WalletGate>
        {role === ROLES.BRAND ? <BrandView /> : <KOLView />}
      </WalletGate>
    </AppShell>
  );
}
