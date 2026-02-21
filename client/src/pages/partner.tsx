import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { CheckCircle, ChevronRight, Truck, Calendar, DollarSign, Shield, MessageSquare, FileText, Handshake } from "lucide-react";

const benefits = [
  { icon: Calendar, title: "安定した継続案件", desc: "スポットだけでなく、定期案件も多数。車両の稼働率アップを支援します。" },
  { icon: DollarSign, title: "透明な支払い条件", desc: "月末締め翌月末払いが基本。支払い遅延ゼロを徹底しています。" },
  { icon: Shield, title: "長期的な信頼関係", desc: "一時的な取引ではなく、長期パートナーとしての関係構築を重視します。" },
  { icon: MessageSquare, title: "丁寧なサポート体制", desc: "専任担当者が対応。困ったことがあればいつでも相談できる体制です。" },
];

const requirements = [
  "一般貨物自動車運送事業許可または軽貨物配送業（黒ナンバー）の登録があること",
  "安全管理体制が整っていること（運行記録、点検整備など）",
  "ドライブレコーダーが搭載されていること（推奨）",
  "携帯電話での連絡が取れること（スマートフォン推奨）",
  "配送完了後の報告・連絡ができること",
  "損害賠償保険への加入（任意保険・貨物保険）",
];

const steps = [
  { step: "01", title: "フォームから登録申請", desc: "下記の申請フォームに必要事項を入力して送信するだけ。5分で完了します。" },
  { step: "02", title: "担当者からご連絡", desc: "1〜2営業日以内に担当者からお電話またはメールでご連絡します。" },
  { step: "03", title: "面談・書類確認", desc: "オンラインまたは対面で簡単な面談と必要書類の確認を行います。" },
  { step: "04", title: "契約締結・案件スタート", desc: "契約完了後、すぐに案件をご紹介します。最短1週間でスタート可能です。" },
];

const vehicleTypes = [
  { type: "軽バン・軽トラック", demand: "需要高" },
  { type: "2tトラック（平・箱）", demand: "需要高" },
  { type: "4tトラック（平・箱）", demand: "需要中" },
  { type: "10tトラック（大型）", demand: "需要中" },
  { type: "冷凍・冷蔵車", demand: "需要高" },
  { type: "ウイング車", demand: "需要中" },
  { type: "重機運搬（低床）", demand: "要相談" },
  { type: "その他特殊車両", demand: "要相談" },
];

export default function Partner() {
  useEffect(() => {
    trackPageView("/partner");
    document.title = "協力会社募集｜アクロス物流株式会社 - パートナー登録";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-16 bg-[#0f2044] min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2044] via-[#1a3a7a] to-[#0d1b3e]" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center w-full">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4 text-sm">協力会社募集</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            一緒に成長する<br /><span className="text-amber-400">物流パートナーを募集</span>
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            アクロス物流では、共に発展していける協力会社様を募集しています。
            安定した案件と透明な条件で、長期的なパートナーシップを築きましょう。
          </p>
          <Link href="/contact?type=partner">
            <Button
              size="lg"
              className="bg-amber-500 text-white font-black border-amber-400 text-lg px-10"
              onClick={() => trackEvent("cta_contact_click", { location: "partner_hero", type: "partner" })}
              data-testid="button-partner-hero-register"
            >
              パートナー登録を申し込む
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">BENEFITS</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">アクロス物流と組む4つのメリット</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white border border-card-border rounded-lg p-6 flex gap-4 hover-elevate">
                <div className="bg-[#0f2044] w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f2044] mb-2">{b.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle types */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-amber-500 font-semibold text-sm tracking-widest">WANTED VEHICLES</span>
              <h2 className="text-3xl font-black text-[#0f2044] mt-2 mb-6">募集している車両タイプ</h2>
              <div className="space-y-3">
                {vehicleTypes.map((v) => (
                  <div key={v.type} className="flex items-center justify-between bg-white border border-card-border rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-[#0f2044] font-medium">{v.type}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${v.demand === "需要高" ? "bg-green-100 text-green-700" : v.demand === "需要中" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                      {v.demand}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-amber-500 font-semibold text-sm tracking-widest">REQUIREMENTS</span>
              <h2 className="text-3xl font-black text-[#0f2044] mt-2 mb-6">登録条件</h2>
              <p className="text-muted-foreground text-sm mb-4">以下の条件を満たす事業者様からのご登録をお待ちしています。</p>
              <div className="space-y-3">
                {requirements.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#0f2044]">{r}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>個人事業主の方も歓迎。</strong> 軽貨物（黒ナンバー）での登録も可能です。まずはお気軽にご相談ください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">HOW TO JOIN</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">登録の流れ</h2>
            <p className="text-muted-foreground mt-2">最短1週間で案件スタートが可能です</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.step} className="text-center">
                <div className="relative">
                  <div className="bg-[#0f2044] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-amber-400 font-black text-lg">{s.step}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-7 left-full w-full h-px bg-blue-200 -ml-2" />
                  )}
                </div>
                <h3 className="font-bold text-[#0f2044] text-sm mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment terms */}
      <section className="py-16 bg-gradient-to-r from-[#0f2044] to-[#1a3a7a] px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { label: "支払いサイト", value: "月末締め翌月末払い", icon: Calendar },
              { label: "手数料", value: "なし（0%）", icon: DollarSign },
              { label: "契約期間", value: "最短3ヶ月から", icon: FileText },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-lg p-6 border border-white/20">
                <item.icon className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <div className="text-blue-300 text-sm mb-1">{item.label}</div>
                <div className="text-white font-bold text-lg">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="パートナー登録のご相談はこちら"
        subtitle="登録後すぐに案件紹介が可能です。まずはお気軽にご連絡ください。"
        quoteLabel="パートナー登録を申し込む"
        contactLabel="詳細を問い合わせる"
        quoteType="partner"
      />
      <Footer />
    </div>
  );
}
