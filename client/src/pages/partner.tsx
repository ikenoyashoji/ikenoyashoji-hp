import { useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { CheckCircle } from "lucide-react";

const benefits = [
  { title: "安定した継続案件", desc: "スポットだけでなく、定期案件も多数。車両の稼働率アップを支援します。" },
  { title: "透明な支払い条件", desc: "月末締め翌月末払いが基本。支払い遅延ゼロを徹底しています。" },
  { title: "長期的な信頼関係", desc: "一時的な取引ではなく、長期パートナーとしての関係構築を重視します。" },
  { title: "丁寧なサポート体制", desc: "専任担当者が対応。困ったことがあればいつでも相談できる体制です。" },
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
  { step: "01", title: "フォームから登録申請", desc: "必要事項を入力して送信。5分で完了します。" },
  { step: "02", title: "担当者からご連絡", desc: "1〜2営業日以内にお電話またはメールでご連絡します。" },
  { step: "03", title: "面談・書類確認", desc: "オンラインまたは対面で簡単な面談と書類確認を行います。" },
  { step: "04", title: "契約締結・案件スタート", desc: "契約完了後、すぐに案件をご紹介。最短1週間でスタート可能です。" },
];

export default function Partner() {
  useEffect(() => {
    trackPageView("/partner");
    setSeo({
      title: "協力会社募集｜傭車・業務委託のご案内",
      description: "株式会社池ノ谷商事では協力会社・傭車パートナーを募集しています。関東圏全域の安定した継続案件をご提供。フリーランスドライバー・運送会社様もお気軽にご相談ください。",
      path: "/partner",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] bg-[#0f2044] overflow-hidden" style={{ minHeight: "420px" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 40px,rgba(255,255,255,0.03) 40px,rgba(255,255,255,0.03) 41px)" }} />
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
          <div className="text-center">
            <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-6">PARTNER PROGRAM</p>
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-light text-white tracking-[0.08em] sm:tracking-[0.2em] mb-6">協力会社募集</h1>
            <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-8" />
            <p className="text-gray-300 text-sm leading-relaxed max-w-xl mx-auto">
              一緒に成長する物流パートナーを募集しています。
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, white, transparent)" }} />
      </section>

      {/* Marquee */}
      <div className="overflow-hidden py-5 bg-white border-b border-gray-100">
        <div className="animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-24 pr-24 whitespace-nowrap">
              {[...Array(8)].map((_, j) => (
                <span key={j} className="text-4xl font-bold italic text-gray-100 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Ikenoya Shoji Co,Ltd.</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Intro */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateIn>
            <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">ABOUT</p>
            <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">パートナーシップ</h2>
            <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-8" />
            <p className="text-gray-500 text-sm leading-relaxed">
              池ノ谷商事では、共に発展していける協力会社様を募集しています。<br />安定した案件と透明な条件で、長期的なパートナーシップを築きましょう。
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">BENEFITS</p>
              <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">4つのメリット</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <AnimateIn key={b.title} delay={i * 80}>
                <div className="bg-white border border-gray-100 p-8 hover:border-[#1d4ed8] transition-colors">
                  <p className="text-[#1d4ed8] text-xs tracking-[0.3em] mb-4">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-semibold text-gray-900 mb-3">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + Payment */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
          <AnimateIn direction="left">
            <div>
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">REQUIREMENTS</p>
              <h2 className="text-3xl font-light text-gray-900 tracking-[0.15em] mb-4">登録条件</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mb-8" />
              <div className="space-y-3">
                {requirements.map((r, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#1d4ed8] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{r}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-l-2 border-[#1d4ed8] pl-4">
                <p className="text-sm text-gray-600"><span className="font-semibold">個人事業主の方も歓迎。</span> 軽貨物（黒ナンバー）での登録も可能です。</p>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn direction="right">
            <div>
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">PAYMENT</p>
              <h2 className="text-3xl font-light text-gray-900 tracking-[0.15em] mb-4">支払い条件</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mb-8" />
              <div className="space-y-4">
                {[
                  { label: "支払いサイト", value: "月末締め翌月末払い" },
                  { label: "手数料", value: "なし（0%）" },
                  { label: "最低契約期間", value: "最短3ヶ月から" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-gray-900 font-semibold text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* How to join */}
      <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">HOW TO JOIN</p>
              <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">登録の流れ</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <AnimateIn key={s.step} delay={i * 80}>
                <div className="text-center">
                  <div className="w-14 h-14 bg-[#0f2044] text-white font-light text-xl flex items-center justify-center mx-auto mb-5 tracking-wider">{s.step}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-20 bg-[#0f2044] text-center px-4 sm:px-8">
        <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-3">REGISTER NOW</p>
        <h2 className="text-xl sm:text-3xl font-light text-white tracking-[0.05em] sm:tracking-[0.2em] mb-3 sm:mb-4">パートナー登録のご相談</h2>
        <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-10">登録後すぐに案件紹介が可能です。まずはお気軽にご連絡ください。</p>
        <Link href="/contact?type=partner">
          <button
            className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-8 py-3 sm:px-10 sm:py-4 text-sm tracking-widest transition-colors"
            onClick={() => trackEvent("cta_contact_click", { location: "partner_cta" })}
            data-testid="button-partner-cta"
          >
            お問い合わせはこちら
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
