import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, CheckCircle } from "lucide-react";

const contactSchema = z.object({
  type: z.enum(["shipper", "recruit", "partner"]),
  name: z.string().min(1, "お名前を入力してください"),
  company: z.string().optional(),
  email: z.string().email("メールアドレスの形式が正しくありません"),
  phone: z.string().optional(),
  prefecture: z.string().optional(),
  cargoType: z.string().optional(),
  message: z.string().min(10, "10文字以上入力してください"),
  privacyAgreed: z.boolean().refine((v) => v, "プライバシーポリシーへの同意が必要です"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const typeConfig = {
  shipper: { label: "荷主・輸送のご相談", color: "text-[#1a4b99]", bg: "bg-blue-50 border-blue-200" },
  recruit: { label: "採用のお問い合わせ", color: "text-[#c0392b]", bg: "bg-red-50 border-red-200" },
  partner: { label: "協力会社のご登録", color: "text-[#6B9E9E]", bg: "bg-teal-50 border-teal-200" },
};

export default function Contact() {
  const search = useSearch();
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const params = new URLSearchParams(search);
  const defaultType = (params.get("type") || "shipper") as "shipper" | "recruit" | "partner";

  useEffect(() => {
    trackPageView("/contact");
    document.title = "お問い合わせ｜アクロス物流株式会社";
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: defaultType,
      name: "",
      company: "",
      email: "",
      phone: "",
      prefecture: "",
      cargoType: "",
      message: "",
      privacyAgreed: false,
    },
  });

  const watchType = form.watch("type");
  const config = typeConfig[watchType];

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest("/api/contacts", { method: "POST", body: JSON.stringify(data) });
    },
    onSuccess: () => {
      trackEvent("contact_form_submit", { type: watchType });
      setSubmitted(true);
    },
    onError: () => {
      toast({ title: "送信に失敗しました", description: "しばらく経ってから再度お試しください。", variant: "destructive" });
    },
  });

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 pt-16">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-[#6B9E9E]/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#6B9E9E]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">送信完了しました</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              お問い合わせありがとうございます。担当者より2営業日以内にご連絡いたします。
            </p>
            <a href="/" className="text-[#c0392b] hover:underline text-sm">ホームに戻る</a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="pt-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <span className="text-[#c0392b] font-black text-4xl italic font-serif">Contact</span>
          <p className="text-gray-400 text-sm mt-1 mb-8">お問い合わせ</p>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <a href="tel:0312345678" className="border border-gray-200 rounded-lg p-5 hover:border-[#c0392b] transition-colors hover-elevate flex items-center gap-3" data-testid="link-contact-tel">
              <Phone className="w-5 h-5 text-[#c0392b] flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400">お電話</div>
                <div className="text-gray-800 font-bold">03-1234-5678</div>
                <div className="text-xs text-gray-400">平日 9:00〜18:00</div>
              </div>
            </a>
            <a href="mailto:info@across-logistics.co.jp" className="border border-gray-200 rounded-lg p-5 hover:border-[#c0392b] transition-colors hover-elevate flex items-center gap-3" data-testid="link-contact-email">
              <Mail className="w-5 h-5 text-[#c0392b] flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-400">メール</div>
                <div className="text-gray-700 text-sm">info@across-logistics.co.jp</div>
                <div className="text-xs text-gray-400">24時間受付</div>
              </div>
            </a>
            <div className="border border-gray-200 rounded-lg p-5 flex items-start gap-3">
              <span className="text-lg">📍</span>
              <div>
                <div className="text-xs text-gray-400">本社所在地</div>
                <div className="text-gray-700 text-xs leading-relaxed mt-1">〒135-0001<br />東京都江東区東陽1-1-1</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
            <h2 className="font-bold text-gray-800 text-lg mb-6">お問い合わせフォーム</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">お問い合わせ種別</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.entries(typeConfig) as [string, (typeof typeConfig)[keyof typeof typeConfig]][]).map(([key, cfg]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => field.onChange(key)}
                            className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors ${field.value === key ? `${cfg.bg} ${cfg.color} border-current` : "border-gray-200 text-gray-500"}`}
                            data-testid={`button-type-${key}`}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">お名前 <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="山田 太郎" className="border-gray-200 text-sm" data-testid="input-name" /></FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">会社名・屋号</FormLabel>
                      <FormControl><Input {...field} placeholder="株式会社〇〇" className="border-gray-200 text-sm" data-testid="input-company" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">メールアドレス <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="info@example.com" className="border-gray-200 text-sm" data-testid="input-email" /></FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">電話番号</FormLabel>
                      <FormControl><Input {...field} type="tel" placeholder="03-XXXX-XXXX" className="border-gray-200 text-sm" data-testid="input-phone" /></FormControl>
                    </FormItem>
                  )} />
                </div>

                {watchType === "shipper" && (
                  <div className="grid md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="prefecture" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600">発送元都道府県</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="border-gray-200 text-sm" data-testid="select-prefecture"><SelectValue placeholder="都道府県を選択" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {["東京都", "神奈川県", "千葉県", "埼玉県", "茨城県", "栃木県", "群馬県", "その他"].map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="cargoType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600">主な貨物種類</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="border-gray-200 text-sm" data-testid="select-cargo-type"><SelectValue placeholder="貨物種類を選択" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {["一般貨物", "精密機器・電子部品", "食品・冷凍食品", "建設資材・重量物", "危険物（要確認）", "その他"].map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                )}

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-600">お問い合わせ内容 <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} placeholder="ご依頼内容・ご質問などをご記入ください" className="border-gray-200 text-sm resize-none" data-testid="textarea-message" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="privacyAgreed" render={({ field }) => (
                  <FormItem className="flex items-start gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" data-testid="checkbox-privacy" />
                    </FormControl>
                    <div className="text-sm text-gray-600">
                      <a href="/privacy" target="_blank" className="text-[#1a4b99] hover:underline">プライバシーポリシー</a>に同意する <span className="text-red-500">*</span>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-[#c0392b] hover:bg-[#a93226] disabled:opacity-50 text-white font-medium py-3 rounded-full transition-colors text-sm"
                  data-testid="button-submit"
                >
                  {mutation.isPending ? "送信中..." : "送信する"}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
