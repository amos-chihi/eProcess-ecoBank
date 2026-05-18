/** Format integers as GHS for demo display. */
export function formatGhs(n: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(n);
}
