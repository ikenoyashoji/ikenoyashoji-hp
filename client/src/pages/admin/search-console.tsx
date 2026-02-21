import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BarChart2, TrendingUp, TrendingDown, Upload, Wand2, RotateCcw, ChevronUp, ChevronDown } from "lucide-react";

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
    if (sortField !== field) return <BarChart2 className="w-3 h-3 text-blue-600" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-amber-400" /> : <ChevronDown className="w-3 h-3 text-amber-400" />;
  };

  const lowCtr = sorted.filter((r) => r.impressions > 100 && r.ctr < 0.03);
  const rising = sorted.filter((r) => r.position <= 10 && r.clicks > 5);

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-black text-white">サーチコンソール PDCA</h1>
            <p className="text-blue-400 text-xs mt-0.5">{scData?.length ?? 0}件のデータ</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-blue-700 text-blue-300 bg-transparent text-xs"
            onClick={() => setImportOpen(true)}
            data-testid="button-sc-import"
          >
            <Upload className="w-3.5 h-3.5 mr-1" /> データをインポート
          </Button>
        </div>

        <div className="bg-blue-900/20 border border-blue-900/40 rounded-lg p-3 text-blue-300 text-xs space-y-1">
          <p className="font-semibold text-blue-200">Search Console API連携について</p>
          <p>Google Search Console APIのデータをJSON形式でインポートしてください。API連携は GOOGLE_REFRESH_TOKEN 等の環境変数を設定後、カスタム実装で追加可能です。</p>
          <p>インポートするJSONの形式：<code className="text-amber-300">[{"{"}"date":"2024-01-01","page":"/blog/slug","query":"キーワード","impressions":100,"clicks":5,"ctr":0.05,"position":8.5{"}"}]</code></p>
        </div>

        {isLoading ? (
          <div className="space-y-2">{[1,2,3].map(i=><Skeleton key={i} className="h-16 bg-[#0f2044]"/>)}</div>
        ) : !scData?.length ? (
          <div className="text-center py-16 text-blue-500">
            <BarChart2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">データがありません</p>
            <Button size="sm" className="mt-3 bg-amber-500 text-white border-amber-400 text-xs" onClick={() => setImportOpen(true)}>
              データをインポートする
            </Button>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "改善が必要なページ", value: lowCtr.length, icon: TrendingDown, color: "text-red-400" },
                { label: "上位表示ページ", value: rising.length, icon: TrendingUp, color: "text-green-400" },
                { label: "総表示回数", value: scData.reduce((s, r) => s + r.impressions, 0).toLocaleString(), icon: BarChart2, color: "text-blue-400" },
                { label: "総クリック数", value: scData.reduce((s, r) => s + r.clicks, 0).toLocaleString(), icon: BarChart2, color: "text-amber-400" },
              ].map((s) => (
                <Card key={s.label} className="bg-[#0f2044] border-blue-900">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                      <div>
                        <div className="text-white font-bold text-base">{s.value}</div>
                        <div className="text-blue-400 text-[10px]">{s.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Low CTR alert */}
            {lowCtr.length > 0 && (
              <Card className="bg-red-900/10 border-red-900/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-300 text-sm flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" /> CTRが低いページ（要改善）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lowCtr.slice(0, 5).map((r, i) => (
                      <div key={i} className="flex items-center gap-3 bg-red-900/10 rounded p-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-red-200 text-xs truncate">{r.page}</div>
                          <div className="text-red-400 text-[10px]">{r.query} / CTR: {(r.ctr*100).toFixed(1)}% / 順位: {r.position?.toFixed(1)}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-[10px] border-amber-700 text-amber-400 bg-transparent flex-shrink-0"
                          onClick={() => handleAnalyze(r)}
                          data-testid={`button-analyze-${i}`}
                        >
                          <Wand2 className="w-3 h-3 mr-1" /> AI分析
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data table */}
            <Card className="bg-[#0f2044] border-blue-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">全データ</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-blue-900">
                        <th className="text-left px-3 py-2 text-blue-400 font-medium">ページ / クエリ</th>
                        {[
                          { key: "impressions", label: "表示回数" },
                          { key: "clicks", label: "クリック" },
                          { key: "ctr", label: "CTR" },
                          { key: "position", label: "順位" },
                        ].map((col) => (
                          <th key={col.key} className="text-right px-3 py-2 text-blue-400 font-medium cursor-pointer hover:text-white" onClick={() => toggleSort(col.key)}>
                            <span className="flex items-center justify-end gap-1">
                              {col.label} <SortIcon field={col.key} />
                            </span>
                          </th>
                        ))}
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.slice(0, 50).map((r, i) => (
                        <tr key={i} className="border-b border-blue-900/50 hover:bg-blue-900/20">
                          <td className="px-3 py-2">
                            <div className="text-blue-200 truncate max-w-[200px]">{r.page}</div>
                            <div className="text-blue-500 truncate max-w-[200px]">{r.query}</div>
                          </td>
                          <td className="px-3 py-2 text-right text-blue-200">{r.impressions?.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right text-blue-200">{r.clicks?.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right">
                            <span className={r.ctr < 0.03 ? "text-red-400" : r.ctr > 0.1 ? "text-green-400" : "text-blue-200"}>
                              {(r.ctr * 100).toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <span className={r.position <= 3 ? "text-green-400" : r.position <= 10 ? "text-blue-200" : "text-red-400"}>
                              {r.position?.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-1.5 text-[10px] text-amber-400"
                              onClick={() => handleAnalyze(r)}
                            >
                              <Wand2 className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Import dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="bg-[#0f2044] border-blue-900 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Search Consoleデータをインポート</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-blue-300 text-xs">Search Console APIからエクスポートしたJSONデータを貼り付けてください。</p>
            <Textarea
              placeholder='[{"date":"2024-01-01","page":"/blog/article","query":"物流 コスト削減","impressions":500,"clicks":25,"ctr":0.05,"position":8.5}]'
              className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs font-mono"
              rows={8}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              data-testid="textarea-sc-import"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="border-blue-700 text-blue-300 bg-transparent" onClick={() => setImportOpen(false)}>キャンセル</Button>
            <Button
              className="bg-amber-500 text-white border-amber-400"
              onClick={() => importMutation.mutate()}
              disabled={!importJson || importMutation.isPending}
              data-testid="button-sc-import-confirm"
            >
              {importMutation.isPending ? "インポート中..." : "インポートする"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI analysis dialog */}
      <Dialog open={!!analyzeItem} onOpenChange={() => { setAnalyzeItem(null); setAnalysis(""); }}>
        <DialogContent className="bg-[#0f2044] border-blue-900 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-amber-400" /> AI改善分析
            </DialogTitle>
          </DialogHeader>
          {analyzeItem && (
            <div className="space-y-4">
              <div className="bg-blue-900/30 rounded p-3 text-xs">
                <div className="text-blue-200 font-medium">{analyzeItem.page}</div>
                <div className="text-blue-400 mt-1">クエリ：{analyzeItem.query} / CTR: {(analyzeItem.ctr*100).toFixed(1)}% / 順位: {analyzeItem.position?.toFixed(1)}</div>
              </div>
              {analyzing ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 bg-blue-900" />
                  <Skeleton className="h-4 bg-blue-900 w-4/5" />
                  <Skeleton className="h-4 bg-blue-900 w-3/4" />
                </div>
              ) : analysis ? (
                <div className="bg-[#0a1628] rounded p-4 text-blue-200 text-xs whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">{analysis}</div>
              ) : (
                <div className="text-blue-500 text-sm text-center py-4">分析中...</div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="border-blue-700 text-blue-300 bg-transparent" onClick={() => { setAnalyzeItem(null); setAnalysis(""); }}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
