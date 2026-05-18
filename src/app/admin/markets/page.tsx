import { MarketsConfigAdminClient } from "@/components/demo/markets-config-admin-client";

export default function AdminMarketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Market & tax configuration</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          JSON-first configuration surface aligned with pillar 4 (multi-country deployment). Validates
          structure in-browser; persists nowhere in this prototype.
        </p>
      </div>
      <MarketsConfigAdminClient />
    </div>
  );
}
