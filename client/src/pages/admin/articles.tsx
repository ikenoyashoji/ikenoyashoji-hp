import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, FileText, CheckCircle, Wand2, Trash2, Edit, Eye, EyeOff } from "lucide-react";
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
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
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
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-black text-white">記事管理</h1>
            <p className="text-blue-400 text-xs mt-0.5">{articles?.length ?? 0}件の記事</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              className="border-blue-700 text-blue-300 bg-transparent text-xs"
              onClick={() => setGenerateOpen(true)}
              data-testid="button-ai-generate"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1" /> AI記事生成
            </Button>
            <Link href="/admin/articles/new">
              <Button size="sm" className="bg-amber-500 text-white border-amber-400 text-xs" data-testid="button-new-article">
                <Plus className="w-3.5 h-3.5 mr-1" /> 新規作成
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500" />
            <Input
              placeholder="記事を検索..."
              className="pl-8 bg-[#0f2044] border-blue-800 text-white placeholder:text-blue-600 text-xs h-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-article-search"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-28 bg-[#0f2044] border-blue-800 text-blue-200 text-xs h-8" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0f2044] border-blue-800">
              <SelectItem value="all" className="text-blue-200 text-xs">すべて</SelectItem>
              <SelectItem value="published" className="text-blue-200 text-xs">公開中</SelectItem>
              <SelectItem value="draft" className="text-blue-200 text-xs">下書き</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 bg-[#0f2044]" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-blue-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">記事がありません</p>
            <Link href="/admin/articles/new">
              <Button size="sm" className="mt-3 bg-amber-500 text-white border-amber-400 text-xs">最初の記事を作成</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((article: any) => (
              <div key={article.id} className="bg-[#0f2044] border border-blue-900 rounded-lg p-4 flex items-start gap-3" data-testid={`article-row-${article.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge
                      variant={article.status === "published" ? "default" : "secondary"}
                      className={`text-[10px] px-1.5 ${article.status === "published" ? "bg-green-700 text-green-100 border-green-600" : "bg-blue-900 text-blue-300 border-blue-700"}`}
                      data-testid={`badge-status-${article.id}`}
                    >
                      {article.status === "published" ? "公開中" : "下書き"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 text-blue-400 border-blue-700">{article.category}</Badge>
                  </div>
                  <h3 className="text-white text-sm font-semibold line-clamp-1">{article.title}</h3>
                  <p className="text-blue-400 text-xs mt-0.5 line-clamp-1">{article.excerpt}</p>
                  <p className="text-blue-600 text-[10px] mt-1">
                    {article.publishedAt
                      ? `公開：${format(new Date(article.publishedAt), "yyyy年M月d日", { locale: ja })}`
                      : `作成：${format(new Date(article.createdAt), "yyyy年M月d日", { locale: ja })}`}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {article.status === "draft" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-[10px] border-green-700 text-green-400 bg-transparent"
                      onClick={() => publishMutation.mutate(article.id)}
                      data-testid={`button-publish-${article.id}`}
                    >
                      <Eye className="w-3 h-3 mr-1" /> 公開
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-[10px] border-blue-700 text-blue-400 bg-transparent"
                      onClick={() => unpublishMutation.mutate(article.id)}
                      data-testid={`button-unpublish-${article.id}`}
                    >
                      <EyeOff className="w-3 h-3 mr-1" /> 非公開
                    </Button>
                  )}
                  <Link href={`/admin/articles/${article.id}`}>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] border-blue-700 text-blue-300 bg-transparent" data-testid={`button-edit-${article.id}`}>
                      <Edit className="w-3 h-3 mr-1" /> 編集
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-[10px] border-red-900 text-red-400 bg-transparent"
                    onClick={() => setDeleteId(article.id)}
                    data-testid={`button-delete-${article.id}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0f2044] border-blue-900">
          <DialogHeader>
            <DialogTitle className="text-white">記事を削除しますか？</DialogTitle>
          </DialogHeader>
          <p className="text-blue-300 text-sm">この操作は元に戻せません。</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-blue-700 text-blue-300 bg-transparent" onClick={() => setDeleteId(null)}>キャンセル</Button>
            <Button variant="destructive" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "削除中..." : "削除する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Generate */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="bg-[#0f2044] border-blue-900">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-400" /> AI記事自動生成
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-blue-300 text-sm mb-2">生成するキーワードを選択してください</p>
              {keywords && keywords.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {keywords.map((kw: any) => (
                    <button
                      key={kw.id}
                      onClick={() => setGenerateKeywordId(kw.id)}
                      className={`w-full text-left px-3 py-2 rounded border text-sm transition-colors ${generateKeywordId === kw.id ? "border-amber-500 bg-amber-500/10 text-amber-300" : "border-blue-800 text-blue-300 hover:border-blue-600"}`}
                      data-testid={`button-select-keyword-${kw.id}`}
                    >
                      <div className="font-medium">{kw.keyword}</div>
                      <div className="text-[10px] text-blue-500 mt-0.5">対象: {kw.target === "shipper" ? "荷主" : kw.target === "recruit" ? "採用" : "協力会社"} / 優先度: {kw.priority}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-blue-500 text-sm">キーワードが登録されていません。まずキーワードを追加してください。</p>
              )}
            </div>
            {!import.meta.env.VITE_HAS_OPENAI && (
              <div className="bg-amber-900/20 border border-amber-700/30 rounded p-3 text-amber-300 text-xs">
                OPENAI_API_KEYが設定されていない場合、生成はできません。環境変数を設定してください。
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-blue-700 text-blue-300 bg-transparent" onClick={() => setGenerateOpen(false)}>キャンセル</Button>
            <Button
              onClick={handleGenerate}
              disabled={!generateKeywordId || generating}
              className="bg-amber-500 text-white border-amber-400 font-bold"
              data-testid="button-generate-confirm"
            >
              {generating ? "生成中..." : "AI記事を生成する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
