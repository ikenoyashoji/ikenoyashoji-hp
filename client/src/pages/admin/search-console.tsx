import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BarChart2, TrendingUp, TrendingDown, Upload, Wand2, ChevronUp, ChevronDown } from "lucide-react";

export default function AdminSearchConsole() {
  const [importJson, setImportJson] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [analyzeItem, setAnalyzeItem] = useState<any>(null);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [sortField, setSortField] = useState<string>("impressions");
  const [sortAsc, setSortAsc] = useState(false);
  const { toast } = useToast();

  const { data: scData, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/search-console"] });

  const importMutation = useMutation({
    mutationFn: async () => {
      const rows = JSON.parse(importJson);
      return apiRequest("POST", "/api/admin/search-console/save", { data: rows });
    },
    onSuccess: (d: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/search-console"] });
      setImportOpen(false);
      toast({ title: `${d.count}件のデータをインポートしました` });
    },
    onError: () => toast({ title: "インポートに失敗しました", variant: "destructive" }),
  });

  const handleAnalyze = async (item: any) => {
    setAnalyzeItem(item);
    setAnalysis("");
    setAnalyzing(true);
    try {
      const res = await fetch("/api/admin/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      toast({ title: "分析に失敗しました", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const sorted = [...(scData || [])].sort((a, b) => {
    const va = a[sortField] ?? 0;
    const vb = b[sortField] ?? 0;
    return sortAsc ? va - vb : vb - va;
  });

  const toggleSort = (field: string) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <BarChart2 className="w-3 h-3 text-gray-300" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-gray-700" /> : <ChevronDown className="w-3 h-3 text-gray-700" />;
  };

  const lowCtr = sorted.filter((r) => r.impressions > 100 && r.ctr < 0.03);
  const rising = sorted.filter((r) => r.position <= 10 && r.clicks > 5);

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-5xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">サーチコンソール PDCA</h1>
            <p className="text-gray-400 text-xs mt-0.5">{scData?.length ?? 0}件のデータ</p>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs hover:border-black hover:text-black transition-colors"
            onClick={() => setImportOpen(true)}
            data-testid="button-sc-import"
          >
            <Upload className="w-3.5 h-3.5" /> データをインポート
          </button>
        </div>

        <div className="border border-gray-200 bg-gray-50 p-3 text-gray-500 text-xs space-y-1">
          <p className="font-semibold text-gray-700">Search Console API連携について</p>
          <p>Google Search Console APIのデータをJSON形式でインポートしてください。</p>
          <p>形式：<code className="text-gray-700 bg-gray-100 px-1">[{`{"date":"2024-01-01","page":"/blog/slug","query":"キーワード","impressions":100,"clicks":5,"ctr":0.05,"position":8.5}`}]</code></p>
        </div>

        {isLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 bg-gray-100" />)}</div>
        ) : !scData?.length ? (
          <div className="text-center py-16 border border-gray-100 text-gray-400">
            <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm mb-3">データがありません</p>
            <button className="text-xs bg-black text-white px-4 py-2" onClick={() => setImportOpen(true)}>
              データをインポートする
            </button>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "改善が必要なページ", value: lowCtr.length, icon: TrendingDown },
                { label: "上位表示ページ", value: rising.length, icon: TrendingUp },
                { label: "総表示回数", value: scData.reduce((s, r) => s + r.impressions, 0).toLocaleString(), icon: BarChart2 },
                { label: "総クリック数", value: scData.reduce((s, r) => s + r.clicks, 0).toLocaleString(), icon: BarChart2 },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-gray-200 p-3 flex items-center gap-2">
                  <s.icon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div>
                    <div className="text-gray-900 font-bold text-base">{s.value}</div>
                    <div className="text-gray-400 text-[10px]">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Low CTR */}
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
                      <button
                        className="h-6 px-2 text-[10px] border border-gray-300 text-gray-600 hover:border-black flex items-center gap-1 flex-shrink-0 transition-colors"
                        onClick={() => handleAnalyze(r)}
                        data-testid={`button-analyze-${i}`}
                      >
                        <Wand2 className="w-3 h-3" /> AI分析
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data table */}
            <div className="bg-white border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-200">
                <span className="text-gray-700 text-sm font-medium">全データ</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-4 py-2 text-gray-500 font-medium">ページ / クエリ</th>
                      {[
                        { key: "impressions", label: "表示回数" },
                        { key: "clicks", label: "クリック" },
                        { key: "ctr", label: "CTR" },
                        { key: "position", label: "順位" },
                      ].map((col) => (
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
                        <td className="px-4 py-2.5">
                          <div className="text-gray-700 truncate max-w-[200px]">{r.page}</div>
                          <div className="text-gray-400 truncate max-w-[200px]">{r.query}</div>
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700">{r.impressions?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-gray-700">{r.clicks?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">
                          <span className={r.ctr < 0.03 ? "text-red-500" : r.ctr > 0.1 ? "text-green-600" : "text-gray-700"}>
                            {(r.ctr * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span className={r.position <= 3 ? "text-green-600 font-semibold" : r.position <= 10 ? "text-gray-700" : "text-red-500"}>
                            {r.position?.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <button
                            className="h-6 px-1.5 text-[10px] text-gray-400 hover:text-black flex items-center"
                            onClick={() => handleAnalyze(r)}
                          >
                            <Wand2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Import dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Search Consoleデータをインポート</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-gray-500 text-xs">Search Console APIからエクスポートしたJSONデータを貼り付けてください。</p>
            <Textarea
              placeholder='[{"date":"2024-01-01","page":"/blog/article","query":"物流 コスト削減","impressions":500,"clicks":25,"ctr":0.05,"position":8.5}]'
              className="border-gray-200 text-gray-900 placeholder:text-gray-300 text-xs font-mono rounded-none resize-none focus:border-black focus:ring-0"
              rows={8}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              data-testid="textarea-sc-import"
            />
          </div>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setImportOpen(false)}>キャンセル</button>
            <button
              className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40"
              onClick={() => importMutation.mutate()}
              disabled={!importJson || importMutation.isPending}
              data-testid="button-sc-import-confirm"
            >
              {importMutation.isPending ? "インポート中..." : "インポートする"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI analysis dialog */}
      <Dialog open={!!analyzeItem} onOpenChange={() => { setAnalyzeItem(null); setAnalysis(""); }}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 flex items-center gap-2">
              <Wand2 className="w-4 h-4" /> AI改善分析
            </DialogTitle>
          </DialogHeader>
          {analyzeItem && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-3 text-xs">
                <div className="text-gray-800 font-medium">{analyzeItem.page}</div>
                <div className="text-gray-500 mt-1">クエリ：{analyzeItem.query} / CTR: {(analyzeItem.ctr*100).toFixed(1)}% / 順位: {analyzeItem.position?.toFixed(1)}</div>
              </div>
              {analyzing ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 bg-gray-100" />
                  <Skeleton className="h-4 bg-gray-100 w-4/5" />
                  <Skeleton className="h-4 bg-gray-100 w-3/4" />
                </div>
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
    </AdminLayout>
  );
}
