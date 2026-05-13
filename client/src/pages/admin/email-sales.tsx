import { AdminLayout } from "@/components/admin-layout";
import { Mail } from "lucide-react";

export default function AdminEmailSales() {
  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">メール営業</h1>
          <p className="text-gray-400 text-xs mt-0.5">一括メール送信・営業リスト管理</p>
        </div>
        <div className="border border-gray-100 bg-white py-20 flex flex-col items-center gap-3 text-gray-400">
          <Mail className="w-10 h-10 opacity-20" />
          <p className="text-sm">メール営業機能は準備中です</p>
          <p className="text-xs text-gray-300">SMTPサーバー設定後に有効化されます</p>
        </div>
      </div>
    </AdminLayout>
  );
}
