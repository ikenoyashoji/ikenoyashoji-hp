import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ClipboardList, MousePointerClick, Mail, FileText, Eye, Activity } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  event:           { icon: MousePointerClick, color: "text-blue-600",  bg: "bg-blue-50 border-blue-100" },
  contact:         { icon: Mail,             color: "text-green-600", bg: "bg-green-50 border-green-100" },
  article_publish: { icon: Eye,              color: "text-purple-600",bg: "bg-purple-50 border-purple-100" },
  article_create:  { icon: FileText,         color: "text-gray-600",  bg: "bg-gray-50 border-gray-100" },
};

export default function AdminLogs() {
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/logs", days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/logs?days=${days}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const logs: any[] = data?.logs || [];

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">アクティビティログ</h1>
            <p className="text-gray-400 text-xs mt-0.5">サイトのイベント・問い合わせ・記事操作の履歴</p>
          </div>
          <div className="flex border border-gray-200">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-xs transition-colors ${days === d ? "bg-black text-white" : "text-gray-500 hover:text-gray-900"}`}
                data-testid={`tab-logs-${d}days`}
              >
                {d}日
              </button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "ページビュー", value: data?.totalPV ?? 0, icon: Activity },
            { label: "イベント（CV）", value: data?.totalEvents ?? 0, icon: MousePointerClick },
            { label: "問い合わせ", value: data?.totalContacts ?? 0, icon: Mail },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 p-4" data-testid={`log-stat-${s.label}`}>
              <div className="flex items-start justify-between mb-1">
                <p className="text-gray-500 text-[11px]">{s.label}</p>
                <s.icon className="w-4 h-4 text-gray-300" />
              </div>
              {isLoading ? (
                <Skeleton className="h-6 w-14 bg-gray-100" />
              ) : (
                <p className="text-xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
              )}
              <p className="text-gray-400 text-[10px] mt-0.5">直近{days}日</p>
            </div>
          ))}
        </div>

        {/* PV chart */}
        {data?.pvByDay?.length > 0 && (
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-gray-700 text-sm font-medium mb-4">ページビュー推移</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={data.pvByDay} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 0, fontSize: 11 }} />
                <Bar dataKey="count" fill="#111" radius={[2, 2, 0, 0]} name="PV" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Activity log */}
        <div className="bg-white border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 text-sm font-medium">アクティビティ一覧</span>
            <span className="text-gray-400 text-xs ml-auto">{logs.length}件</span>
          </div>

          {isLoading ? (
            <div className="p-4 space-y-2">
              {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 bg-gray-50" />)}
            </div>
          ) : logs.length === 0 ? (
            <div className="py-16 text-center text-gray-300">
              <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">アクティビティがありません</p>
              <p className="text-xs mt-1">期間を広げると表示される場合があります</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {logs.map((log: any, i: number) => {
                const cfg = typeConfig[log.type] || typeConfig.article_create;
                const Icon = cfg.icon;
                return (
                  <div key={i} className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors" data-testid={`log-row-${i}`}>
                    <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 border ${cfg.bg}`}>
                      <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-xs font-medium">{log.label}</p>
                      {log.detail && <p className="text-gray-400 text-[11px] truncate mt-0.5">{log.detail}</p>}
                    </div>
                    <span className="text-gray-300 text-[11px] flex-shrink-0 mt-0.5">
                      {format(new Date(log.time), "M/d HH:mm", { locale: ja })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
