import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { ArrowRight, Truck, Warehouse, Network, BarChart3, Shield, Wrench } from "lucide-react";
import heroImg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.png";
import serviceImg01 from "@assets/4A8E31BC-A53B-4581-BFDB-808A56C9285B_1779426681105.PNG";
import serviceImg02 from "@assets/CD5B5D20-9501-48AD-AD3B-EDD91D28BA1F_1779426738532.PNG";
import serviceImg03 from "@assets/0878E4B7-4446-434F-9882-22577A67DDBD_1779426777782.PNG";
import serviceImg04 from "@assets/32441AFB-7881-4D18-AC34-2DBF80A87B7F_1779426843675.PNG";
import serviceImg05 from "@assets/3591D69C-9B93-4472-B7C0-24217B55FC36_1779427030587.PNG";
import serviceImg06 from "@assets/3EF77FFF-E87F-4925-A5AD-B58610F4588C_1779426911532.PNG";
import serviceImg07 from "@assets/4EDD08B8-A65F-40A7-93F3-7F0D21C63C92_1779427089063.PNG";
import serviceImg08 from "@assets/スクリーンショット_2026-05-22_14.19.00_1779427152403.png";

const services = [
  {
    num: "01",
    title: "一般貨物自動車運送",
    sub: "General Cargo Transport",
    icon: Truck,
    img: serviceImg01,
    desc: "関東圏を中心に、大型・中型・小型トラックを駆使した幹線輸送から地域配送まで、あらゆる物量・品種に対応します。定期便・スポット便いずれも柔軟にご対応し、安全・確実な輸送をお約束します。",
    points: ["定期便・スポット便対応", "大型〜小型トラック対応", "24時間365日受付"],
  },
  {
    num: "02",
    title: "貨物利用運送",
    sub: "Freight Forwarding",
    icon: Network,
    img: serviceImg02,
    desc: "全国ネットワークで繋がる提携運送事業者のトラックを活用し、自社対応エリア外や繁忙期の輸送ニーズにも柔軟にお応えします。スポット対応から定期輸送まで、幅広い物流課題をサポートします。",
    points: ["全国ネットワーク対応", "トラック利用運送", "スポット・定期対応", "繁忙期・エリア外カバー"],
  },
  {
    num: "03",
    title: "貨物軽自動車運送",
    sub: "Light Cargo Transport",
    icon: Truck,
    img: serviceImg03,
    desc: "軽バン・軽トラックを活用した小口・ラストワンマイル配送に特化したサービス。狭小地・住宅地への配送や急ぎのスポット対応も迅速に承ります。",
    points: ["小口・宅配便対応", "ラストワンマイル配送", "スポット・急ぎ対応", "住宅地・狭小地対応"],
  },
  {
    num: "04",
    title: "物流コンサルティング",
    sub: "Logistics Consulting",
    icon: BarChart3,
    img: serviceImg04,
    desc: "現状の物流フローを診断し、コスト削減・効率化・品質向上のための最適解をご提案します。KPI設計から改善施策の実行支援まで、物流の専門家として伴走型でサポートします。",
    points: ["物流コスト診断・分析", "改善提案・実行支援", "KPI設計・モニタリング", "DX・自動化推進"],
  },
  {
    num: "05",
    title: "倉庫管理",
    sub: "Warehouse Management",
    icon: Warehouse,
    img: serviceImg05,
    desc: "愛川・厚木エリアの自社倉庫を活用した保管・管理サービス。入出庫管理から在庫管理システムの導入まで、お客様の物流センター機能を丸ごとサポートします。ピッキング・仕分け・梱包など荷役作業も一括対応。",
    points: ["入出庫・在庫管理", "ピッキング・仕分け・梱包", "温度管理対応倉庫", "WMS導入サポート"],
  },
  {
    num: "06",
    title: "総合保険代理店",
    sub: "Insurance Agency",
    icon: Shield,
    img: serviceImg06,
    desc: "運送保険・貨物保険をはじめ、企業向け各種損害保険・生命保険の代理店業務を行います。物流事業者ならではのリスク知識を活かし、最適な保険プランをご提案します。",
    points: ["運送保険・貨物保険", "企業向け損害保険", "生命保険・団体保険", "保険見直し・最適化提案"],
  },
  {
    num: "07",
    title: "各種新車・中古車販売及び買取",
    sub: "Vehicle Sales & Purchase",
    icon: Truck,
    img: serviceImg07,
    desc: "トラック・乗用車・特殊車両など各種新車・中古車の販売および買取を行います。古物商許可を取得しており、適正価格での売買をサポートします。在庫車両も豊富に取り揃えております。",
    points: ["各種新車・中古車販売", "車両買取", "古物商許可取得済", "豊富な在庫車両"],
  },
  {
    num: "08",
    title: "一般整備・車検・板金・塗装・レッカー",
    sub: "Vehicle Maintenance & Repair",
    icon: Wrench,
    img: serviceImg08,
    desc: "自社整備工場による一般整備・車検・板金・塗装・レッカー牽引まで、車両に関するあらゆるサービスをワンストップで提供。迅速かつ丁寧な対応でお客様の車両を万全に保ちます。",
    points: ["一般整備・車検", "板金・塗装", "レッカー牽引", "自社整備工場"],
  },
];

function useCountUp(target: number, duration = 1200) {
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

function StatItem({ num, unit, label, delay }: { num: number; unit: string; label: string; delay: number }) {
  const { count, ref } = useCountUp(num, 1400);
  return (
    <AnimateIn delay={delay}>
      <div ref={ref} className="text-center px-6 py-2">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl md:text-4xl font-extralight text-white tracking-tight tabular-nums">
            {count}{unit === "台" && num === 120 ? "+" : ""}
          </span>
          <span className="text-[#7eb3ff] text-sm">{unit}</span>
        </div>
        <p className="text-[9px] tracking-[0.4em] text-gray-500 mt-1">{label}</p>
      </div>
    </AnimateIn>
  );
}

const marqueeItems = [
  "一般貨物自動車運送", "貨物利用運送", "貨物軽自動車運送", "物流コンサルティング", "倉庫管理", "総合保険代理店", "各種新車・中古車販売及び買取", "一般整備・車検・板金・塗装・レッカー",
  "一般貨物自動車運送", "貨物利用運送", "貨物軽自動車運送", "物流コンサルティング", "倉庫管理", "総合保険代理店", "各種新車・中古車販売及び買取", "一般整備・車検・板金・塗装・レッカー",
];

export default function Services() {
  useEffect(() => {
    trackPageView("/services");
    setSeo({
      title: "事業紹介｜運送・倉庫・3PL・保険・車両",
      description: "株式会社池ノ谷商事の6つの事業：一般貨物運送・倉庫管理・3PL・物流コンサルティング・総合保険代理店・車両販売整備。神奈川県から関東圏全域の物流をワンストップで対応します。",
      path: "/services",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="mt-[100px] relative overflow-hidden">
        <img src={heroImg} alt="事業紹介" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 flex items-center justify-center"><div className="max-w-5xl mx-auto w-full text-center px-8">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] mb-4">Ikenoyashoji Co.,Ltd.</p>
            <h1 className="hero-title text-2xl sm:text-4xl md:text-6xl font-extralight text-white tracking-[0.08em] sm:tracking-[0.15em] mb-6">事業紹介</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
          </AnimateIn>
        </div></div>
      </section>



      {/* Intro */}
      <section className="py-20 bg-white px-8">
        <div className="max-w-3xl mx-auto text-center">
          <AnimateIn>
            <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">OUR BUSINESS</p>
            <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">事業紹介</h2>
            <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-8" />
            <p className="text-gray-500 text-sm leading-relaxed">
              株式会社池ノ谷商事は、一般貨物運送を核として、倉庫管理・物流コンサルティング・保険・車両販売整備まで、<br className="hidden md:inline" />
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
                  <div className="md:w-2/5 flex-shrink-0 overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.title}
                      className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
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
              <h2 className="text-2xl sm:text-4xl font-light text-gray-900 tracking-[0.1em] sm:tracking-[0.2em] mb-4">サービスの流れ</h2>
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
      <section className="py-10 sm:py-20 bg-[#0f2044] text-center px-4 sm:px-8">
        <AnimateIn>
          <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-3">CONTACT</p>
          <h2 className="text-xl sm:text-3xl font-light text-white tracking-[0.05em] sm:tracking-[0.2em] mb-3 sm:mb-4">まずはお気軽にご相談ください</h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-10">物流に関するご質問・お見積もりは無料です。専任担当がご対応します。</p>
          <Link href="/contact">
            <button
              className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-8 py-3 sm:px-12 sm:py-4 text-sm tracking-widest transition-colors"
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
