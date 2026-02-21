import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, Eye, Zap, Users, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const COLORS = ["#1a3a7a", "#f59e0b", "#10b981", "#6366f1", "#ef4444"];

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
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-black text-white">ダッシュボード</h1>
            <p className="text-blue-400 text-xs mt-0.5">サイトの概要・成果指標を確認</p>
          </div>
          <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <TabsList className="bg-[#0f2044] border border-blue-900">
              <TabsTrigger value="7" className="text-xs data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300" data-testid="tab-7days">直近7日</TabsTrigger>
              <TabsTrigger value="28" className="text-xs data-[state=active]:bg-blue-700 data-[state=active]:text-white text-blue-300" data-testid="tab-28days">直近28日</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "ページビュー", value: analytics?.totalPV ?? 0, icon: Eye, sub: `直近${days}日`, color: "text-blue-400" },
            { label: "イベント（CV）", value: analytics?.totalEvents ?? 0, icon: Zap, sub: `直近${days}日`, color: "text-amber-400" },
            { label: "公開記事数", value: stats?.articles?.published ?? 0, icon: FileText, sub: `下書き ${stats?.articles?.draft ?? 0}件`, color: "text-green-400" },
            { label: "問い合わせ数", value: stats?.contacts ?? 0, icon: Users, sub: "累計", color: "text-purple-400" },
          ].map((s) => (
            <Card key={s.label} className="bg-[#0f2044] border-blue-900" data-testid={`stat-card-${s.label}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-400 text-xs mb-1">{s.label}</p>
                    {statsLoading || analyticsLoading ? (
                      <Skeleton className="h-8 w-16 bg-blue-900" />
                    ) : (
                      <p className="text-2xl font-black text-white">{s.value.toLocaleString()}</p>
                    )}
                    <p className="text-blue-500 text-xs mt-0.5">{s.sub}</p>
                  </div>
                  <s.icon className={`w-5 h-5 ${s.color} mt-1`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* PV chart */}
          <Card className="lg:col-span-2 bg-[#0f2044] border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">ページビュー推移</CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Skeleton className="h-48 w-full bg-blue-900" />
              ) : analytics?.pvByDay?.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.pvByDay} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                    <XAxis dataKey="date" tick={{ fill: "#60a5fa", fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fill: "#60a5fa", fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f2044", border: "1px solid #1e3a5f", borderRadius: 6, color: "#fff" }} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} name="PV" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-blue-500 text-sm">データがありません</div>
              )}
            </CardContent>
          </Card>

          {/* Events breakdown */}
          <Card className="bg-[#0f2044] border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">イベント内訳</CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Skeleton className="h-48 w-full bg-blue-900" />
              ) : analytics?.eventsByName?.length > 0 ? (
                <div className="space-y-2">
                  {analytics.eventsByName.slice(0, 6).map((e: any, i: number) => (
                    <div key={e.name} className="flex items-center justify-between">
                      <span className="text-blue-300 text-xs truncate flex-1">{e.name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="w-16 h-1.5 bg-blue-900 rounded-full">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(e.count / Math.max(...analytics.eventsByName.map((x: any) => x.count))) * 100}%`,
                              backgroundColor: COLORS[i % COLORS.length]
                            }}
                          />
                        </div>
                        <span className="text-white text-xs w-5 text-right">{e.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-blue-500 text-sm">イベントなし</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Top pages */}
          <Card className="bg-[#0f2044] border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> 人気ページ TOP10
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="space-y-2">{[1,2,3,4].map(i => <Skeleton key={i} className="h-6 bg-blue-900" />)}</div>
              ) : (
                <div className="space-y-1.5">
                  {(analytics?.topPages || []).slice(0, 8).map((p: any, i: number) => (
                    <div key={p.path} className="flex items-center gap-2">
                      <span className="text-blue-500 text-xs w-4">{i + 1}</span>
                      <span className="text-blue-200 text-xs flex-1 truncate">{p.path}</span>
                      <Badge variant="secondary" className="text-xs ml-auto bg-blue-900 text-blue-300 border-0">{p.count}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent contacts */}
          <Card className="bg-[#0f2044] border-blue-900">
            <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-white text-sm">最近の問い合わせ</CardTitle>
              <Link href="/admin/contacts" className="text-blue-400 text-xs hover:text-white">すべて見る →</Link>
            </CardHeader>
            <CardContent>
              {recentContacts.length === 0 ? (
                <div className="text-blue-500 text-sm py-6 text-center">問い合わせがありません</div>
              ) : (
                <div className="space-y-2">
                  {recentContacts.map((c: any) => (
                    <div key={c.id} className="flex items-start gap-2 py-1.5 border-b border-blue-900 last:border-0">
                      <Badge
                        className="text-[10px] px-1.5 py-0 flex-shrink-0 mt-0.5"
                        variant={c.type === "shipper" ? "default" : c.type === "recruit" ? "secondary" : "outline"}
                      >
                        {c.type === "shipper" ? "荷主" : c.type === "recruit" ? "採用" : "協力"}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-blue-200 text-xs font-medium truncate">{c.name}（{c.company || "個人"}）</p>
                        <p className="text-blue-400 text-[10px] truncate">{c.email}</p>
                      </div>
                      <span className="text-blue-500 text-[10px] flex-shrink-0">
                        {format(new Date(c.createdAt), "M/d", { locale: ja })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Prefecture breakdown */}
        {analytics?.pvByPrefecture?.length > 0 && (
          <Card className="bg-[#0f2044] border-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" /> 都道府県別PV（推定）
                <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-700">参考値</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {analytics.pvByPrefecture.slice(0, 12).map((p: any) => (
                  <div key={p.prefecture} className="bg-blue-900/40 rounded p-2 text-center">
                    <div className="text-white text-sm font-bold">{p.count}</div>
                    <div className="text-blue-400 text-xs truncate">{p.prefecture}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: "/admin/articles", label: "新規記事作成", sub: "ブログ記事を書く" },
            { href: "/admin/keywords", label: "キーワード管理", sub: "SEKWを追加" },
            { href: "/admin/search-console", label: "サーチコンソール", sub: "順位を確認" },
            { href: "/admin/contacts", label: "問い合わせ一覧", sub: "未対応を確認" },
          ].map((a) => (
            <Link key={a.href} href={a.href}>
              <div className="bg-[#0f2044] border border-blue-900 rounded-lg p-4 hover:border-blue-600 transition-colors cursor-pointer hover-elevate">
                <div className="text-white text-sm font-semibold mb-0.5">{a.label}</div>
                <div className="text-blue-400 text-xs">{a.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
