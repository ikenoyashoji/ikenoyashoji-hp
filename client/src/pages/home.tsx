import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { ArrowRight } from "lucide-react";
import heroBg from "@assets/imageああああ_1778609849549.png";
import japanMapImg from "@assets/imageううう_1778610881804.png";
import businessImg1 from "@assets/スクリーンショット_2026-05-13_3.51.29_1778611935867.png";
import businessImg2 from "@assets/スクリーンショット_2026-05-13_3.51.42_1778611939679.png";
import businessImg3 from "@assets/スクリーンショット_2026-05-13_3.51.51_1778611943375.png";
import recruitImg1 from "@assets/スクリーンショット_2026-05-13_4.02.02_1778612566803.png";
import recruitImg2 from "@assets/スクリーンショット_2026-05-13_4.02.12_1778612566804.png";
import recruitImg3 from "@assets/スクリーンショット_2026-05-13_4.02.22_1778612566811.png";
import recruitImg4 from "@assets/スクリーンショット_2026-05-13_4.04.03_1778612674400.png";
import recruitImg5 from "@assets/スクリーンショット_2026-05-13_4.04.12_1778612674403.png";
import recruitImg6 from "@assets/スクリーンショット_2026-05-13_4.04.20_1778612674407.png";
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
    document.title = "株式会社池ノ谷商事｜関東圏の物流・輸送サービス";
  }, []);

  const { data: articles } = useQuery<any[]>({ queryKey: ["/api/articles"] });
  const latestArticles = articles?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Marquee ticker — above hero */}
      <div className="overflow-hidden py-5 bg-white border-b border-gray-100 mt-[100px]">
        <div className="animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-24 pr-24 whitespace-nowrap">
              {[...Array(8)].map((_, j) => (
                <span key={j} className="text-4xl font-bold italic text-gray-200 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Ikenoya Shoji Co,Ltd.</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="relative bg-white overflow-hidden" style={{ maxHeight: "calc(100vh - 150px)" }}>
        <img
          src={heroBg}
          alt="運ぶ信頼、届ける真心 — 株式会社池ノ谷商事"
          className="w-full h-full object-cover object-top block"
        />
        <div className="absolute inset-0 flex items-end pb-10 px-6 lg:px-16">
          <Link href="/company">
            <button
              className="flex items-center gap-3 border border-gray-900 text-gray-900 hover:bg-[#1d4ed8] hover:border-[#1d4ed8] hover:text-white font-medium px-8 py-3 transition-colors text-sm tracking-wide bg-white"
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
                <span key={j} className="text-4xl font-bold italic text-gray-200 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Ikenoya Shoji Co,Ltd.</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* TOPICS section */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-10">
              <p className="text-gray-900 font-light text-4xl tracking-[0.2em] mb-1">TOPICS</p>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
              <p className="text-gray-400 text-xs tracking-widest">最新トピックス</p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-4 gap-5">
            {staticTopics.map((t, i) => (
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
              <div className="pl-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                  関東を拠点に、<br />全国へ広がる輸送ネットワーク
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  池ノ谷商事は関東一都六県を中心に、<br />
                  全国の幹線輸送ネットワークと連携しながら<br />
                  確かな物流サービスを提供する総合物流企業です。
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "一般貨物自動車運送業", sub: "General Cargo Transport", img: businessImg1 },
              { num: "02", title: "倉庫管理・荷役作業",   sub: "Warehouse Management",   img: businessImg2 },
              { num: "03", title: "３PL",                  sub: "Third Party Logistics",  img: businessImg3 },
            ].map((s, i) => (
              <div key={i} className="border border-gray-100 hover:border-[#1a4b99] transition-colors flex flex-col group overflow-hidden">
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
                    <Link href="/contact">
                      <span className="text-[#1a4b99] text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        詳しく見る <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
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
                <span key={j} className="text-4xl font-bold italic text-gray-200 tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>Ikenoya Shoji Co,Ltd.</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
