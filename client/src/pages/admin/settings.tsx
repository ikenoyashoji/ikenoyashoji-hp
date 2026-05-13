import { AdminLayout } from "@/components/admin-layout";
import { Settings } from "lucide-react";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">設定</h1>
          <p className="text-gray-400 text-xs mt-0.5">サイト全般の設定を管理します</p>
        </div>
        <div className="border border-gray-100 bg-white py-20 flex flex-col items-center gap-3 text-gray-400">
          <Settings className="w-10 h-10 opacity-20" />
          <p className="text-sm">設定機能は準備中です</p>
          <p className="text-xs text-gray-300">サイト名・メール通知・SEO設定などを管理できます</p>
        </div>
      </div>
    </AdminLayout>
  );
}
