import { useEffect, useState, useContext } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import { SplashContext } from "@/lib/splash-context";
import heroTruck from "@assets/5029A6E0-F753-4C3C-9B97-E2826E325D91_1779426563754.webp";
import heroCold from "@assets/hero_warehouse_cold.webp";
import heroInterior from "@assets/hero_warehouse_interior.webp";
import heroAerial from "@assets/hero_aerial_logistics.webp";
import japanMapImg from "@assets/imageううう_1778610881804.webp";
import serviceImg01 from "@assets/BE3582A6-2E5C-49C7-8922-B23D966DDB2B_1779581062877.webp";
import serviceImg02 from "@assets/CD5B5D20-9501-48AD-AD3B-EDD91D28BA1F_1779426738532.webp";
import serviceImg03 from "@assets/0878E4B7-4446-434F-9882-22577A67DDBD_1779426777782.webp";
import serviceImg04 from "@assets/32441AFB-7881-4D18-AC34-2DBF80A87B7F_1779426843675.webp";
import serviceImg05 from "@assets/3591D69C-9B93-4472-B7C0-24217B55FC36_1779427030587.webp";
import serviceImg06 from "@assets/3EF77FFF-E87F-4925-A5AD-B58610F4588C_1779426911532.webp";
import serviceImg07 from "@assets/4EDD08B8-A65F-40A7-93F3-7F0D21C63C92_1779427089063.webp";
import serviceImg08 from "@assets/スクリーンショット_2026-05-22_14.19.00_1779427152403.webp";
import recruitImg1 from "@assets/3A3C76C0-4233-44A3-B457-22FF64E8AF06_1779427576892.webp";
import recruitImg2 from "@assets/BC6D7FFA-B15E-457A-8DC2-C1E0FA25B943_1779427576893.webp";
import recruitImg3 from "@assets/1F4EB5CB-29A3-47D1-9277-E1E76987A7B8_1779427576893.webp";
import recruitImg4 from "@assets/0A6767E5-1451-438C-B486-1782B1297F10_1779427576893.webp";
import recruitImg5 from "@assets/B30768FD-5A67-43D6-A365-9C50F0948EAC_1779427576893.webp";
import topicImg1 from "@assets/スクリーンショット_2026-05-13_2.44.31_1778607953004.webp";
import topicImg2 from "@assets/スクリーンショット_2026-05-13_2.44.44_1778607963000.webp";
import topicImg3 from "@assets/スクリーンショット_2026-05-13_2.44.54_1778607966295.webp";
import topicImg4 from "@assets/スクリーンショット_2026-05-13_2.45.03_1778607970643.webp";

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
    category: "物流コラム",
    date: "2026.05.06",
    title: "MOVE THE CITY｜街をつなぎ、未来を支える。現場から見える物流の今とこれから。",
    href: "/blog",
  },
];


function TypewriterHeading({ lines, active = false, startDelay = 400, speed = 90 }: { lines: string[]; active?: boolean; startDelay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState<string[]>(lines.map(() => ""));
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [active, startDelay]);

  useEffect(() => {
    if (!started || done) return;
    if (lineIdx >= lines.length) { setDone(true); return; }
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          next[lineIdx] = line.slice(0, charIdx + 1);
          return next;
        });
        setCharIdx(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, speed * 4);
      return () => clearTimeout(t);
    } else {
      setDone(true);
    }
  }, [started, done, lineIdx, charIdx, lines, speed]);

  return (
    <>
      {lines.map((_, i) => (
        <span key={i} style={{ display: "block", whiteSpace: "nowrap" }}>
          {displayed[i]}
          {!done && i === lineIdx && (
            <span className="tw-cursor" style={{ height: "0.85em" }} />
          )}
        </span>
      ))}
      {done && <span className="tw-cursor-done" style={{ height: "0.85em" }} />}
    </>
  );
}

export default function Home() {
  const splashDone = useContext(SplashContext);
  const hs = splashDone ? "hero-slide" : "opacity-0";

  useEffect(() => {
    trackPageView("/");
    setSeo({
      title: "株式会社池ノ谷商事｜神奈川・関東の物流・運送・倉庫会社",
      description: "株式会社池ノ谷商事は神奈川県愛川町を拠点に、一般貨物運送・倉庫管理・3PLを提供する総合物流企業です。荷主様の輸送コスト削減・物流効率化をワンストップで支援します。",
      path: "/",
      skipSuffix: true,
    });
  }, []);

  const { data: articles, isLoading: articlesLoading } = useQuery<any[]>({ queryKey: ["/api/articles"] });
  const realArticles = articles?.slice(0, 4) || [];
  const topicItems = realArticles.map((a: any) => ({ type: "article" as const, data: a }));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* HERO */}
      <section
        className="relative overflow-hidden mt-[100px]"
        style={{ height: "calc(100vh - 100px)", minHeight: 560 }}
      >
        {/* ── Full-bleed background image ── */}
        <img
          src={heroTruck}
          alt="イスズトラック 高速道路"
          className="hero-img-in absolute inset-0 w-full h-full object-cover hero-truck-img"
          style={{ animationDelay: "0ms" }}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />

        {/* ── White diagonal mask (desktop) ── */}
        <div
          className="hidden md:block absolute inset-0 z-10"
          style={{
            background: "white",
            clipPath: "polygon(0 0, 52% 0, 38% 100%, 0 100%)",
          }}
        />

        {/* ── White gradient fade (mobile) ── */}
        <div
          className="md:hidden absolute inset-0 z-10"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.92) 60%, rgba(255,255,255,0.5) 100%)" }}
        />

        {/* ── Text content ── */}
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="px-6 sm:px-10 lg:px-16 xl:px-24 w-[92%] sm:w-[62%] md:w-auto md:max-w-[42%]">
            <p
              className={`${hs} text-[12px] tracking-[0.35em] text-gray-400 mb-2`}
              style={{ animationDelay: "50ms" }}
            >
              Ikenoyashoji Co., Ltd.
            </p>
            <div className={`${hs} w-8 h-px bg-gray-300 mb-3`} style={{ animationDelay: "120ms" }} />
            <p
              className={`${hs} text-[12px] tracking-[0.28em] text-gray-400 mb-10 uppercase`}
              style={{ animationDelay: "170ms" }}
            >
              Since 2023
            </p>
            <h1
              className={`${hs} font-bold text-gray-900 leading-[1.15] mb-2`}
              style={{
                animationDelay: "260ms",
                fontFamily: "'Noto Serif JP', serif",
                fontSize: "clamp(1.8rem, 7vw, 5.8rem)",
              }}
            >
              <TypewriterHeading lines={["運ぶ信頼", "届ける真心"]} active={splashDone} startDelay={300} speed={140} />
            </h1>
            <div className={`${hs} w-8 h-px bg-gray-800 mb-9`} style={{ animationDelay: "370ms" }} />
            <div className={hs} style={{ animationDelay: "460ms" }}>
              <Link href="/about">
                <button
                  className="btn-curtain flex items-center gap-3 border border-gray-900 text-gray-900 font-medium px-7 py-3 text-sm tracking-widest bg-white transition-colors duration-300"
                  onClick={() => trackEvent("cta_quote_click", { location: "hero" })}
                  data-testid="button-hero-quote"
                >
                  池ノ谷商事について
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Circular rotating text (bottom-right) ── */}
        <div className="absolute top-7 right-8 z-30 w-32 h-32 hidden md:block">
          <svg viewBox="0 0 100 100" width="128" height="128">
            <defs>
              <path id="circle-path" d="M 50,50 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
              <filter id="text-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="rgba(0,0,0,0.7)" />
              </filter>
            </defs>
            <g className="rotate-circle">
              <text
                fontSize="8.4"
                letterSpacing="2.6"
                fill="rgba(255,255,255,1)"
                fontFamily="'Open Sans', sans-serif"
                fontWeight="600"
                filter="url(#text-shadow)"
              >
                <textPath href="#circle-path">
                  IKENOYASHOJI · IKENOYASHOJI · 
                </textPath>
              </text>
            </g>
          </svg>
        </div>

        {/* ── Subtle bottom fade ── */}
        <div className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(255,255,255,0.6), transparent)" }} />
      </section>

      {/* Marquee ticker */}
      <div className="overflow-hidden py-5 bg-white relative z-10">
        <div className="animate-marquee">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center gap-24 pr-24 whitespace-nowrap">
              {[...Array(8)].map((_, j) => (
                <span key={j} className="text-4xl font-bold italic text-gray-200 tracking-widest" style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic", color: "#c4c9d4" }}>Delivering Trust, Carrying Sincerity</span>
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
              <p className="text-gray-900 font-light text-2xl sm:text-4xl tracking-[0.1em] sm:tracking-[0.2em] mb-1">TOPICS</p>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
              <p className="text-gray-400 text-xs tracking-widest">最新トピックス</p>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {articlesLoading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="rounded-sm mb-3 bg-gray-100 aspect-[3/2]" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/3 mb-2" />
                    <div className="h-2.5 bg-gray-100 rounded w-full mb-1" />
                    <div className="h-2.5 bg-gray-100 rounded w-4/5" />
                  </div>
                ))
              : topicItems.map((item, i) => (
                  <AnimateIn key={`a-${item.data.id}`} direction="up" delay={i * 80}>
                    <Link href={`/blog/${item.data.slug}`}>
                      <div className="group cursor-pointer" data-testid={`card-topic-${i}`}>
                        <div className="overflow-hidden relative rounded-sm mb-3 bg-gray-100">
                          {item.data.imageUrl ? (
                            <img
                              src={item.data.imageUrl}
                              alt={item.data.title}
                              className="w-full h-auto block group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                const t = e.currentTarget;
                                t.style.display = "none";
                                const fb = t.nextElementSibling as HTMLElement;
                                if (fb) fb.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full aspect-[3/2] bg-gradient-to-br from-[#0f2044] to-[#1d4ed8] flex items-center justify-center"
                            style={{ display: item.data.imageUrl ? "none" : "flex" }}
                          >
                            <span className="text-white text-[10px] font-bold tracking-widest opacity-60">IKENOYA</span>
                          </div>
                          <span className="absolute top-2 left-2 bg-[#1d4ed8] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider">
                            {item.data.category || "物流コラム"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mb-1">
                          {item.data.publishedAt
                            ? new Date(item.data.publishedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, ".")
                            : new Date(item.data.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, ".")}
                        </p>
                        <h3 className="text-gray-700 text-xs leading-relaxed line-clamp-2 group-hover:text-[#1d4ed8] transition-colors">
                          {item.data.title}
                        </h3>
                      </div>
                    </Link>
                  </AnimateIn>
                ))
            }
          </div>
          {realArticles.length > 0 && (
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
              <p className="text-gray-900 font-light text-2xl sm:text-4xl tracking-[0.1em] sm:tracking-[0.2em] mb-1">COMPANY</p>
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
                  loading="lazy"
                  className="w-full h-auto object-contain"
                />
              </div>
            </AnimateIn>

            {/* Right: text + buttons */}
            <AnimateIn direction="right">
              <div className="pl-0 md:pl-8 mt-2 md:mt-0 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-snug">
                  全国へ広がる輸送ネットワーク
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  池ノ谷商事は関東一都六県を中心に<br />
                  全国の幹線輸送ネットワークと連携しながら<br />
                  物流サービスを提供する総合物流企業です。
                </p>
                <div className="flex gap-4 flex-wrap justify-center">
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
            <p className="text-gray-900 font-light text-2xl sm:text-4xl tracking-[0.1em] sm:tracking-[0.2em] mb-1">BUSINESS</p>
            <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
            <p className="text-gray-400 text-xs tracking-widest">事業紹介</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-stretch">
            {[
              { num: "01", title: "一般貨物自動車運送",           sub: "General Cargo Transport",      img: serviceImg01 },
              { num: "02", title: "貨物利用運送",                 sub: "Freight Forwarding",            img: serviceImg02 },
              { num: "03", title: "貨物軽自動車運送",             sub: "Light Cargo Transport",         img: serviceImg03 },
              { num: "04", title: "物流コンサルティング",         sub: "Logistics Consulting",          img: serviceImg04 },
              { num: "05", title: "3PL",                           sub: "3rd Party Logistics",            img: serviceImg05 },
              { num: "06", title: "総合保険代理店",               sub: "Insurance Agency",              img: serviceImg06 },
              { num: "07", title: "各種新車・中古車販売及び買取", sub: "Vehicle Sales & Purchase",      img: serviceImg07 },
              { num: "08", title: "一般整備・車検・板金・塗装・レッカー", sub: "Vehicle Maintenance & Repair", img: serviceImg08 },
            ].map((s, i) => (
              <AnimateIn key={i} delay={(i % 4) * 80} direction="up">
              <div className="border border-gray-100 hover:border-[#1a4b99] transition-colors flex flex-col group overflow-hidden h-full">
                <div className="w-full h-48 overflow-hidden flex-shrink-0">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                {/* Text content */}
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <div className="text-[#1d4ed8] text-xs font-medium tracking-widest">{s.num}</div>
                  <div className="w-6 h-0.5 bg-[#1d4ed8]" />
                  <h3 className="text-gray-900 font-bold text-sm leading-snug">{s.title}</h3>
                  <p className="text-gray-400 text-xs italic tracking-wide">{s.sub}</p>
                  <div className="pt-2 mt-auto">
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
          <p className="text-gray-900 font-light text-2xl sm:text-4xl tracking-[0.1em] sm:tracking-[0.2em] mb-1">RECRUIT</p>
          <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
          <p className="text-gray-400 text-xs tracking-widest">採用情報</p>
        </div>

        {/* Image slider strip */}
        <div className="overflow-hidden w-full mb-8">
          <div className="flex animate-recruit-slide" style={{ width: "max-content" }}>
            {[recruitImg1, recruitImg2, recruitImg3, recruitImg4, recruitImg5,
              recruitImg1, recruitImg2, recruitImg3, recruitImg4, recruitImg5,
              recruitImg1, recruitImg2, recruitImg3, recruitImg4, recruitImg5,
              recruitImg1, recruitImg2, recruitImg3, recruitImg4, recruitImg5].map((img, i) => (
              <div key={i} className="flex-shrink-0 h-64 w-44 overflow-hidden mr-3">
                <img src={img} alt={`recruit-${i}`} loading="lazy" className="w-full h-full object-cover object-top" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA button */}
        <div className="flex justify-end max-w-7xl mx-auto px-4 pb-16">
          <Link href="/recruit">
            <span className="btn-curtain flex items-center gap-3 border border-gray-900 text-gray-900 text-sm font-medium px-8 py-3" data-testid="link-recruit-detail">
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
                <span key={j} className="text-4xl font-bold italic text-gray-200 tracking-widest" style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: "italic", color: "#c4c9d4" }}>Delivering Trust, Carrying Sincerity</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
