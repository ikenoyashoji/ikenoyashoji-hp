import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { CheckCircle, Mail, ArrowRight, Star, TrendingUp, Shield, Clock } from "lucide-react";
import truckHeroImg from "@assets/recruit_hero.png";
import recruitImg1 from "@assets/recruit_slide_01.png";
import recruitImg2 from "@assets/recruit_slide_02.png";
import recruitImg3 from "@assets/recruit_slide_03.png";
import recruitImg4 from "@assets/recruit_slide_04.png";
import recruitImg5 from "@assets/recruit_slide_05.png";
import recruitImg6 from "@assets/recruit_slide_06.png";

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function StatItem({ num, suffix = "", unit, label, delay }: { num: number; suffix?: string; unit: string; label: string; delay: number }) {
  const { count, ref } = useCountUp(num, 1400);
  return (
    <AnimateIn delay={delay}>
      <div ref={ref} className="text-center px-6 py-2">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl md:text-4xl font-extralight text-white tracking-tight tabular-nums">{count}{suffix}</span>
          <span className="text-[#7eb3ff] text-sm">{unit}</span>
        </div>
        <p className="text-[9px] tracking-[0.4em] text-gray-500 mt-1">{label}</p>
      </div>
    </AnimateIn>
  );
}

const positions = [
  {
    title: "トラックドライバー（正社員）",
    salary: "月給 25万〜35万円",
    features: ["社会保険完備", "賞与年2回", "退職金制度", "免許取得支援"],
    desc: "定期輸送・スポット輸送を担当。大型免許取得支援制度あり。未経験からでもベテランのOJTで安心スタート。",
    badge: "正社員",
  },
  {
    title: "トラックドライバー（アルバイト）",
    salary: "時給 1,300円〜1,800円",
    features: ["週2日〜OK", "シフト制", "深夜手当あり", "WワークOK"],
    desc: "副業・WワークOK。扶養内勤務も相談可能。自分のペースで働きたい方に。",
    badge: "アルバイト",
  },
  {
    title: "配車担当スタッフ",
    salary: "月給 22万〜30万円",
    features: ["内勤メイン", "土日休み相談可", "未経験歓迎", "研修制度充実"],
    desc: "配車手配、ドライバーとの調整業務。物流の心臓部を担う重要ポジション。PCスキルがあれば歓迎。",
    badge: "正社員",
  },
  {
    title: "営業担当スタッフ",
    salary: "月給 25万〜40万円（インセンティブあり）",
    features: ["インセンティブ制度", "社用車支給", "実績次第で昇給", "フレックス対応"],
    desc: "新規荷主の開拓・既存顧客のフォローを担当。やる気と行動力があれば業界未経験でも大歓迎。",
    badge: "正社員",
  },
  {
    title: "倉庫スタッフ",
    salary: "時給 1,200円〜1,500円",
    features: ["土日祝休み可", "体を動かす仕事", "チームワーク重視", "日勤のみOK"],
    desc: "愛川・厚木倉庫での入出庫管理、仕分け、梱包作業。体を動かしたい方、チームで働きたい方に最適。",
    badge: "アルバイト",
  },
  {
    title: "整備士・メカニック",
    salary: "月給 25万〜38万円",
    features: ["各種資格手当", "技術向上支援", "安定需要", "社会保険完備"],
    desc: "自社整備工場にて車両の定期整備・車検・板金・塗装を担当。整備士資格保有者優遇、資格取得支援制度あり。",
    badge: "正社員",
  },
];

const timeline = [
  { time: "06:00", title: "出社・点呼・車両点検", note: "安全確認と体調チェックからスタート" },
  { time: "07:00", title: "積み込み作業", note: "配送物の確認・積み付け" },
  { time: "08:00", title: "配送ルート出発", note: "GPS管理で安全・効率的に配送" },
  { time: "12:00", title: "昼食休憩（1時間）", note: "ゆっくり休んでリフレッシュ" },
  { time: "15:00", title: "配送完了・帰社", note: "運行記録の提出" },
  { time: "16:00", title: "車両清掃・翌日準備・退勤", note: "定時退勤を推奨しています" },
];

const voices = [
  {
    name: "田中 K.",
    role: "トラックドライバー / 入社2年目",
    years: "2年",
    comment: "前職は全く違う業界でした。未経験でも入社後の研修が充実していて、先輩ドライバーが丁寧に教えてくれるので、3ヶ月で一人前になれました。給与も以前より上がり、今はとても充実しています。",
    stars: 5,
  },
  {
    name: "佐藤 M.",
    role: "配車担当スタッフ / 入社3年目",
    years: "3年",
    comment: "ドライバーさんたちが安全に仕事できるよう、配車を組む仕事にやりがいを感じています。会社全体が風通しよく、意見を言いやすい雰囲気。残業も少なく、プライベートも大事にできています。",
    stars: 5,
  },
  {
    name: "山田 T.",
    role: "トラックドライバー / 入社1年目",
    years: "1年",
    comment: "大型免許の費用を会社が全額サポートしてくれました。入社前は免許なしで不安でしたが、今では大型トラックを自信を持って運転しています。仲間も良い人ばかりで毎日楽しく働いています。",
    stars: 5,
  },
];

const careerPath = [
  { stage: "入社", period: "〜3ヶ月", title: "研修・OJT期間", desc: "座学研修2週間 + ベテランドライバーによる添乗OJT。安全運転・法規・積み付けを学ぶ。", color: "bg-gray-100 border-gray-200" },
  { stage: "1年目", period: "〜1年", title: "独り立ち", desc: "担当ルートを持ち、定期配送を担当。GPS・デジタコを活用した効率的な運行を身につける。", color: "bg-blue-50 border-blue-200" },
  { stage: "3年目", period: "〜3年", title: "上位資格取得", desc: "大型・中型免許、フォークリフト等の資格取得を会社がサポート。資格手当で収入アップ。", color: "bg-indigo-50 border-indigo-200" },
  { stage: "5年目〜", period: "5年〜", title: "リーダー・管理職", desc: "チームリーダー、配車担当、管理職へのキャリアアップ。経験と実績で評価される環境。", color: "bg-[#0f2044] border-[#0f2044] text-white" },
];

const applicationFlow = [
  { step: "01", title: "エントリー", desc: "お問い合わせフォームまたはお電話でご応募ください。履歴書不要でOK。" },
  { step: "02", title: "書類選考", desc: "ご応募後3営業日以内にご連絡します。書類選考は簡単な内容のみ。" },
  { step: "03", title: "面接（1回）", desc: "担当者との気軽な面談。会社見学も同時に行います。" },
  { step: "04", title: "内定・条件確認", desc: "面接後、最短即日で結果をお伝えします。条件面は丁寧に説明します。" },
  { step: "05", title: "入社・研修開始", desc: "ご都合に合わせて入社日を調整します。研修から無理なくスタート。" },
];

const faqs = [
  { q: "未経験でも応募できますか？", a: "はい、大歓迎です！入社後2週間の座学研修と、ベテランドライバーによるOJT（最低1ヶ月）があります。免許さえあれば安心してスタートできます。" },
  { q: "大型・中型免許がないと応募できませんか？", a: "普通免許（AT限定可）があればご応募いただけます。入社後、会社の費用補助で大型免許や各種資格を取得できます。" },
  { q: "残業はどのくらいありますか？", a: "月平均20時間程度です。会社全体として働き方改革に取り組んでおり、過度な残業は発生しない体制を整えています。" },
  { q: "転職・中途採用も歓迎していますか？", a: "もちろんです。他業種からの転職者も多く活躍しています。これまでの経験を活かしながら成長できます。" },
  { q: "女性でも働けますか？", a: "はい、現在も女性スタッフが活躍しています。配車担当・営業・倉庫スタッフなど内勤・軽作業系のポジションも多数あります。" },
  { q: "副業・WワークはOKですか？", a: "アルバイト・パートの方はWワーク歓迎です。正社員の方は会社にご相談ください。シフトも柔軟に対応します。" },
  { q: "寮・社宅はありますか？", a: "現在は社宅制度はございませんが、神奈川県内陸工業団地近郊に手頃な物件が多くあります。引越し支援も相談可能です。" },
  { q: "選考はどのくらいかかりますか？", a: "最短で応募から内定まで1週間以内を目指しています。面接は原則1回のみです。" },
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
      <section className="relative mt-[100px] overflow-hidden" style={{ minHeight: "500px" }}>
        <img src={truckHeroImg} alt="採用情報" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
          <div className="text-center">
            <AnimateIn>
              <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] uppercase mb-6">JOIN OUR TEAM</p>
              <h1 className="text-5xl sm:text-7xl font-extralight text-white tracking-[0.15em] mb-6">採用情報</h1>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
              <p className="text-gray-300 text-sm tracking-widest">時間も、収入も、人生に彩りを。</p>
            </AnimateIn>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0f2044] py-8 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
          <StatItem num={128} unit="名" label="EMPLOYEES" delay={0} />
          <StatItem num={35} unit="歳" label="AVG. AGE" delay={80} />
          <StatItem num={92} suffix="%" unit="" label="RETENTION RATE" delay={160} />
          <StatItem num={3} unit="年目" label="COMPANY AGE" delay={240} />
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
            <p className="text-gray-500 text-sm leading-relaxed text-center max-w-2xl mx-auto mb-16">
              池ノ谷商事が担うのは、製品輸送や構内作業といった、一見すると目立たないけれど、現場に欠かせない仕事です。誠実に、まっすぐに。現場を支える一員として、一緒に働いてみませんか。
            </p>
          </AnimateIn>
          {/* 4 Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "安定した雇用", desc: "創業から右肩上がりで成長中。物流需要は社会インフラとして安定した需要があります。" },
              { icon: TrendingUp, title: "明確なキャリアパス", desc: "ドライバーから管理職まで。実力と年数に応じた昇給・昇格制度を整備しています。" },
              { icon: Star, title: "充実した研修", desc: "未経験でも安心のOJT制度。免許・資格取得費用も会社が全額サポートします。" },
              { icon: Clock, title: "働き方改革推進", desc: "月平均残業20時間以下。有給取得も推奨。プライベートを大切にできる環境です。" },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <AnimateIn key={p.title} delay={i * 80}>
                  <div className="bg-gray-50 border border-gray-100 p-6 hover:border-[#1d4ed8] transition-colors group">
                    <div className="w-10 h-10 bg-[#0f2044] flex items-center justify-center mb-4 group-hover:bg-[#1d4ed8] transition-colors">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{p.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
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
              <AnimateIn key={p.title} delay={i * 60}>
                <div className="bg-white border border-gray-100 p-8 hover:border-[#1d4ed8] transition-colors group" data-testid={`card-position-${i}`}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1">{p.title}</h3>
                    <span className={`ml-3 text-xs px-2 py-0.5 flex-shrink-0 ${p.badge === "正社員" ? "bg-[#0f2044] text-white" : "bg-gray-100 text-gray-600"}`}>{p.badge}</span>
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
              "育児休業・産前産後休業取得実績あり",
              "引越し支援（相談可能）",
              "食事補助・自動販売機割引",
            ].map((b, i) => (
              <AnimateIn key={b} delay={i * 30}>
                <div className="flex items-start gap-3 p-4 border border-gray-100 bg-gray-50/50 hover:border-[#1d4ed8] transition-colors">
                  <CheckCircle className="w-4 h-4 text-[#1d4ed8] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{b}</span>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Career Path */}
      <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">CAREER PATH</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">キャリアパス</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-4" />
              <p className="text-gray-500 text-sm">未経験からでも、ステップアップできる環境があります。</p>
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-4 gap-0 relative">
            {careerPath.map((c, i) => (
              <AnimateIn key={c.stage} delay={i * 100}>
                <div className="relative">
                  {i < careerPath.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-8 translate-x-1/2 z-10">
                      <ArrowRight className="w-4 h-4 text-[#1d4ed8]" />
                    </div>
                  )}
                  <div className={`border ${c.color} p-6 mx-1 h-full`}>
                    <div className={`text-xs tracking-[0.3em] mb-1 ${c.stage === "5年目〜" ? "text-blue-300" : "text-[#1d4ed8]"}`}>{c.period}</div>
                    <div className={`text-lg font-bold mb-2 ${c.stage === "5年目〜" ? "text-white" : "text-gray-900"}`}>{c.stage}</div>
                    <div className="w-6 h-0.5 bg-[#1d4ed8] mb-3" />
                    <h4 className={`font-semibold text-sm mb-2 ${c.stage === "5年目〜" ? "text-white" : "text-gray-800"}`}>{c.title}</h4>
                    <p className={`text-xs leading-relaxed ${c.stage === "5年目〜" ? "text-blue-200" : "text-gray-500"}`}>{c.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Voices */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">EMPLOYEE VOICES</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">社員の声</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-6">
            {voices.map((v, i) => (
              <AnimateIn key={v.name} delay={i * 100}>
                <div className="bg-gray-50 border border-gray-100 p-8 relative hover:border-[#1d4ed8] transition-colors">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(v.stars)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-[#1d4ed8] text-[#1d4ed8]" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">「{v.comment}」</p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-semibold text-gray-900 text-sm">{v.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{v.role}</div>
                  </div>
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
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-4" />
              <p className="text-gray-500 text-sm">ドライバー職（早番）の一例です。</p>
            </div>
          </AnimateIn>
          <div className="relative">
            <div className="absolute left-[56px] top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-2">
              {timeline.map((t, i) => (
                <AnimateIn key={i} delay={i * 60}>
                  <div className="flex items-start gap-6 relative">
                    <div className="text-[#1d4ed8] font-bold text-sm w-14 flex-shrink-0 tracking-wider pt-3">{t.time}</div>
                    <div className="w-2 h-2 bg-[#1d4ed8] flex-shrink-0 mt-4 relative z-10" />
                    <div className="bg-white border border-gray-100 px-5 py-3 flex-1 hover:border-[#1d4ed8] transition-colors">
                      <span className="text-gray-800 text-sm font-medium">{t.title}</span>
                      <p className="text-gray-400 text-xs mt-1">{t.note}</p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Flow */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">HOW TO APPLY</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">応募の流れ</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-4" />
              <p className="text-gray-500 text-sm">最短1週間以内での内定を目指しています。</p>
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-5 gap-0">
            {applicationFlow.map((f, i) => (
              <AnimateIn key={f.step} delay={i * 80}>
                <div className="relative bg-gray-50 border border-gray-100 p-6 mx-1 text-center hover:border-[#1d4ed8] transition-colors">
                  {i < applicationFlow.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-3 h-3 border-t border-r border-gray-300 rotate-45 bg-gray-50" />
                  )}
                  <span className="text-[#1d4ed8] text-2xl font-extralight tracking-widest block mb-3">{f.step}</span>
                  <div className="w-6 h-0.5 bg-[#1d4ed8] mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{f.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-8">
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
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-gray-100 px-5" data-testid={`faq-recruit-${i}`}>
                <AccordionTrigger className="text-gray-800 font-medium text-sm text-left py-4">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0f2044] text-center px-8">
        <AnimateIn>
          <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">APPLY NOW</p>
          <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-4">一緒に働きましょう</h2>
          <p className="text-gray-400 text-sm mb-10 max-w-xl mx-auto leading-relaxed">
            ご応募・ご質問はお気軽にどうぞ。履歴書不要、まずはお気軽にご連絡ください。<br />
            <span className="text-[#7eb3ff]">TEL: 046-212-2766</span>（平日 9:00〜21:00）
          </p>
          <Link href="/contact?type=recruit">
            <button
              className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-12 py-4 text-sm tracking-widest transition-colors"
              onClick={() => trackEvent("cta_contact_click", { location: "recruit_cta" })}
              data-testid="button-recruit-cta"
            >
              お問い合わせはこちら
            </button>
          </Link>
        </AnimateIn>
      </section>

      <Footer />
    </div>
  );
}
