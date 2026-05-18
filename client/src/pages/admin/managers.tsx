import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  UserCog, Shield, Plus, Trash2, KeyRound, X, Eye, EyeOff, ChevronDown, ChevronUp,
} from "lucide-react";

type AdminUser = {
  id: number;
  username: string;
  role: string;
  createdAt: string;
};

export default function AdminManagers() {
  const { toast } = useToast();

  const { data: admins, isLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/managers"],
  });

  const [showAdd, setShowAdd] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const [showNewPw, setShowNewPw] = useState(false);

  const [changePwId, setChangePwId] = useState<number | null>(null);
  const [changePwValue, setChangePwValue] = useState("");
  const [showChangePw, setShowChangePw] = useState(false);

  const addMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/admin/managers", {
        username: newUsername,
        password: newPassword,
        role: newRole,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/managers"] });
      toast({ title: "管理者を追加しました" });
      setShowAdd(false);
      setNewUsername("");
      setNewPassword("");
      setNewRole("admin");
    },
    onError: async (err: any) => {
      let msg = "追加に失敗しました";
      try { const j = await err.message; msg = j || msg; } catch {}
      toast({ title: msg, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/managers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/managers"] });
      toast({ title: "管理者を削除しました" });
    },
    onError: () => toast({ title: "削除に失敗しました", variant: "destructive" }),
  });

  const changePwMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      apiRequest("PATCH", `/api/admin/managers/${id}/password`, { password }),
    onSuccess: () => {
      toast({ title: "パスワードを変更しました" });
      setChangePwId(null);
      setChangePwValue("");
    },
    onError: () => toast({ title: "パスワード変更に失敗しました", variant: "destructive" }),
  });

  const roleLabel = (role: string) =>
    role === "superadmin" ? "スーパー管理者" : "管理者";

  const roleBadge = (role: string) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold border ${
        role === "superadmin"
          ? "border-purple-200 bg-purple-50 text-purple-700"
          : "border-blue-200 bg-blue-50 text-blue-700"
      }`}
    >
      {roleLabel(role)}
    </span>
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">管理者管理</h1>
            <p className="text-gray-400 text-xs mt-0.5">
              管理画面にアクセスできるアカウントを管理します
            </p>
          </div>
          <Button
            size="sm"
            className="bg-[#0f2044] hover:bg-[#1a3a6c] text-white text-xs h-8 px-3 gap-1.5"
            onClick={() => setShowAdd((v) => !v)}
            data-testid="button-add-admin"
          >
            {showAdd ? <ChevronUp className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showAdd ? "閉じる" : "管理者を追加"}
          </Button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-white border border-gray-200 p-4 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Plus className="w-4 h-4 text-gray-400" />
              <p className="text-gray-700 text-sm font-semibold">新しい管理者を追加</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">ユーザー名（メールアドレス推奨）</Label>
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="admin@example.com"
                  className="h-8 text-sm"
                  data-testid="input-new-username"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">ロール</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger className="h-8 text-sm" data-testid="select-new-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理者</SelectItem>
                    <SelectItem value="superadmin">スーパー管理者</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">パスワード（8文字以上）</Label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-8 text-sm pr-9"
                  data-testid="input-new-password"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowNewPw((v) => !v)}
                >
                  {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setShowAdd(false)}
              >
                キャンセル
              </Button>
              <Button
                size="sm"
                className="bg-[#0f2044] hover:bg-[#1a3a6c] text-white h-8 text-xs"
                onClick={() => addMutation.mutate()}
                disabled={addMutation.isPending || !newUsername || newPassword.length < 8}
                data-testid="button-confirm-add"
              >
                {addMutation.isPending ? "追加中..." : "追加する"}
              </Button>
            </div>
          </div>
        )}

        {/* Master env-var account */}
        <div className="bg-white border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <p className="text-gray-700 text-sm font-semibold">マスターアカウント（環境変数）</p>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0f2044] flex items-center justify-center">
                  <UserCog className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">ADMIN_USER</p>
                  <p className="text-xs text-gray-400">環境変数で設定済み・削除不可</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold border border-gray-300 bg-gray-100 text-gray-600">
                マスター
              </span>
            </div>
          </div>
        </div>

        {/* DB admin users list */}
        <div className="bg-white border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <UserCog className="w-4 h-4 text-gray-400" />
            <p className="text-gray-700 text-sm font-semibold">追加した管理者</p>
            {!isLoading && (
              <span className="ml-auto text-xs text-gray-400">{admins?.length ?? 0}件</span>
            )}
          </div>

          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-12 bg-gray-100" />)}
            </div>
          ) : !admins || admins.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              追加した管理者はいません
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {admins.map((admin) => (
                <li key={admin.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <UserCog className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-sm font-medium text-gray-900 truncate"
                          data-testid={`text-admin-username-${admin.id}`}
                        >
                          {admin.username}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(admin.createdAt).toLocaleDateString("ja-JP")} 追加
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {roleBadge(admin.role)}
                      <button
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="パスワード変更"
                        onClick={() => {
                          setChangePwId(changePwId === admin.id ? null : admin.id);
                          setChangePwValue("");
                        }}
                        data-testid={`button-change-password-${admin.id}`}
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="削除"
                        onClick={() => {
                          if (confirm(`「${admin.username}」を削除しますか？`)) {
                            deleteMutation.mutate(admin.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-admin-${admin.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline password change */}
                  {changePwId === admin.id && (
                    <div className="mt-3 flex gap-2 items-center pl-11">
                      <div className="relative flex-1">
                        <Input
                          type={showChangePw ? "text" : "password"}
                          value={changePwValue}
                          onChange={(e) => setChangePwValue(e.target.value)}
                          placeholder="新しいパスワード（8文字以上）"
                          className="h-7 text-xs pr-8"
                          data-testid={`input-change-password-${admin.id}`}
                        />
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                          onClick={() => setShowChangePw((v) => !v)}
                        >
                          {showChangePw ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-[#0f2044] hover:bg-[#1a3a6c] text-white px-3"
                        onClick={() =>
                          changePwMutation.mutate({ id: admin.id, password: changePwValue })
                        }
                        disabled={changePwMutation.isPending || changePwValue.length < 8}
                        data-testid={`button-confirm-change-password-${admin.id}`}
                      >
                        変更
                      </Button>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => { setChangePwId(null); setChangePwValue(""); }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Note */}
        <p className="text-[11px] text-gray-400 px-1">
          追加した管理者はパスワードハッシュ化（bcrypt）されDBに保存されます。
          マスターアカウントは環境変数（ADMIN_USER / ADMIN_PASS）でのみ変更できます。
        </p>
      </div>
    </AdminLayout>
  );
}
