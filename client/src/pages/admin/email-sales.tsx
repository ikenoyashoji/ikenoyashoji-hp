import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send, Users, AlertCircle, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const typeLabel: Record<string, string> = { shipper: "荷主", recruit: "採用", partner: "協力会社" };

const TEMPLATES = [
  {
    label: "荷主向け：物流改善提案",
    subject: "【株式会社池ノ谷商事】物流コスト削減のご提案",
    body: `いつもお世話になっております。
株式会社池ノ谷商事の営業担当です。

このたびは弊社サービスにご興味をお持ちいただき、誠にありがとうございます。

弊社では関東圏を中心に、定期輸送・スポット輸送・チャーター便など
お客様のニーズに合わせた輸送サービスをご提供しております。

現在、物流コスト削減や輸送効率化でお困りの企業様向けに
無料の物流診断を実施しております。

ぜひ一度、ご相談の機会をいただけますでしょうか。
ご都合のよいお日にちをお知らせいただければ幸いです。

株式会社池ノ谷商事
TEL: 03-XXXX-XXXX
Email: info@ikenoyashoji.co.jp`,
  },
  {
    label: "協力会社向け：パートナー募集",
    subject: "【株式会社池ノ谷商事】業務委託パートナーのご案内",
    body: `お世話になっております。
株式会社池ノ谷商事です。

弊社では現在、関東・関西エリアにて業務委託可能な
協力会社様を積極的に募集しております。

【特徴】
・安定した仕事量の提供
・適正な運賃設定
・迅速な支払い（月末締め翌月末払い）

詳細についてはお気軽にお問い合わせください。

株式会社池ノ谷商事
Email: info@ikenoyashoji.co.jp`,
  },
  {
    label: "採用向け：求人のご案内",
    subject: "【池ノ谷商事】ドライバー求人のご案内",
    body: `この度は弊社求人にご関心をお持ちいただきありがとうございます。

株式会社池ノ谷商事では現在、ドライバーを積極募集中です。

【待遇】
・月給25万円〜（経験考慮）
・各種社会保険完備
・年間休日105日以上
・未経験歓迎

ご応募・ご質問はお気軽にご連絡ください。

株式会社池ノ谷商事 採用担当
Email: info@ikenoyashoji.co.jp`,
  },
];

export default function AdminEmailSales() {
  const [filterType, setFilterType] = useState("all");
  const [selected, setSelected] = useState<number[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [manualTo, setManualTo] = useState("");
  const [templateIdx, setTemplateIdx] = useState<number | "">("");
  const { toast } = useToast();

  const { data: contacts, isLoading } = useQuery<any[]>({ queryKey: ["/api/admin/contacts"] });
  const { data: status } = useQuery<any>({ queryKey: ["/api/admin/settings/status"] });

  const filtered = (contacts || []).filter((c) => filterType === "all" || c.type === filterType);

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const toggleAll = () => {
    if (selected.length === filtered.length) setSelected([]);
    else setSelected(filtered.map((c) => c.id));
  };

  const applyTemplate = (idx: number) => {
    const t = TEMPLATES[idx];
    if (!t) return;
    setSubject(t.subject);
    setBody(t.body);
    setTemplateIdx(idx);
  };

  const sendMutation = useMutation({
    mutationFn: async () => {
      const toList = selected.length > 0
        ? filtered.filter((c) => selected.includes(c.id)).map((c) => c.email)
        : manualTo.split(/[,\n]/).map((e) => e.trim()).filter(Boolean);

      if (toList.length === 0) throw new Error("送信先が選択されていません");
      if (!subject) throw new Error("件名を入力してください");
      if (!body) throw new Error("本文を入力してください");

      return apiRequest("POST", "/api/admin/email/send", { to: toList, subject, body });
    },
    onSuccess: (d: any) => {
      setComposeOpen(false);
      setSelected([]);
      toast({ title: `メールを送信しました（${d.accepted?.length ?? "?"} 件）` });
    },
    onError: (err: any) => {
      toast({ title: "送信に失敗しました", description: err.message, variant: "destructive" });
    },
  });

  const smtpOk = status?.smtp;

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-4xl">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-gray-900">メール営業</h1>
            <p className="text-gray-400 text-xs mt-0.5">問い合わせ済みの連絡先へのフォローアップメール送信</p>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs hover:bg-gray-800 disabled:opacity-40 transition-colors"
            onClick={() => setComposeOpen(true)}
            data-testid="button-compose-email"
          >
            <Mail className="w-3.5 h-3.5" /> メールを作成
          </button>
        </div>

        {/* SMTP status */}
        <div className={`border p-3 flex items-start gap-2.5 text-xs ${smtpOk ? "border-green-100 bg-green-50 text-green-700" : "border-amber-100 bg-amber-50 text-amber-700"}`}>
          {smtpOk
            ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          }
          <div>
            {smtpOk ? (
              <span>SMTPが設定済みです。メール送信が可能です。</span>
            ) : (
              <>
                <span className="font-semibold">SMTPサーバーが未設定のためメール送信はできません。</span>
                <span className="block mt-0.5">「設定」ページから SMTP_HOST・SMTP_USER・SMTP_PASS を環境変数に設定してください。</span>
              </>
            )}
          </div>
        </div>

        {/* Filter + contact list */}
        <div className="bg-white border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 text-sm font-medium">問い合わせ一覧</span>
            </div>
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setSelected([]); }}>
              <SelectTrigger className="w-32 border-gray-200 text-gray-600 text-xs h-7 rounded-none" data-testid="select-email-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none border-gray-200">
                <SelectItem value="all" className="text-xs">すべて</SelectItem>
                <SelectItem value="shipper" className="text-xs">荷主</SelectItem>
                <SelectItem value="recruit" className="text-xs">採用</SelectItem>
                <SelectItem value="partner" className="text-xs">協力会社</SelectItem>
              </SelectContent>
            </Select>
            {filtered.length > 0 && (
              <button onClick={toggleAll} className="text-xs text-gray-500 hover:text-gray-900 ml-auto" data-testid="button-select-all">
                {selected.length === filtered.length ? "選択解除" : `全選択（${filtered.length}件）`}
              </button>
            )}
            {selected.length > 0 && (
              <button
                className="flex items-center gap-1 px-3 py-1 bg-black text-white text-xs hover:bg-gray-800 transition-colors"
                onClick={() => setComposeOpen(true)}
                data-testid="button-send-selected"
              >
                <Send className="w-3 h-3" /> 選択した{selected.length}件に送信
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="p-4 space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 bg-gray-50" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-300">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">問い合わせがありません</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((c: any) => (
                <div
                  key={c.id}
                  className={`px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selected.includes(c.id) ? "bg-blue-50" : ""}`}
                  onClick={() => toggleSelect(c.id)}
                  data-testid={`contact-row-${c.id}`}
                >
                  <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center ${selected.includes(c.id) ? "bg-black border-black" : "border-gray-300"}`}>
                    {selected.includes(c.id) && <span className="text-white text-[10px] leading-none">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 border border-gray-200 text-gray-500">{typeLabel[c.type] ?? c.type}</span>
                      <span className="text-gray-800 text-xs font-medium">{c.name}</span>
                      {c.company && <span className="text-gray-400 text-xs">（{c.company}）</span>}
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">{c.email}</p>
                  </div>
                  <span className="text-gray-300 text-[11px] flex-shrink-0">{format(new Date(c.createdAt), "M/d", { locale: ja })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compose dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="bg-white border-gray-200 rounded-none max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 flex items-center gap-2">
              <Mail className="w-4 h-4" /> メール作成
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* To */}
            <div>
              <label className="text-gray-600 text-xs font-medium">送信先</label>
              {selected.length > 0 ? (
                <div className="mt-1 border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700">
                  選択された {selected.length} 件の問い合わせ先に送信
                  <span className="text-gray-400 ml-2">（{filtered.filter((c) => selected.includes(c.id)).map((c) => c.email).join(", ")}）</span>
                </div>
              ) : (
                <Input
                  placeholder="例：customer@example.com（複数の場合はカンマ区切り）"
                  className="border-gray-200 text-gray-900 placeholder:text-gray-300 mt-1 text-xs rounded-none focus:border-black focus:ring-0"
                  value={manualTo}
                  onChange={(e) => setManualTo(e.target.value)}
                  data-testid="input-email-to"
                />
              )}
            </div>

            {/* Template */}
            <div>
              <label className="text-gray-600 text-xs font-medium">テンプレート（任意）</label>
              <Select value={templateIdx === "" ? "" : String(templateIdx)} onValueChange={(v) => applyTemplate(Number(v))}>
                <SelectTrigger className="border-gray-200 text-gray-600 text-xs h-8 mt-1 rounded-none" data-testid="select-email-template">
                  <SelectValue placeholder="テンプレートを選択..." />
                </SelectTrigger>
                <SelectContent className="rounded-none border-gray-200">
                  {TEMPLATES.map((t, i) => (
                    <SelectItem key={i} value={String(i)} className="text-xs">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject */}
            <div>
              <label className="text-gray-600 text-xs font-medium">件名</label>
              <Input
                placeholder="メールの件名"
                className="border-gray-200 text-gray-900 placeholder:text-gray-300 mt-1 text-sm rounded-none focus:border-black focus:ring-0"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                data-testid="input-email-subject"
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-gray-600 text-xs font-medium">本文</label>
              <Textarea
                placeholder="メールの本文"
                className="border-gray-200 text-gray-900 placeholder:text-gray-300 mt-1 text-xs rounded-none resize-none focus:border-black focus:ring-0"
                rows={12}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                data-testid="textarea-email-body"
              />
            </div>

            {!smtpOk && (
              <div className="flex items-center gap-2 border border-red-100 bg-red-50 p-3 text-xs text-red-600">
                <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                SMTPが設定されていないため送信できません。「設定」画面で SMTP 環境変数を設定してください。
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <button className="px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-black" onClick={() => setComposeOpen(false)}>キャンセル</button>
            <button
              className="px-4 py-2 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-40 flex items-center gap-2"
              onClick={() => sendMutation.mutate()}
              disabled={!smtpOk || sendMutation.isPending || (!subject || !body)}
              data-testid="button-send-email"
            >
              <Send className="w-3.5 h-3.5" />
              {sendMutation.isPending ? "送信中..." : "送信する"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
