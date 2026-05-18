import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import heroBg from "@assets/imageああああ_1778609849549.png";
import japanMapImg from "@assets/imageううう_1778610881804.png";
import serviceImg01 from "@assets/service_01_general_cargo.png";
import serviceImg02 from "@assets/service_02_freight_forwarding.png";
import serviceImg03 from "@assets/service_03_light_cargo.png";
import serviceImg04 from "@assets/service_04_consulting.png";
import serviceImg05 from "@assets/service_05_warehouse.png";
import serviceImg06 from "@assets/service_06_insurance.png";
import serviceImg07 from "@assets/service_07_vehicle_sales.png";
import serviceImg08 from "@assets/service_08_maintenance.png";
import recruitImg1 from "@assets/recruit_01_driver_cab.png";
import recruitImg2 from "@assets/recruit_02_coordinator_warehouse.png";
import recruitImg3 from "@assets/recruit_03_delivery_street.png";
import recruitImg4 from "@assets/recruit_04_office_worker.png";
import recruitImg5 from "@assets/recruit_05_mechanics_team.png";
import recruitImg6 from "@assets/recruit_06_senior_outdoor.png";
import topicImg1 from "@assets/スクリーンショット_2026-05-13_2.44.31_1778607953004.png";
import topicImg2 from "@assets/スクリーンショット_2026-05-13_2.44.44_1778607963000.png";
import topicImg3 from "@assets/スクリーンショット_2026-05-13_2.44.54_1778607966295.png";
import topicImg4 from "@assets/スクリーンショット_2026-05-13_2.45.03_1778607970643.png";

const staticTopics = [
  {
    img: topicImg1,
    category: "採用情報",
    date: "2026.05.12",
    title: "WORK STYLE｜ドライバーのリアルな働き方と想いをお届けします。",
    href: "/recruit",
  },
  {
    img: topicImg2,
    category: "物流コラム",
    date: "2026.05.10",
    title: "物流の裏側｜現場の工夫や課題解決の取り組みを発信します。",
    href: "/blog",
  },
  {
    img: topicImg3,
    category: "採用情報",
    date: "2026.05.08",
    title: "人を大切にする会社 池ノ谷商事の魅力｜女性スタッフも多数活躍中！",
    href: "/recruit",
  },
  {
    img: topicImg4,
    category: "BLOG",
    date: "2026.05.06",
    title: "MOVE THE CITY｜街をつなぎ、未来を支える。現場から見える物流の今とこれから。",
    href: "/blog",
  },
];


export default function Home() {
  useEffect(() => {
    trackPageView("/");
    setSeo({
      title: "神奈川・関東の物流・運送・倉庫会社",
      description: "株式会社池ノ谷商事は神奈川県愛川町を拠点に、一般貨物運送・倉庫管理・3PLを提供する総合物流企業です。荷主様の輸送コスト削減・物流効率化をワンストップで支援します。",
      path: "/",
    });
  }, []);

  const { data: articles } = useQuery<any[]>({ queryKey: ["/api/articles"] });
  const latestArticles = articles?.slice(0, 4) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* HERO */}
      <section className="relative bg-white overflow-hidden mt-[100px]">
        <img
          src={heroBg}
          alt="運ぶ信頼、届ける真心 — 株式会社池ノ谷商事"
          className="w-full h-auto md:h-[calc(100vh-100px)] md:object-cover md:object-top block"
        />
        <div className="absolute inset-0 flex items-end pb-6 sm:pb-10 px-4 sm:px-6 lg:px-16">
          <Link href="/about">
            <button
              className="flex items-center gap-3 border border-gray-900 text-gray-900 hover:bg-[#1d4ed8] hover:border-[#1d4ed8] hover:text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 transition-colors text-sm tracking-wide bg-white"
              onClick={() => trackEvent("cta_quote_click", { location: "hero" })}
              data-testid="button-hero-quote"
            >
              池ノ谷商事について
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Marquee ticker */}
      <div className="overflow-hidden py-5 bg-white relative z-10">
        <div className="animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-24 pr-24 whitespace-nowrap">
              {[...Array(8)].map((_, j) => (
                <span key={j} className="text-4xl font-bold italic text-gray-200 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Ikenoya Shoji Co.,Ltd.</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* TOPICS section */}
      <section className="py-10 md:py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-10">
              <p className="text-gray-900 font-light text-4xl tracking-[0.2em] mb-1">TOPICS</p>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
              <p className="text-gray-400 text-xs tracking-widest">最新トピックス</p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {latestArticles.length > 0
              ? latestArticles.map((article: any, i: number) => (
                  <AnimateIn key={article.id} direction="up" delay={i * 80}>
                    <Link href={`/blog/${article.slug}`}>
                      <div className="group cursor-pointer" data-testid={`card-topic-${i}`}>
                        <div className="aspect-[4/3] overflow-hidden relative rounded-sm mb-3 bg-gray-100">
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#0f2044] to-[#1d4ed8] flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold tracking-widest opacity-60">IKENOYA</span>
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-[#1d4ed8] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider">
                            {article.category || "物流コラム"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-1">
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, ".")
                            : new Date(article.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, ".")}
                        </p>
                        <h3 className="text-gray-700 text-xs leading-relaxed line-clamp-2 group-hover:text-[#1d4ed8] transition-colors">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  </AnimateIn>
                ))
              : staticTopics.map((t, i) => (
                  <AnimateIn key={i} direction="up" delay={i * 80}>
                    <Link href={t.href}>
                      <div className="group cursor-pointer" data-testid={`card-topic-${i}`}>
                        <div className="aspect-[4/3] overflow-hidden relative rounded-sm mb-3 bg-gray-100">
                          <img
                            src={t.img}
                            alt={t.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 bg-[#1d4ed8] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider">
                            {t.category}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-1">{t.date}</p>
                        <h3 className="text-gray-700 text-xs leading-relaxed line-clamp-2 group-hover:text-[#1d4ed8] transition-colors">
                          {t.title}
                        </h3>
                      </div>
                    </Link>
                  </AnimateIn>
                ))}
          </div>
          {latestArticles.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/blog">
                <button className="border border-gray-300 text-gray-600 hover:border-[#1d4ed8] hover:text-[#1d4ed8] text-xs px-8 py-2.5 transition-colors tracking-widest">
                  記事をもっと見る
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* COMPANY section */}
      <section className="pt-10 pb-6 bg-white px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-10">
              <p className="text-gray-900 font-light text-4xl tracking-[0.2em] mb-1">COMPANY</p>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
              <p className="text-gray-400 text-xs tracking-widest">企業・拠点情報</p>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-0 items-center">
            {/* Left: Japan map image */}
            <AnimateIn direction="left">
              <div className="flex items-center justify-center py-4">
                <img
                  src={japanMapImg}
                  alt="全国配送ネットワーク地図"
                  className="w-full h-auto object-contain"
                />
              </div>
            </AnimateIn>

            {/* Right: text + buttons */}
            <AnimateIn direction="right">
              <div className="pl-0 md:pl-8 mt-2 md:mt-0">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                  全国へ広がる輸送ネットワーク
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  池ノ谷商事は関東一都六県を中心に<br />
                  全国の幹線輸送ネットワークと連携しながら<br />
                  物流サービスを提供する総合物流企業です。
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Link href="/company">
                    <button className="flex items-center gap-4 border border-gray-300 text-gray-700 hover:border-[#1a4b99] hover:text-[#1a4b99] px-6 py-3 text-sm transition-colors" data-testid="button-company-info">
                      企業情報
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/company">
                    <button className="flex items-center gap-4 border border-gray-300 text-gray-700 hover:border-[#1a4b99] hover:text-[#1a4b99] px-6 py-3 text-sm transition-colors" data-testid="button-company-base">
                      拠点情報
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* BUSINESS section */}
      <section className="pt-2 pb-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gray-900 font-light text-4xl tracking-[0.2em] mb-1">BUSINESS</p>
            <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
            <p className="text-gray-400 text-xs tracking-widest">事業紹介</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "01", title: "一般貨物自動車運送",           sub: "General Cargo Transport",      img: serviceImg01 },
              { num: "02", title: "貨物利用運送",                 sub: "Freight Forwarding",            img: serviceImg02 },
              { num: "03", title: "貨物軽自動車運送",             sub: "Light Cargo Transport",         img: serviceImg03 },
              { num: "04", title: "物流コンサルティング",         sub: "Logistics Consulting",          img: serviceImg04 },
              { num: "05", title: "倉庫管理",                     sub: "Warehouse Management",          img: serviceImg05 },
              { num: "06", title: "総合保険代理店",               sub: "Insurance Agency",              img: serviceImg06 },
              { num: "07", title: "各種新車・中古車販売及び買取", sub: "Vehicle Sales & Purchase",      img: serviceImg07 },
              { num: "08", title: "一般整備・車検・板金・塗装・レッカー", sub: "Vehicle Maintenance & Repair", img: serviceImg08 },
            ].map((s, i) => (
              <AnimateIn key={i} delay={(i % 4) * 80} direction="up">
              <div className="border border-gray-100 hover:border-[#1a4b99] transition-colors flex flex-col group overflow-hidden">
                <div className="w-full aspect-[16/9] overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                {/* Text content */}
                <div className="p-8 flex flex-col gap-3">
                  <div className="text-[#1d4ed8] text-xs font-medium tracking-widest">{s.num}</div>
                  <div className="w-6 h-0.5 bg-[#1d4ed8]" />
                  <h3 className="text-gray-900 font-bold text-lg leading-snug">{s.title}</h3>
                  <p className="text-gray-400 text-xs italic tracking-wide">{s.sub}</p>
                  <div className="pt-2">
                    <Link href="/services">
                      <span className="text-[#1a4b99] text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        詳しく見る <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* RECRUIT section */}
      <section className="pt-6 pb-0 bg-white">
        {/* Heading */}
        <div className="text-center mb-8 px-4">
          <p className="text-gray-900 font-light text-4xl tracking-[0.2em] mb-1">RECRUIT</p>
          <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
          <p className="text-gray-400 text-xs tracking-widest">採用情報</p>
        </div>

        {/* Image slider strip */}
        <div className="overflow-hidden w-full mb-8">
          <div className="flex animate-recruit-slide" style={{ width: "max-content" }}>
            {[recruitImg1, recruitImg2, recruitImg3, recruitImg4, recruitImg5, recruitImg6,
              recruitImg1, recruitImg2, recruitImg3, recruitImg4, recruitImg5, recruitImg6].map((img, i) => (
              <div key={i} className="flex-shrink-0 h-72 w-52 overflow-hidden border-r-2 border-white">
                <img src={img} alt={`recruit-${i}`} className="w-full h-full object-cover object-top" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA button */}
        <div className="flex justify-end max-w-7xl mx-auto px-4 pb-16">
          <Link href="/recruit">
            <span className="flex items-center gap-3 border border-gray-900 text-gray-900 text-sm font-medium px-8 py-3 hover:bg-[#1d4ed8] hover:border-[#1d4ed8] hover:text-white transition-colors" data-testid="link-recruit-detail">
              詳しく見る <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Marquee ticker — below RECRUIT */}
      <div className="overflow-hidden py-5 bg-white border-b border-gray-100">
        <div className="animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-24 pr-24 whitespace-nowrap">
              {[...Array(8)].map((_, j) => (
                <span key={j} className="text-4xl font-bold italic text-gray-200 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Ikenoya Shoji Co.,Ltd.</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
