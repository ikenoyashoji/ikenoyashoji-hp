import { useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { CheckCircle } from "lucide-react";
import buildingImg from "@assets/スクリーンショット_2026-05-13_4.37.54_1778614678216.png";

const companyInfo: { label: string; value: string | string[] }[] = [
  { label: "会社名", value: "株式会社池ノ谷商事" },
  { label: "英語表記", value: "IKENOYA SHOJI CO., LTD." },
  { label: "本社所在地", value: "〒243-0303 神奈川県愛甲郡愛川町中津7287" },
  { label: "TEL", value: "046-212-2766" },
  { label: "FAX", value: "046-401-1714" },
  { label: "Email", value: "info@ikenoyashoji.co.jp" },
  { label: "代表取締役", value: "池ノ谷 翔" },
  { label: "設立", value: "令和5年2月20日" },
  { label: "資本金", value: "3,000,000円" },
  { label: "適格請求書発行事業者登録番号", value: "T802100108272" },
  { label: "許認可", value: [
    "関自貨第542号",
    "関自貨第1201号",
    "古物商　神奈川公安委員会　第452740020200号",
  ]},
  { label: "事業内容", value: [
    "一般貨物自動車運送、貨物利用運送、貨物軽自動車運送、物流コンサルティング、倉庫管理、",
    "総合保険代理店、各種新車・中古車販売及び買取、一般整備・車検・板金・塗装・レッカー",
  ]},
  { label: "保有台数", value: "約40台（大型・中型・小型トラック、軽貨物車含む）" },
  { label: "従業員数", value: "約128名（パート・アルバイト含む）" },
  { label: "貨物保険", value: "三井住友海上　10,000,000円" },
  { label: "加盟団体", value: "公益社団法人 全日本トラック協会、神奈川トラック協会" },
  { label: "主要取引先", value: [
    "株式会社ギオンデリバリーサービス／株式会社ロジネットジャパン／株式会社丸和運輸機関／",
    "サン インテルネット株式会社／遠州トラック株式会社／SBS即配サポート株式会社／",
    "ヒップスタイル株式会社／ヤマト運輸株式会社／ファイズトランスポートサービス株式会社／",
    "白銅株式会社／中央運輸株式会社　他（順不同）",
  ]},
  { label: "主要取引銀行", value: [
    "相愛信用組合 本店",
    "三井住友銀行 厚木市店",
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
        <div className="relative">
          <img src={buildingImg} alt="池ノ谷商事 本社" className="w-full" style={{ maxHeight: "280px", objectFit: "cover", objectPosition: "center 60%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(26,75,153,0.82) 0%, rgba(29,78,216,0.55) 50%, rgba(15,32,68,0.35) 100%)" }} />
          <div className="absolute inset-0 flex items-center px-6 sm:px-14">
            <div>
              <p className="text-white/50 text-[10px] tracking-[0.5em] uppercase mb-3">IKENOYA SHOJI CO., LTD.</p>
              <h1 className="text-3xl sm:text-5xl font-thin text-white tracking-[0.15em] leading-none mb-4">企業情報</h1>
              <div className="w-10 h-px bg-white/50 mb-4" />
              <p className="text-white/70 text-xs tracking-wider leading-relaxed">
                誠実に、まっすぐに。地域に根ざし、信頼を育んできました。
              </p>
            </div>
          </div>
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
                  <div className="sm:w-44 flex-shrink-0 px-4 sm:px-6 pt-3 pb-1 sm:py-4 text-xs sm:text-sm font-medium text-gray-500 bg-gray-50 sm:border-r border-gray-100">{item.label}</div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                type: "本社",
                zip: "〒243-0303",
                address: "神奈川県愛甲郡愛川町中津7287",
                tel: "046-212-2766",
                fax: "046-401-1714",
              },
              {
                type: "湘南営業所",
                zip: "〒257-0024",
                address: "神奈川県秦野市名古木157-12",
                tel: "0463-84-5181",
                fax: "0463-84-5182",
              },
              {
                type: "相模原車庫",
                zip: "—",
                address: "—",
                tel: "—",
                fax: "—",
              },
              {
                type: "愛川第一倉庫",
                zip: "—",
                address: "—",
                tel: "—",
                fax: "—",
              },
              {
                type: "厚木第一倉庫",
                zip: "—",
                address: "—",
                tel: "—",
                fax: "—",
              },
            ].map((loc, i) => (
              <AnimateIn key={i} delay={i * 60}>
                <div className="bg-white border border-gray-100 p-6">
                  <span className="inline-block text-[10px] tracking-[0.3em] bg-[#0f2044] text-white px-3 py-1 mb-4">{loc.type}</span>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    {loc.zip !== "—" && <p>{loc.zip}</p>}
                    <p className={loc.address === "—" ? "text-gray-300 italic" : ""}>{loc.address === "—" ? "住所調整中" : loc.address}</p>
                    <p className="pt-1">TEL：{loc.tel === "—" ? <span className="text-gray-300">—</span> : loc.tel}</p>
                    <p>FAX：{loc.fax === "—" ? <span className="text-gray-300">—</span> : loc.fax}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Org Chart */}
      <section className="py-24 bg-white px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">ORGANIZATION</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">本社組織図</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="flex flex-col items-center gap-0">
              {/* Top */}
              <div className="bg-[#0f2044] text-white text-sm font-semibold tracking-wider px-10 py-3 min-w-[200px] text-center">
                代表取締役
              </div>
              <div className="w-px h-8 bg-gray-300" />
              {/* Second layer */}
              <div className="border border-gray-200 text-gray-800 text-sm font-medium tracking-wider px-8 py-3 min-w-[180px] text-center bg-gray-50">
                管理本部
              </div>
              <div className="w-px h-8 bg-gray-300" />
              {/* Third layer - 4 departments */}
              <div className="relative w-full flex justify-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gray-300" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl pt-8 relative">
                <div className="absolute -top-px left-[12.5%] right-[12.5%] h-px bg-gray-300" />
                {[
                  { name: "営業部", en: "SALES" },
                  { name: "運行管理部", en: "OPERATION" },
                  { name: "整備部", en: "MAINTENANCE" },
                  { name: "管理部", en: "ADMIN" },
                ].map((dept) => (
                  <div key={dept.name} className="flex flex-col items-center gap-0">
                    <div className="w-px h-8 bg-gray-300" />
                    <div className="border border-[#1d4ed8]/30 bg-blue-50 text-center px-3 py-3 w-full">
                      <p className="text-[10px] text-gray-400 tracking-widest mb-0.5">{dept.en}</p>
                      <p className="text-sm font-semibold text-[#1a4b99]">{dept.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* History */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">HISTORY</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">沿革</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="relative">
            <div className="absolute left-[80px] sm:left-[120px] top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-0">
              {[
                { year: "2023年2月", event: "神奈川県愛甲郡愛川町中津7287にて株式会社池ノ谷商事を設立" },
                { year: "2023年3月", event: "一般貨物自動車運送事業 許可取得（関自貨第542号）" },
                { year: "2023年4月", event: "貨物利用運送事業 登録取得（関自貨第1201号）、事業開始" },
                { year: "2023年6月", event: "古物商許可取得（神奈川公安委員会 第452740020200号）" },
                { year: "2023年9月", event: "車両台数・従業員数を拡充し、関東圏全域への配送網を整備" },
                { year: "2024年4月", event: "物流コンサルティング事業・倉庫管理事業を開始" },
                { year: "2024年9月", event: "総合保険代理店業務、各種車両販売・整備事業を開始" },
                { year: "2025年2月", event: "従業員数100名超を達成、第二事業所を開設" },
              ].map((item, i) => (
                <AnimateIn key={i} delay={i * 60}>
                  <div className="flex items-start gap-0 relative pb-0">
                    <div className="w-[80px] sm:w-[120px] flex-shrink-0 py-5 pr-3 sm:pr-6 text-right">
                      <span className="text-[10px] sm:text-xs text-gray-500 tracking-wide">{item.year}</span>
                    </div>
                    <div className="flex-shrink-0 relative z-10 mt-5">
                      <div className="w-3 h-3 rounded-full bg-[#1d4ed8] border-2 border-white ring-1 ring-[#1d4ed8]" />
                    </div>
                    <div className="flex-1 py-5 pl-6 border-b border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{item.event}</p>
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
