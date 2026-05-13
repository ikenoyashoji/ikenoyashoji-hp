import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FileText, Eye, Zap, Users, TrendingUp, MapPin } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const typeLabel: Record<string, string> = { shipper: "荷主", recruit: "採用", partner: "協力" };

export default function AdminDashboard() {
  const [days, setDays] = useState(7);

  const { data: stats, isLoading: statsLoading } = useQuery<any>({ queryKey: ["/api/admin/stats"] });
  const { data: analytics, isLoading: analyticsLoading } = useQuery<any>({
    queryKey: ["/api/admin/analytics", days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics?days=${days}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });
  const { data: contacts } = useQuery<any[]>({ queryKey: ["/api/admin/contacts"] });
  const recentContacts = (contacts || []).slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">ダッシュボード</h1>
            <p className="text-gray-400 text-xs mt-0.5">サイトの概要・成果指標</p>
          </div>
          <div className="flex border border-gray-200">
            {[7, 28].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-1.5 text-xs transition-colors ${days === d ? "bg-black text-white" : "text-gray-500 hover:text-gray-900"}`}
                data-testid={`tab-${d}days`}
              >
                {d === 7 ? "7日" : "28日"}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "ページビュー", value: analytics?.totalPV ?? 0, icon: Eye, sub: `直近${days}日` },
            { label: "イベント（CV）", value: analytics?.totalEvents ?? 0, icon: Zap, sub: `直近${days}日` },
            { label: "公開記事数", value: stats?.articles?.published ?? 0, icon: FileText, sub: `下書き ${stats?.articles?.draft ?? 0}件` },
            { label: "問い合わせ数", value: stats?.contacts ?? 0, icon: Users, sub: "累計" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 p-4" data-testid={`stat-card-${s.label}`}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-500 text-[11px]">{s.label}</p>
                <s.icon className="w-4 h-4 text-gray-300" />
              </div>
              {statsLoading || analyticsLoading ? (
                <Skeleton className="h-7 w-16 bg-gray-100" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
              )}
              <p className="text-gray-400 text-[10px] mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* PV chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-4">
            <p className="text-gray-700 text-sm font-medium mb-4">ページビュー推移</p>
            {analyticsLoading ? (
              <Skeleton className="h-44 w-full bg-gray-100" />
            ) : analytics?.pvByDay?.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={analytics.pvByDay} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 0, color: "#111", fontSize: 11 }} />
                  <Bar dataKey="count" fill="#111111" radius={[2, 2, 0, 0]} name="PV" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex items-center justify-center text-gray-300 text-sm">データがありません</div>
            )}
          </div>

          {/* Events */}
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-gray-700 text-sm font-medium mb-4">イベント内訳</p>
            {analyticsLoading ? (
              <Skeleton className="h-44 w-full bg-gray-100" />
            ) : analytics?.eventsByName?.length > 0 ? (
              <div className="space-y-2.5">
                {analytics.eventsByName.slice(0, 6).map((e: any) => (
                  <div key={e.name} className="flex items-center gap-2">
                    <span className="text-gray-500 text-[11px] flex-1 truncate">{e.name}</span>
                    <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full"
                        style={{ width: `${(e.count / Math.max(...analytics.eventsByName.map((x: any) => x.count))) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-700 text-[11px] w-4 text-right font-medium">{e.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-gray-300 text-sm">イベントなし</div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Top pages */}
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-gray-700 text-sm font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-gray-400" /> 人気ページ TOP8
            </p>
            {analyticsLoading ? (
              <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-5 bg-gray-100" />)}</div>
            ) : (
              <div className="space-y-1.5">
                {(analytics?.topPages || []).slice(0, 8).map((p: any, i: number) => (
                  <div key={p.path} className="flex items-center gap-2">
                    <span className="text-gray-300 text-[11px] w-4 text-right">{i + 1}</span>
                    <span className="text-gray-600 text-[11px] flex-1 truncate">{p.path}</span>
                    <span className="text-gray-900 text-[11px] font-semibold">{p.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent contacts */}
          <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-700 text-sm font-medium">最近の問い合わせ</p>
              <Link href="/admin/contacts" className="text-gray-400 text-xs hover:text-gray-900 transition-colors">すべて見る →</Link>
            </div>
            {recentContacts.length === 0 ? (
              <div className="text-gray-300 text-sm py-8 text-center">問い合わせがありません</div>
            ) : (
              <div className="space-y-2.5">
                {recentContacts.map((c: any) => (
                  <div key={c.id} className="flex items-start gap-2 pb-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-[10px] px-1.5 py-0.5 border border-gray-200 text-gray-500 flex-shrink-0 mt-0.5">
                      {typeLabel[c.type] ?? c.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-xs font-medium truncate">{c.name}（{c.company || "個人"}）</p>
                      <p className="text-gray-400 text-[10px] truncate">{c.email}</p>
                    </div>
                    <span className="text-gray-300 text-[10px] flex-shrink-0">
                      {format(new Date(c.createdAt), "M/d", { locale: ja })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prefecture */}
        {analytics?.pvByPrefecture?.length > 0 && (
          <div className="bg-white border border-gray-200 p-4">
            <p className="text-gray-700 text-sm font-medium mb-4 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400" /> 都道府県別PV <span className="text-gray-300 text-[10px] font-normal">参考値</span>
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {analytics.pvByPrefecture.slice(0, 12).map((p: any) => (
                <div key={p.prefecture} className="border border-gray-100 p-2 text-center">
                  <div className="text-gray-900 text-sm font-bold">{p.count}</div>
                  <div className="text-gray-400 text-[10px] truncate">{p.prefecture}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin/articles/new", label: "新規記事作成", sub: "ブログ記事を書く" },
            { href: "/admin/keywords", label: "キーワード管理", sub: "SEKWを追加" },
            { href: "/admin/search-console", label: "サーチコンソール", sub: "順位を確認" },
            { href: "/admin/contacts", label: "問い合わせ一覧", sub: "未対応を確認" },
          ].map((a) => (
            <Link key={a.href} href={a.href}>
              <div className="bg-white border border-gray-200 p-4 hover:border-black transition-colors cursor-pointer">
                <div className="text-gray-900 text-sm font-semibold mb-0.5">{a.label}</div>
                <div className="text-gray-400 text-xs">{a.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
