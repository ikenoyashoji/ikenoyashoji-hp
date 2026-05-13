import { AdminLayout } from "@/components/admin-layout";
import { ClipboardList } from "lucide-react";

export default function AdminLogs() {
  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">操作ログ</h1>
          <p className="text-gray-400 text-xs mt-0.5">管理画面での操作履歴を確認します</p>
        </div>
        <div className="border border-gray-100 bg-white py-20 flex flex-col items-center gap-3 text-gray-400">
          <ClipboardList className="w-10 h-10 opacity-20" />
          <p className="text-sm">操作ログ機能は準備中です</p>
          <p className="text-xs text-gray-300">ログイン・記事操作・問い合わせ確認などの履歴が表示されます</p>
        </div>
      </div>
    </AdminLayout>
  );
}
