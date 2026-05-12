import { useEffect } from "react";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { CheckCircle, ChevronRight, Mail } from "lucide-react";

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

export default function Recruit() {
  useEffect(() => {
    trackPageView("/recruit");
    document.title = "採用情報｜株式会社池ノ谷商事";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative pt-16 min-h-[60vh] flex items-stretch">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1a4b99] to-[#1d4ed8] relative min-h-72">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 16px)" }} />
          <div className="absolute bottom-4 left-4 grid grid-cols-2 gap-2">
            <div className="w-32 h-20 bg-white/10 rounded" />
            <div className="w-32 h-20 bg-white/10 rounded" />
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-white flex items-center p-8 md:p-16">
          <div>
            <div className="mb-4">
              <span className="text-[#1d4ed8] font-black text-4xl italic font-serif">Recruit</span>
              <p className="text-gray-400 text-sm mt-1">採用情報</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a4b99] mb-6 leading-snug">
              支える仕事には、<br />
              静かな誇りと、<br />
              世界を動かす力がある。
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              池ノ谷商事が担うのは、製品輸送や構内作業といった、一見すると目立たないけれど、現場に欠かせない仕事です。誠実に、まっすぐに。現場を支える一員として、一緒に働いてみませんか。
            </p>
            <Link href="/contact?type=recruit">
              <button
                className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm"
                onClick={() => trackEvent("cta_contact_click", { location: "recruit_hero" })}
                data-testid="button-recruit-hero-apply"
              >
                View More.
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee band */}
      <div className="bg-gradient-to-r from-[#1a4b99] to-[#1d4ed8] py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-3xl font-black italic text-white/20 mr-16 tracking-tight flex-shrink-0">
              Driven by Trust. Everyday work. &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Positions */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">Positions</span>
            <p className="text-gray-400 text-sm mt-1">募集職種</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {positions.map((p) => (
              <div key={p.title} className="border border-gray-200 rounded-lg p-6 hover:border-[#1d4ed8] transition-colors hover-elevate bg-white">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight flex-1">{p.title}</h3>
                  <span className="ml-2 text-xs bg-[#1a4b99] text-white px-2 py-0.5 rounded flex-shrink-0">{p.badge}</span>
                </div>
                <div className="text-[#1d4ed8] font-bold text-sm mb-3">{p.salary}</div>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.features.map((f) => (
                    <span key={f} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
                <Link href="/contact?type=recruit">
                  <button className="flex items-center gap-1 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white text-xs px-4 py-2 rounded-full" data-testid={`button-apply-${p.title}`}>
                    <Mail className="w-3 h-3" /> 応募する
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">Benefits</span>
            <p className="text-gray-400 text-sm mt-1">待遇・福利厚生</p>
          </div>
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
            ].map((b) => (
              <div key={b} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                <CheckCircle className="w-4 h-4 text-[#1d4ed8] flex-shrink-0 mt-0.5" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day in life */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">A Day in the Life</span>
            <p className="text-gray-400 text-sm mt-1">1日の仕事の流れ</p>
          </div>
          <div className="space-y-4">
            {timeline.map((t, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-[#1d4ed8] font-bold text-sm w-14 flex-shrink-0">{t.time}</div>
                <div className="w-2 h-2 rounded-full bg-[#1d4ed8] flex-shrink-0" />
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 flex-1">
                  <span className="text-gray-800 text-sm font-medium">{t.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">FAQ</span>
            <p className="text-gray-400 text-sm mt-1">採用に関するよくある質問</p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-gray-200 rounded-lg px-5" data-testid={`faq-recruit-${i}`}>
                <AccordionTrigger className="text-gray-800 font-semibold text-sm text-left py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBanner title="一緒に働きましょう" subtitle="ご応募・ご質問はお気軽にどうぞ。" quoteLabel="お問い合わせはこちら" quoteType="recruit" />
      <Footer />
    </div>
  );
}
