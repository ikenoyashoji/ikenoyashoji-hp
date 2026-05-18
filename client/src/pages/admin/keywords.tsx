import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Wand2 } from "lucide-react";
import { Link } from "wouter";

const targetLabels: Record<string, string> = { shipper: "荷主向け", recruit: "採用向け", partner: "協力会社向け" };

type FormState = { keyword: string; target: string; priority: string; notes: string };

function KeywordForm({ value, onChange }: { value: FormState; onChange: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-gray-600 text-xs font-medium">キーワード</label>
        <Input
          placeholder="例：物流 コスト削減 方法"
          className="border-gray-200 text-gray-900 placeholder:text-gray-300 mt-1 text-sm rounded-none focus:border-black focus:ring-0"
          value={value.keyword}
          onChange={(e) => onChange((f) => ({ ...f, keyword: e.target.value }))}
          data-testid="input-keyword"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-gray-600 text-xs font-medium">ターゲット</label>
          <Select value={value.target} onValueChange={(v) => onChange((f) => ({ ...f, target: v }))}>
            <SelectTrigger className="border-gray-200 text-gray-700 text-xs h-8 mt-1 rounded-none" data-testid="select-keyword-target">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-gray-200">
              <SelectItem value="shipper" className="text-xs">荷主向け</SelectItem>
              <SelectItem value="recruit" className="text-xs">採用向け</SelectItem>
              <SelectItem value="partner" className="text-xs">協力会社向け</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-gray-600 text-xs font-medium">優先度（1〜5）</label>
          <Select value={value.priority} onValueChange={(v) => onChange((f) => ({ ...f, priority: v }))}>
            <SelectTrigger className="border-gray-200 text-gray-700 text-xs h-8 mt-1 rounded-none" data-testid="select-keyword-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-gray-200">
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">{"★".repeat(n)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-gray-600 text-xs font-medium">メモ（任意）</label>
        <Input
          placeholder="キーワードに関するメモ"
          className="border-gray-200 text-gray-900 placeholder:text-gray-300 mt-1 text-xs rounded-none"
          value={value.notes}
          onChange={(e) => onChange((f) => ({ ...f, notes: e.target.value }))}
        />
      </div>
    </div>
  );
}

const emptyForm: FormState = { keyword: "", target: "shipper", priority: "3", notes: "" };

export default function AdminKeywords() {
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [addForm, setAddForm] = useState<FormState>(emptyForm);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const { toast } = useToast();

  const { data: keywords, isLoading } = useQuery<any[]>({ queryKey: ["/api/keywords"] });

  const addMutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/admin/keywords", { ...addForm, priority: parseInt(addForm.priority) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      setAddOpen(false);
      setAddForm(emptyForm);
      toast({ title: "キーワードを追加しました" });
    },
    onError: () => toast({ title: "追加に失敗しました", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      apiRequest("PUT", `/api/admin/keywords/${editItem?.id}`, { ...editForm, priority: parseInt(editForm.priority) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      setEditItem(null);
      toast({ title: "キーワードを更新しました" });
    },
    onError: () => toast({ title: "更新に失敗しました", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/keywords/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      setDeleteId(null);
      toast({ title: "キーワードを削除しました" });
    },
  });

  const openEdit = (kw: any) => {
    setEditItem(kw);
    setEditForm({ keyword: kw.keyword, target: kw.target, priority: String(kw.priority), notes: kw.notes || "" });
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">キーワード管理</h1>
            <p className="text-gray-400 text-xs mt-0.5">{keywords?.length ?? 0}件のキーワード</p>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs hover:bg-gray-800 transition-colors"
            onClick={() => { setAddForm(emptyForm); setAddOpen(true); }}
            data-testid="button-add-keyword"
          >
            <Plus className="w-3.5 h-3.5" /> キーワード追加
          </button>
        </div>

        <div className="border border-gray-200 bg-gray-50 p-3 text-gray-500 text-xs flex items-start gap-2">
          <Wand2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          キーワードを追加後、記事管理画面の「AI記事生成」ボタンから自動記事生成ができます。
        </div>

        {isLoading ? (
          <div className="space-y-1">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 bg-gray-100" />)}</div>
        ) : !keywords?.length ? (
          <div className="text-center py-16 border border-gray-100 text-gray-400">
            <p className="text-sm mb-3">キーワードがありません</p>
            <button className="text-xs bg-black text-white px-4 py-2" onClick={() => { setAddForm(emptyForm); setAddOpen(true); }}>
              最初のキーワードを追加
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            {keywords.map((kw: any) => (
              <div key={kw.id} className="bg-white border border-gray-200 p-3 flex items-center gap-3 hover:border-gray-400 transition-colors" data-testid={`keyword-row-${kw.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-gray-900 font-medium text-sm">{kw.keyword}</span>
                    <span className="text-[10px] px-1.5 py-0.5 border border-gray-200 text-gray-400">{targetLabels[kw.target]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-xs">{"★".repeat(kw.priority)}{"☆".repeat(5 - kw.priority)}</span>
                    {kw.notes && <span className="text-gray-400 text-xs truncate">{kw.notes}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Link href="/admin/articles">
                    <button className="h-7 px-2 text-[10px] border border-gray-200 text-gray-500 hover:border-black transition-colors flex items-center" title="AI記事生成">
                      <Wand2 className="w-3 h-3" />
                    </button>
                  </Link>
                  <button
                    className="h-7 px-2 text-[10px] border border-gray-200 text-gray-500 hover:border-black transition-colors flex items-center"
                    onClick={() => openEdit(kw)}
                    data-testid={`button-edit-keyword-${kw.id}`}
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    className="h-7 px-2 text-[10px] border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors flex items-center"
                    onClick={() => setDeleteId(kw.id)}
                    data-testid={`button-delete-keyword-${kw.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900">キーワード追加</DialogTitle></DialogHeader>
          <KeywordForm value={addForm} onChange={setAddForm} />
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setAddOpen(false)}>キャンセル</button>
            <button
              className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40"
              onClick={() => addMutation.mutate()}
              disabled={!addForm.keyword || addMutation.isPending}
              data-testid="button-keyword-save"
            >
              {addMutation.isPending ? "追加中..." : "追加する"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => { if (!o) setEditItem(null); }}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900">キーワード編集</DialogTitle></DialogHeader>
          <KeywordForm value={editForm} onChange={setEditForm} />
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setEditItem(null)}>キャンセル</button>
            <button
              className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40"
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "更新中..." : "更新する"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(o) => { if (!o) setDeleteId(null); }}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900">削除の確認</DialogTitle></DialogHeader>
          <p className="text-gray-500 text-sm">このキーワードを削除しますか？</p>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setDeleteId(null)}>キャンセル</button>
            <button
              className="px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "削除中..." : "削除"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
