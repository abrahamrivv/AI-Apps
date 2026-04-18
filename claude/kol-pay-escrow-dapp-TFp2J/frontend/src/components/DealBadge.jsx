import { getDealStatus } from "../hooks/useKOLPay";

export default function DealBadge({ deal }) {
  const status = getDealStatus(deal);
  if (status === "released") return <span className="badge-released">✓ Liberado</span>;
  if (status === "cancelled") return <span className="badge-cancelled">✕ Cancelado</span>;
  return <span className="badge-pending">⏳ Pendiente</span>;
}
