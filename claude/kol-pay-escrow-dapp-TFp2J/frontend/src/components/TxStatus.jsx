export default function TxStatus({ hash, isPending, isConfirming, isSuccess, error }) {
  if (error) {
    const msg = error.shortMessage || error.message || "Error desconocido";
    return <p className="text-red-400 text-sm mt-2">Error: {msg}</p>;
  }
  if (isPending) return <p className="text-neon text-sm mt-2 animate-pulse">Confirmando en wallet…</p>;
  if (isConfirming) return (
    <p className="text-neon text-sm mt-2 animate-pulse">
      Tx enviada, esperando confirmación…{" "}
      <a href={`https://testnet.monadexplorer.com/tx/${hash}`} target="_blank" rel="noreferrer" className="underline">
        Ver tx
      </a>
    </p>
  );
  if (isSuccess) return (
    <p className="text-neon text-sm mt-2">
      ✓ Transacción confirmada.{" "}
      <a href={`https://testnet.monadexplorer.com/tx/${hash}`} target="_blank" rel="noreferrer" className="underline">
        Ver tx
      </a>
    </p>
  );
  return null;
}
