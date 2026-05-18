import { useEffect } from "react";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { CheckCircle, Mail } from "lucide-react";
import truckHeroImg from "@assets/recruit_hero.png";
import recruitImg1 from "@assets/recruit_slide_01.png";
import recruitImg2 from "@assets/recruit_slide_02.png";
import recruitImg3 from "@assets/recruit_slide_03.png";
import recruitImg4 from "@assets/recruit_slide_04.png";
import recruitImg5 from "@assets/recruit_slide_05.png";
import recruitImg6 from "@assets/recruit_slide_06.png";

const positions = [
  { title: "トラックドライバー（正社員）", salary: "月給 25万〜35万円", features: ["社会保険完備", "賞与年2回", "退職金制度"], desc: "定期輸送・スポット輸送を担当。大型免許取得支援制度あり。", badge: "正社員" },
  { title: "トラックドライバー（アルバイト）", salary: "時給 1,300円〜1,800円", features: ["週2日〜OK", "シフト制", "深夜手当あり"], desc: "副業・WワークOK。扶養内勤務も相談可能。", badge: "アルバイト" },
  { title: "配車担当スタッフ", salary: "月給 22万〜30万円", features: ["内勤メイン", "土日休み相談可", "未経験歓迎"], desc: "配車手配、ドライバーとの調整業務。物流の心臓部を担う重要ポジション。", badge: "正社員" },
  { title: "営業担当スタッフ", salary: "月給 25万〜40万円（インセンティブあり）", features: ["インセンティブ制度", "社用車支給", "実績次第で昇給"], desc: "新規荷主の開拓・既存顧客のフォローを担当。やる気があれば大歓迎。", badge: "正社員" },
];

const timeline = [
  { time: "06:00", title: "出社・点呼・車両点検" },
  { time: "07:00", title: "積み込み作業" },
  { time: "08:00", title: "配送ルート出発" },
  { time: "12:00", title: "昼食休憩（1時間）" },
  { time: "15:00", title: "配送完了・帰社" },
  { time: "16:00", title: "車両清掃・翌日準備・退勤" },
];

const faqs = [
  { q: "未経験でも応募できますか？", a: "はい、大歓迎です！入社後2週間の座学研修と、ベテランドライバーによるOJT（最低1ヶ月）があります。免許さえあれば安心してスタートできます。" },
  { q: "大型・中型免許がないと応募できませんか？", a: "普通免許（AT限定可）があればご応募いただけます。入社後、会社の費用補助で大型免許や各種資格を取得できます。" },
  { q: "残業はどのくらいありますか？", a: "月平均20時間程度です。会社全体として働き方改革に取り組んでおり、過度な残業は発生しない体制を整えています。" },
  { q: "転職・中途採用も歓迎していますか？", a: "もちろんです。他業種からの転職者も多く活躍しています。これまでの経験を活かしながら成長できます。" },
];

const recruitImgs = [recruitImg1, recruitImg2, recruitImg3, recruitImg4, recruitImg5, recruitImg6];

export default function Recruit() {
  useEffect(() => {
    trackPageView("/recruit");
    setSeo({
      title: "採用情報｜トラックドライバー・物流スタッフ募集",
      description: "株式会社池ノ谷商事ではトラックドライバーをはじめとする物流スタッフを積極採用中。神奈川・関東エリア、未経験歓迎、充実した研修制度・待遇で働きやすい環境を整えています。",
      path: "/recruit",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden" style={{ minHeight: "420px" }}>
        <img src={truckHeroImg} alt="採用情報" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#0f2044]/75" />
        <div className="absolute inset-0 flex items-end pb-10 sm:pb-16 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto w-full">
            <AnimateIn>
              <p className="text-[#7eb3ff] text-xs tracking-[0.5em] uppercase mb-3">JOIN OUR TEAM</p>
              <h1 className="text-3xl sm:text-5xl font-extralight text-white tracking-[0.15em] mb-4">採用情報</h1>
              <div className="w-12 h-0.5 bg-[#1d4ed8]" />
              <p className="text-gray-300 text-sm mt-4 tracking-wide">支える仕事には、静かな誇りと、世界を動かす力がある。</p>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Photo slider */}
      <section className="bg-white py-12 overflow-hidden">
        <div className="relative">
          <div className="flex gap-3 animate-recruit-slide" style={{ width: "max-content" }}>
            {[...recruitImgs, ...recruitImgs].map((img, i) => (
              <div key={i} className="w-44 h-64 flex-shrink-0 overflow-hidden">
                <img src={img} alt={`スタッフ写真 ${(i % 6) + 1}`} className="w-full h-full object-cover object-top" />
              </div>
            ))}
          </div>
        </div>
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

      {/* Message */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">WHY JOIN US</p>
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">ともに、働く。</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <p className="text-gray-500 text-sm leading-relaxed text-center max-w-2xl mx-auto">
              池ノ谷商事が担うのは、製品輸送や構内作業といった、一見すると目立たないけれど、現場に欠かせない仕事です。誠実に、まっすぐに。現場を支える一員として、一緒に働いてみませんか。
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Positions */}
      <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">POSITIONS</p>
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">募集職種</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-2 gap-6">
            {positions.map((p, i) => (
              <AnimateIn key={p.title} delay={i * 80}>
                <div className="bg-white border border-gray-100 p-8 hover:border-[#1d4ed8] transition-colors" data-testid={`card-position-${i}`}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">{p.title}</h3>
                    <span className="ml-3 text-xs bg-[#0f2044] text-white px-2 py-0.5 flex-shrink-0">{p.badge}</span>
                  </div>
                  <div className="text-[#1d4ed8] font-bold text-sm mb-3">{p.salary}</div>
                  <p className="text-gray-400 text-xs mb-5 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {p.features.map((f) => (
                      <span key={f} className="border border-gray-200 text-gray-500 text-xs px-2 py-0.5">{f}</span>
                    ))}
                  </div>
                  <Link href="/contact?type=recruit">
                    <button
                      className="flex items-center gap-2 border border-[#1d4ed8] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white text-xs px-5 py-2 transition-colors"
                      onClick={() => trackEvent("cta_contact_click", { location: "recruit_position" })}
                      data-testid={`button-apply-${i}`}
                    >
                      <Mail className="w-3 h-3" /> 応募する
                    </button>
                  </Link>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">BENEFITS</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">待遇・福利厚生</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "社会保険完備（健康・厚生年金・雇用・労災）",
              "昇給年1回（4月）",
              "賞与年2回（6月・12月）",
              "退職金制度あり",
              "有給休暇（入社6ヶ月後から付与）",
              "年間休日105日以上",
              "制服・作業着支給",
              "車両完備（個人持ち込み不要）",
              "健康診断年1回",
              "大型免許取得費用補助",
              "各種資格取得支援制度",
              "社員旅行・懇親会あり",
            ].map((b, i) => (
              <AnimateIn key={b} delay={i * 40}>
                <div className="flex items-start gap-3 p-4 border border-gray-100 bg-gray-50/50">
                  <CheckCircle className="w-4 h-4 text-[#1d4ed8] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{b}</span>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">A DAY IN THE LIFE</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">1日の仕事の流れ</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="space-y-4">
            {timeline.map((t, i) => (
              <AnimateIn key={i} delay={i * 60}>
                <div className="flex items-center gap-6">
                  <div className="text-[#1d4ed8] font-bold text-sm w-14 flex-shrink-0 tracking-wider">{t.time}</div>
                  <div className="w-2 h-2 bg-[#1d4ed8] flex-shrink-0" />
                  <div className="bg-white border border-gray-100 px-5 py-3 flex-1">
                    <span className="text-gray-800 text-sm">{t.title}</span>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">FAQ</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">よくある質問</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-gray-50 border border-gray-100 px-5" data-testid={`faq-recruit-${i}`}>
                <AccordionTrigger className="text-gray-800 font-medium text-sm text-left py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f2044] text-center px-8">
        <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">APPLY NOW</p>
        <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-4">一緒に働きましょう</h2>
        <p className="text-gray-400 text-sm mb-10">ご応募・ご質問はお気軽にどうぞ。</p>
        <Link href="/contact?type=recruit">
          <button
            className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-10 py-4 text-sm tracking-widest transition-colors"
            onClick={() => trackEvent("cta_contact_click", { location: "recruit_cta" })}
            data-testid="button-recruit-cta"
          >
            お問い合わせはこちら
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
