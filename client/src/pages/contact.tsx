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
import { AnimateIn } from "@/components/animate-in";
import { Footer } from "@/components/footer";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import heroImg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.webp";

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
  recruit: { label: "採用のお問い合わせ", color: "text-[#1d4ed8]", bg: "bg-blue-50 border-blue-300" },
  partner: { label: "協力会社のご登録", color: "text-[#1e3a8a]", bg: "bg-blue-100 border-blue-300" },
};

export default function Contact() {
  const search = useSearch();
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const params = new URLSearchParams(search);
  const defaultType = (params.get("type") || "shipper") as "shipper" | "recruit" | "partner";

  useEffect(() => {
    trackPageView("/contact");
    setSeo({
      title: "お問い合わせ｜荷主・採用・協力会社",
      description: "株式会社池ノ谷商事へのお問い合わせはこちら。荷主様の輸送ご相談、採用のお問い合わせ、協力会社のご登録を承ります。2営業日以内にご返答いたします。",
      path: "/contact",
    });
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
      const { privacyAgreed: _, ...contactData } = data;
      return apiRequest("POST", "/api/contacts", contactData);
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
        <div className="flex-1 flex items-center justify-center px-4 mt-[100px]">
          <div className="text-center max-w-md py-20">
            <div className="w-16 h-16 bg-[#0f2044] flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">THANK YOU</p>
            <h2 className="text-3xl font-light text-gray-900 tracking-[0.15em] mb-6">送信完了しました</h2>
            <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-6" />
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              お問い合わせありがとうございます。担当者より2営業日以内にご連絡いたします。
            </p>
            <a href="/" className="border border-gray-300 text-gray-700 hover:border-[#1d4ed8] hover:text-[#1d4ed8] text-sm px-8 py-3 transition-colors inline-block">ホームに戻る</a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden">
        <img src={heroImg} alt="お問い合わせ" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] mb-6">Ikenoyashoji Co.,Ltd.</p>
            <h1 className="hero-title text-2xl sm:text-4xl md:text-6xl font-extralight text-white tracking-[0.08em] sm:tracking-[0.15em] mb-6">お問い合わせ</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto" />
          </AnimateIn>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-white px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Contact info */}
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            <a href="tel:0462122766" className="border border-gray-100 p-6 hover:border-[#1d4ed8] transition-colors flex items-center gap-4" data-testid="link-contact-tel">
              <div className="w-10 h-10 bg-[#0f2044] flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-400 tracking-widest mb-1">TEL</div>
                <div className="text-gray-900 font-semibold text-sm">046-212-2766</div>
                <div className="text-xs text-gray-400">平日 9:00〜21:00</div>
              </div>
            </a>
            <a href="mailto:info@ikenoyashoji.co.jp" className="border border-gray-100 p-6 hover:border-[#1d4ed8] transition-colors flex items-center gap-4" data-testid="link-contact-email">
              <div className="w-10 h-10 bg-[#0f2044] flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-400 tracking-widest mb-1">EMAIL</div>
                <div className="text-gray-700 text-xs">info@ikenoyashoji.co.jp</div>
                <div className="text-xs text-gray-400">24時間受付</div>
              </div>
            </a>
            <div className="border border-gray-100 p-6 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0f2044] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-400 tracking-widest mb-1">ADDRESS</div>
                <div className="text-gray-700 text-xs leading-relaxed">〒243-0303<br />神奈川県愛甲郡愛川町中津7287</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="border border-gray-100 p-5 sm:p-8 md:p-12">
            <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-2">CONTACT FORM</p>
            <h2 className="text-2xl font-light text-gray-900 tracking-[0.15em] mb-2">お問い合わせフォーム</h2>
            <div className="w-8 h-0.5 bg-[#1d4ed8] mb-8" />

            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-500 tracking-widest uppercase">お問い合わせ種別</FormLabel>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                        {(Object.entries(typeConfig) as [string, (typeof typeConfig)[keyof typeof typeConfig]][]).map(([key, cfg]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => field.onChange(key)}
                            className={`px-3 py-2.5 border text-xs font-medium transition-colors ${field.value === key ? "bg-[#0f2044] text-white border-[#0f2044]" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}
                            data-testid={`button-type-${key}`}
                          >
                            {cfg.label}
                          </button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-500 tracking-widest uppercase">お名前 <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input {...field} placeholder="池ノ谷 太郎" className="border-gray-200 text-sm rounded-none mt-1" data-testid="input-name" /></FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-500 tracking-widest uppercase">会社名・屋号</FormLabel>
                      <FormControl><Input {...field} placeholder="株式会社〇〇" className="border-gray-200 text-sm rounded-none mt-1" data-testid="input-company" /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-500 tracking-widest uppercase">メールアドレス <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input {...field} type="email" placeholder="info@example.com" className="border-gray-200 text-sm rounded-none mt-1" data-testid="input-email" /></FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-gray-500 tracking-widest uppercase">電話番号</FormLabel>
                      <FormControl><Input {...field} type="tel" placeholder="046-XXX-XXXX" className="border-gray-200 text-sm rounded-none mt-1" data-testid="input-phone" /></FormControl>
                    </FormItem>
                  )} />
                </div>

                {watchType === "shipper" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="prefecture" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-500 tracking-widest uppercase">発送元都道府県</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="border-gray-200 text-sm rounded-none mt-1" data-testid="select-prefecture"><SelectValue placeholder="都道府県を選択" /></SelectTrigger></FormControl>
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
                        <FormLabel className="text-xs text-gray-500 tracking-widest uppercase">主な貨物種類</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="border-gray-200 text-sm rounded-none mt-1" data-testid="select-cargo-type"><SelectValue placeholder="貨物種類を選択" /></SelectTrigger></FormControl>
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
                    <FormLabel className="text-xs text-gray-500 tracking-widest uppercase">お問い合わせ内容 <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={5} placeholder="ご依頼内容・ご質問などをご記入ください" className="border-gray-200 text-sm resize-none rounded-none mt-1" data-testid="textarea-message" />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="privacyAgreed" render={({ field }) => (
                  <FormItem className="flex items-start gap-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5 rounded-none" data-testid="checkbox-privacy" />
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
                  className="w-full bg-[#0f2044] hover:bg-[#1a4b99] disabled:opacity-50 text-white font-light py-4 transition-colors text-sm tracking-widest"
                  onClick={() => trackEvent("contact_form_attempt", { type: watchType })}
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
