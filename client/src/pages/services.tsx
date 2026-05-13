import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { ArrowRight, Truck, Warehouse, Network, BarChart3, Shield, Wrench } from "lucide-react";
import businessImg1 from "@assets/スクリーンショット_2026-05-13_3.51.29_1778611935867.png";
import businessImg2 from "@assets/スクリーンショット_2026-05-13_3.51.42_1778611939679.png";
import businessImg3 from "@assets/スクリーンショット_2026-05-13_3.51.51_1778611943375.png";

const services = [
  {
    num: "01",
    title: "一般貨物自動車運送業",
    sub: "General Cargo Transport",
    icon: Truck,
    img: businessImg1,
    desc: "関東圏を中心に、大型・中型・小型トラックを駆使した幹線輸送から地域配送まで、あらゆる物量・品種に対応します。定期便・スポット便いずれも柔軟にご対応。リアルタイムGPS追跡で安全・確実な輸送をお約束します。",
    points: ["定期便・スポット便対応", "リアルタイムGPS追跡", "大型〜軽貨物まで対応", "24時間365日受付"],
  },
  {
    num: "02",
    title: "倉庫管理・荷役作業",
    sub: "Warehouse & Cargo Handling",
    icon: Warehouse,
    img: businessImg2,
    desc: "愛川・厚木エリアの自社倉庫を活用した保管・管理サービス。入出庫管理から在庫管理システムの導入まで、お客様の物流センター機能を丸ごとサポートします。ピッキング・仕分け・梱包など荷役作業も一括対応。",
    points: ["入出庫・在庫管理", "ピッキング・仕分け・梱包", "温度管理対応倉庫", "WMS導入サポート"],
  },
  {
    num: "03",
    title: "３PL（サードパーティロジスティクス）",
    sub: "Third Party Logistics",
    icon: Network,
    img: businessImg3,
    desc: "輸送・保管・流通加工・情報管理を一括して請け負う3PLサービス。お客様の物流業務全体をアウトソーシングいただくことで、コア事業への集中と大幅なコスト削減を実現。サプライチェーン全体を最適化します。",
    points: ["物流業務の一括アウトソーシング", "サプライチェーン最適化", "コスト削減提案", "専任担当者によるサポート"],
  },
  {
    num: "04",
    title: "物流コンサルティング",
    sub: "Logistics Consulting",
    icon: BarChart3,
    img: businessImg1,
    desc: "現状の物流フローを診断し、コスト削減・効率化・品質向上のための最適解をご提案します。KPI設計から改善施策の実行支援まで、物流の専門家として伴走型でサポートします。",
    points: ["物流コスト診断・分析", "改善提案・実行支援", "KPI設計・モニタリング", "DX・自動化推進"],
  },
  {
    num: "05",
    title: "総合保険代理店",
    sub: "Insurance Agency",
    icon: Shield,
    img: businessImg2,
    desc: "運送保険・貨物保険をはじめ、企業向け各種損害保険・生命保険の代理店業務を行います。物流事業者ならではのリスク知識を活かし、最適な保険プランをご提案します。",
    points: ["運送保険・貨物保険", "企業向け損害保険", "生命保険・団体保険", "保険見直し・最適化提案"],
  },
  {
    num: "06",
    title: "車両販売・整備",
    sub: "Vehicle Sales & Maintenance",
    icon: Wrench,
    img: businessImg3,
    desc: "トラック・特殊車両の販売から定期整備・車検・修理まで対応。古物商許可を取得しており、中古車両の売買も行います。自社整備工場で迅速かつ低コストな車両メンテナンスを提供します。",
    points: ["新車・中古車両販売", "定期整備・車検・修理", "古物商（中古車売買）", "車両リース・レンタル"],
  },
];

const marqueeItems = [
  "一般貨物自動車運送業", "倉庫管理・荷役作業", "３PL", "物流コンサルティング", "総合保険代理店", "車両販売・整備",
  "一般貨物自動車運送業", "倉庫管理・荷役作業", "３PL", "物流コンサルティング", "総合保険代理店", "車両販売・整備",
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section
        className="mt-[100px] relative h-[340px] flex items-end pb-16 px-8 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f2044 0%, #1a4b99 60%, #1d4ed8 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.3) 39px,rgba(255,255,255,.3) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.3) 39px,rgba(255,255,255,.3) 40px)" }}
        />
        <div className="relative max-w-5xl mx-auto w-full">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-xs tracking-[0.5em] uppercase mb-3">IKENOYA SHOJI CO., LTD.</p>
            <h1 className="text-5xl font-extralight text-white tracking-[0.15em] mb-4">事業紹介</h1>
            <div className="w-12 h-0.5 bg-[#1d4ed8]" />
            <p className="text-gray-300 text-sm mt-4 tracking-wide">物流のプロとして、多角的なサービスで社会を支えます。</p>
          </AnimateIn>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-[#0f2044] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap" style={{ width: "max-content" }}>
          {marqueeItems.map((item, i) => (
            <span key={i} className="text-[10px] tracking-[0.4em] text-blue-300/60 uppercase mx-8">{item}</span>
          ))}
        </div>
      </div>

      {/* Intro */}
      <section className="py-20 bg-white px-8">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateIn>
            <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">OUR BUSINESS</p>
            <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">6つの事業領域</h2>
            <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-8" />
            <p className="text-gray-500 text-sm leading-relaxed">
              株式会社池ノ谷商事は、一般貨物運送を核として、倉庫管理・3PL・コンサルティング・保険・車両整備まで、<br className="hidden md:inline" />
              物流に関わるあらゆるニーズにワンストップで対応できる総合物流企業です。
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-24 px-8">
        <div className="max-w-5xl mx-auto space-y-0">
          {services.map((s, i) => {
            const Icon = s.icon;
            const isEven = i % 2 === 0;
            return (
              <AnimateIn key={s.num} delay={i * 60}>
                <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} border border-gray-100 mb-6 group overflow-hidden`}>
                  {/* Image */}
                  <div className="md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden flex-shrink-0">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {/* Text */}
                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[#1d4ed8] text-xs font-medium tracking-[0.3em]">{s.num}</span>
                      <div className="w-6 h-px bg-[#1d4ed8]" />
                      <Icon className="w-4 h-4 text-[#1d4ed8]" />
                    </div>
                    <h3 className="text-gray-900 font-bold text-xl mb-1 tracking-wide">{s.title}</h3>
                    <p className="text-gray-400 text-xs italic tracking-wide mb-4">{s.sub}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{s.desc}</p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="w-1 h-1 rounded-full bg-[#1d4ed8] flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact">
                      <button
                        className="inline-flex items-center gap-2 border border-[#1a4b99] text-[#1a4b99] hover:bg-[#1a4b99] hover:text-white px-6 py-3 text-xs tracking-widest transition-colors self-start"
                        data-testid={`button-service-contact-${s.num}`}
                      >
                        お問い合わせ <ArrowRight className="w-3 h-3" />
                      </button>
                    </Link>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </section>

      {/* Flow Section */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">FLOW</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">サービスの流れ</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-4 gap-0">
            {[
              { step: "01", title: "ご相談・ヒアリング", desc: "現状の物流課題やニーズを丁寧にヒアリングします。" },
              { step: "02", title: "プランご提案", desc: "最適なサービスとコストプランをご提案します。" },
              { step: "03", title: "ご契約・準備", desc: "詳細を調整し、スムーズな立ち上げを支援します。" },
              { step: "04", title: "サービス開始", desc: "専任担当が伴走し、継続的な改善を行います。" },
            ].map((f, i) => (
              <AnimateIn key={f.step} delay={i * 80}>
                <div className="relative bg-white border border-gray-100 p-7 flex flex-col gap-3">
                  {i < 3 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-4 h-4 border-t border-r border-gray-200 rotate-45 bg-white" />
                  )}
                  <span className="text-[#1d4ed8] text-2xl font-extralight tracking-widest">{f.step}</span>
                  <div className="w-6 h-0.5 bg-[#1d4ed8]" />
                  <h4 className="font-semibold text-gray-800 text-sm">{f.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f2044] text-center px-8">
        <AnimateIn>
          <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">CONTACT</p>
          <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-4">まずはお気軽にご相談ください</h2>
          <p className="text-gray-400 text-sm mb-10">物流に関するご質問・お見積もりは無料です。専任担当がご対応します。</p>
          <Link href="/contact">
            <button
              className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-12 py-4 text-sm tracking-widest transition-colors"
              data-testid="button-services-cta"
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
