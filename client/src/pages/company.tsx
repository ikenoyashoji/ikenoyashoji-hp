import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { CheckCircle } from "lucide-react";
import buildingImg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.png";

function useCountUp(target: number, duration = 2800) {
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
    "一般貨物自動車運送",
    "貨物利用運送",
    "貨物軽自動車運送",
    "物流コンサルティング",
    "倉庫管理",
    "総合保険代理店",
    "各種新車・中古車販売及び買取",
    "一般整備・車検・板金・塗装・レッカー",
  ]},
  { label: "保有車両", value: "12台（13tウィングゲート・4tウィングゲート・3t冷凍車・2tl箱・2ts箱・1tバン・軽）" },
  { label: "従業員数", value: "15名（パート・アルバイト含む）" },
  { label: "貨物保険", value: "東京海上日動　100,000,000円" },
  { label: "加盟団体", value: ["一般社団法人神奈川県トラック協会", "愛甲商工会議所"] },
  { label: "顧問", value: ["弁護士法人グレイス", "Palm税理士法人", "Palm社会保険労務士法人"] },
  { label: "主要取引先", value: [
    "アート引越センター株式会社",
    "株式会社アエナ",
    "アズフィット株式会社",
    "Amazon Japan合同会社",
    "SBS即配サポート株式会社",
    "遠州トラック株式会社",
    "近物レックス株式会社",
    "株式会社ギオンデリバリーサービス",
    "株式会社Comfy",
    "佐川急便株式会社",
    "サン インテルネット株式会社",
    "澁澤倉庫株式会社",
    "シモハナ物流株式会社",
    "株式会社首都圏物流",
    "株式会社成玉舎",
    "成立工業株式会社",
    "センコー株式会社",
    "株式会社東京アルファライン",
    "ニッコン株式会社",
    "日本ロジテム株式会社",
    "株式会社ハート引越センター",
    "白銅株式会社",
    "株式会社ハマキョウレックス",
    "ヒップスタイル株式会社",
    "ファイズトランスポートサービス株式会社",
    "株式会社富士ロジテックホールディングス",
    "株式会社丸和運輸機関",
    "ヤマト運輸株式会社",
    "株式会社ロジネットジャパン",
    "他（順不同）",
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
      <section className="relative mt-[100px] overflow-hidden">
        <img src={buildingImg} alt="池ノ谷商事 本社" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] mb-6">Ikenoyashoji Co.,Ltd.</p>
            <h1 className="hero-title text-2xl sm:text-4xl md:text-6xl font-extralight text-white tracking-[0.08em] sm:tracking-[0.15em] mb-6">企業情報</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
          </AnimateIn>
        </div>
      </section>


      {/* Company info */}
      <section className="py-16 sm:py-24 bg-white px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">OVERVIEW</p>
              <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">会社概要</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="border border-gray-100">
              {companyInfo.map((item, i) => (
                <div key={item.label} className={`flex flex-col sm:flex-row border-b border-gray-100 last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="sm:w-56 flex-shrink-0 px-4 sm:px-6 pt-3 pb-1 sm:py-4 text-xs sm:text-sm font-medium text-gray-500 bg-gray-50 sm:border-r border-gray-100 whitespace-nowrap">{item.label}</div>
                  <div className="px-4 sm:px-6 pb-3 pt-1 sm:py-4 text-sm text-gray-800 flex-1 leading-relaxed">
                    {Array.isArray(item.value) && item.label === "主要取引先"
                      ? (() => {
                          const half = Math.ceil(item.value.length / 2);
                          const left = item.value.slice(0, half);
                          const right = item.value.slice(half);
                          return (
                            <div className="grid grid-cols-2 gap-x-6">
                              <div>{left.map((line, j) => <div key={j}>{line}</div>)}</div>
                              <div>{right.map((line, j) => <div key={j}>{line}</div>)}</div>
                            </div>
                          );
                        })()
                      : Array.isArray(item.value)
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
      <section className="py-16 sm:py-24 bg-gray-50 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">LOCATIONS</p>
              <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">拠点情報</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          {(() => {
            const locs = [
              { type: "本社営業所",   zip: "〒243-0303", address: "神奈川県愛甲郡愛川町中津7287",       tel: "046-212-2766", fax: "046-401-1714", mapQuery: "神奈川県愛甲郡愛川町中津7287" },
              { type: "湘南営業所",   zip: "〒257-0024", address: "神奈川県秦野市名古木157-12",          tel: "0463-84-5181", fax: "0463-84-5182", mapQuery: "神奈川県秦野市名古木157-12" },
              { type: "厚木営業所",   zip: "〒243-0127", address: "神奈川県厚木市森の里紅葉台3-4 2階\nニッコン（株）内", tel: "", fax: "", mapQuery: "神奈川県厚木市森の里紅葉台3-4" },
              { type: "愛川倉庫",     zip: "〒243-0303", address: "神奈川県愛甲郡愛川町中津250-1\n（有）青木商事 内", tel: "", fax: "", mapQuery: "神奈川県愛甲郡愛川町中津250-1" },
              { type: "厚木倉庫",     zip: "〒243-0127", address: "神奈川県厚木市森の里紅葉台3-4",      tel: "", fax: "", mapQuery: "神奈川県厚木市森の里紅葉台3-4" },
              { type: "愛川第一車庫", zip: "〒243-0303", address: "神奈川県愛甲郡愛川町中津7294",       tel: "", fax: "", mapQuery: "神奈川県愛甲郡愛川町中津7294" },
              { type: "相模原車庫",   zip: "〒252-0244", address: "神奈川県相模原市中央区田名4905",     tel: "", fax: "", mapQuery: "神奈川県相模原市中央区田名4905" },
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">{locs.slice(0, 3).map((l, i) => card(l, i))}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch sm:max-w-[66.7%] sm:mx-auto">
                  {card(locs[3], 3)}
                  {card(locs[4], 4)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch sm:max-w-[66.7%] sm:mx-auto">
                  {card(locs[5], 5)}
                  {card(locs[6], 6)}
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
              <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">沿革</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="relative">
            <div className="absolute left-[90px] sm:left-[130px] top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-0">
              {[
                { year: "2023年2月", event: "神奈川県愛甲郡愛川町中津7287にて株式会社池ノ谷商事を設立", highlight: true },
                { year: "2023年4月", event: "山口県阿知須DS ローンチ" },
                { year: "2023年6月", event: "福岡県北九州DS ローンチ" },
                { year: "2023年6月", event: "愛知県名古屋DS エリア拡大" },
                { year: "2023年7月", event: "京都府久世DS エリア拡大" },
                { year: "2023年8月", event: "静岡県三島DS ローンチ" },
                { year: "2023年9月", event: "貨物利用運送事業 登録取得（関自貨第542号）、輸送事業を開始" },
                { year: "2023年9月", event: "湘南営業所（神奈川県秦野市名古木157-12）を開設。湘南・西湘エリアへ事業拡大" },
                { year: "2023年10月", event: "愛甲商工会に加盟" },
                { year: "2024年2月", event: "創業1周年", highlight: true },
                { year: "2024年2月", event: "神奈川県横浜市戸塚EC ローンチ" },
                { year: "2024年4月", event: "古物商許可取得（神奈川公安委員会 第452740020200号）各種新車・中古車販売及び買取 開始" },
                { year: "2024年8月", event: "岐阜県可児DS ローンチ" },
                { year: "2025年2月", event: "創業2周年", highlight: true },
                { year: "2025年3月", event: "総合保険代理店業務 開始" },
                { year: "2026年1月", event: "一般貨物自動車運送事業 許可取得（関自貨第1201号）。自社運送事業を本格化" },
                { year: "2026年2月", event: "創業3周年", highlight: true },
                { year: "2026年2月", event: "愛川倉庫（神奈川県愛甲郡愛川町中津250-1）を開設。倉庫事業へ進出" },
                { year: "2026年3月", event: "一般社団法人神奈川県トラック協会 加盟" },
                { year: "2026年5月", event: "愛川第一車庫（神奈川県愛甲郡愛川町中津7294）を開設" },
                { year: "2026年5月", event: "相模原車庫（神奈川県相模原市中央区田名4905）を開設" },
                { year: "2026年5月", event: "厚木営業所・厚木倉庫（神奈川県厚木市森の里紅葉台3-4）を開設" },
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

      {/* 各種約款 */}
      <section className="py-24 bg-white px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">TERMS & CONDITIONS</p>
              <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">各種約款</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "標準貨物自動車運送約款",
                subtitle: "国土交通省告示 平成29年改正版準拠",
                label: "一般貨物自動車運送事業",
                file: "/docs/standard-cargo-terms.pdf",
              },
              {
                title: "貨物利用運送約款",
                subtitle: "貨物利用運送事業法に基づく",
                label: "貨物利用運送事業（登録番号：関自貨第542号）",
                file: "/docs/freight-forwarding-terms.pdf",
              },
            ].map((item, i) => (
              <AnimateIn key={i} delay={i * 100}>
                <a
                  href={item.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-yakkan-${i}`}
                  className="group flex items-center justify-between p-6 border border-gray-200 hover:border-[#1d4ed8] hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#1d4ed8] tracking-widest mb-1 uppercase">PDF</p>
                    <p className="text-sm font-medium text-gray-900 leading-snug mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 mb-2">{item.subtitle}</p>
                    <span className="inline-block text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 tracking-wide">{item.label}</span>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-[#1d4ed8] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                </a>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-20 bg-[#0f2044] text-center px-4 sm:px-8">
        <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-3">CONTACT</p>
        <h2 className="text-xl sm:text-3xl font-light text-white tracking-[0.05em] sm:tracking-[0.2em] mb-6 sm:mb-8">お問い合わせ</h2>
        <Link href="/contact">
          <button className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-8 py-3 sm:px-10 sm:py-4 text-sm tracking-widest transition-colors" data-testid="button-company-contact">
            お問い合わせはこちら
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
