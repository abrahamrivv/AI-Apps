import { useState } from "react";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import {
  useCreateDeal,
  useDealsForClient,
  useMultipleDeals,
  useReleaseFunds,
  useCancelDeal,
  formatMon,
  shortAddr
} from "../hooks/useKOLPay";
import DealBadge from "./DealBadge";
import TxStatus from "./TxStatus";

function CreateDealForm() {
  const [kolAddr, setKolAddr] = useState("");
  const [deliverable, setDeliverable] = useState("");
  const [amount, setAmount] = useState("");
  const { createDeal, isPending, isConfirming, isSuccess, error } = useCreateDeal();

  const valid = isAddress(kolAddr) && deliverable.trim().length > 0 && parseFloat(amount) > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    createDeal(kolAddr, deliverable.trim(), amount);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-neon mb-4">Crear nuevo contrato</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Wallet del KOL</label>
          <input
            className="input"
            placeholder="0x..."
            value={kolAddr}
            onChange={(e) => setKolAddr(e.target.value)}
          />
          {kolAddr && !isAddress(kolAddr) && (
            <p className="text-red-400 text-xs mt-1">Dirección inválida</p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Entregable</label>
          <textarea
            className="input resize-none"
            rows={3}
            placeholder="ej. 1 video en YouTube + 2 stories en Instagram"
            value={deliverable}
            onChange={(e) => setDeliverable(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Monto (MON)</label>
          <input
            className="input"
            type="number"
            min="0"
            step="any"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={!valid || isPending || isConfirming}>
          {isPending || isConfirming ? "Procesando…" : "Crear contrato y depositar fondos"}
        </button>

        <TxStatus hash={undefined} isPending={isPending} isConfirming={isConfirming} isSuccess={isSuccess} error={error} />
      </form>
    </div>
  );
}

function DealCard({ dealId }) {
  const { data: deal, refetch } = useMultipleDeals([dealId]);
  const dealData = deal?.[0]?.result;

  const release = useReleaseFunds();
  const cancel = useCancelDeal();

  const handleRelease = async () => {
    release.releaseFunds(dealId);
  };
  const handleCancel = async () => {
    cancel.cancelDeal(dealId);
  };

  if (!dealData) return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-800 rounded w-1/3 mb-2" />
      <div className="h-3 bg-gray-800 rounded w-2/3" />
    </div>
  );

  const isPending = !dealData.isReleased && !dealData.isCancelled;

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Deal #{dealId.toString()}</span>
        <DealBadge deal={dealData} />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-0.5">KOL</p>
        <p className="text-sm font-mono text-gray-200">{shortAddr(dealData.kol)}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-0.5">Entregable</p>
        <p className="text-sm text-gray-200">{dealData.deliverable}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-0.5">Monto en escrow</p>
        <p className="text-xl font-bold text-neon">{formatMon(dealData.amount)} MON</p>
      </div>

      {isPending && (
        <div className="flex gap-3 pt-2">
          <button
            className="btn-primary flex-1 text-sm py-2"
            onClick={handleRelease}
            disabled={release.isPending || release.isConfirming}
          >
            {release.isPending || release.isConfirming ? "Procesando…" : "Liberar pago"}
          </button>
          <button
            className="btn-danger flex-1 text-sm py-2"
            onClick={handleCancel}
            disabled={cancel.isPending || cancel.isConfirming}
          >
            {cancel.isPending || cancel.isConfirming ? "Procesando…" : "Cancelar y recuperar"}
          </button>
        </div>
      )}

      <TxStatus isPending={release.isPending} isConfirming={release.isConfirming} isSuccess={release.isSuccess} error={release.error} />
      <TxStatus isPending={cancel.isPending} isConfirming={cancel.isConfirming} isSuccess={cancel.isSuccess} error={cancel.error} />
    </div>
  );
}

export default function BrandView() {
  const { address } = useAccount();
  const { data: dealIds, isLoading, refetch } = useDealsForClient(address);

  return (
    <div className="space-y-8">
      <CreateDealForm />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Mis contratos activos</h2>
          <button className="text-xs text-gray-500 hover:text-neon transition-colors" onClick={() => refetch()}>
            Actualizar
          </button>
        </div>

        {isLoading && <p className="text-gray-500 text-sm">Cargando contratos…</p>}
        {!isLoading && (!dealIds || dealIds.length === 0) && (
          <div className="card text-center py-10">
            <p className="text-gray-500">No tienes contratos aún.</p>
            <p className="text-gray-600 text-sm mt-1">Crea tu primer contrato arriba.</p>
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
