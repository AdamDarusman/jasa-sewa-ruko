export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function getStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
    case "SETTLEMENT":
      return {
        label: "LUNAS",
        bg: "bg-emerald-100",
        text: "text-emerald-800",
        border: "border-emerald-300",
      };
    case "PENDING":
      return {
        label: "MENUNGGU PEMBAYARAN",
        bg: "bg-amber-100",
        text: "text-amber-800",
        border: "border-amber-300",
      };
    case "CANCELLED":
    case "EXPIRED":
      return {
        label: "BATAL / KADALUARSA",
        bg: "bg-rose-100",
        text: "text-rose-800",
        border: "border-rose-300",
      };
    default:
      return {
        label: status,
        bg: "bg-slate-100",
        text: "text-slate-800",
        border: "border-slate-300",
      };
  }
}
