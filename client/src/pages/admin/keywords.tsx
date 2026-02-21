import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Star, Wand2 } from "lucide-react";
import { Link } from "wouter";

const targetLabels: Record<string, string> = { shipper: "荷主向け", recruit: "採用向け", partner: "協力会社向け" };
const targetColors: Record<string, string> = {
  shipper: "bg-blue-900 text-blue-300 border-blue-700",
  recruit: "bg-green-900 text-green-300 border-green-700",
  partner: "bg-amber-900 text-amber-300 border-amber-700",
};

export default function AdminKeywords() {
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ keyword: "", target: "shipper", priority: "3", notes: "" });
  const { toast } = useToast();

  const { data: keywords, isLoading } = useQuery<any[]>({ queryKey: ["/api/keywords"] });

  const addMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/keywords", { ...data, priority: parseInt(data.priority) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      setAddOpen(false);
      setForm({ keyword: "", target: "shipper", priority: "3", notes: "" });
      toast({ title: "キーワードを追加しました" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", `/api/admin/keywords/${data.id}`, { ...data, priority: parseInt(data.priority) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/keywords"] });
      setEditItem(null);
      toast({ title: "キーワードを更新しました" });
    },
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
    setEditItem({ ...kw, priority: String(kw.priority) });
  };

  const priorityStars = (p: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < p ? "text-amber-400 fill-amber-400" : "text-blue-800"}`} />
    ));

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">キーワード管理</h1>
            <p className="text-blue-400 text-xs mt-0.5">{keywords?.length ?? 0}件のキーワード</p>
          </div>
          <Button
            size="sm"
            className="bg-amber-500 text-white border-amber-400 text-xs"
            onClick={() => setAddOpen(true)}
            data-testid="button-add-keyword"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> キーワード追加
          </Button>
        </div>

        <div className="bg-blue-900/20 border border-blue-900/40 rounded-lg p-3 text-blue-300 text-xs">
          <Wand2 className="w-3.5 h-3.5 inline mr-1.5 text-amber-400" />
          キーワードを追加後、記事管理画面の「AI記事生成」ボタンから自動記事生成ができます。
        </div>

        {isLoading ? (
          <div className="space-y-2">{[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 bg-[#0f2044]" />)}</div>
        ) : !keywords?.length ? (
          <div className="text-center py-16 text-blue-500">
            <p className="text-sm mb-3">キーワードがありません</p>
            <Button size="sm" className="bg-amber-500 text-white border-amber-400 text-xs" onClick={() => setAddOpen(true)}>
              最初のキーワードを追加
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {keywords.map((kw: any) => (
              <div key={kw.id} className="bg-[#0f2044] border border-blue-900 rounded-lg p-4 flex items-center gap-3" data-testid={`keyword-row-${kw.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-semibold text-sm">{kw.keyword}</span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 ${targetColors[kw.target]}`}>
                      {targetLabels[kw.target]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{priorityStars(kw.priority)}</div>
                    {kw.notes && <span className="text-blue-500 text-xs truncate">{kw.notes}</span>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Link href="/admin/articles">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] border-amber-700 text-amber-400 bg-transparent" title="AI記事生成">
                      <Wand2 className="w-3 h-3" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[10px] border-blue-700 text-blue-300 bg-transparent"
                    onClick={() => openEdit(kw)}
                    data-testid={`button-edit-keyword-${kw.id}`}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[10px] border-red-900 text-red-400 bg-transparent"
                    onClick={() => setDeleteId(kw.id)}
                    data-testid={`button-delete-keyword-${kw.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-[#0f2044] border-blue-900">
          <DialogHeader>
            <DialogTitle className="text-white">キーワード追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-blue-300 text-xs">キーワード</label>
              <Input
                placeholder="例：物流 コスト削減 方法"
                className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 mt-1 text-sm"
                value={form.keyword}
                onChange={(e) => setForm((f) => ({ ...f, keyword: e.target.value }))}
                data-testid="input-keyword"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-blue-300 text-xs">ターゲット</label>
                <Select value={form.target} onValueChange={(v) => setForm((f) => ({ ...f, target: v }))}>
                  <SelectTrigger className="bg-[#0a1628] border-blue-800 text-white text-xs h-8 mt-1" data-testid="select-keyword-target">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f2044] border-blue-800">
                    <SelectItem value="shipper" className="text-blue-200 text-xs">荷主向け</SelectItem>
                    <SelectItem value="recruit" className="text-blue-200 text-xs">採用向け</SelectItem>
                    <SelectItem value="partner" className="text-blue-200 text-xs">協力会社向け</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-blue-300 text-xs">優先度（1〜5）</label>
                <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v }))}>
                  <SelectTrigger className="bg-[#0a1628] border-blue-800 text-white text-xs h-8 mt-1" data-testid="select-keyword-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f2044] border-blue-800">
                    {[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)} className="text-blue-200 text-xs">{"★".repeat(n)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-blue-300 text-xs">メモ（任意）</label>
              <Input
                placeholder="キーワードに関するメモ"
                className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 mt-1 text-xs"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-blue-700 text-blue-300 bg-transparent" onClick={() => setAddOpen(false)}>キャンセル</Button>
            <Button
              className="bg-amber-500 text-white border-amber-400"
              onClick={() => addMutation.mutate(form)}
              disabled={!form.keyword || addMutation.isPending}
              data-testid="button-keyword-save"
            >
              {addMutation.isPending ? "追加中..." : "追加する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="bg-[#0f2044] border-blue-900">
          <DialogHeader>
            <DialogTitle className="text-white">キーワード編集</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-3">
              <div>
                <label className="text-blue-300 text-xs">キーワード</label>
                <Input
                  className="bg-[#0a1628] border-blue-800 text-white mt-1 text-sm"
                  value={editItem.keyword}
                  onChange={(e) => setEditItem((p: any) => ({ ...p, keyword: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-blue-300 text-xs">ターゲット</label>
                  <Select value={editItem.target} onValueChange={(v) => setEditItem((p: any) => ({ ...p, target: v }))}>
                    <SelectTrigger className="bg-[#0a1628] border-blue-800 text-white text-xs h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f2044] border-blue-800">
                      <SelectItem value="shipper" className="text-blue-200 text-xs">荷主向け</SelectItem>
                      <SelectItem value="recruit" className="text-blue-200 text-xs">採用向け</SelectItem>
                      <SelectItem value="partner" className="text-blue-200 text-xs">協力会社向け</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-blue-300 text-xs">優先度</label>
                  <Select value={editItem.priority} onValueChange={(v) => setEditItem((p: any) => ({ ...p, priority: v }))}>
                    <SelectTrigger className="bg-[#0a1628] border-blue-800 text-white text-xs h-8 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f2044] border-blue-800">
                      {[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)} className="text-blue-200 text-xs">{"★".repeat(n)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-blue-300 text-xs">メモ</label>
                <Input
                  className="bg-[#0a1628] border-blue-800 text-white mt-1 text-xs"
                  value={editItem.notes || ""}
                  onChange={(e) => setEditItem((p: any) => ({ ...p, notes: e.target.value }))}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-blue-700 text-blue-300 bg-transparent" onClick={() => setEditItem(null)}>キャンセル</Button>
            <Button
              className="bg-amber-500 text-white border-amber-400"
              onClick={() => updateMutation.mutate(editItem)}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "更新中..." : "更新する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0f2044] border-blue-900">
          <DialogHeader><DialogTitle className="text-white">削除の確認</DialogTitle></DialogHeader>
          <p className="text-blue-300 text-sm">このキーワードを削除しますか？</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-blue-700 text-blue-300 bg-transparent" onClick={() => setDeleteId(null)}>キャンセル</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "削除中..." : "削除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
