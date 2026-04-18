import { useAccount } from "wagmi";
import {
  useDealsForKOL,
  useMultipleDeals,
  formatMon,
  shortAddr
} from "../hooks/useKOLPay";
import DealBadge from "./DealBadge";

function DealCard({ dealId }) {
  const { data: deals } = useMultipleDeals([dealId]);
  const deal = deals?.[0]?.result;

  if (!deal) return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-800 rounded w-2/3" />
    </div>
  );

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Deal #{dealId.toString()}</span>
        <DealBadge deal={deal} />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-0.5">Marca (cliente)</p>
        <p className="text-sm font-mono text-gray-200">{shortAddr(deal.client)}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-0.5">Entregable</p>
        <p className="text-sm text-gray-200">{deal.deliverable}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-0.5">Monto</p>
        <p className="text-xl font-bold text-neon">{formatMon(deal.amount)} MON</p>
      </div>

      {!deal.isReleased && !deal.isCancelled && (
        <p className="text-xs text-yellow-500/80 bg-yellow-500/5 border border-yellow-500/20 rounded-lg px-3 py-2">
          Fondos en escrow — la marca liberará el pago cuando completes el entregable.
        </p>
      )}
      {deal.isReleased && (
        <p className="text-xs text-neon/80 bg-neon/5 border border-neon/20 rounded-lg px-3 py-2">
          Pago recibido en tu wallet.
        </p>
      )}
      {deal.isCancelled && (
        <p className="text-xs text-red-400/80 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
          Contrato cancelado. Los fondos fueron devueltos a la marca.
        </p>
      )}
    </div>
  );
}

export default function KOLView() {
  const { address } = useAccount();
  const { data: dealIds, isLoading, refetch } = useDealsForKOL(address);

  const pendingDeals = [];
  const settledDeals = [];

  return (
    <div className="space-y-6">
      <div className="card bg-gray-900/50">
        <p className="text-xs text-gray-500 mb-1">Tu wallet (KOL)</p>
        <p className="text-sm font-mono text-neon break-all">{address}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Contratos donde aparezco como KOL</h2>
          <button className="text-xs text-gray-500 hover:text-neon transition-colors" onClick={() => refetch()}>
            Actualizar
          </button>
        </div>

        {isLoading && <p className="text-gray-500 text-sm">Cargando contratos…</p>}
        {!isLoading && (!dealIds || dealIds.length === 0) && (
          <div className="card text-center py-10">
            <p className="text-gray-500">No tienes contratos asignados aún.</p>
            <p className="text-gray-600 text-sm mt-1">Pídele a una marca que te cree un contrato con tu wallet.</p>
          </div>
        )}
        {dealIds && dealIds.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...dealIds].reverse().map((id) => (
              <DealCard key={id.toString()} dealId={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
