import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { CheckCircle, Clock, Award, Users, Truck, Heart, ChevronRight, Star } from "lucide-react";

const positions = [
  {
    title: "トラックドライバー（正社員）",
    salary: "月給 25万〜35万円",
    features: ["社会保険完備", "賞与年2回", "退職金制度"],
    desc: "定期輸送・スポット輸送を担当。経験・資格に応じて昇給あり。大型免許取得支援制度あり。",
    badge: "正社員",
    badgeColor: "bg-blue-600",
  },
  {
    title: "トラックドライバー（アルバイト）",
    salary: "時給 1,300円〜1,800円",
    features: ["週2日〜OK", "シフト制", "深夜手当あり"],
    desc: "副業・WワークOK。自分のペースで働ける環境です。扶養内での勤務も相談可能。",
    badge: "アルバイト",
    badgeColor: "bg-green-600",
  },
  {
    title: "配車担当スタッフ",
    salary: "月給 22万〜30万円",
    features: ["内勤メイン", "土日休み相談可", "未経験歓迎"],
    desc: "電話・システムでの配車手配、ドライバーとの調整業務。物流業界の心臓部を担う重要ポジション。",
    badge: "正社員",
    badgeColor: "bg-blue-600",
  },
  {
    title: "営業担当スタッフ",
    salary: "月給 25万〜40万円（インセンティブあり）",
    features: ["インセンティブ制度", "社用車支給", "実績次第で昇給"],
    desc: "新規荷主の開拓・既存顧客のフォローを担当。物流の知識がなくても、やる気があれば大歓迎。",
    badge: "正社員",
    badgeColor: "bg-blue-600",
  },
];

const reasons = [
  { icon: Heart, title: "誇りを持って働ける職場", desc: "物流は社会インフラ。あなたの仕事が日本の物流を支えています。毎日達成感を感じながら働ける環境です。" },
  { icon: Award, title: "充実した待遇・キャリアアップ", desc: "大型免許などの資格取得支援、昇給・賞与制度完備。あなたの成長を全力でサポートします。" },
  { icon: Users, title: "仲間を大切にする社風", desc: "困ったときはお互い様。先輩ドライバーが丁寧にフォローする、温かい職場環境が自慢です。" },
];

const timeline = [
  { time: "06:00", title: "出社・点呼・車両点検", desc: "安全確認と体調チェック。プロとして安全運転の準備を整えます。" },
  { time: "07:00", title: "積み込み作業", desc: "荷物の数量・状態を確認しながら丁寧に積み込み。" },
  { time: "08:00", title: "配送ルート出発", desc: "GPSナビとデジタコを活用した安全・効率的な配送。" },
  { time: "12:00", title: "昼食休憩（1時間）", desc: "しっかり休憩を取ることが安全運転の基本です。" },
  { time: "15:00", title: "配送完了・帰社", desc: "余裕を持ったスケジュールで残業は最小限。" },
  { time: "16:00", title: "車両清掃・翌日準備・退勤", desc: "プロとして車両を大切にすることも仕事のうち。" },
];

const faqs = [
  { q: "未経験でも応募できますか？", a: "はい、大歓迎です！入社後2週間の座学研修と、ベテランドライバーによるOJT（最低1ヶ月）があります。免許さえあれば、物流の知識がなくても安心してスタートできます。" },
  { q: "大型・中型免許がないと応募できませんか？", a: "普通免許（AT限定可）があればご応募いただけます。入社後、会社の費用補助で大型免許や各種資格を取得できます。" },
  { q: "残業はどのくらいありますか？", a: "月平均20時間程度です（部門・時期により異なります）。会社全体として働き方改革に取り組んでおり、過度な残業は発生しない体制を整えています。" },
  { q: "転職・中途採用も歓迎していますか？", a: "もちろんです。他業種からの転職者も多く活躍しています。これまでの経験やスキルを活かしながら、物流のプロとして成長できます。" },
  { q: "面接から採用までどのくらいかかりますか？", a: "書類選考（3営業日）→ 面接（1〜2回）→ 内定の流れで、最短1週間での採用も可能です。" },
];

export default function Recruit() {
  useEffect(() => {
    trackPageView("/recruit");
    document.title = "採用情報｜アクロス物流株式会社 - ドライバー・スタッフ募集";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-16 bg-[#0f2044] min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2044] via-[#1a3a7a] to-[#0d1b3e]" />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center w-full">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-4 text-sm">採用情報</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            あなたの力で、<br /><span className="text-amber-400">日本の物流を動かそう。</span>
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            アクロス物流では、誇りを持って働けるドライバー・スタッフを募集しています。
            安全・安定・成長の三拍子揃った職場で、あなたのキャリアを築きませんか？
          </p>
          <Link href="/contact?type=recruit">
            <Button
              size="lg"
              className="bg-amber-500 text-white font-black border-amber-400 text-lg px-10"
              onClick={() => trackEvent("cta_contact_click", { location: "recruit_hero", type: "recruit" })}
              data-testid="button-recruit-hero-apply"
            >
              応募する・話を聞く
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Reasons */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">WHY US</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">アクロス物流で働く理由</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reasons.map((r) => (
              <Card key={r.title} className="border-card-border hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="bg-amber-500 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                    <r.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-[#0f2044] text-lg mb-3">{r.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Positions */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">POSITIONS</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">募集職種</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {positions.map((p) => (
              <Card key={p.title} className="border-card-border hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-[#0f2044] text-base leading-tight">{p.title}</h3>
                    <span className={`${p.badgeColor} text-white text-xs px-2 py-0.5 rounded flex-shrink-0 ml-2`}>{p.badge}</span>
                  </div>
                  <div className="text-amber-600 font-bold text-sm mb-3">{p.salary}</div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.features.map((f) => (
                      <span key={f} className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href="/contact?type=recruit">
                      <Button size="sm" className="bg-amber-500 text-white border-amber-400 font-bold text-xs" data-testid={`button-apply-${p.title}`}>
                        この職種に応募する
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">BENEFITS</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">待遇・福利厚生</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div key={b} className="flex items-start gap-2 text-sm text-[#0f2044]">
                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day in life */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">A DAY IN THE LIFE</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">1日の仕事の流れ</h2>
            <p className="text-muted-foreground mt-2">定期便ドライバーの例（スケジュールは業務により異なります）</p>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-blue-200 md:left-20" />
            <div className="space-y-6">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-14 text-right md:w-18">
                    <span className="text-amber-600 font-bold text-sm">{t.time}</span>
                  </div>
                  <div className="relative flex-shrink-0 mt-1">
                    <div className="w-4 h-4 rounded-full bg-[#0f2044] border-2 border-amber-400 relative z-10" />
                  </div>
                  <div className="bg-white rounded-lg border border-card-border p-4 flex-1 hover-elevate">
                    <div className="font-bold text-[#0f2044] text-sm mb-1">{t.title}</div>
                    <div className="text-muted-foreground text-xs leading-relaxed">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold text-sm tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0f2044] mt-2">採用に関するよくある質問</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-slate-50 border border-card-border rounded-lg px-5" data-testid={`faq-recruit-${i}`}>
                <AccordionTrigger className="text-[#0f2044] font-semibold text-sm text-left py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBanner
        title="一緒に働きましょう"
        subtitle="ご応募・ご質問はお気軽にどうぞ。オンライン面接も対応可能です。"
        quoteLabel="今すぐ応募する"
        contactLabel="詳細を問い合わせる"
        quoteType="recruit"
      />
      <Footer />
    </div>
  );
}
