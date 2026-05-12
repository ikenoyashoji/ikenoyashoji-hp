import { useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { CheckCircle, ChevronRight } from "lucide-react";

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
    document.title = "協力会社募集｜株式会社池ノ谷商事";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-2xl">
            <span className="text-[#1d4ed8] font-black text-4xl italic font-serif">Partner</span>
            <p className="text-gray-400 text-sm mt-1 mb-6">協力会社募集</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-snug">
              一緒に成長する<br />物流パートナーを募集
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
              池ノ谷商事では、共に発展していける協力会社様を募集しています。安定した案件と透明な条件で、長期的なパートナーシップを築きましょう。
            </p>
            <Link href="/contact?type=partner">
              <button
                className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm"
                onClick={() => trackEvent("cta_contact_click", { location: "partner_hero" })}
                data-testid="button-partner-hero-register"
              >
                パートナー登録を申し込む
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wide image */}
      <div className="relative bg-gradient-to-br from-[#1a4b99] to-[#0f2044]" style={{ minHeight: 260 }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex items-end h-full py-8">
          <p className="text-white/30 text-3xl font-black italic">Everyday work. Global impact.</p>
        </div>
      </div>

      {/* Marquee */}
      <div className="bg-gradient-to-r from-[#1a4b99] to-[#1d4ed8] py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-3xl font-black italic text-white/20 mr-16 tracking-tight flex-shrink-0">
              Driven by Trust. Partner Together. &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">Benefits</span>
            <p className="text-gray-400 text-sm mt-1">池ノ谷商事と組む4つのメリット</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div key={b.title} className="border border-gray-200 rounded-lg p-6 hover:border-[#1d4ed8] transition-colors hover-elevate">
                <div className="text-[#1d4ed8] font-black text-2xl mb-3">{String(i + 1).padStart(2, "0")}.</div>
                <h3 className="font-bold text-gray-800 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">Requirements</span>
                <p className="text-gray-400 text-sm mt-1">登録条件</p>
              </div>
              <div className="space-y-3">
                {requirements.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#1d4ed8] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{r}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800"><strong>個人事業主の方も歓迎。</strong> 軽貨物（黒ナンバー）での登録も可能です。</p>
              </div>
            </div>
            <div>
              <div className="mb-8">
                <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">Payment</span>
                <p className="text-gray-400 text-sm mt-1">支払い条件</p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "支払いサイト", value: "月末締め翌月末払い" },
                  { label: "手数料", value: "なし（0%）" },
                  { label: "最低契約期間", value: "最短3ヶ月から" },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-gray-800 font-bold text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">How to Join</span>
            <p className="text-gray-400 text-sm mt-1">登録の流れ</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#1a4b99] text-white font-black text-lg flex items-center justify-center mx-auto mb-4">{s.step}</div>
                <h3 className="font-bold text-gray-800 text-sm mb-2">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner title="パートナー登録のご相談はこちら" subtitle="登録後すぐに案件紹介が可能です。まずはお気軽にご連絡ください。" quoteLabel="お問い合わせはこちら" quoteType="partner" />
      <Footer />
    </div>
  );
}
