import { useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView } from "@/lib/analytics";
import { CheckCircle } from "lucide-react";
import buildingImg from "@assets/スクリーンショット_2026-05-13_4.37.54_1778614678216.png";
import ceoImg from "@assets/スクリーンショット_2026-05-14_2.55.57_1778694961831.png";

const companyInfo = [
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
  { label: "許認可", value: "関自貨第542号 / 関自貨第1201号 / 古物商　神奈川公安委員会　第452740020200号" },
  { label: "事業内容", value: "一般貨物自動車運送、貨物利用運送、貨物軽自動車運送、物流コンサルティング、倉庫管理、総合保険代理店、各種新車・中古車販売及び買取、一般整備・車検・板金・塗装・レッカー" },
  { label: "保有台数", value: "—" },
  { label: "従業員数", value: "約128名（パート・アルバイト含む）" },
  { label: "貨物保険", value: "三井住友海上　10,000,000円" },
  { label: "加盟団体", value: "公益社団法人 全日本トラック協会、神奈川トラック協会" },
  { label: "主要取引先", value: "株式会社ギオンデリバリーサービス／株式会社ロジネットジャパン／株式会社丸和運輸機関／サン インテルネット株式会社／遠州トラック株式会社／SBS即配サポート株式会社／ヒップスタイル株式会社／ヤマト運輸株式会社／ファイズトランスポートサービス株式会社／白銅株式会社／中央運輸株式会社　他（順不同）" },
  { label: "主要取引銀行", value: "相愛信用組合 本店 / 三井住友銀行 厚木市店 / きらぼし銀行 厚木支店" },
];

export default function Company() {
  useEffect(() => {
    trackPageView("/company");
    document.title = "企業情報｜株式会社池ノ谷商事";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden">
        <div className="relative">
          <img src={buildingImg} alt="池ノ谷商事 本社" className="w-full" style={{ maxHeight: "280px", objectFit: "cover", objectPosition: "center 60%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(26,75,153,0.82) 0%, rgba(29,78,216,0.55) 50%, rgba(15,32,68,0.35) 100%)" }} />
          <div className="absolute inset-0 flex items-center px-14">
            <div>
              <p className="text-white/50 text-[10px] tracking-[0.5em] uppercase mb-3">IKENOYA SHOJI CO., LTD.</p>
              <h1 className="text-5xl font-thin text-white tracking-[0.15em] leading-none mb-4">企業情報</h1>
              <div className="w-10 h-px bg-white/50 mb-4" />
              <p className="text-white/70 text-xs tracking-wider leading-relaxed">
                誠実に、まっすぐに。地域に根ざし、信頼を育んできました。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Message */}
      <section className="py-24 bg-white px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimateIn direction="left">
            <div>
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">MESSAGE</p>
              <h2 className="text-3xl font-light text-gray-900 tracking-[0.15em] mb-6 leading-relaxed">
                物流で、<br />社会をつなぐ。
              </h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mb-8" />
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                池ノ谷商事は、2023年の創業以来、安全・確実・丁寧をモットーに、輸送業務と構内作業に取り組んできました。長年の経験と現場力を活かし、地域社会とともに歩みながら、お客様との信頼関係を一つひとつ丁寧に築いてきた歴史があります。
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                これからも、誠実な姿勢で現場に向き合い、確かな仕事を積み重ねてまいります。
              </p>
            </div>
          </AnimateIn>
          <AnimateIn direction="right">
            <div className="relative overflow-hidden">
              <img src={ceoImg} alt="代表取締役 池ノ谷 翔" className="w-full object-cover" style={{ aspectRatio: "4/5", objectPosition: "center top" }} />
              <div className="absolute bottom-0 left-0 right-0 bg-[#0f2044]/90 px-6 py-4">
                <p className="text-white font-semibold tracking-wider text-sm">池ノ谷 翔</p>
                <p className="text-gray-400 text-xs mt-0.5 tracking-widest">代表取締役</p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden py-5 bg-white">
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

      {/* Philosophy */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">PHILOSOPHY</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">企業理念</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="bg-[#0f2044] py-12 px-8 text-center mb-12">
              <p className="text-2xl md:text-3xl font-light text-white tracking-[0.15em] mb-3">"運ぶ信頼、届ける真心"</p>
              <p className="text-gray-400 text-xs tracking-[0.4em]">TRUST IN EVERY DELIVERY, SINCERITY IN EVERY STEP</p>
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { en: "INTEGRITY", title: "誠実", desc: "お客様・パートナー・社員に対して、常に誠実であることを第一とします。" },
              { en: "SAFETY", title: "安全", desc: "全ての業務において安全を最優先に。事故ゼロの実現に向けて取り組みます。" },
              { en: "INNOVATION", title: "革新", desc: "テクノロジーと現場力を融合させ、物流の常識を変え続けます。" },
            ].map((p, i) => (
              <AnimateIn key={p.title} delay={i * 100}>
                <div className="bg-white border border-gray-100 p-8">
                  <p className="text-[#1d4ed8] text-xs tracking-[0.3em] mb-3">{p.en}</p>
                  <div className="text-gray-900 font-bold text-2xl mb-4">{p.title}</div>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </AnimateIn>
            ))}
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
                <div key={item.label} className={`flex border-b border-gray-100 last:border-b-0 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                  <div className="w-44 flex-shrink-0 px-6 py-4 text-sm font-medium text-gray-500 bg-gray-50 border-r border-gray-100">{item.label}</div>
                  <div className="px-6 py-4 text-sm text-gray-800 flex-1">{item.value}</div>
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
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                type: "本社",
                name: "株式会社池ノ谷商事 本社",
                zip: "〒243-0303",
                address: "神奈川県愛甲郡愛川町中津7287",
                tel: "046-212-2766",
                fax: "046-401-1714",
              },
              {
                type: "第二事業所",
                name: "池ノ谷商事 第二事業所",
                zip: "〒243-0303",
                address: "神奈川県愛甲郡愛川町中津7287",
                tel: "046-212-2766",
                fax: "046-401-1714",
              },
            ].map((loc, i) => (
              <AnimateIn key={i} delay={i * 80}>
                <div className="bg-white border border-gray-100 p-7">
                  <span className="inline-block text-[10px] tracking-[0.3em] bg-[#0f2044] text-white px-3 py-1 mb-4">{loc.type}</span>
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">{loc.name}</h3>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <p>{loc.zip}</p>
                    <p>{loc.address}</p>
                    <p className="pt-1">TEL：{loc.tel}</p>
                    <p>FAX：{loc.fax}</p>
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
              <div className="grid grid-cols-4 gap-4 w-full max-w-2xl pt-8 relative">
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
            <div className="absolute left-[120px] top-0 bottom-0 w-px bg-gray-200" />
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
                    <div className="w-[120px] flex-shrink-0 py-5 pr-6 text-right">
                      <span className="text-xs text-gray-500 tracking-wide whitespace-nowrap">{item.year}</span>
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

      {/* Certifications */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">CERTIFICATIONS</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">認証・取組み</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Gマーク認証取得", desc: "国土交通省認定の安全優良事業所として認定を受けています。" },
              { title: "ISO 9001認証", desc: "品質マネジメントシステムの国際規格を取得し、品質向上に取り組んでいます。" },
              { title: "グリーン経営認証", desc: "環境負荷低減に取り組むグリーン経営認証を取得しています。" },
              { title: "働きやすい職場認証", desc: "ドライバーが働きやすい環境づくりに取り組み、認証を取得しています。" },
            ].map((c, i) => (
              <AnimateIn key={c.title} delay={i * 80}>
                <div className="flex gap-4 p-6 bg-white border border-gray-100">
                  <CheckCircle className="w-5 h-5 text-[#1d4ed8] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-800 text-sm mb-1">{c.title}</div>
                    <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
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
