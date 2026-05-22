import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { CheckCircle, Mail, ArrowRight, Star, TrendingUp, Shield, Clock } from "lucide-react";
import truckHeroImg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.png";
import recruitImg1 from "@assets/1F4EB5CB-29A3-47D1-9277-E1E76987A7B8_1779460775107.PNG";
import recruitImg2 from "@assets/0A6767E5-1451-438C-B486-1782B1297F10_1779460775108.PNG";
import recruitImg3 from "@assets/3A3C76C0-4233-44A3-B457-22FF64E8AF06_1779460775109.PNG";
import recruitImg4 from "@assets/BC6D7FFA-B15E-457A-8DC2-C1E0FA25B943_1779460775109.PNG";
import recruitImg5 from "@assets/B30768FD-5A67-43D6-A365-9C50F0948EAC_1779460775109.PNG";

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
    salary: "月給 25万〜50万円",
    features: ["週2・3日からOK", "社員登用あり", "即日勤務OK", "未経験歓迎"],
    desc: "神奈川県内を中心に、軽貨物・1t〜4tトラックでのルート配送。近距離中心で長距離なし。無理のないスケジュールで、先輩スタッフが丁寧にサポートします。",
    badge: "正社員",
  },
  {
    title: "配車オペレーター",
    salary: "月給 25万〜50万円",
    features: ["昇給あり", "社員登用あり", "即日勤務OK", "経験者優遇"],
    desc: "一般貨物の配車手配・営業・日報入力などを担当。社員同士の距離が近くアットホームな職場。稼働状況によって勤務時間に変動あり。9:00〜18:00（休憩1時間）・土日祝休み。",
    badge: "正社員",
  },
];

const timeline = [
  { time: "09:00", title: "出社・点呼・車両点検", note: "安全確認と体調チェックからスタート" },
  { time: "10:00", title: "積み込み・ルート出発", note: "配送物の確認・積み付け後、出発" },
  { time: "12:00", title: "昼食休憩（1時間）", note: "ゆっくり休んでリフレッシュ" },
  { time: "13:00", title: "午後の配送", note: "近距離ルート中心。長距離運転はなし" },
  { time: "16:00", title: "配送完了・帰社", note: "お客様先での納品対応・運転日報の記録" },
  { time: "18:00", title: "車両清掃・翌日準備・退勤", note: "定時退勤を推奨しています" },
];

const voices = [
  {
    name: "田中 K.",
    role: "トラックドライバー / 入社2年目",
    years: "2年",
    comment: "前職は全く違う業界からの転職でした。入社前は不安でしたが、先輩スタッフが本当に丁寧に教えてくれて、すぐに職場に馴染めました。近距離のルート配送なので体への負担も少なく、プライベートも充実しています。",
    stars: 5,
  },
  {
    name: "佐藤 M.",
    role: "配車オペレーター / 入社3年目",
    years: "3年",
    comment: "社員同士の距離が近く、アットホームな雰囲気が気に入っています。困ったときはすぐ相談できるし、頑張りをちゃんと評価してもらえるので、入社2年目に昇給もありました。長く働ける職場だと感じています。",
    stars: 5,
  },
  {
    name: "山田 T.",
    role: "トラックドライバー / 入社1年目",
    years: "1年",
    comment: "20代から50代まで幅広い年齢層のスタッフがいて、チームワークがとても良いです。長距離運転がなく定時に帰れることが多いので、プライベートとの両立がしやすいです。資格取得のサポートも手厚く、将来のことも考えられています。",
    stars: 5,
  },
];

const careerPath = [
  { stage: "入社", period: "〜3ヶ月", title: "研修・サポート期間", desc: "先輩スタッフが丁寧にサポート。ルート配送の基礎・安全運転・お客様対応を実務で学ぶ。試用期間3ヶ月・同条件。", color: "bg-gray-100 border-gray-200" },
  { stage: "1年目", period: "〜1年", title: "担当ルートを持つ", desc: "ひとり立ちし、お客様先への定期配送を担当。信頼関係を築きながら経験を積む。", color: "bg-blue-50 border-blue-200" },
  { stage: "3年目", period: "〜3年", title: "昇給・スキルアップ", desc: "各種資格取得を会社がサポート。頑張りが評価に直結し、昇給で収入アップを実現。", color: "bg-indigo-50 border-indigo-200" },
  { stage: "5年目〜", period: "5年〜", title: "配車・リーダー職", desc: "配車オペレーターや管理職へのキャリアアップ。経験と実績で長く安定して活躍できる環境。", color: "bg-[#0f2044] border-[#0f2044] text-white" },
];

const applicationFlow = [
  { step: "01", title: "エントリー", desc: "お問い合わせフォームまたはお電話（046-212-2766）でご応募ください。まずはお気軽にどうぞ。" },
  { step: "02", title: "ご連絡・日程調整", desc: "応募後、担当者よりご連絡します。面接日程をご都合に合わせて調整します。" },
  { step: "03", title: "面接（1回のみ）", desc: "担当者との気軽な面談。会社・職場の見学も同時に行います。即日勤務も相談可能です。" },
  { step: "04", title: "内定・条件確認", desc: "面接後、速やかに結果をご連絡します。給与・条件面は丁寧にご説明します。" },
  { step: "05", title: "入社・サポート開始", desc: "入社日はご都合に合わせて調整。先輩スタッフが丁寧にサポートしながらスタートします。" },
];

const faqs = [
  { q: "未経験でも応募できますか？", a: "はい、大歓迎です。先輩スタッフが丁寧にサポートしますので安心してスタートできます。配送ドライバー経験が1年以上ある方は優遇いたします。" },
  { q: "どんな免許が必要ですか？", a: "普通免許（AT限定可）があればご応募いただけます。大型・中型・準中型免許をお持ちの方は優遇いたします。資格取得費用は会社が補助します。" },
  { q: "どんな仕事内容ですか？", a: "神奈川県内を中心とした近距離ルート配送が主な業務です。軽貨物または1t〜4tトラックでお客様先へ納品を行います。" },
  { q: "勤務時間・休日を教えてください。", a: "定時は9:00〜18:00（休憩1時間）です。配送状況により変動する場合があります。シフト制・週休2日で、土日祝休み。希望休の相談も柔軟に対応します。" },
  { q: "勤務地・アクセスは？", a: "神奈川県愛甲郡愛川町中津7287が拠点です。陸運支局前バス停（徒歩約3分）、下溝駅から車で約10分。マイカー・自転車通勤可、駐車場・駐輪場完備。" },
  { q: "試用期間はありますか？", a: "試用期間は3ヶ月です。試用期間中も本採用と同条件での勤務となります。" },
  { q: "女性でも働けますか？", a: "はい、現在も女性スタッフが活躍しています。軽貨物ドライバーや配車オペレーターなど、女性が活躍できるポジションがあります。" },
  { q: "即日勤務は可能ですか？", a: "はい、即日勤務OK・週2・3日からのスタートも可能です。まずはお気軽にご相談ください。面接は1回のみ、TEL: 046-212-2766 まで。" },
];

const recruitImgs = [recruitImg1, recruitImg2, recruitImg3, recruitImg4, recruitImg5];

export default function Recruit() {
  useEffect(() => {
    trackPageView("/recruit");
    setSeo({
      title: "採用情報｜トラックドライバー・物流スタッフ募集",
      description: "株式会社池ノ谷商事では神奈川県愛川町を拠点にトラックドライバーを積極採用中。月給25万〜50万円、未経験歓迎、週2・3日〜OK、即日勤務可。社会保険完備・各種資格補助あり。",
      path: "/recruit",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px]">
        <img src={truckHeroImg} alt="採用情報" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
          <div className="text-center">
            <AnimateIn>
              <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] mb-6">Ikenoyashoji Co.,Ltd.</p>
              <h1 className="hero-title text-4xl sm:text-6xl font-extralight text-white tracking-[0.15em] mb-6">採用情報</h1>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
            </AnimateIn>
          </div>
        </div>
      </section>


      {/* Photo slider */}
      <section className="bg-white py-12">
        <div className="overflow-hidden w-full">
          <div className="flex gap-3 animate-recruit-slide" style={{ width: "max-content" }}>
            {[...recruitImgs, ...recruitImgs].map((img, i) => (
              <div key={i} className="flex-shrink-0 h-64 w-44 overflow-hidden">
                <img src={img} alt={`スタッフ写真 ${(i % recruitImgs.length) + 1}`} className="w-full h-full object-cover object-top" />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Message */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">WHY JOIN US</p>
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">時間も、収入も、人生に彩りを</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <p className="text-gray-500 text-sm leading-relaxed text-center max-w-2xl mx-auto mb-16">
              神奈川県愛川町を拠点に、近距離ルート配送を中心とした物流業務を担う池ノ谷商事。社員同士の距離が近く、アットホームで明るい職場環境です。20代〜50代まで幅広いスタッフがチームワークを大切に働いています。あなたの頑張りをしっかり評価し、長く安定して働ける環境をご用意しています。
            </p>
          </AnimateIn>
          {/* 4 Pillars */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "アットホームな職場", desc: "社員同士の距離が近く、明るい雰囲気。新人の方もすぐに馴染める環境で、先輩スタッフが丁寧にサポートします。" },
              { icon: TrendingUp, title: "頑張りをしっかり評価", desc: "昇給あり・社員登用制度完備。実績や成果に応じて公正に評価され、長く安定して働けます。" },
              { icon: Star, title: "充実したサポート体制", desc: "未経験でも安心。各種資格取得費用の補助制度あり。先輩スタッフが丁寧に指導します。" },
              { icon: Clock, title: "柔軟な働き方", desc: "希望休の相談可能。シフト制・週休2日でライフスタイルに合わせた働き方ができます。" },
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
              "健康保険",
              "厚生年金",
              "雇用保険",
              "労災保険",
              "各種資格取得費用補助",
              "家族手当（実績・状況により支給）",
              "皆勤手当（実績・状況により支給）",
              "通勤手当（実績・状況により支給）",
              "試用期間3ヶ月・同条件",
              "マイカー通勤可・駐車場完備",
              "自転車通勤可・駐輪場完備",
              "社員登用制度あり",
              "昇給あり",
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
      <section className="py-16 sm:py-24 bg-[#0f2044] text-center px-4 sm:px-8">
        <AnimateIn>
          <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">APPLY NOW</p>
          <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-4">時間も、収入も、人生に彩りを</h2>
          <p className="text-gray-400 text-sm mb-3 max-w-xl mx-auto leading-relaxed">
            即日勤務OK・週2〜3日からスタートOK。まずはお気軽にご連絡ください。
          </p>
          <p className="text-[#7eb3ff] text-base font-light tracking-widest mb-10">
            TEL: 046-212-2766
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact?type=recruit">
              <button
                className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-12 py-4 text-sm tracking-widest transition-colors"
                onClick={() => trackEvent("cta_contact_click", { location: "recruit_cta" })}
                data-testid="button-recruit-cta"
              >
                応募フォームはこちら
              </button>
            </Link>
            <a
              href="tel:046-212-2766"
              className="border border-[#1d4ed8] text-[#7eb3ff] hover:bg-[#1d4ed8] hover:text-white px-12 py-4 text-sm tracking-widest transition-colors"
              onClick={() => trackEvent("cta_tel_click", { location: "recruit_cta" })}
              data-testid="link-recruit-tel"
            >
              電話で問い合わせる
            </a>
          </div>
        </AnimateIn>
      </section>

      <Footer />
    </div>
  );
}
