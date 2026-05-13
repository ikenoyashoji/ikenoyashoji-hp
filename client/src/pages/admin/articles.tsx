import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, FileText, Wand2, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function AdminArticles() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generateKeywordId, setGenerateKeywordId] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const { data: articles, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/articles"] });
  const { data: keywords } = useQuery<any[]>({ queryKey: ["/api/keywords"] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/articles/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setDeleteId(null);
      toast({ title: "記事を削除しました" });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/articles/${id}/publish`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({ title: "記事を公開しました" });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/articles/${id}/unpublish`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({ title: "記事を下書きに戻しました" });
    },
  });

  const handleGenerate = async () => {
    const kw = keywords?.find((k) => k.id === generateKeywordId);
    if (!kw) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw.keyword, target: kw.target, notes: kw.notes }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      const article = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setGenerateOpen(false);
      toast({ title: "AI記事を生成しました", description: article.title });
    } catch (err: any) {
      toast({ title: "生成に失敗しました", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const filtered = (articles || []).filter((a) => {
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchSearch = !search || a.title.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">記事管理</h1>
            <p className="text-gray-400 text-xs mt-0.5">{articles?.length ?? 0}件の記事</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setGenerateOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs hover:border-black hover:text-black transition-colors"
              data-testid="button-ai-generate"
            >
              <Wand2 className="w-3.5 h-3.5" /> AI記事生成
            </button>
            <Link href="/admin/articles/new">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs hover:bg-gray-800 transition-colors" data-testid="button-new-article">
                <Plus className="w-3.5 h-3.5" /> 新規作成
              </button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              placeholder="記事を検索..."
              className="pl-8 border-gray-200 text-gray-900 placeholder:text-gray-300 text-xs h-8 rounded-none focus:border-black focus:ring-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-article-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 border-gray-200 text-gray-600 text-xs h-8 rounded-none" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-gray-200">
              <SelectItem value="all" className="text-xs">すべて</SelectItem>
              <SelectItem value="published" className="text-xs">公開中</SelectItem>
              <SelectItem value="draft" className="text-xs">下書き</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-20 bg-gray-100" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-gray-100 text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm mb-3">記事がありません</p>
            <Link href="/admin/articles/new">
              <button className="text-xs bg-black text-white px-4 py-2">最初の記事を作成</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((article: any) => (
              <div key={article.id} className="bg-white border border-gray-200 p-4 flex items-start gap-3 hover:border-gray-400 transition-colors" data-testid={`article-row-${article.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 border ${article.status === "published" ? "border-gray-900 text-gray-900" : "border-gray-300 text-gray-400"}`}
                      data-testid={`badge-status-${article.id}`}
                    >
                      {article.status === "published" ? "公開中" : "下書き"}
                    </span>
                    <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5">{article.category}</span>
                  </div>
                  <h3 className="text-gray-900 text-sm font-semibold line-clamp-1">{article.title}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{article.excerpt}</p>
                  <p className="text-gray-300 text-[10px] mt-1">
                    {article.publishedAt
                      ? `公開：${format(new Date(article.publishedAt), "yyyy.M.d", { locale: ja })}`
                      : `作成：${format(new Date(article.createdAt), "yyyy.M.d", { locale: ja })}`}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {article.status === "draft" ? (
                    <button
                      className="h-7 px-2 text-[10px] border border-gray-300 text-gray-600 hover:border-black flex items-center gap-1 transition-colors"
                      onClick={() => publishMutation.mutate(article.id)}
                      data-testid={`button-publish-${article.id}`}
                    >
                      <Eye className="w-3 h-3" /> 公開
                    </button>
                  ) : (
                    <button
                      className="h-7 px-2 text-[10px] border border-gray-300 text-gray-600 hover:border-black flex items-center gap-1 transition-colors"
                      onClick={() => unpublishMutation.mutate(article.id)}
                      data-testid={`button-unpublish-${article.id}`}
                    >
                      <EyeOff className="w-3 h-3" /> 非公開
                    </button>
                  )}
                  <Link href={`/admin/articles/${article.id}`}>
                    <button className="h-7 px-2 text-[10px] border border-gray-300 text-gray-600 hover:border-black flex items-center gap-1 transition-colors" data-testid={`button-edit-${article.id}`}>
                      <Edit className="w-3 h-3" /> 編集
                    </button>
                  </Link>
                  <button
                    className="h-7 px-2 text-[10px] border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 flex items-center transition-colors"
                    onClick={() => setDeleteId(article.id)}
                    data-testid={`button-delete-${article.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-base">記事を削除しますか？</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 text-sm">この操作は元に戻せません。</p>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setDeleteId(null)}>キャンセル</button>
            <button
              className="px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "削除中..." : "削除する"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Generate */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-base flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> AI記事自動生成
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-gray-500 text-sm">キーワードを選択してください</p>
            {keywords && keywords.length > 0 ? (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {keywords.map((kw: any) => (
                  <button
                    key={kw.id}
                    onClick={() => setGenerateKeywordId(kw.id)}
                    className={`w-full text-left px-3 py-2.5 border text-sm transition-colors ${generateKeywordId === kw.id ? "border-black bg-gray-50 text-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}
                    data-testid={`button-select-keyword-${kw.id}`}
                  >
                    <div className="font-medium">{kw.keyword}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {kw.target === "shipper" ? "荷主" : kw.target === "recruit" ? "採用" : "協力会社"} / 優先度: {kw.priority}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">キーワードが登録されていません。</p>
            )}
            {!import.meta.env.VITE_HAS_OPENAI && (
              <div className="border border-gray-200 bg-gray-50 p-3 text-gray-500 text-xs">
                OPENAI_API_KEYが設定されていない場合、生成はできません。
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setGenerateOpen(false)}>キャンセル</button>
            <button
              onClick={handleGenerate}
              disabled={!generateKeywordId || generating}
              className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40"
              data-testid="button-generate-confirm"
            >
              {generating ? "生成中..." : "AI記事を生成する"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
