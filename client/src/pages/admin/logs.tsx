import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Monitor, Smartphone, Tablet, Globe, Search, Share2, Link2,
  Activity, MousePointerClick, Mail, Users, TrendingUp, MapPin,
  ChevronDown, ChevronRight, Clock, ArrowRight, Eye,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

const TABS = [
  { id: "overview", label: "概要" },
  { id: "sessions", label: "訪問者ログ" },
  { id: "sources", label: "流入元" },
  { id: "pages", label: "ページ別" },
];

const SOURCE_COLORS: Record<string, string> = {
  direct: "#111",
  organic: "#16a34a",
  social: "#7c3aed",
  referral: "#0369a1",
};
const PIE_COLORS = ["#111", "#1d4ed8", "#16a34a", "#7c3aed", "#dc2626", "#d97706", "#0891b2"];

function DeviceIcon({ device }: { device: string }) {
  if (device === "スマートフォン") return <Smartphone className="w-3.5 h-3.5" />;
  if (device === "タブレット") return <Tablet className="w-3.5 h-3.5" />;
  return <Monitor className="w-3.5 h-3.5" />;
}

function SourceIcon({ cat }: { cat: string }) {
  if (cat === "organic") return <Search className="w-3.5 h-3.5 text-green-600" />;
  if (cat === "social") return <Share2 className="w-3.5 h-3.5 text-purple-600" />;
  if (cat === "referral") return <Link2 className="w-3.5 h-3.5 text-blue-600" />;
  return <Globe className="w-3.5 h-3.5 text-gray-500" />;
}

function sourceCatLabel(cat: string) {
  if (cat === "organic") return "オーガニック";
  if (cat === "social") return "ソーシャル";
  if (cat === "referral") return "参照元";
  return "ダイレクト";
}

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div className="bg-white border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-gray-500 text-[11px]">{label}</p>
        <Icon className={`w-4 h-4 ${color || "text-gray-300"}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-gray-400 text-[10px] mt-0.5">{sub}</p>}
    </div>
  );
}

function SessionRow({ session }: { session: any }) {
  const [open, setOpen] = useState(false);
  const dur = session.duration > 0
    ? session.duration < 60 ? `${session.duration}秒` : `${Math.round(session.duration / 60)}分`
    : "—";

  return (
    <div className="border-b border-gray-50 last:border-0" data-testid={`session-row-${session.sessionId}`}>
      <div
        className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="w-5 flex-shrink-0 text-gray-300">
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </div>

        <div className="w-32 flex-shrink-0">
          <p className="text-gray-700 text-xs font-mono">{session.sessionId.slice(0, 8)}</p>
          <p className="text-gray-400 text-[10px]">
            {format(new Date(session.startAt), "M/d HH:mm", { locale: ja })}
          </p>
        </div>

        <div className="w-28 flex-shrink-0 flex items-center gap-1.5 text-gray-600 text-xs">
          <SourceIcon cat={session.sourceCategory} />
          <span className="truncate">{session.source}</span>
        </div>

        <div className="w-24 flex-shrink-0 flex items-center gap-1 text-gray-500 text-xs">
          <DeviceIcon device={session.device} />
          <span className="truncate">{session.device}</span>
        </div>

        <div className="w-20 flex-shrink-0 text-gray-500 text-xs truncate">
          {session.browser}
        </div>

        <div className="w-20 flex-shrink-0 text-gray-500 text-xs truncate">
          {session.os}
        </div>

        <div className="w-20 flex-shrink-0 flex items-center gap-1 text-gray-500 text-xs">
          {session.prefecture && <MapPin className="w-3 h-3 flex-shrink-0" />}
          <span className="truncate">{session.prefecture || "—"}</span>
        </div>

        <div className="w-14 flex-shrink-0 text-center">
          <span className="text-gray-600 text-xs font-medium">{session.pageCount}P</span>
          <span className="text-gray-300 text-[10px] ml-1">{dur}</span>
        </div>

        <div className="flex-1 flex items-center justify-end gap-2">
          {session.hasCV && (
            <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200 font-normal">
              CV {session.events.length}
            </Badge>
          )}
        </div>
      </div>

      {open && (
        <div className="px-10 pb-3 space-y-3 bg-gray-50 border-t border-gray-100">
          {session.referrer && (
            <div className="pt-2">
              <p className="text-gray-400 text-[10px] mb-0.5">参照元URL</p>
              <p className="text-gray-600 text-xs break-all">{session.referrer}</p>
            </div>
          )}

          <div>
            <p className="text-gray-400 text-[10px] mb-1 pt-2">ページ遷移</p>
            <div className="flex flex-wrap items-center gap-1">
              {session.pages.map((p: any, i: number) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="bg-white border border-gray-200 text-gray-700 text-[11px] px-2 py-0.5 font-mono rounded">
                    {p.path}
                  </span>
                  {i < session.pages.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {session.events.length > 0 && (
            <div>
              <p className="text-gray-400 text-[10px] mb-1">CV・イベント</p>
              <div className="flex flex-wrap gap-1.5">
                {session.events.map((ev: any, i: number) => (
                  <div key={i} className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded px-2 py-0.5">
                    <MousePointerClick className="w-3 h-3 text-blue-500" />
                    <span className="text-blue-700 text-[11px]">{ev.name}</span>
                    {ev.path && <span className="text-blue-400 text-[10px]">{ev.path}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-1 pb-0.5">
            <p className="text-gray-400 text-[10px] mb-0.5">UserAgent</p>
            <p className="text-gray-400 text-[10px] break-all font-mono">{session.userAgent || "—"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLogs() {
  const [days, setDays] = useState(30);
  const [tab, setTab] = useState("overview");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [deviceFilter, setDeviceFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/visitors", days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/visitors?days=${days}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const sessions: any[] = data?.sessions || [];

  const filtered = sessions.filter((s) => {
    if (sourceFilter && s.sourceCategory !== sourceFilter) return false;
    if (deviceFilter && s.device !== deviceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.sessionId.includes(q) ||
        s.source.toLowerCase().includes(q) ||
        s.prefecture.toLowerCase().includes(q) ||
        s.pages.some((p: any) => p.path.includes(q))
      );
    }
    return true;
  });

  const pvByDay = (() => {
    const map: Record<string, number> = {};
    for (const s of sessions) {
      const d = s.startAt?.split("T")[0];
      if (d) map[d] = (map[d] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
  })();

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">訪問者ログ</h1>
            <p className="text-gray-400 text-xs mt-0.5">流入元・デバイス・CV・地域・ページ遷移を確認</p>
          </div>
          <div className="flex border border-gray-200">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 text-xs transition-colors ${days === d ? "bg-black text-white" : "text-gray-500 hover:text-gray-900"}`}
                data-testid={`btn-days-${d}`}
              >
                {d}日
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${tab === t.id ? "border-black text-gray-900 font-medium" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              data-testid={`tab-${t.id}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Users} label="セッション数" value={(data?.totalSessions ?? 0).toLocaleString()} sub={`直近${days}日`} color="text-blue-400" />
              <StatCard icon={Eye} label="ページビュー" value={(data?.totalPV ?? 0).toLocaleString()} sub={`平均 ${data?.avgPages ?? 0}P/セッション`} color="text-gray-400" />
              <StatCard icon={MousePointerClick} label="CVセッション" value={(data?.cvSessions ?? 0).toLocaleString()} sub={`CV率 ${data?.cvRate ?? 0}%`} color="text-green-500" />
              <StatCard icon={Activity} label="イベント合計" value={(data?.totalEvents ?? 0).toLocaleString()} sub="クリック・送信等" color="text-purple-400" />
            </div>

            {pvByDay.length > 0 && (
              <div className="bg-white border border-gray-200 p-4">
                <p className="text-gray-700 text-sm font-medium mb-4">セッション推移</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={pvByDay} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 0, fontSize: 11 }} />
                    <Bar dataKey="count" fill="#111" radius={[2, 2, 0, 0]} name="セッション" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Source pie */}
              <div className="bg-white border border-gray-200 p-4">
                <p className="text-gray-700 text-sm font-medium mb-3">流入元</p>
                {isLoading ? <Skeleton className="h-32 bg-gray-50" /> : (
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={data?.sourceBreakdown || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={50} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                        {(data?.sourceBreakdown || []).map((_: any, i: number) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Device pie */}
              <div className="bg-white border border-gray-200 p-4">
                <p className="text-gray-700 text-sm font-medium mb-3">デバイス</p>
                {isLoading ? <Skeleton className="h-32 bg-gray-50" /> : (
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={data?.deviceBreakdown || []} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={50} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                        {(data?.deviceBreakdown || []).map((_: any, i: number) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Prefecture */}
              <div className="bg-white border border-gray-200 p-4">
                <p className="text-gray-700 text-sm font-medium mb-3">地域（都道府県）</p>
                {isLoading ? <Skeleton className="h-32 bg-gray-50" /> : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {(data?.prefBreakdown || []).slice(0, 10).map((p: any) => (
                      <div key={p.name} className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-300 flex-shrink-0" />
                        <span className="text-gray-600 text-xs flex-1 truncate">{p.name}</span>
                        <span className="text-gray-500 text-xs font-medium">{p.count}</span>
                      </div>
                    ))}
                    {(!data?.prefBreakdown?.length) && <p className="text-gray-300 text-xs">データなし</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Browser breakdown */}
            <div className="bg-white border border-gray-200 p-4">
              <p className="text-gray-700 text-sm font-medium mb-3">ブラウザ別セッション</p>
              {isLoading ? <Skeleton className="h-20 bg-gray-50" /> : (
                <div className="flex flex-wrap gap-3">
                  {(data?.browserBreakdown || []).map((b: any) => (
                    <div key={b.name} className="flex items-center gap-2 border border-gray-100 px-3 py-1.5">
                      <span className="text-gray-700 text-xs font-medium">{b.name}</span>
                      <span className="text-gray-400 text-xs">{b.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SESSIONS */}
        {tab === "sessions" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="セッションID・ページ・地域で検索…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 text-xs px-3 py-1.5 w-64 focus:outline-none focus:border-gray-400"
                data-testid="input-session-search"
              />
              <div className="flex gap-1">
                {["direct", "organic", "social", "referral"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSourceFilter(sourceFilter === cat ? null : cat)}
                    className={`px-2.5 py-1 text-[11px] border transition-colors ${sourceFilter === cat ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                    data-testid={`filter-source-${cat}`}
                  >
                    {sourceCatLabel(cat)}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {["PC", "スマートフォン", "タブレット"].map((dev) => (
                  <button
                    key={dev}
                    onClick={() => setDeviceFilter(deviceFilter === dev ? null : dev)}
                    className={`px-2.5 py-1 text-[11px] border transition-colors ${deviceFilter === dev ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                    data-testid={`filter-device-${dev}`}
                  >
                    {dev}
                  </button>
                ))}
              </div>
              <span className="text-gray-400 text-xs ml-auto">{filtered.length}件</span>
            </div>

            <div className="bg-white border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-3 text-gray-400 text-[10px] font-medium uppercase tracking-wide">
                <div className="w-5 flex-shrink-0" />
                <div className="w-32 flex-shrink-0">セッションID / 日時</div>
                <div className="w-28 flex-shrink-0">流入元</div>
                <div className="w-24 flex-shrink-0">デバイス</div>
                <div className="w-20 flex-shrink-0">ブラウザ</div>
                <div className="w-20 flex-shrink-0">OS</div>
                <div className="w-20 flex-shrink-0">地域</div>
                <div className="w-14 flex-shrink-0 text-center">PV/時間</div>
                <div className="flex-1 text-right">CV</div>
              </div>

              {isLoading ? (
                <div className="p-4 space-y-2">
                  {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-10 bg-gray-50" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-gray-300">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">訪問者データがありません</p>
                </div>
              ) : (
                <div>
                  {filtered.slice(0, 200).map((s: any) => (
                    <SessionRow key={s.sessionId} session={s} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SOURCES */}
        {tab === "sources" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 p-4">
                <p className="text-gray-700 text-sm font-medium mb-4">流入元別セッション数</p>
                {isLoading ? <Skeleton className="h-48 bg-gray-50" /> : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data?.sourceBreakdown || []} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "#374151", fontSize: 11 }} width={90} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 0 }} />
                      <Bar dataKey="count" fill="#111" radius={[0, 2, 2, 0]} name="セッション" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-white border border-gray-200 p-4">
                <p className="text-gray-700 text-sm font-medium mb-4">流入カテゴリ別</p>
                {isLoading ? <Skeleton className="h-48 bg-gray-50" /> : (() => {
                  const catMap: Record<string, number> = {};
                  for (const s of sessions) catMap[s.sourceCategory] = (catMap[s.sourceCategory] || 0) + 1;
                  const catData = Object.entries(catMap).map(([cat, count]) => ({ cat, label: sourceCatLabel(cat), count }));
                  return (
                    <div className="space-y-3 pt-1">
                      {catData.sort((a, b) => b.count - a.count).map((c) => {
                        const pct = sessions.length ? Math.round((c.count / sessions.length) * 100) : 0;
                        return (
                          <div key={c.cat}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <SourceIcon cat={c.cat} />
                                <span className="text-gray-700 text-sm">{c.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-xs">{pct}%</span>
                                <span className="text-gray-900 text-sm font-medium">{c.count}</span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, backgroundColor: SOURCE_COLORS[c.cat] || "#111" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="bg-white border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-gray-700 text-sm font-medium">流入元詳細</p>
              </div>
              <div className="divide-y divide-gray-50">
                {isLoading ? (
                  <div className="p-4 space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-8 bg-gray-50" />)}</div>
                ) : (
                  (data?.sourceBreakdown || []).map((s: any, i: number) => {
                    const pct = data.totalSessions ? Math.round((s.count / data.totalSessions) * 100) : 0;
                    return (
                      <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                        <span className="text-gray-400 text-xs w-5">{i + 1}</span>
                        <Globe className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                        <span className="text-gray-700 text-sm flex-1 truncate">{s.name}</span>
                        <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs w-8 text-right">{pct}%</span>
                        <span className="text-gray-900 text-sm font-medium w-10 text-right">{s.count}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* PAGES */}
        {tab === "pages" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <p className="text-gray-700 text-sm font-medium">ページ別PV</p>
              </div>
              <div className="divide-y divide-gray-50">
                {isLoading ? (
                  <div className="p-4 space-y-2">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-8 bg-gray-50" />)}</div>
                ) : (
                  (data?.topPages || []).map((p: any, i: number) => {
                    const max = data.topPages[0]?.count || 1;
                    const pct = Math.round((p.count / max) * 100);
                    return (
                      <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                        <span className="text-gray-400 text-xs w-5">{i + 1}</span>
                        <span className="text-gray-700 text-sm font-mono flex-1 truncate">{p.path}</span>
                        <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-black rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-gray-900 text-sm font-medium w-12 text-right">{p.count.toLocaleString()}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {(data?.topPages?.length ?? 0) > 0 && (
              <div className="bg-white border border-gray-200 p-4">
                <p className="text-gray-700 text-sm font-medium mb-4">ページ別PV グラフ</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data?.topPages || []} layout="vertical" margin={{ top: 0, right: 30, left: 100, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                    <YAxis dataKey="path" type="category" tick={{ fill: "#374151", fontSize: 10 }} width={120} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 0 }} />
                    <Bar dataKey="count" fill="#1d4ed8" radius={[0, 2, 2, 0]} name="PV" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
