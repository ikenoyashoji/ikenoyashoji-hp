import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  CheckCircle2, XCircle, AlertCircle, Mail, Bot, BarChart2, Globe,
  Database, Download, Trash2, Send, RefreshCw, Copy, ExternalLink,
  Shield, Eye, EyeOff, ChevronDown, ChevronRight, Server, Key,
} from "lucide-react";

function StatusBadge({ ok, label }: { ok: boolean; label?: string }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 text-[11px] px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> {label || "接続済み"}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 border border-red-200 text-[11px] px-2 py-0.5 rounded-full">
      <XCircle className="w-3 h-3" /> {label || "未設定"}
    </span>
  );
}

function EnvRow({ name, value, secret }: { name: string; value: string; secret?: boolean }) {
  const [show, setShow] = useState(false);
  const { toast } = useToast();
  const display = secret && !show ? (value ? "••••••••••••" : "—") : (value || "—");
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
      <code className="text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono flex-shrink-0 w-44 truncate">{name}</code>
      <span className="text-gray-600 text-xs flex-1 font-mono truncate">{display}</span>
      <div className="flex gap-1 flex-shrink-0">
        {secret && value && (
          <button onClick={() => setShow(!show)} className="p-1 text-gray-400 hover:text-gray-700">
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
        <button
          onClick={() => { navigator.clipboard.writeText(name); toast({ title: "コピーしました", description: name }); }}
          className="p-1 text-gray-400 hover:text-gray-700"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
      <StatusBadge ok={!!value} label={value ? "設定済み" : "未設定"} />
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100">
        <Icon className="w-4 h-4 text-gray-500" />
        <h2 className="text-gray-800 text-sm font-semibold">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function TestButton({ label, onTest }: { label: string; onTest: () => Promise<Response> }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    try {
      const res = await onTest();
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "エラー");
      toast({ title: "成功", description: data.message || "テスト成功" });
    } catch (e: any) {
      toast({ title: "エラー", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={run}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
      data-testid={`btn-test-${label}`}
    >
      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

function ConfirmDelete({ label, description, onConfirm }: { label: string; description: string; onConfirm: () => Promise<void> }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const run = async () => {
    setLoading(true);
    try {
      await onConfirm();
      toast({ title: "削除完了", description });
      setConfirm(false);
    } catch (e: any) {
      toast({ title: "エラー", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-red-200 text-red-500 hover:border-red-400 hover:text-red-700 transition-colors"
        data-testid={`btn-delete-${label}`}
      >
        <Trash2 className="w-3.5 h-3.5" />{label}
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-red-600 text-xs">本当に削除しますか？</span>
      <button onClick={run} disabled={loading} className="px-3 py-1.5 text-xs bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50">
        {loading ? "削除中…" : "削除する"}
      </button>
      <button onClick={() => setConfirm(false)} className="px-3 py-1.5 text-xs border border-gray-200 text-gray-500 hover:text-gray-700">
        キャンセル
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [smtpTestTo, setSmtpTestTo] = useState("");
  const [showEnv, setShowEnv] = useState(false);

  const { data: st, isLoading, refetch } = useQuery<any>({
    queryKey: ["/api/admin/settings/status"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings/status");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const downloadCSV = async (path: string, filename: string) => {
    const res = await fetch(path);
    if (!res.ok) { toast({ title: "エラー", description: "エクスポート失敗", variant: "destructive" }); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast({ title: "ダウンロード開始", description: filename });
  };

  const clearData = async (path: string) => {
    const res = await apiRequest("DELETE", path, {});
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    await queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/status"] });
    await refetch();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div>
          <h1 className="text-lg font-bold text-gray-900">設定</h1>
          <p className="text-gray-400 text-xs mt-0.5">サービス接続・エクスポート・データ管理</p>
        </div>

        {/* ── 接続状態サマリー ── */}
        <Section icon={Server} title="サービス接続状態">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 bg-gray-50" />)}</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Bot,       label: "OpenAI（GPT-4o）",   key: "openai",  detail: "AI記事生成・リライト・分析" },
                { icon: Mail,      label: "SMTP メール",        key: "smtp",    detail: st?.smtpHost ? `${st.smtpHost}:${st.smtpPort}` : "未設定" },
                { icon: BarChart2, label: "Google Analytics 4", key: "ga4",     detail: st?.ga4Id ? `ID: ${st.ga4Id}` : "未設定" },
                { icon: BarChart2, label: "Microsoft Clarity",  key: "clarity", detail: st?.clarityId ? `ID: ${st.clarityId}` : "未設定" },
              ].map((s) => (
                <div key={s.key} className="flex items-start gap-3 border border-gray-100 p-3 rounded">
                  <s.icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 text-sm font-medium">{s.label}</p>
                    <p className="text-gray-400 text-[11px] truncate">{s.detail}</p>
                  </div>
                  <StatusBadge ok={st?.[s.key]} />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* ── 管理者アカウント ── */}
        <Section icon={Shield} title="管理者アカウント">
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-100">
              <div>
                <p className="text-gray-400 text-[11px]">現在のログインユーザー</p>
                <p className="text-gray-900 text-sm font-medium font-mono">{isLoading ? "…" : (st?.adminUser || "—")}</p>
              </div>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              ユーザー名・パスワードは環境変数で管理されています。Replitの「Secrets」タブ（🔒）から変更できます。
            </p>
            <div>
              <EnvRow name="ADMIN_USER" value={isLoading ? "" : (st?.adminUser || "")} />
              <EnvRow name="ADMIN_PASS" value={isLoading ? "" : (st?.smtp ? "設定済み" : "")} secret />
            </div>
          </div>
        </Section>

        {/* ── SMTP ── */}
        <Section icon={Mail} title="メール（SMTP）設定">
          <div className="space-y-4">
            <div>
              <EnvRow name="SMTP_HOST" value={isLoading ? "" : (st?.smtpHost || "")} />
              <EnvRow name="SMTP_PORT" value={isLoading ? "" : (st?.smtpPort || "")} />
              <EnvRow name="SMTP_USER" value={isLoading ? "" : (st?.smtpUser || "")} />
              <EnvRow name="SMTP_PASS" value={isLoading ? "" : (st?.smtp ? "設定済み" : "")} secret />
              <EnvRow name="SMTP_FROM" value={isLoading ? "" : (st?.smtpFrom || "")} />
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-gray-600 text-xs font-medium mb-2">テストメール送信</p>
              <div className="flex gap-2 items-center">
                <input
                  type="email"
                  placeholder="送信先アドレス（省略時: SMTP_USER）"
                  value={smtpTestTo}
                  onChange={(e) => setSmtpTestTo(e.target.value)}
                  className="border border-gray-200 text-xs px-3 py-1.5 flex-1 focus:outline-none focus:border-gray-400"
                  data-testid="input-smtp-test-to"
                />
                <TestButton
                  label="テスト送信"
                  onTest={() => apiRequest("POST", "/api/admin/settings/test-smtp", { to: smtpTestTo || undefined })}
                />
              </div>
              {!isLoading && !st?.smtp && (
                <p className="text-amber-600 text-[11px] mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> SMTP_HOST・SMTP_USER・SMTP_PASSを環境変数に設定するとメール送信が有効になります。
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* ── OpenAI ── */}
        <Section icon={Bot} title="AI（OpenAI）設定">
          <div className="space-y-4">
            <EnvRow name="OPENAI_API_KEY" value={isLoading ? "" : (st?.openai ? "設定済み" : "")} secret />
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <TestButton
                label="GPT-4o 接続テスト"
                onTest={() => apiRequest("POST", "/api/admin/settings/test-openai", {})}
              />
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                APIキーを取得 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {!isLoading && !st?.openai && (
              <p className="text-amber-600 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> OPENAI_API_KEYが未設定です。AI記事生成・リライト・メール生成が無効になっています。
              </p>
            )}
          </div>
        </Section>

        {/* ── アナリティクス ── */}
        <Section icon={BarChart2} title="アナリティクス設定">
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 text-xs font-medium mb-2">Google Analytics 4</p>
              <EnvRow name="VITE_GA4_ID" value={isLoading ? "" : (st?.ga4Id || "")} />
              {!isLoading && !st?.ga4 && (
                <p className="text-gray-400 text-[11px] mt-1.5">
                  <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center gap-1">
                    Google Analytics <ExternalLink className="w-3 h-3" />
                  </a>
                  {" "}でプロパティを作成し、測定ID（G-XXXXXXXXXX）を環境変数に設定してください。
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-gray-700 text-xs font-medium mb-2">Microsoft Clarity</p>
              <EnvRow name="VITE_CLARITY_ID" value={isLoading ? "" : (st?.clarityId || "")} />
              {!isLoading && !st?.clarity && (
                <p className="text-gray-400 text-[11px] mt-1.5">
                  <a href="https://clarity.microsoft.com" target="_blank" rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center gap-1">
                    Microsoft Clarity <ExternalLink className="w-3 h-3" />
                  </a>
                  {" "}でプロジェクトを作成し、プロジェクトIDを設定してください。
                </p>
              )}
            </div>
            <p className="text-gray-400 text-[11px] border-t border-gray-100 pt-3">
              ※ GA4・Clarityはユーザーがクッキーに同意した場合のみロードされます（GDPR・個人情報保護法対応）
            </p>
          </div>
        </Section>

        {/* ── SEO・サイト設定 ── */}
        <Section icon={Globe} title="SEO・サイト設定">
          <div className="space-y-4">
            <EnvRow name="SITE_URL" value={isLoading ? "" : (st?.siteUrl || "")} />
            {!isLoading && st?.siteUrl ? (
              <div className="flex flex-wrap gap-2">
                <a href={`${st.siteUrl}/sitemap.xml`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-100 bg-blue-50 px-3 py-1.5 hover:border-blue-300 transition-colors">
                  <ExternalLink className="w-3 h-3" /> sitemap.xml を確認
                </a>
                <a href={`${st.siteUrl}/robots.txt`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 border border-blue-100 bg-blue-50 px-3 py-1.5 hover:border-blue-300 transition-colors">
                  <ExternalLink className="w-3 h-3" /> robots.txt を確認
                </a>
              </div>
            ) : !isLoading ? (
              <p className="text-amber-600 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> SITE_URLが未設定です。サイトマップのURLが正しく生成されません。
              </p>
            ) : null}
            <div className="bg-gray-50 border border-gray-100 p-3 rounded">
              <p className="text-gray-500 text-[11px] font-medium mb-1">robots.txt（現在の内容）</p>
              <pre className="font-mono text-gray-400 text-[11px] whitespace-pre-wrap">{`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${st?.siteUrl || "https://example.com"}/sitemap.xml`}</pre>
            </div>
          </div>
        </Section>

        {/* ── データ管理 ── */}
        <Section icon={Database} title="データ管理">
          {isLoading ? <Skeleton className="h-40 bg-gray-50" /> : (
            <div className="space-y-5">
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: "PV数",    value: st?.pvCount       ?? 0 },
                  { label: "イベント", value: st?.eventsCount   ?? 0 },
                  { label: "問い合わせ", value: st?.contactsCount ?? 0 },
                  { label: "記事",    value: st?.articlesCount  ?? 0 },
                  { label: "営業リード", value: st?.leadsCount  ?? 0 },
                ].map((s) => (
                  <div key={s.label} className="text-center border border-gray-100 p-2 rounded">
                    <p className="text-xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
                    <p className="text-gray-400 text-[10px]">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-700 text-xs font-medium mb-3">CSVエクスポート</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "問い合わせ一覧", path: "/api/admin/export/contacts",  file: `contacts-${today}.csv` },
                    { label: "記事一覧",       path: "/api/admin/export/articles",  file: `articles-${today}.csv` },
                    { label: "営業リード",      path: "/api/admin/export/leads",     file: `leads-${today}.csv` },
                  ].map((ex) => (
                    <button
                      key={ex.label}
                      onClick={() => downloadCSV(ex.path, ex.file)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
                      data-testid={`btn-export-${ex.label}`}
                    >
                      <Download className="w-3.5 h-3.5" /> {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-700 text-xs font-medium mb-1">アナリティクスデータのリセット</p>
                <p className="text-gray-400 text-[11px] mb-3">蓄積されたPV・イベントログを削除します。記事・問い合わせ・リードは削除されません。</p>
                <div className="flex flex-wrap gap-3">
                  <ConfirmDelete
                    label={`PVログを削除（${(st?.pvCount ?? 0).toLocaleString()}件）`}
                    description="ページビューログを全て削除しました"
                    onConfirm={() => clearData("/api/admin/analytics/pageviews")}
                  />
                  <ConfirmDelete
                    label={`イベントログを削除（${(st?.eventsCount ?? 0).toLocaleString()}件）`}
                    description="イベントログを全て削除しました"
                    onConfirm={() => clearData("/api/admin/analytics/events")}
                  />
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* ── 環境変数ガイド（折りたたみ）── */}
        <div className="bg-white border border-gray-200">
          <button
            onClick={() => setShowEnv(!showEnv)}
            className="w-full flex items-center gap-2.5 px-5 py-3.5 hover:bg-gray-50 transition-colors"
            data-testid="btn-toggle-env"
          >
            <Key className="w-4 h-4 text-gray-500" />
            <h2 className="text-gray-800 text-sm font-semibold flex-1 text-left">環境変数一覧（設定ガイド）</h2>
            {showEnv ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
          </button>
          {showEnv && (
            <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-5">
              <p className="text-gray-500 text-xs">
                Replitの「Secrets」タブ（🔒アイコン）から設定してください。変更後はサーバーを再起動すると反映されます。
              </p>
              {[
                { cat: "必須", items: [
                  { name: "DATABASE_URL",  desc: "PostgreSQL接続URL" },
                  { name: "SESSION_SECRET", desc: "セッション秘密鍵（ランダムな長い文字列）" },
                ]},
                { cat: "管理者認証", items: [
                  { name: "ADMIN_USER", desc: "管理者ユーザー名（デフォルト: admin）" },
                  { name: "ADMIN_PASS", desc: "管理者パスワード（デフォルト: admin123）" },
                ]},
                { cat: "SMTP（メール送信）", items: [
                  { name: "SMTP_HOST", desc: "SMTPサーバー（例: smtp.hostinger.com）" },
                  { name: "SMTP_PORT", desc: "ポート（587: STARTTLS / 465: SSL）" },
                  { name: "SMTP_USER", desc: "ユーザー名（メールアドレス）" },
                  { name: "SMTP_PASS", desc: "パスワード" },
                  { name: "SMTP_FROM", desc: "送信元表示アドレス（省略時: SMTP_USER）" },
                ]},
                { cat: "AI・外部API", items: [
                  { name: "OPENAI_API_KEY", desc: "OpenAI APIキー（GPT-4o・DALL-E 3）" },
                ]},
                { cat: "アナリティクス", items: [
                  { name: "VITE_GA4_ID",    desc: "Google Analytics 4 測定ID（G-XXXXXXXXXX）" },
                  { name: "VITE_CLARITY_ID", desc: "Microsoft Clarity プロジェクトID" },
                ]},
                { cat: "SEO", items: [
                  { name: "SITE_URL", desc: "サイトのURL（例: https://example.com）— サイトマップ生成に使用" },
                ]},
              ].map((group) => (
                <div key={group.cat}>
                  <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-2">{group.cat}</p>
                  {group.items.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 py-1.5 border-b border-gray-50 last:border-0">
                      <code className="text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono flex-shrink-0">{item.name}</code>
                      <span className="text-gray-500 text-xs">{item.desc}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
