import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Bot, Play, RefreshCw, Image, FileText, CheckCircle, AlertCircle, Clock, Zap } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

const CRON_PRESETS = [
  { label: "毎日 午前6時", value: "0 6 * * *" },
  { label: "毎日 午前9時", value: "0 9 * * *" },
  { label: "毎日 正午", value: "0 12 * * *" },
  { label: "毎日 深夜0時", value: "0 0 * * *" },
  { label: "週3回（月水金 午前9時）", value: "0 9 * * 1,3,5" },
];

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try { return format(parseISO(iso), "M月d日 HH:mm", { locale: ja }); } catch { return iso; }
}

export default function AdminAutoPublish() {
  const { toast } = useToast();
  const [triggering, setTriggering] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; title?: string; articleId?: number; imageGenerated?: boolean; error?: string } | null>(null);

  const { data: config, isLoading } = useQuery<any>({ queryKey: ["/api/admin/auto-publish/status"] });

  const toggleMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/auto-publish/toggle", {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/auto-publish/status"] }),
    onError: () => toast({ title: "切り替え失敗", variant: "destructive" }),
  });

  const settingsMutation = useMutation({
    mutationFn: (body: any) => apiRequest("PATCH", "/api/admin/auto-publish/settings", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/auto-publish/status"] });
      toast({ title: "設定を保存しました" });
    },
    onError: () => toast({ title: "設定保存失敗", variant: "destructive" }),
  });

  const handleTrigger = async () => {
    setTriggering(true);
    setLastResult(null);
    try {
      const res = await apiRequest("POST", "/api/admin/auto-publish/trigger", {});
      const data = await res.json();
      setLastResult(data);
      if (data.success) {
        toast({ title: `記事を生成しました：${data.title}` });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/auto-publish/status"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      } else {
        toast({ title: `生成失敗：${data.error}`, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "エラーが発生しました", variant: "destructive" });
    } finally {
      setTriggering(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-5 h-5 text-gray-400" />
              AI自動投稿
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">毎日AIがキーワードを調査して記事・画像を生成し自動公開します</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3"><Skeleton className="h-28 bg-gray-100" /><Skeleton className="h-24 bg-gray-100" /></div>
        ) : (
          <>
            {/* Status card */}
            <div className={`border p-5 ${config?.enabled ? "border-black bg-black text-white" : "border-gray-200 bg-white"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${config?.enabled ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
                  <span className={`text-sm font-semibold ${config?.enabled ? "text-white" : "text-gray-900"}`}>
                    {config?.enabled ? "稼働中" : "停止中"}
                  </span>
                </div>
                <Switch
                  checked={config?.enabled ?? false}
                  onCheckedChange={() => toggleMutation.mutate()}
                  disabled={toggleMutation.isPending}
                  data-testid="toggle-auto-publish"
                />
              </div>

              <div className={`grid grid-cols-2 gap-4 text-xs ${config?.enabled ? "text-gray-300" : "text-gray-500"}`}>
                <div>
                  <div className={`mb-0.5 ${config?.enabled ? "text-gray-500" : "text-gray-400"}`}>最終実行</div>
                  <div className={`font-medium ${config?.enabled ? "text-white" : "text-gray-700"}`}>
                    {fmtDate(config?.lastRun)}
                  </div>
                </div>
                <div>
                  <div className={`mb-0.5 ${config?.enabled ? "text-gray-500" : "text-gray-400"}`}>スケジュール</div>
                  <div className={`font-medium ${config?.enabled ? "text-white" : "text-gray-700"}`}>
                    {CRON_PRESETS.find((p) => p.value === config?.cronTime)?.label ?? config?.cronTime ?? "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="border border-gray-200 bg-white p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-800">スケジュール設定</h2>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">投稿タイミング</label>
                <Select
                  value={config?.cronTime ?? "0 9 * * *"}
                  onValueChange={(v) => settingsMutation.mutate({ cronTime: v })}
                >
                  <SelectTrigger className="border-gray-200 text-gray-700 text-xs rounded-none h-9" data-testid="select-cron-time">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-gray-200">
                    {CRON_PRESETS.map((p) => (
                      <SelectItem key={p.value} value={p.value} className="text-xs">{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-700">自動で即時公開</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">OFFにすると下書き保存になります</p>
                </div>
                <Switch
                  checked={config?.autoPublish ?? true}
                  onCheckedChange={(v) => settingsMutation.mutate({ autoPublish: v })}
                  data-testid="toggle-auto-publish-publish"
                />
              </div>

              <div className="pt-1 border-t border-gray-100">
                <h3 className="text-xs font-medium text-gray-700 mb-2">生成内容（自動）</h3>
                <ul className="space-y-1.5 text-[11px] text-gray-500">
                  <li className="flex items-center gap-2"><Zap className="w-3 h-3 text-blue-400" />GPT-4oによるロングテールSEOキーワード自動調査</li>
                  <li className="flex items-center gap-2"><FileText className="w-3 h-3 text-blue-400" />3500〜4500文字のSEO最適化記事（FAQ・CTA付き）</li>
                  <li className="flex items-center gap-2"><Image className="w-3 h-3 text-blue-400" />DALL-E 3によるファッション雑誌スタイル画像（1792×1024）</li>
                </ul>
              </div>
            </div>

            {/* Manual trigger */}
            <div className="border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">今すぐ生成</h2>
              <p className="text-xs text-gray-500 mb-4">スケジュールを待たずに今すぐ記事を1件生成・投稿します。キーワード調査→記事生成→画像生成の順に処理します（約1〜2分）。</p>
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40 transition-colors"
                onClick={handleTrigger}
                disabled={triggering}
                data-testid="button-trigger-auto-publish"
              >
                {triggering ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {triggering ? "生成中..." : "今すぐ生成する"}
              </button>

              {triggering && (
                <div className="mt-4 p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin text-blue-500" />キーワードを調査中...</div>
                  <div className="text-gray-400 pl-5">→ 記事を生成中... → 画像を生成中（約40〜60秒）</div>
                </div>
              )}

              {lastResult && (
                <div className={`mt-4 p-3 border text-xs ${lastResult.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>
                  {lastResult.success ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> 生成完了
                      </div>
                      <p className="pl-5">{lastResult.title}</p>
                      <div className="pl-5 flex items-center gap-3 text-green-600">
                        {lastResult.imageGenerated ? <span className="flex items-center gap-1"><Image className="w-3 h-3" />画像生成済み</span> : <span className="text-yellow-600">画像なし</span>}
                        <Link href={`/admin/articles/${lastResult.articleId}`}>
                          <span className="underline cursor-pointer">記事を確認 →</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>エラー: {lastResult.error}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Activity log */}
            {config?.log?.length > 0 && (
              <div className="border border-gray-200 bg-white p-5">
                <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  生成履歴
                </h2>
                <div className="space-y-1">
                  {config.log.slice(0, 10).map((entry: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0 text-xs">
                      <span className="text-gray-400 flex-shrink-0 w-20">{fmtDate(entry.date)}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-700 truncate block">{entry.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {entry.imageGenerated && <span title="画像あり"><Image className="w-3 h-3 text-blue-400" /></span>}
                        <span className={`px-1.5 py-0.5 text-[10px] ${entry.status === "published" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
                          {entry.status === "published" ? "公開" : "下書き"}
                        </span>
                        <Link href={`/admin/articles/${entry.articleId}`}>
                          <span className="text-gray-400 hover:text-black cursor-pointer">→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
