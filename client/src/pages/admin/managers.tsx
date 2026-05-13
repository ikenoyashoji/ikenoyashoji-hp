import { AdminLayout } from "@/components/admin-layout";
import { UserCog } from "lucide-react";

export default function AdminManagers() {
  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900">管理者管理</h1>
          <p className="text-gray-400 text-xs mt-0.5">管理画面にアクセスできるユーザーを管理します</p>
        </div>
        <div className="border border-gray-100 bg-white py-20 flex flex-col items-center gap-3 text-gray-400">
          <UserCog className="w-10 h-10 opacity-20" />
          <p className="text-sm">管理者管理機能は準備中です</p>
          <p className="text-xs text-gray-300">環境変数 ADMIN_USER / ADMIN_PASS で認証情報を設定できます</p>
        </div>
      </div>
    </AdminLayout>
  );
}
