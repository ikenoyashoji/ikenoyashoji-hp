import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Search, FileText, Wand2, Trash2, Edit, Eye, EyeOff,
  Tag, BarChart2, TrendingUp, TrendingDown, Upload, ChevronUp, ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

type Tab = "articles" | "keywords" | "search-console";

// ─── Articles Panel ────────────────────────────────────────────────────────────

function ArticlesPanel() {
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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] }); setDeleteId(null); toast({ title: "記事を削除しました" }); },
  });
  const publishMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/articles/${id}/publish`, {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] }); toast({ title: "記事を公開しました" }); },
  });
  const unpublishMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/articles/${id}/unpublish`, {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] }); toast({ title: "記事を下書きに戻しました" }); },
  });

  const handleGenerate = async () => {
    const kw = keywords?.find((k) => k.id === generateKeywordId);
    if (!kw) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyword: kw.keyword, target: kw.target, notes: kw.notes }) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      const article = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setGenerateOpen(false);
      toast({ title: "AI記事を生成しました", description: article.title });
    } catch (err: any) {
      toast({ title: "生成に失敗しました", description: err.message, variant: "destructive" });
    } finally { setGenerating(false); }
  };

  const filtered = (articles || []).filter((a) => {
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchSearch = !search || a.title.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-gray-400 text-xs">{articles?.length ?? 0}件の記事</p>
        <div className="flex gap-2">
          <button onClick={() => setGenerateOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs hover:border-black hover:text-black transition-colors" data-testid="button-ai-generate">
            <Wand2 className="w-3.5 h-3.5" /> AI記事生成
          </button>
          <Link href="/admin/articles/new">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs hover:bg-gray-800 transition-colors" data-testid="button-new-article">
              <Plus className="w-3.5 h-3.5" /> 新規作成
            </button>
          </Link>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <Input placeholder="記事を検索..." className="pl-8 border-gray-200 text-gray-900 placeholder:text-gray-300 text-xs h-8 rounded-none focus:border-black focus:ring-0" value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-article-search" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-28 border-gray-200 text-gray-600 text-xs h-8 rounded-none" data-testid="select-status-filter"><SelectValue /></SelectTrigger>
          <SelectContent className="rounded-none border-gray-200">
            <SelectItem value="all" className="text-xs">すべて</SelectItem>
            <SelectItem value="published" className="text-xs">公開中</SelectItem>
            <SelectItem value="draft" className="text-xs">下書き</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-20 bg-gray-100" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-gray-100 text-gray-400">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm mb-3">記事がありません</p>
          <Link href="/admin/articles/new"><button className="text-xs bg-black text-white px-4 py-2">最初の記事を作成</button></Link>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((article: any) => (
            <div key={article.id} className="bg-white border border-gray-200 p-4 flex items-start gap-3 hover:border-gray-400 transition-colors" data-testid={`article-row-${article.id}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-1.5 py-0.5 border ${article.status === "published" ? "border-gray-900 text-gray-900" : "border-gray-300 text-gray-400"}`} data-testid={`badge-status-${article.id}`}>
                    {article.status === "published" ? "公開中" : "下書き"}
                  </span>
                  <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5">{article.category}</span>
                </div>
                <h3 className="text-gray-900 text-sm font-semibold line-clamp-1">{article.title}</h3>
                <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{article.excerpt}</p>
                <p className="text-gray-300 text-[10px] mt-1">
                  {article.publishedAt ? `公開：${format(new Date(article.publishedAt), "yyyy.M.d", { locale: ja })}` : `作成：${format(new Date(article.createdAt), "yyyy.M.d", { locale: ja })}`}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {article.status === "draft" ? (
                  <button className="h-7 px-2 text-[10px] border border-gray-300 text-gray-600 hover:border-black flex items-center gap-1 transition-colors" onClick={() => publishMutation.mutate(article.id)} data-testid={`button-publish-${article.id}`}><Eye className="w-3 h-3" /> 公開</button>
                ) : (
                  <button className="h-7 px-2 text-[10px] border border-gray-300 text-gray-600 hover:border-black flex items-center gap-1 transition-colors" onClick={() => unpublishMutation.mutate(article.id)} data-testid={`button-unpublish-${article.id}`}><EyeOff className="w-3 h-3" /> 非公開</button>
                )}
                <Link href={`/admin/articles/${article.id}`}>
                  <button className="h-7 px-2 text-[10px] border border-gray-300 text-gray-600 hover:border-black flex items-center gap-1 transition-colors" data-testid={`button-edit-${article.id}`}><Edit className="w-3 h-3" /> 編集</button>
                </Link>
                <button className="h-7 px-2 text-[10px] border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 flex items-center transition-colors" onClick={() => setDeleteId(article.id)} data-testid={`button-delete-${article.id}`}><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900 text-base">記事を削除しますか？</DialogTitle></DialogHeader>
          <p className="text-gray-500 text-sm">この操作は元に戻せません。</p>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setDeleteId(null)}>キャンセル</button>
            <button className="px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "削除中..." : "削除する"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-md">
          <DialogHeader><DialogTitle className="text-gray-900 text-base flex items-center gap-2"><Wand2 className="w-4 h-4" /> AI記事自動生成</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-gray-500 text-sm">キーワードを選択してください</p>
            {keywords && keywords.length > 0 ? (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {keywords.map((kw: any) => (
                  <button key={kw.id} onClick={() => setGenerateKeywordId(kw.id)} className={`w-full text-left px-3 py-2.5 border text-sm transition-colors ${generateKeywordId === kw.id ? "border-black bg-gray-50 text-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"}`} data-testid={`button-select-keyword-${kw.id}`}>
                    <div className="font-medium">{kw.keyword}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{kw.target === "shipper" ? "荷主" : kw.target === "recruit" ? "採用" : "協力会社"} / 優先度: {kw.priority}</div>
                  </button>
                ))}
              </div>
            ) : <p className="text-gray-400 text-sm">キーワードが登録されていません。</p>}
            {!import.meta.env.VITE_HAS_OPENAI && <div className="border border-gray-200 bg-gray-50 p-3 text-gray-500 text-xs">OPENAI_API_KEYが設定されていない場合、生成はできません。</div>}
          </div>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setGenerateOpen(false)}>キャンセル</button>
            <button onClick={handleGenerate} disabled={!generateKeywordId || generating} className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40" data-testid="button-generate-confirm">{generating ? "生成中..." : "AI記事を生成する"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Keywords Panel ────────────────────────────────────────────────────────────

const targetLabels: Record<string, string> = { shipper: "荷主向け", recruit: "採用向け", partner: "協力会社向け" };

function KeywordsPanel() {
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState({ keyword: "", target: "shipper", priority: "3", notes: "" });
  const { toast } = useToast();

  const { data: keywords, isLoading } = useQuery<any[]>({ queryKey: ["/api/keywords"] });

  const addMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/keywords", { ...data, priority: parseInt(data.priority) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/keywords"] }); setAddOpen(false); setForm({ keyword: "", target: "shipper", priority: "3", notes: "" }); toast({ title: "キーワードを追加しました" }); },
  });
  const updateMutation = useMutation({
    mutationFn: (data: any) => apiRequest("PUT", `/api/admin/keywords/${data.id}`, { ...data, priority: parseInt(data.priority) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/keywords"] }); setEditItem(null); toast({ title: "キーワードを更新しました" }); },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/keywords/${id}`, {}),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/keywords"] }); setDeleteId(null); toast({ title: "キーワードを削除しました" }); },
  });

  const KwForm = ({ value, onChange }: { value: typeof form; onChange: (f: any) => void }) => (
    <div className="space-y-3">
      <div>
        <label className="text-gray-600 text-xs font-medium">キーワード</label>
        <Input placeholder="例：物流 コスト削減 方法" className="border-gray-200 text-gray-900 placeholder:text-gray-300 mt-1 text-sm rounded-none focus:border-black focus:ring-0" value={value.keyword} onChange={(e) => onChange((f: any) => ({ ...f, keyword: e.target.value }))} data-testid="input-keyword" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-gray-600 text-xs font-medium">ターゲット</label>
          <Select value={value.target} onValueChange={(v) => onChange((f: any) => ({ ...f, target: v }))}>
            <SelectTrigger className="border-gray-200 text-gray-700 text-xs h-8 mt-1 rounded-none" data-testid="select-keyword-target"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-none border-gray-200">
              <SelectItem value="shipper" className="text-xs">荷主向け</SelectItem>
              <SelectItem value="recruit" className="text-xs">採用向け</SelectItem>
              <SelectItem value="partner" className="text-xs">協力会社向け</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-gray-600 text-xs font-medium">優先度（1〜5）</label>
          <Select value={value.priority} onValueChange={(v) => onChange((f: any) => ({ ...f, priority: v }))}>
            <SelectTrigger className="border-gray-200 text-gray-700 text-xs h-8 mt-1 rounded-none" data-testid="select-keyword-priority"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-none border-gray-200">
              {[1,2,3,4,5].map((n) => <SelectItem key={n} value={String(n)} className="text-xs">{"★".repeat(n)}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-gray-600 text-xs font-medium">メモ（任意）</label>
        <Input placeholder="キーワードに関するメモ" className="border-gray-200 text-gray-900 placeholder:text-gray-300 mt-1 text-xs rounded-none" value={value.notes} onChange={(e) => onChange((f: any) => ({ ...f, notes: e.target.value }))} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs">{keywords?.length ?? 0}件のキーワード</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs hover:bg-gray-800 transition-colors" onClick={() => setAddOpen(true)} data-testid="button-add-keyword">
          <Plus className="w-3.5 h-3.5" /> キーワード追加
        </button>
      </div>

      <div className="border border-gray-200 bg-gray-50 p-3 text-gray-500 text-xs flex items-start gap-2">
        <Wand2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        キーワードを追加後、「記事一覧」タブの「AI記事生成」ボタンから自動生成できます。
      </div>

      {isLoading ? (
        <div className="space-y-1">{[1,2,3,4,5].map(i => <Skeleton key={i} className="h-14 bg-gray-100" />)}</div>
      ) : !keywords?.length ? (
        <div className="text-center py-16 border border-gray-100 text-gray-400">
          <p className="text-sm mb-3">キーワードがありません</p>
          <button className="text-xs bg-black text-white px-4 py-2" onClick={() => setAddOpen(true)}>最初のキーワードを追加</button>
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
                <button className="h-7 px-2 text-[10px] border border-gray-200 text-gray-500 hover:border-black transition-colors flex items-center" onClick={() => setEditItem({ ...kw, priority: String(kw.priority) })} data-testid={`button-edit-keyword-${kw.id}`}><Edit className="w-3 h-3" /></button>
                <button className="h-7 px-2 text-[10px] border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors flex items-center" onClick={() => setDeleteId(kw.id)} data-testid={`button-delete-keyword-${kw.id}`}><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900">キーワード追加</DialogTitle></DialogHeader>
          <KwForm value={form} onChange={setForm} />
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setAddOpen(false)}>キャンセル</button>
            <button className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40" onClick={() => addMutation.mutate(form)} disabled={!form.keyword || addMutation.isPending} data-testid="button-keyword-save">{addMutation.isPending ? "追加中..." : "追加する"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900">キーワード編集</DialogTitle></DialogHeader>
          {editItem && <KwForm value={editItem} onChange={setEditItem} />}
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setEditItem(null)}>キャンセル</button>
            <button className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40" onClick={() => updateMutation.mutate(editItem)} disabled={updateMutation.isPending}>{updateMutation.isPending ? "更新中..." : "更新する"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900">削除の確認</DialogTitle></DialogHeader>
          <p className="text-gray-500 text-sm">このキーワードを削除しますか？</p>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setDeleteId(null)}>キャンセル</button>
            <button className="px-4 py-2 bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50" onClick={() => deleteId && deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "削除中..." : "削除"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Search Console Panel ──────────────────────────────────────────────────────

function SearchConsolePanel() {
  const [importJson, setImportJson] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [analyzeItem, setAnalyzeItem] = useState<any>(null);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [sortField, setSortField] = useState("impressions");
  const [sortAsc, setSortAsc] = useState(false);
  const { toast } = useToast();

  const { data: scData, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/search-console"] });

  const importMutation = useMutation({
    mutationFn: async () => { const rows = JSON.parse(importJson); return apiRequest("POST", "/api/admin/search-console/save", { data: rows }); },
    onSuccess: (d: any) => { queryClient.invalidateQueries({ queryKey: ["/api/admin/search-console"] }); setImportOpen(false); toast({ title: `${d.count}件のデータをインポートしました` }); },
    onError: () => toast({ title: "インポートに失敗しました", variant: "destructive" }),
  });

  const handleAnalyze = async (item: any) => {
    setAnalyzeItem(item); setAnalysis(""); setAnalyzing(true);
    try {
      const res = await fetch("/api/admin/ai/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setAnalysis((await res.json()).analysis);
    } catch (err: any) { toast({ title: "分析に失敗しました", description: err.message, variant: "destructive" }); }
    finally { setAnalyzing(false); }
  };

  const sorted = [...(scData || [])].sort((a, b) => {
    const va = a[sortField] ?? 0, vb = b[sortField] ?? 0;
    return sortAsc ? va - vb : vb - va;
  });
  const toggleSort = (field: string) => { if (sortField === field) setSortAsc(!sortAsc); else { setSortField(field); setSortAsc(false); } };
  const SortIcon = ({ field }: { field: string }) => sortField !== field ? <BarChart2 className="w-3 h-3 text-gray-300" /> : sortAsc ? <ChevronUp className="w-3 h-3 text-gray-700" /> : <ChevronDown className="w-3 h-3 text-gray-700" />;

  const lowCtr = sorted.filter((r) => r.impressions > 100 && r.ctr < 0.03);
  const rising = sorted.filter((r) => r.position <= 10 && r.clicks > 5);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-gray-400 text-xs">{scData?.length ?? 0}件のデータ</p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs hover:border-black hover:text-black transition-colors" onClick={() => setImportOpen(true)} data-testid="button-sc-import">
          <Upload className="w-3.5 h-3.5" /> データをインポート
        </button>
      </div>

      <div className="border border-gray-200 bg-gray-50 p-3 text-gray-500 text-xs space-y-1">
        <p className="font-semibold text-gray-700">Search Console API連携について</p>
        <p>Google Search Console APIのデータをJSON形式でインポートしてください。</p>
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 bg-gray-100" />)}</div>
      ) : !scData?.length ? (
        <div className="text-center py-16 border border-gray-100 text-gray-400">
          <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm mb-3">データがありません</p>
          <button className="text-xs bg-black text-white px-4 py-2" onClick={() => setImportOpen(true)}>データをインポートする</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "改善が必要なページ", value: lowCtr.length, icon: TrendingDown },
              { label: "上位表示ページ", value: rising.length, icon: TrendingUp },
              { label: "総表示回数", value: scData.reduce((s, r) => s + r.impressions, 0).toLocaleString(), icon: BarChart2 },
              { label: "総クリック数", value: scData.reduce((s, r) => s + r.clicks, 0).toLocaleString(), icon: BarChart2 },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 p-3 flex items-center gap-2">
                <s.icon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <div><div className="text-gray-900 font-bold text-base">{s.value}</div><div className="text-gray-400 text-[10px]">{s.label}</div></div>
              </div>
            ))}
          </div>

          {lowCtr.length > 0 && (
            <div className="border border-red-100 bg-red-50">
              <div className="px-4 py-2 border-b border-red-100 flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                <span className="text-red-600 text-sm font-medium">CTRが低いページ（要改善）</span>
              </div>
              <div className="p-3 space-y-1.5">
                {lowCtr.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white border border-red-100 p-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-700 text-xs truncate">{r.page}</div>
                      <div className="text-gray-400 text-[10px] mt-0.5">{r.query} / CTR: {(r.ctr*100).toFixed(1)}% / 順位: {r.position?.toFixed(1)}</div>
                    </div>
                    <button className="h-6 px-2 text-[10px] border border-gray-300 text-gray-600 hover:border-black flex items-center gap-1 flex-shrink-0 transition-colors" onClick={() => handleAnalyze(r)} data-testid={`button-analyze-${i}`}>
                      <Wand2 className="w-3 h-3" /> AI分析
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200">
            <div className="px-4 py-2 border-b border-gray-200"><span className="text-gray-700 text-sm font-medium">全データ</span></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-2 text-gray-500 font-medium">ページ / クエリ</th>
                    {[{ key: "impressions", label: "表示回数" }, { key: "clicks", label: "クリック" }, { key: "ctr", label: "CTR" }, { key: "position", label: "順位" }].map((col) => (
                      <th key={col.key} className="text-right px-3 py-2 text-gray-500 font-medium cursor-pointer hover:text-gray-900" onClick={() => toggleSort(col.key)}>
                        <span className="flex items-center justify-end gap-1">{col.label} <SortIcon field={col.key} /></span>
                      </th>
                    ))}
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.slice(0, 50).map((r, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-2.5"><div className="text-gray-700 truncate max-w-[200px]">{r.page}</div><div className="text-gray-400 truncate max-w-[200px]">{r.query}</div></td>
                      <td className="px-3 py-2 text-right text-gray-700">{r.impressions?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right text-gray-700">{r.clicks?.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right"><span className={r.ctr < 0.03 ? "text-red-500" : r.ctr > 0.1 ? "text-green-600" : "text-gray-700"}>{(r.ctr * 100).toFixed(1)}%</span></td>
                      <td className="px-3 py-2 text-right"><span className={r.position <= 3 ? "text-green-600 font-semibold" : r.position <= 10 ? "text-gray-700" : "text-red-500"}>{r.position?.toFixed(1)}</span></td>
                      <td className="px-3 py-2"><button className="h-6 px-1.5 text-[10px] text-gray-400 hover:text-black flex items-center" onClick={() => handleAnalyze(r)}><Wand2 className="w-3 h-3" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-lg">
          <DialogHeader><DialogTitle className="text-gray-900">Search Consoleデータをインポート</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-gray-500 text-xs">Search Console APIからエクスポートしたJSONデータを貼り付けてください。</p>
            <Textarea placeholder='[{"date":"2024-01-01","page":"/blog/article","query":"物流 コスト削減","impressions":500,"clicks":25,"ctr":0.05,"position":8.5}]' className="border-gray-200 text-gray-900 placeholder:text-gray-300 text-xs font-mono rounded-none resize-none focus:border-black focus:ring-0" rows={8} value={importJson} onChange={(e) => setImportJson(e.target.value)} data-testid="textarea-sc-import" />
          </div>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setImportOpen(false)}>キャンセル</button>
            <button className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40" onClick={() => importMutation.mutate()} disabled={!importJson || importMutation.isPending} data-testid="button-sc-import-confirm">{importMutation.isPending ? "インポート中..." : "インポートする"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!analyzeItem} onOpenChange={() => { setAnalyzeItem(null); setAnalysis(""); }}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-2xl">
          <DialogHeader><DialogTitle className="text-gray-900 flex items-center gap-2"><Wand2 className="w-4 h-4" /> AI改善分析</DialogTitle></DialogHeader>
          {analyzeItem && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-3 text-xs">
                <div className="text-gray-800 font-medium">{analyzeItem.page}</div>
                <div className="text-gray-500 mt-1">クエリ：{analyzeItem.query} / CTR: {(analyzeItem.ctr*100).toFixed(1)}% / 順位: {analyzeItem.position?.toFixed(1)}</div>
              </div>
              {analyzing ? (
                <div className="space-y-2"><Skeleton className="h-4 bg-gray-100" /><Skeleton className="h-4 bg-gray-100 w-4/5" /><Skeleton className="h-4 bg-gray-100 w-3/4" /></div>
              ) : analysis ? (
                <div className="bg-gray-50 border border-gray-200 p-4 text-gray-700 text-xs whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">{analysis}</div>
              ) : (
                <div className="text-gray-400 text-sm text-center py-4">分析中...</div>
              )}
            </div>
          )}
          <DialogFooter>
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => { setAnalyzeItem(null); setAnalysis(""); }}>閉じる</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "articles", label: "記事一覧", icon: FileText },
  { id: "keywords", label: "キーワード", icon: Tag },
  { id: "search-console", label: "サーチコンソール", icon: BarChart2 },
];

export default function AdminArticles() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-4xl">
        {/* Page header */}
        <div>
          <h1 className="text-lg font-bold text-gray-900">記事管理</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors -mb-px ${
                  active ? "border-black text-gray-900" : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "articles" && <ArticlesPanel />}
        {activeTab === "keywords" && <KeywordsPanel />}
        {activeTab === "search-console" && <SearchConsolePanel />}
      </div>
    </AdminLayout>
  );
}
