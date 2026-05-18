import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from "lucide-react";

function StatusBadge({ ok, label }: { ok: boolean; label?: string }) {
  return ok ? (
    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
      <CheckCircle className="w-3.5 h-3.5" />
      {label ?? "設定済み"}
    </span>
  ) : (
    <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
      <XCircle className="w-3.5 h-3.5" />
      {label ?? "未設定"}
    </span>
  );
}

export default function AdminSettings() {
  const { data: status, isLoading } = useQuery<any>({ queryKey: ["/api/admin/settings/status"] });

  const sections = [
    {
      title: "AI・OpenAI",
      rows: [
        { label: "OPENAI_API_KEY", ok: status?.openai, note: "記事自動生成・AIリライト・サーチコンソール分析に必要" },
      ],
    },
    {
      title: "SMTPメール送信",
      rows: [
        { label: "SMTP全体", ok: status?.smtp, note: "SMTP_HOST・SMTP_USER・SMTP_PASSがすべて設定されている場合に有効" },
        { label: "SMTP_HOST", ok: !!status?.smtpHost, note: status?.smtpHost || "未設定" },
        { label: "SMTP_PORT", ok: !!status?.smtpPort, note: status?.smtpPort ? `ポート ${status.smtpPort}` : "587（デフォルト）" },
      ],
    },
    {
      title: "アナリティクス",
      rows: [
        { label: "VITE_GA4_ID（Google Analytics 4）", ok: status?.ga4, note: "Cookie同意後に自動ロード" },
        { label: "VITE_CLARITY_ID（Microsoft Clarity）", ok: status?.clarity, note: "ヒートマップ・セッション録画" },
      ],
    },
    {
      title: "サイト設定",
      rows: [
        { label: "SITE_URL", ok: !!status?.siteUrl, note: status?.siteUrl || "サイトマップ・robots.txt生成に使用" },
      ],
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div>
          <h1 className="text-lg font-bold text-gray-900">設定</h1>
          <p className="text-gray-400 text-xs mt-0.5">環境変数・外部サービス連携のステータス確認</p>
        </div>

        {/* Admin info */}
        <div className="bg-white border border-gray-200 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-gray-700 text-sm font-semibold">管理者アカウント</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 border border-gray-100 p-3">
              <div className="text-gray-400 text-[10px] mb-1">ログインユーザー名</div>
              {isLoading ? (
                <Skeleton className="h-4 w-24 bg-gray-200" />
              ) : (
                <div className="text-gray-900 font-mono font-medium">{status?.adminUser || "admin"}</div>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-100 p-3">
              <div className="text-gray-400 text-[10px] mb-1">パスワード</div>
              <div className="text-gray-500">環境変数 ADMIN_PASS で管理</div>
            </div>
          </div>
          <div className="flex items-start gap-2 border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            認証情報の変更は Replit の「Secrets」（環境変数）で ADMIN_USER・ADMIN_PASS を設定してください。
          </div>
        </div>

        {/* Env var status sections */}
        {sections.map((sec) => (
          <div key={sec.title} className="bg-white border border-gray-200">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-gray-700 text-sm font-semibold">{sec.title}</p>
            </div>
            <div className="divide-y divide-gray-50">
              {sec.rows.map((row) => (
                <div key={row.label} className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-xs font-medium font-mono">{row.label}</p>
                    <p className="text-gray-400 text-[11px] mt-0.5 truncate">{row.note}</p>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 bg-gray-100" />
                  ) : (
                    <StatusBadge ok={row.ok} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Quick links */}
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-gray-700 text-sm font-semibold mb-3">クイックリンク</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { label: "sitemap.xml を確認", href: "/sitemap.xml" },
              { label: "robots.txt を確認", href: "/robots.txt" },
              { label: "サイトトップを表示", href: "/" },
              { label: "お問い合わせフォーム", href: "/contact" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 text-xs hover:border-black hover:text-black transition-colors"
                data-testid={`link-settings-${link.label}`}
              >
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border border-gray-100 bg-gray-50 p-4 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-700">環境変数の変更方法</p>
          <p>1. Replit の左パネルから「Secrets」を開く</p>
          <p>2. 変数名（Key）と値（Value）を入力して「Add new secret」をクリック</p>
          <p>3. アプリを再起動すると新しい設定が反映されます</p>
        </div>
      </div>
    </AdminLayout>
  );
}
