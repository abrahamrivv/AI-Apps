import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { KOLPAY_ABI } from "../abi/KOLPay";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export function useContractAddress() {
  return CONTRACT_ADDRESS;
}

export function useDealCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: KOLPAY_ABI,
    functionName: "dealCount"
  });
}

export function useDealsForClient(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: KOLPAY_ABI,
    functionName: "getDealsForClient",
    args: [address],
    query: { enabled: !!address }
  });
}

export function useDealsForKOL(address) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: KOLPAY_ABI,
    functionName: "getDealsForKOL",
    args: [address],
    query: { enabled: !!address }
  });
}

export function useDeal(dealId) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: KOLPAY_ABI,
    functionName: "getDeal",
    args: [dealId],
    query: { enabled: dealId !== undefined && dealId !== null }
  });
}

export function useMultipleDeals(dealIds) {
  const contracts = (dealIds || []).map((id) => ({
    address: CONTRACT_ADDRESS,
    abi: KOLPAY_ABI,
    functionName: "getDeal",
    args: [id]
  }));

  return useReadContracts({
    contracts,
    query: { enabled: !!dealIds && dealIds.length > 0 }
  });
}

export function useCreateDeal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createDeal = (kolAddress, deliverable, amountMon) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: KOLPAY_ABI,
      functionName: "createDeal",
      args: [kolAddress, deliverable],
      value: parseEther(amountMon)
    });
  };

  return { createDeal, hash, isPending, isConfirming, isSuccess, error };
}

export function useReleaseFunds() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const releaseFunds = (dealId) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: KOLPAY_ABI,
      functionName: "releaseFunds",
      args: [dealId]
    });
  };

  return { releaseFunds, hash, isPending, isConfirming, isSuccess, error };
}

export function useCancelDeal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelDeal = (dealId) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: KOLPAY_ABI,
      functionName: "cancelDeal",
      args: [dealId]
    });
  };

  return { cancelDeal, hash, isPending, isConfirming, isSuccess, error };
}

export function getDealStatus(deal) {
  if (!deal) return "unknown";
  if (deal.isReleased) return "released";
  if (deal.isCancelled) return "cancelled";
  return "pending";
}

export function formatMon(wei) {
  if (!wei) return "0";
  return parseFloat(formatEther(wei)).toFixed(4);
}

export function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}
