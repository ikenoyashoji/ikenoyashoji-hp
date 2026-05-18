import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCog, Shield, AlertCircle, Key } from "lucide-react";

export default function AdminManagers() {
  const { data: status, isLoading } = useQuery<any>({ queryKey: ["/api/admin/settings/status"] });

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-5">
        <div>
          <h1 className="text-lg font-bold text-gray-900">管理者管理</h1>
          <p className="text-gray-400 text-xs mt-0.5">管理画面にアクセスできるアカウントを確認します</p>
        </div>

        {/* Current admin card */}
        <div className="bg-white border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <p className="text-gray-700 text-sm font-semibold">現在の管理者アカウント</p>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-gray-100 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <UserCog className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400 text-[10px]">ユーザー名 / ADMIN_USER</span>
                </div>
                {isLoading ? (
                  <Skeleton className="h-5 w-28 bg-gray-200" />
                ) : (
                  <p className="text-gray-900 font-mono text-sm font-semibold">{status?.adminUser || "admin"}</p>
                )}
              </div>
              <div className="bg-gray-50 border border-gray-100 p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Key className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400 text-[10px]">パスワード / ADMIN_PASS</span>
                </div>
                <p className="text-gray-500 text-sm">••••••••（非表示）</p>
              </div>
            </div>

            <div className="flex items-start gap-2 border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <div>
                現在、管理者アカウントは環境変数（Secrets）で1アカウントのみ管理されています。
                複数アカウントが必要な場合は、データベースベースの認証への移行をご検討ください。
              </div>
            </div>
          </div>
        </div>

        {/* How to change */}
        <div className="bg-white border border-gray-200 p-4 space-y-3">
          <p className="text-gray-700 text-sm font-semibold">認証情報を変更する方法</p>
          <ol className="space-y-2.5 text-xs text-gray-600">
            <li className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-medium text-gray-800">Replit の「Secrets」を開く</p>
                <p className="text-gray-400 mt-0.5">左サイドパネルの鍵アイコン（Secrets）をクリックしてください。</p>
              </div>
            </li>
            <li className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-medium text-gray-800">環境変数を追加・更新する</p>
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded">
                    <span className="font-mono text-gray-700 font-semibold text-[11px]">ADMIN_USER</span>
                    <span className="text-gray-400 text-[11px]">→ 新しいユーザー名</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded">
                    <span className="font-mono text-gray-700 font-semibold text-[11px]">ADMIN_PASS</span>
                    <span className="text-gray-400 text-[11px]">→ 新しいパスワード（8文字以上推奨）</span>
                  </div>
                </div>
              </div>
            </li>
            <li className="flex gap-2.5">
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-medium text-gray-800">アプリを再起動する</p>
                <p className="text-gray-400 mt-0.5">Secretsを保存後、アプリを再起動すると新しい認証情報が有効になります。</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Security tips */}
        <div className="bg-white border border-gray-200 p-4">
          <p className="text-gray-700 text-sm font-semibold mb-3">セキュリティのポイント</p>
          <ul className="space-y-2 text-xs text-gray-600">
            {[
              "パスワードは12文字以上、英数字記号を混在させることを推奨します",
              "定期的（3〜6ヶ月ごと）にパスワードを変更してください",
              "管理画面のURLは外部に公開しないようにしてください",
              "ログイン後は必ずセッションを終了（ログアウト）してください",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 mt-1.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
