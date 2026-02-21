import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Package, Users, Truck } from "lucide-react";

const contactTypes = [
  { value: "shipper", label: "荷主・輸送依頼", icon: Package, desc: "輸送の見積もり・依頼をご希望の方" },
  { value: "recruit", label: "採用・入社希望", icon: Users, desc: "ドライバー・スタッフとして働きたい方" },
  { value: "partner", label: "協力会社登録", icon: Truck, desc: "協力会社・パートナーとして登録したい方" },
];

const baseSchema = z.object({
  type: z.string(),
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1, "メッセージを入力してください"),
  cargoType: z.string().optional(),
  route: z.string().optional(),
  frequency: z.string().optional(),
  position: z.string().optional(),
  experience: z.string().optional(),
  vehicleType: z.string().optional(),
  vehicleCount: z.string().optional(),
});

export default function Contact() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultType = params.get("type") || "shipper";
  const [contactType, setContactType] = useState(defaultType);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    trackPageView("/contact");
    document.title = "お問い合わせ｜アクロス物流株式会社";
  }, []);

  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      type: contactType,
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      cargoType: "",
      route: "",
      frequency: "",
      position: "",
      experience: "",
      vehicleType: "",
      vehicleCount: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/contacts", data),
    onSuccess: () => {
      const eventName = contactType === "shipper" ? "form_submit_shipper" : contactType === "recruit" ? "form_submit_recruit" : "form_submit_partner";
      trackEvent(eventName, { type: contactType });
      setSubmitted(true);
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({ ...data, type: contactType });
  };

  const changeType = (type: string) => {
    setContactType(type);
    form.setValue("type", type);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-black text-[#0f2044] mb-3">お問い合わせを受け付けました</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              ご連絡いただきありがとうございます。<br />
              担当者より1〜2営業日以内にご連絡いたします。<br />
              緊急の場合はお電話（03-1234-5678）にてお問い合わせください。
            </p>
            <a href="/" className="text-blue-600 hover:underline text-sm">トップページへ戻る</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-16 bg-[#0f2044]">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <span className="text-amber-400 font-semibold text-sm tracking-widest">CONTACT</span>
          <h1 className="text-3xl md:text-4xl font-black text-white mt-2">お問い合わせ</h1>
          <p className="text-blue-200 mt-3 text-sm">お気軽にご連絡ください。通常30分〜1営業日以内にご返答いたします。</p>
        </div>
      </section>

      <section className="py-12 bg-slate-50 px-4 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#0f2044] mb-3">お問い合わせの種類を選択してください</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {contactTypes.map((ct) => (
                <button
                  key={ct.value}
                  onClick={() => changeType(ct.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${contactType === ct.value ? "border-[#0f2044] bg-[#0f2044] text-white" : "border-card-border bg-white hover:border-blue-300"}`}
                  data-testid={`button-contact-type-${ct.value}`}
                >
                  <ct.icon className={`w-5 h-5 mb-2 ${contactType === ct.value ? "text-amber-400" : "text-[#0f2044]"}`} />
                  <div className={`font-bold text-sm mb-0.5 ${contactType === ct.value ? "text-white" : "text-[#0f2044]"}`}>{ct.label}</div>
                  <div className={`text-xs ${contactType === ct.value ? "text-blue-200" : "text-muted-foreground"}`}>{ct.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-card-border p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-[#0f2044]">お名前 <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input placeholder="山田 太郎" {...field} data-testid="input-name" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="company" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-[#0f2044]">会社名・屋号</FormLabel>
                      <FormControl><Input placeholder="株式会社〇〇" {...field} data-testid="input-company" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-[#0f2044]">メールアドレス <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input type="email" placeholder="info@example.com" {...field} data-testid="input-email" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-[#0f2044]">電話番号</FormLabel>
                      <FormControl><Input type="tel" placeholder="03-1234-5678" {...field} data-testid="input-phone" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {contactType === "shipper" && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="cargoType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-[#0f2044]">荷物の種類</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger data-testid="select-cargo-type"><SelectValue placeholder="選択してください" /></SelectTrigger>
                              <SelectContent>
                                {["一般貨物", "食品・飲料", "精密機器", "建設資材", "危険物", "冷凍冷蔵品", "その他"].map((v) => (
                                  <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="frequency" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-[#0f2044]">輸送頻度</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger data-testid="select-frequency"><SelectValue placeholder="選択してください" /></SelectTrigger>
                              <SelectContent>
                                {["スポット（単発）", "週1〜2回", "週3〜4回", "毎日", "月数回", "未定"].map((v) => (
                                  <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="route" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0f2044]">輸送ルート（例：東京〜大阪）</FormLabel>
                        <FormControl><Input placeholder="例：東京都江東区→埼玉県さいたま市" {...field} data-testid="input-route" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </>
                )}

                {contactType === "recruit" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="position" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0f2044]">希望職種</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger data-testid="select-position"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                              {["トラックドライバー（正社員）", "トラックドライバー（アルバイト）", "配車担当スタッフ", "営業担当スタッフ", "その他・相談したい"].map((v) => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="experience" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0f2044]">運転経験</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger data-testid="select-experience"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                              {["未経験", "1年未満", "1〜3年", "3〜5年", "5〜10年", "10年以上"].map((v) => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}

                {contactType === "partner" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="vehicleType" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0f2044]">保有車両の種類</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger data-testid="select-vehicle-type"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                              {["軽バン・軽トラック", "2tトラック", "4tトラック", "10tトラック（大型）", "冷凍・冷蔵車", "その他"].map((v) => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="vehicleCount" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-[#0f2044]">保有台数</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger data-testid="select-vehicle-count"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                              {["1台（個人）", "2〜5台", "6〜10台", "11〜20台", "21台以上"].map((v) => (
                                <SelectItem key={v} value={v}>{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                )}

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-[#0f2044]">
                      {contactType === "shipper" ? "ご要望・ご質問" : contactType === "recruit" ? "自己PR・ご質問" : "ご質問・メッセージ"}
                      <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          contactType === "shipper"
                            ? "輸送の詳細、スケジュール、特記事項などをお知らせください"
                            : contactType === "recruit"
                            ? "志望動機や保有資格などをご記入ください"
                            : "保有車両の詳細、稼働エリア、希望条件などをお知らせください"
                        }
                        rows={5}
                        {...field}
                        data-testid="textarea-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="text-xs text-muted-foreground">
                  送信することで<a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>に同意したものとみなされます。
                </div>

                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-amber-500 text-white font-black border-amber-400 text-base py-3"
                  data-testid="button-contact-submit"
                >
                  {mutation.isPending ? "送信中..." : "送信する"}
                </Button>

                {mutation.isError && (
                  <p className="text-red-500 text-sm text-center">送信に失敗しました。お電話でお問い合わせください。</p>
                )}
              </form>
            </Form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
