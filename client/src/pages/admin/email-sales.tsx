import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Mail, Send, Search, Trash2, RefreshCw, Play,
  Globe, CheckCircle, AlertCircle, Clock, Wand2, Plus,
  BookmarkPlus, FolderOpen,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: "未送信", color: "text-gray-500 bg-gray-100" },
  sent: { label: "送信済", color: "text-green-700 bg-green-50" },
  failed: { label: "失敗", color: "text-red-600 bg-red-50" },
  skipped: { label: "スキップ", color: "text-yellow-700 bg-yellow-50" },
};

const CATEGORY_LABEL: Record<string, string> = {
  shipper: "荷主",
  partner: "協力会社",
  recruit: "採用",
};

function buildHtmlEmailPreview(body: string): string {
  const paragraphs = body
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => `<p style="margin:0 0 16px 0;line-height:1.8;color:#1e293b;font-size:14px;">${l}</p>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    @keyframes logoPulse {
      0%,100% { box-shadow:0 0 0 0 rgba(147,197,253,0.55); }
      50% { box-shadow:0 0 0 14px rgba(147,197,253,0); }
    }
    @keyframes fadeSlideDown {
      from { opacity:0;transform:translateY(-10px); }
      to { opacity:1;transform:translateY(0); }
    }
    @keyframes accentShimmer {
      0% { background-position:0% 50%; }
      50% { background-position:100% 50%; }
      100% { background-position:0% 50%; }
    }
    .logo-ring { animation:logoPulse 2.5s ease-in-out infinite; }
    .hd-title { animation:fadeSlideDown 0.7s ease forwards; }
    .hd-sub { animation:fadeSlideDown 0.7s 0.18s ease both; }
    .accent-bar {
      background:linear-gradient(90deg,#1a4b99,#3b82f6,#60a5fa,#3b82f6,#1a4b99);
      background-size:200% 200%;
      animation:accentShimmer 3s ease infinite;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#dce7f5;font-family:'Helvetica Neue',Arial,'Hiragino Kaku Gothic ProN',Meiryo,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#dce7f5;padding:28px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 6px 32px rgba(15,32,68,0.18);">

      <!-- HEADER -->
      <tr>
        <td style="background:linear-gradient(160deg,#1d4ed8 0%,#2563eb 30%,#3b82f6 65%,#60a5fa 100%);padding:40px 40px 36px 40px;text-align:center;">
          <p class="hd-title" style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.38em;color:rgba(255,255,255,0.85);font-weight:400;">Ikenoyashoji Co., Ltd.</p>
          <p class="hd-title" style="margin:0 0 10px 0;font-size:24px;font-weight:800;color:#ffffff;letter-spacing:0.06em;font-family:'Hiragino Mincho ProN','Yu Mincho','游明朝',Georgia,serif;">株式会社池ノ谷商事</p>
          <p class="hd-sub" style="margin:0;font-size:11px;color:rgba(255,255,255,0.75);letter-spacing:0.14em;">物流・運送サービスのご案内</p>
        </td>
      </tr>

      <!-- ACCENT LINE -->
      <tr><td class="accent-bar" style="height:4px;"></td></tr>

      <!-- BODY -->
      <tr>
        <td style="padding:36px 40px 24px 40px;background:#ffffff;">
          ${paragraphs}
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:4px 40px 36px 40px;background:#ffffff;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="background:linear-gradient(135deg,#1a4b99 0%,#2563eb 100%);border-radius:4px;box-shadow:0 4px 14px rgba(37,99,235,0.35);">
              <a href="mailto:info@ikenoyashoji.co.jp" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.1em;">メールでお問い合わせ →</a>
            </td>
          </tr></table>
        </td>
      </tr>

      <!-- DIVIDER -->
      <tr><td style="padding:0 40px;background:#ffffff;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"/></td></tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding:24px 40px 28px 40px;background:#f8fafc;">
          <p style="margin:0 0 3px 0;font-size:13px;font-weight:800;color:#0f2044;">株式会社池ノ谷商事　営業部</p>
          <p style="margin:0 0 3px 0;font-size:11px;color:#64748b;">〒243-0303　神奈川県愛甲郡愛川町中津7287</p>
          <p style="margin:0 0 3px 0;font-size:11px;color:#64748b;">TEL: <a href="tel:046-212-2766" style="color:#1a4b99;text-decoration:none;">046-212-2766</a>　／　Email: <a href="mailto:info@ikenoyashoji.co.jp" style="color:#1a4b99;text-decoration:none;">info@ikenoyashoji.co.jp</a></p>
          <p style="margin:4px 0 0 0;font-size:11px;color:#64748b;">URL: <a href="https://ikenoyashoji.jp" style="color:#1a4b99;text-decoration:none;">https://ikenoyashoji.jp</a></p>
          <p style="margin:18px 0 0 0;padding-top:14px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;line-height:1.7;">
            このメールは株式会社池ノ谷商事 営業部よりお送りしております。<br/>
            今後このようなメールの受信を希望されない場合は<span style="color:#94a3b8;text-decoration:underline;">こちらをクリックして配信停止</span>してください。
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

function fmtDate(s: string | null) {
  if (!s) return "—";
  try { return format(parseISO(s), "M/d HH:mm", { locale: ja }); } catch { return s; }
}

export default function AdminEmailSales() {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ company: "", website: "", email: "", category: "shipper" });
  const [crawling, setCrawling] = useState(false);
  const [running, setRunning] = useState(false);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [templateSaveOpen, setTemplateSaveOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const { data: leads = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/email-leads"] });
  const { data: smtpStatus } = useQuery<any>({ queryKey: ["/api/admin/settings/status"] });
  const { data: templates = [] } = useQuery<any[]>({ queryKey: ["/api/admin/email-templates"] });
  const smtpOk = smtpStatus?.smtp;

  const filtered = (leads as any[]).filter((l) => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (filterCat !== "all" && l.category !== filterCat) return false;
    if (search && !l.company?.includes(search) && !l.email?.includes(search)) return false;
    return true;
  });

  const selected = filtered.find((l) => l.id === selectedId) ?? filtered[0] ?? null;

  const stats = {
    total: (leads as any[]).length,
    sent: (leads as any[]).filter((l) => l.status === "sent").length,
    pending: (leads as any[]).filter((l) => l.status === "pending").length,
    withEmail: (leads as any[]).filter((l) => l.email).length,
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/email-leads/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-leads"] });
      setSelectedId(null);
      toast({ title: "削除しました" });
    },
  });

  const generateMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/email-leads/${id}/generate`, {}),
    onSuccess: async (res) => {
      const data = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/email-leads"] });
      setEditSubject(data.emailSubject || "");
      setEditBody(data.emailBody || "");
      setEditMode(false);
      toast({ title: "メールを生成しました" });
    },
    onError: () => toast({ title: "生成失敗", variant: "destructive" }),
  });

  const saveMutation = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/admin/email-leads/${id}`, { emailSubject: editSubject, emailBody: editBody }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-leads"] });
      setEditMode(false);
      toast({ title: "保存しました" });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id: number) => apiRequest("POST", `/api/admin/email-leads/${id}/send`, {}),
    onSuccess: async (res) => {
      const data = await res.json();
      if (data.error) { toast({ title: `送信失敗: ${data.error}`, variant: "destructive" }); return; }
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-leads"] });
      toast({ title: "送信しました" });
    },
    onError: (e: any) => toast({ title: `送信失敗: ${e.message}`, variant: "destructive" }),
  });

  const addMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/email-leads", addForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-leads"] });
      setAddOpen(false);
      setAddForm({ company: "", website: "", email: "", category: "shipper" });
      toast({ title: "リードを追加しました" });
    },
  });

  const saveTemplateMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/email-templates", {
      name: templateName,
      subject: editSubject,
      body: editBody,
      category: selected?.category || "shipper",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      setTemplateSaveOpen(false);
      setTemplateName("");
      toast({ title: "テンプレートを保存しました" });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/email-templates/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-templates"] });
      toast({ title: "テンプレートを削除しました" });
    },
  });

  const handleCrawl = async () => {
    setCrawling(true);
    try {
      const res = await apiRequest("POST", "/api/admin/email-sales/crawl", {});
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-leads"] });
      toast({ title: `クロール完了：${data.added}件追加` });
    } catch { toast({ title: "クロール失敗", variant: "destructive" }); }
    finally { setCrawling(false); }
  };

  const handlePipeline = async () => {
    setRunning(true);
    try {
      const res = await apiRequest("POST", "/api/admin/email-sales/pipeline", {});
      const data = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-leads"] });
      toast({ title: `完了: クロール${data.crawled}件 生成${data.generated}件 送信${data.sent}件` });
    } catch { toast({ title: "パイプライン失敗", variant: "destructive" }); }
    finally { setRunning(false); }
  };

  const handleSelectLead = (lead: any) => {
    setSelectedId(lead.id);
    setEditSubject(lead.emailSubject || "");
    setEditBody(lead.emailBody || "");
    setEditMode(false);
  };

  const handleLoadTemplate = (tpl: any) => {
    setEditSubject(tpl.subject);
    setEditBody(tpl.body);
    toast({ title: `テンプレート「${tpl.name}」を読み込みました` });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full -m-6">
        {/* Top toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 bg-white flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-bold text-gray-900">メール営業</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 ml-2 text-[11px] text-gray-400">
            <span>計 <b className="text-gray-700">{stats.total}</b></span>
            <span>送信済 <b className="text-green-600">{stats.sent}</b></span>
            <span>未送信 <b className="text-gray-700">{stats.pending}</b></span>
            <span>メールあり <b className="text-blue-600">{stats.withEmail}</b></span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {!smtpOk && (
              <span className="flex items-center gap-1 text-[11px] text-amber-600 border border-amber-200 bg-amber-50 px-2 py-1">
                <AlertCircle className="w-3 h-3" /> SMTP未設定
              </span>
            )}
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 text-gray-600 text-xs hover:border-black transition-colors"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-3 h-3" /> 手動追加
            </button>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 text-gray-600 text-xs hover:border-black transition-colors disabled:opacity-40"
              onClick={handleCrawl}
              disabled={crawling}
              data-testid="button-crawl-leads"
            >
              {crawling ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
              Yahoo検索クロール
            </button>
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black text-white text-xs hover:bg-gray-800 disabled:opacity-40 transition-colors"
              onClick={handlePipeline}
              disabled={running}
              data-testid="button-run-pipeline"
            >
              {running ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {running ? "実行中..." : "今すぐ一括実行（10件）"}
            </button>
          </div>
        </div>

        {/* Split panel */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT: Lead list */}
          <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
            {/* Filters */}
            <div className="px-3 py-2 border-b border-gray-100 space-y-2">
              <Input
                placeholder="会社名・メールで検索"
                className="h-7 text-xs border-gray-200 rounded-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex gap-1.5">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="flex-1 h-6 text-[10px] border-gray-200 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none text-xs">
                    <SelectItem value="all">全ステータス</SelectItem>
                    <SelectItem value="pending">未送信</SelectItem>
                    <SelectItem value="sent">送信済</SelectItem>
                    <SelectItem value="failed">失敗</SelectItem>
                    <SelectItem value="skipped">停止</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCat} onValueChange={setFilterCat}>
                  <SelectTrigger className="flex-1 h-6 text-[10px] border-gray-200 rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none text-xs">
                    <SelectItem value="all">全カテゴリ</SelectItem>
                    <SelectItem value="shipper">荷主</SelectItem>
                    <SelectItem value="partner">協力会社</SelectItem>
                    <SelectItem value="recruit">採用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-3 space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 bg-gray-50" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-300">
                  <Mail className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">リードがありません</p>
                  <p className="text-[10px] mt-1">Yahoo検索で自動取得</p>
                </div>
              ) : (
                filtered.map((lead) => {
                  const st = STATUS_LABEL[lead.status] ?? STATUS_LABEL.pending;
                  const isActive = selected?.id === lead.id;
                  return (
                    <div
                      key={lead.id}
                      className={`px-3 py-2.5 border-b border-gray-50 cursor-pointer transition-colors ${isActive ? "bg-black text-white" : "hover:bg-gray-50"}`}
                      onClick={() => handleSelectLead(lead)}
                      data-testid={`lead-row-${lead.id}`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${isActive ? "bg-white/20 text-white" : st.color}`}>
                          {st.label}
                        </span>
                        <span className={`text-[9px] ${isActive ? "text-gray-300" : "text-gray-400"}`}>
                          {CATEGORY_LABEL[lead.category] ?? lead.category}
                        </span>
                      </div>
                      <p className={`text-xs font-medium truncate leading-tight ${isActive ? "text-white" : "text-gray-800"}`}>
                        {lead.company || "（会社名なし）"}
                      </p>
                      <p className={`text-[10px] truncate mt-0.5 ${isActive ? "text-gray-300" : lead.email ? "text-blue-500" : "text-gray-300"}`}>
                        {lead.email || "メールなし"}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Email preview */}
          <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <Mail className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">リードを選択してください</p>
              </div>
            ) : (
              <>
                {/* Company info bar */}
                <div className="px-5 py-3 bg-white border-b border-gray-200 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{selected.company || "（会社名なし）"}</span>
                      <span className="text-[10px] px-1.5 py-0.5 border border-gray-200 text-gray-500">
                        {CATEGORY_LABEL[selected.category] ?? selected.category}
                      </span>
                      {(() => { const st = STATUS_LABEL[selected.status] ?? STATUS_LABEL.pending; return (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${st.color}`}>{st.label}</span>
                      ); })()}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
                      {selected.email && (
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selected.email}</span>
                      )}
                      {selected.website && (
                        <a href={selected.website} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                          <Globe className="w-3 h-3" />{selected.website.replace(/^https?:\/\//, "").substring(0, 40)}
                        </a>
                      )}
                      {selected.sentAt && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />{fmtDate(selected.sentAt)}送信
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      className="flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 text-gray-600 text-xs hover:border-black transition-colors disabled:opacity-40"
                      onClick={() => generateMutation.mutate(selected.id)}
                      disabled={generateMutation.isPending}
                      data-testid="button-generate-email"
                    >
                      {generateMutation.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      AIで生成
                    </button>
                    {editMode ? (
                      <>
                        <button className="flex items-center gap-1.5 px-2.5 py-1.5 border border-blue-200 text-blue-600 text-xs hover:border-blue-500"
                          onClick={() => setTemplateSaveOpen(true)}
                          data-testid="button-save-template">
                          <BookmarkPlus className="w-3 h-3" /> 保存
                        </button>
                        <button className="px-2.5 py-1.5 border border-gray-200 text-gray-600 text-xs hover:border-black"
                          onClick={() => { setEditMode(false); setEditSubject(selected.emailSubject || ""); setEditBody(selected.emailBody || ""); }}>
                          キャンセル
                        </button>
                        <button className="px-2.5 py-1.5 bg-gray-800 text-white text-xs hover:bg-black"
                          onClick={() => saveMutation.mutate(selected.id)} disabled={saveMutation.isPending}>
                          このリードに保存
                        </button>
                      </>
                    ) : (
                      <button className="px-2.5 py-1.5 border border-gray-200 text-gray-600 text-xs hover:border-black"
                        onClick={() => setEditMode(true)}>
                        編集
                      </button>
                    )}
                    <button
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black text-white text-xs hover:bg-gray-800 disabled:opacity-40 transition-colors"
                      onClick={() => sendMutation.mutate(selected.id)}
                      disabled={!smtpOk || !selected.email || !selected.emailSubject || sendMutation.isPending || selected.status === "sent"}
                      data-testid="button-send-lead-email"
                    >
                      {sendMutation.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      送信
                    </button>
                    <button
                      className="p-1.5 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                      onClick={() => deleteMutation.mutate(selected.id)}
                      data-testid="button-delete-lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Email preview / edit */}
                <div className="flex-1 overflow-y-auto p-5">
                  {!selected.emailSubject && !editMode ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-300 border border-dashed border-gray-200 bg-white">
                      <Wand2 className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-sm">メールがまだ生成されていません</p>
                      <button
                        className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs"
                        onClick={() => generateMutation.mutate(selected.id)}
                        disabled={generateMutation.isPending}
                      >
                        <Wand2 className="w-3 h-3" />
                        {generateMutation.isPending ? "生成中..." : "AIでメールを生成"}
                      </button>
                    </div>
                  ) : editMode ? (
                    <div className="bg-white border border-gray-200 p-5 space-y-4">
                      {/* Template loader */}
                      {(templates as any[]).length > 0 && (
                        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                          <FolderOpen className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-400 flex-shrink-0">テンプレート:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(templates as any[]).map((tpl: any) => (
                              <div key={tpl.id} className="flex items-center gap-0">
                                <button
                                  className="px-2 py-0.5 border border-blue-200 text-blue-600 text-[10px] hover:bg-blue-50 transition-colors"
                                  onClick={() => handleLoadTemplate(tpl)}
                                  data-testid={`button-load-template-${tpl.id}`}
                                >
                                  {tpl.name}
                                </button>
                                <button
                                  className="px-1 py-0.5 border border-l-0 border-gray-200 text-gray-300 text-[10px] hover:text-red-400 hover:border-red-200 transition-colors"
                                  onClick={() => deleteTemplateMutation.mutate(tpl.id)}
                                  title="削除"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">件名</label>
                        <Input
                          className="border-gray-200 rounded-none text-sm"
                          value={editSubject}
                          onChange={(e) => setEditSubject(e.target.value)}
                          data-testid="input-email-subject"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">本文</label>
                        <Textarea
                          className="border-gray-200 rounded-none text-xs resize-none"
                          rows={18}
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          data-testid="textarea-email-body"
                        />
                      </div>
                    </div>
                  ) : (
                    /* Email preview render */
                    <div className="bg-white border border-gray-200 shadow-sm max-w-2xl">
                      {/* Email header */}
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Mail className="w-3.5 h-3.5" />
                          <span>From: 株式会社池ノ谷商事 営業部 &lt;info@ikenoyashoji.jp&gt;　Reply-To: sales@ikenoyashoji.fun</span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">To: {selected.email || "（メールなし）"}</div>
                        <div className="text-sm font-semibold text-gray-900">{selected.emailSubject}</div>
                      </div>
                      {/* Email body – HTML preview */}
                      {selected.emailBody ? (
                        <iframe
                          srcDoc={buildHtmlEmailPreview(selected.emailBody)}
                          className="w-full border-0"
                          style={{ height: "560px" }}
                          sandbox="allow-same-origin"
                          title="email-preview"
                        />
                      ) : (
                        <div className="px-6 py-8 text-center text-gray-400 text-sm">
                          「AIで生成」ボタンでメール本文を生成してください
                        </div>
                      )}
                      {/* Crawl meta */}
                      {selected.crawlQuery && (
                        <div className="px-6 py-2 border-t border-gray-50 flex items-center gap-2 text-[10px] text-gray-300">
                          <Search className="w-3 h-3" />
                          クロールクエリ: {selected.crawlQuery}
                          <Clock className="w-3 h-3 ml-2" />
                          {fmtDate(selected.createdAt)}
                        </div>
                      )}
                    </div>
                  )}

                  {selected.errorMsg && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {selected.errorMsg}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900">リードを手動追加</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">会社名</label>
              <Input className="border-gray-200 rounded-none text-sm" value={addForm.company}
                onChange={(e) => setAddForm((f) => ({ ...f, company: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">メールアドレス</label>
              <Input className="border-gray-200 rounded-none text-sm" value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Webサイト</label>
              <Input className="border-gray-200 rounded-none text-sm" placeholder="https://..." value={addForm.website}
                onChange={(e) => setAddForm((f) => ({ ...f, website: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">カテゴリ</label>
              <Select value={addForm.category} onValueChange={(v) => setAddForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="border-gray-200 rounded-none text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="shipper">荷主</SelectItem>
                  <SelectItem value="partner">協力会社</SelectItem>
                  <SelectItem value="recruit">採用</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm" onClick={() => setAddOpen(false)}>キャンセル</button>
            <button className="px-4 py-2 bg-black text-white text-sm disabled:opacity-40"
              onClick={() => addMutation.mutate()} disabled={!addForm.company || addMutation.isPending}>
              追加
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={templateSaveOpen} onOpenChange={setTemplateSaveOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-sm">
          <DialogHeader><DialogTitle className="text-gray-900">テンプレートとして保存</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">テンプレート名</label>
              <Input
                className="border-gray-200 rounded-none text-sm"
                placeholder="例：荷主向け標準文"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                data-testid="input-template-name"
              />
            </div>
            <p className="text-[11px] text-gray-400">現在の件名・本文をテンプレートとして保存します。後でどのリードにも読み込んで使えます。</p>
          </div>
          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm" onClick={() => setTemplateSaveOpen(false)}>キャンセル</button>
            <button
              className="px-4 py-2 bg-black text-white text-sm disabled:opacity-40"
              onClick={() => saveTemplateMutation.mutate()}
              disabled={!templateName.trim() || saveTemplateMutation.isPending}
              data-testid="button-confirm-save-template"
            >
              保存
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
