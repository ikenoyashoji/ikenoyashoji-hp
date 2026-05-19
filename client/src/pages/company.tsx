import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { CheckCircle } from "lucide-react";
import buildingImg from "@assets/company_hero.png";

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

const companyInfo: { label: string; value: string | string[] }[] = [
  { label: "会社名", value: "株式会社池ノ谷商事" },
  { label: "英語表記", value: "Ikenoyashoji Co.,Ltd." },
  { label: "本社所在地", value: "〒243-0303 神奈川県愛甲郡愛川町中津7287" },
  { label: "TEL", value: "046-212-2766" },
  { label: "FAX", value: "046-401-1714" },
  { label: "Email", value: "info@ikenoyashoji.co.jp" },
  { label: "代表取締役", value: "池ノ谷 翔" },
  { label: "設立", value: "令和5年2月20日" },
  { label: "資本金", value: "3,000,000円" },
  { label: "インボイス登録番号", value: "T802100108272" },
  { label: "許認可", value: [
    "一般貨物自動車運送事業　関自貨第1201号",
    "貨物利用運送事業　関自貨第542号",
    "古物商　神奈川公安委員会　第452740020200号",
  ]},
  { label: "事業内容", value: [
    "一般貨物自動車運送、貨物利用運送、貨物軽自動車運送、物流コンサルティング、倉庫管理、",
    "総合保険代理店、各種新車・中古車販売及び買取、一般整備・車検・板金・塗装・レッカー",
  ]},
  { label: "保有車両", value: "12台（13tウィングゲート・4tウィングゲート・3t冷凍車・2tl箱・2ts箱・1tバン）" },
  { label: "従業員数", value: "15名（パート・アルバイト含む）" },
  { label: "貨物保険", value: "東京海上日動　100,000,000円" },
  { label: "加盟団体", value: "一般社団法人神奈川県トラック協会、愛甲商工会" },
  { label: "主要取引先", value: [
    "株式会社ギオンデリバリーサービス／株式会社ロジネットジャパン／株式会社丸和運輸機関／",
    "サン インテルネット株式会社／遠州トラック株式会社／SBS即配サポート株式会社／",
    "ヒップスタイル株式会社／ヤマト運輸株式会社／ファイズトランスポートサービス株式会社／",
    "白銅株式会社／中央運輸株式会社　他（順不同）",
  ]},
  { label: "主要取引銀行", value: [
    "相愛信用組合 本店",
    "三井住友銀行",
    "きらぼし銀行 厚木支店",
  ]},
];

export default function Company() {
  useEffect(() => {
    trackPageView("/company");
    setSeo({
      title: "企業情報・会社概要",
      description: "株式会社池ノ谷商事の会社概要・拠点情報・組織図・沿革をご覧いただけます。神奈川県愛川町に本社を置く総合物流企業です。資本金1,000万円、従業員100名以上。",
      path: "/company",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] h-[520px] flex items-center justify-center overflow-hidden">
        <img src={buildingImg} alt="池ノ谷商事 本社" className="absolute inset-0 w-full h-full object-cover object-center" style={{ objectPosition: "center 60%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)", backgroundSize: "60px 60px" }} />
        <div className="relative text-center px-8">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] mb-6">Ikenoyashoji Co.,Ltd.</p>
            <h1 className="text-6xl md:text-7xl font-extralight text-white tracking-[0.15em] mb-6">企業情報</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
            <p className="text-gray-300 text-sm tracking-widest">誠実に、まっすぐに。地域に根ざし、信頼を育んできました。</p>
          </AnimateIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0f2044] py-8 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
          <StatItem num={128} unit="名"  label="EMPLOYEES"  delay={0} />
          <StatItem num={120} suffix="+" unit="台"  label="VEHICLES"   delay={80} />
          <StatItem num={6}   unit="拠点" label="LOCATIONS"  delay={160} />
          <StatItem num={3}   unit="年目" label="SINCE 2023"  delay={240} />
        </div>
      </section>

      {/* Company info */}
      <section className="py-24 bg-white px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">OVERVIEW</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">会社概要</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="border border-gray-100">
              {companyInfo.map((item, i) => (
                <div key={item.label} className={`flex flex-col sm:flex-row border-b border-gray-100 last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="sm:w-56 flex-shrink-0 px-4 sm:px-6 pt-3 pb-1 sm:py-4 text-xs sm:text-sm font-medium text-gray-500 bg-gray-50 sm:border-r border-gray-100 whitespace-nowrap">{item.label}</div>
                  <div className="px-4 sm:px-6 pb-3 pt-1 sm:py-4 text-sm text-gray-800 flex-1 leading-relaxed">
                    {Array.isArray(item.value)
                      ? item.value.map((line, j) => <div key={j}>{line}</div>)
                      : item.value}
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">LOCATIONS</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">拠点情報</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          {(() => {
            const locs = [
              { type: "本社営業所",   zip: "〒243-0303", address: "神奈川県愛甲郡愛川町中津7287",       tel: "046-212-2766", fax: "046-401-1714", mapQuery: "神奈川県愛甲郡愛川町中津7287" },
              { type: "湘南営業所",   zip: "〒257-0024", address: "神奈川県秦野市名古木157-12",          tel: "0463-84-5181", fax: "0463-84-5182", mapQuery: "神奈川県秦野市名古木157-12" },
              { type: "厚木営業所",   zip: "〒243-0127", address: "神奈川県厚木市森の里紅葉台3-4 2階\nニッコン（株）内", tel: "", fax: "", mapQuery: "神奈川県厚木市森の里紅葉台3-4" },
              { type: "愛川倉庫",     zip: "〒243-0303", address: "神奈川県愛甲郡愛川町中津250-1\n（有）青木商事 内", tel: "046-212-2766", fax: "046-401-1714", mapQuery: "神奈川県愛甲郡愛川町中津250-1" },
              { type: "厚木倉庫",     zip: "〒243-0127", address: "神奈川県厚木市森の里紅葉台3-4",      tel: "046-212-2766", fax: "046-401-1714", mapQuery: "神奈川県厚木市森の里紅葉台3-4" },
              { type: "愛川第一車庫", zip: "〒243-0303", address: "神奈川県愛甲郡愛川町中津7294",       tel: "046-212-2766", fax: "046-401-1714", mapQuery: "神奈川県愛甲郡愛川町中津7294" },
              { type: "相模原車庫",   zip: "〒252-0244", address: "神奈川県相模原市中央区田名4905",     tel: "046-212-2766", fax: "046-401-1714", mapQuery: "神奈川県相模原市中央区田名4905" },
            ];
            const card = (loc: typeof locs[0], i: number) => (
              <AnimateIn key={i} delay={i * 60} className="h-full">
                <div className="bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full">
                  <div className="p-6 flex-1">
                    <span className="inline-block text-xs tracking-[0.2em] bg-[#0f2044] text-white px-4 py-1.5 mb-4">{loc.type}</span>
                    <div className="space-y-1.5 text-xs text-gray-500">
                      <p>{loc.zip}</p>
                      <p className="whitespace-pre-line">{loc.address}</p>
                      {loc.tel && <p className="pt-1">TEL：{loc.tel}</p>}
                      {loc.fax && <p>FAX：{loc.fax}</p>}
                    </div>
                  </div>
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(loc.mapQuery)}&output=embed&hl=ja&z=16`}
                    className="w-full h-40 border-0 shrink-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </AnimateIn>
            );
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-stretch">{locs.slice(0, 3).map((l, i) => card(l, i))}</div>
                <div className="grid grid-cols-6 gap-4 items-stretch">
                  <div className="col-span-2 col-start-2 flex flex-col">{card(locs[3], 3)}</div>
                  <div className="col-span-2 flex flex-col">{card(locs[4], 4)}</div>
                </div>
                <div className="grid grid-cols-6 gap-4 items-stretch">
                  <div className="col-span-2 col-start-2 flex flex-col">{card(locs[5], 5)}</div>
                  <div className="col-span-2 flex flex-col">{card(locs[6], 6)}</div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>


      {/* History */}
      <section className="py-24 bg-gray-50 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">HISTORY</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">沿革</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="relative">
            <div className="absolute left-[90px] sm:left-[130px] top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-0">
              {[
                { year: "2023年2月", event: "神奈川県愛甲郡愛川町中津7287にて株式会社池ノ谷商事を設立", highlight: true },
                { year: "2023年3月", event: "貨物利用運送事業 登録取得（関自貨第542号）、輸送事業を開始" },
                { year: "2023年6月", event: "古物商許可取得（神奈川公安委員会 第452740020200号）" },
                { year: "2023年9月", event: "車両台数30台・従業員数50名超を達成。関東圏全域への配送網を整備" },
                { year: "2023年12月", event: "愛川第一車庫を開設。神奈川県内陸工業団地に物流拠点を確立" },
                { year: "2024年2月", event: "創業1周年。事業基盤をさらに強化", highlight: true },
                { year: "2024年4月", event: "一般貨物自動車運送事業 許可取得（関自貨第1201号）。幹線輸送事業を本格化" },
                { year: "2024年6月", event: "相模原第二車庫を開設。相模原市・海老名市エリアへの配送網を拡充" },
                { year: "2024年7月", event: "愛川第一倉庫を開設。倉庫管理・保管事業へ進出" },
                { year: "2024年9月", event: "総合保険代理店業務を開始。各種車両販売・買取・整備・車検事業を拡張" },
                { year: "2024年11月", event: "湘南営業所（神奈川県秦野市）を開設。湘南・西湘エリアへ事業拡大" },
                { year: "2025年2月", event: "創業2周年。従業員数128名・車両台数120台を達成", highlight: true },
                { year: "2025年4月", event: "厚木第二倉庫を開設。物流拠点を6拠点体制へ拡充" },
                { year: "2025年5月", event: "公益社団法人 全日本トラック協会・神奈川トラック協会に加盟" },
              ].map((item, i) => (
                <AnimateIn key={i} delay={i * 50}>
                  <div className="flex items-start gap-0 relative">
                    <div className="w-[90px] sm:w-[130px] flex-shrink-0 py-5 pr-3 sm:pr-6 text-right">
                      <span className={`text-[10px] sm:text-xs tracking-wide ${item.highlight ? "text-[#1a4b99] font-semibold" : "text-gray-400"}`}>
                        {item.year}
                      </span>
                    </div>
                    <div className="flex-shrink-0 relative z-10 mt-[22px]">
                      <div className={`w-3 h-3 rounded-full border-2 border-white ring-1 ${item.highlight ? "bg-[#0f2044] ring-[#0f2044]" : "bg-[#1d4ed8] ring-[#1d4ed8]"}`} />
                    </div>
                    <div className={`flex-1 py-4 pl-6 border-b border-gray-100 ${item.highlight ? "bg-blue-50/40" : ""}`}>
                      <p className={`text-sm leading-relaxed ${item.highlight ? "text-gray-900 font-medium" : "text-gray-600"}`}>
                        {item.event}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f2044] text-center px-8">
        <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">CONTACT</p>
        <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-8">お問い合わせ</h2>
        <Link href="/contact">
          <button className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-10 py-4 text-sm tracking-widest transition-colors" data-testid="button-company-contact">
            お問い合わせはこちら
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
