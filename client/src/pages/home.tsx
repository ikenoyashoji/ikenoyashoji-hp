import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView, trackEvent } from "@/lib/analytics";
import { Mail, Phone, ArrowRight, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import heroBg from "@assets/imageああああ_1778609849549.png";
import japanMapImg from "@assets/imageううう_1778610881804.png";
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

const faqs = [
  { q: "急な輸送依頼にも対応できますか？", a: "はい、24時間365日体制で対応しております。当日のご依頼でも、空き車両がある場合は即対応いたします。まずはお電話またはフォームでご相談ください。" },
  { q: "どのような荷物でも対応できますか？", a: "一般貨物から精密機器、危険物（要確認）、大型貨物まで幅広く対応しております。特殊な荷物については事前にお打ち合わせの上、最適な輸送方法をご提案します。" },
  { q: "料金体系はどのようになっていますか？", a: "距離・荷物の大きさ・重量・時間帯・車両種別によって料金が異なります。定期契約では大幅なコストダウンも可能です。まずは無料見積もりをご依頼ください。" },
  { q: "対応エリアを教えてください。", a: "関東一都六県（東京・神奈川・千葉・埼玉・茨城・栃木・群馬）を主な営業エリアとしており、全国の幹線輸送も対応しております。" },
  { q: "見積もりはどのくらいの時間で出てもらえますか？", a: "お問い合わせいただいた後、通常30分以内にお見積もりをご提示しております。複雑な案件でも最大2時間以内を目標にしています。" },
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
      <section className="pt-10 pb-20 bg-white px-4 overflow-hidden">
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
      <section className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-10">
              <p className="text-gray-900 font-light text-4xl tracking-[0.2em] mb-1">BUSINESS</p>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto mb-1" />
              <p className="text-gray-400 text-xs tracking-widest">事業紹介</p>
            </div>
          </AnimateIn>

          <AnimateIn direction="up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: "01",
                  title: "定期輸送・スポット輸送",
                  sub: "Local Freight",
                  desc: "専任ドライバーによる安全・確実な輸送で、大切なお荷物を目的地まで丁寧にお届けします。",
                },
                {
                  num: "02",
                  title: "チャーター・幹線輸送",
                  sub: "Charter & Trunk",
                  desc: "重量物や取扱注意製品にも対応した輸送体制で、長年培った技術とノウハウを発揮しています。",
                },
                {
                  num: "03",
                  title: "構内作業・特殊輸送",
                  sub: "On-site Work",
                  desc: "工場内で製造補助から環境整備まで、さまざまな業務を柔軟かつ丁寧に対応します。",
                },
              ].map((s, i) => (
                <AnimateIn key={i} direction="up" delay={i * 80}>
                  <div className="border border-gray-100 hover:border-[#1a4b99] transition-colors p-8 flex flex-col gap-3 group">
                    <div className="text-[#1d4ed8] text-xs font-medium tracking-widest">{`0${s.num.replace("0","")}`}</div>
                    <div className="w-6 h-0.5 bg-[#1d4ed8]" />
                    <h3 className="text-gray-900 font-bold text-lg leading-snug">{s.title}</h3>
                    <p className="text-gray-400 text-xs italic tracking-wide">{s.sub}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                    <div className="mt-auto pt-4">
                      <Link href="/#services">
                        <span className="text-[#1a4b99] text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          詳しく見る <ArrowRight className="w-3 h-3" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* About section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateIn direction="up" className="grid grid-cols-3 gap-3 mb-16">
            {[
              { label: "構内作業", gradient: "from-gray-600 to-gray-800" },
              { label: "輸送", gradient: "from-gray-700 to-gray-900" },
              { label: "積み込み", gradient: "from-gray-500 to-gray-700" },
            ].map((item, i) => (
              <div key={i} className={`aspect-[4/3] bg-gradient-to-br ${item.gradient} rounded-lg flex items-end p-3 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)" }} />
                <span className="text-white/60 text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimateIn direction="left">
              <div className="mb-4">
                <span className="text-[#1d4ed8] font-black text-4xl italic font-serif">About Us</span>
                <p className="text-gray-400 text-sm mt-1">私たちについて</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-snug">
                現場に根ざし、信頼に応える。
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                池ノ谷商事は、関東に根ざした運輸・構内作業のプロフェッショナル集団。安全・確実・丁寧な業務を一つひとつ積み重ねてきました。
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                創業以来15年、地域社会とともに歩みながら、お客様との信頼関係を丁寧に築いてきた歴史があります。これからも、誠実な姿勢で現場に向き合い、確かな仕事を積み重ねてまいります。
              </p>
              <Link href="/company">
                <button className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm" data-testid="button-about-more">
                  View More.
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </AnimateIn>
            <AnimateIn direction="right">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-400 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-black opacity-20 italic">誠実に</div>
                    <div className="text-6xl font-black opacity-20 italic">まっすぐに。</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700/60 to-gray-900/60" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium leading-relaxed">誠実に、まっすぐに。<br />地域に根ざし、信頼を育んできました。</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Marquee / blue band */}
      <div className="bg-gradient-to-r from-[#1a4b99] to-[#1d4ed8] py-6 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-4xl md:text-5xl font-black italic text-white/20 mr-16 tracking-tight flex-shrink-0">
              everyday work. Global impact. &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Service section */}
      <section id="services" className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateIn direction="up">
            <div className="mb-12">
              <span className="text-[#1d4ed8] font-black text-4xl italic font-serif">Service</span>
              <p className="text-gray-400 text-sm mt-1">サービスのご案内</p>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                現場を支える、確かな技術と人の力。
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
                私たちは、多岐にわたる物流ニーズに安全・確実に対応しています。<br />
                それぞれの現場に合わせた技術と気配りで、信頼される仕事を続けています。
              </p>
            </div>
          </AnimateIn>

          <AnimateIn direction="up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 relative rounded-lg overflow-hidden" style={{ minHeight: 320 }}>
              {[
                { num: "01", title: "定期輸送・スポット輸送", sub: "Local Freight", desc: "専任ドライバーによる安全・確実な輸送で、大切なお荷物を目的地まで丁寧にお届けします。", gradient: "from-gray-800 to-gray-900" },
                { num: "02", title: "チャーター・幹線輸送", sub: "Charter & Trunk", desc: "重量物や取扱注意製品にも対応した輸送体制で、長年培った技術とノウハウを発揮しています。", gradient: "from-gray-700 to-gray-800" },
                { num: "03", title: "構内作業・特殊輸送", sub: "On-site Work", desc: "工場内で製造補助から環境整備まで、さまざまな業務を柔軟かつ丁寧に対応します。", gradient: "from-gray-900 to-gray-700" },
              ].map((s, i) => (
                <div key={i} className={`relative bg-gradient-to-br ${s.gradient} p-6 flex flex-col justify-end min-h-64`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)" }} />
                  {i > 0 && <div className="absolute inset-y-0 left-0 w-px bg-white/10" />}
                  <div className="relative z-10">
                    <div className="text-white/40 text-xs font-medium mb-2">Service {s.num.padStart(2, "0")}</div>
                    <h3 className="text-white font-bold text-lg mb-1">{s.title}</h3>
                    <div className="text-white/40 text-xs italic mb-3">{s.sub}</div>
                    <p className="text-gray-300 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn direction="up" delay={200}>
            <div className="mt-4 relative rounded-lg overflow-hidden bg-gray-800" style={{ minHeight: 300 }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 51px)" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent" />
              <div className="relative z-10 p-8 flex flex-col justify-end h-full" style={{ minHeight: 300 }}>
                <p className="text-white text-2xl font-bold mb-2">安全・確実・丁寧な業務を一つひとつ積み重ねてきました。</p>
                <Link href="/contact">
                  <button className="mt-4 flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm w-fit" data-testid="button-service-more">
                    View More.
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Recruit section */}
      <section className="py-20 bg-blue-50/40 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateIn direction="up">
            <div className="grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden">
              <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 min-h-80 flex items-end">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 16px)" }} />
                <div className="relative p-6 grid grid-cols-2 gap-2 w-full">
                  <div className="aspect-square bg-gray-600/60 rounded" />
                  <div className="aspect-square bg-gray-500/60 rounded" />
                </div>
              </div>
              <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">Recruit</span>
                  <p className="text-gray-400 text-sm mt-1">採用情報</p>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#1a4b99] mb-4 leading-snug">
                  支える仕事には、<br />
                  静かな誇りと、<br />
                  世界を動かす力がある。
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  池ノ谷商事が担うのは、製品輸送や構内作業といった、一見すると目立たないけれど、現場に欠かせない仕事です。誠実に、まっすぐに。現場を支える一員として、一緒に働いてみませんか。
                </p>
                <Link href="/recruit">
                  <button className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm w-fit" data-testid="button-recruit-more">
                    View More.
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-20 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimateIn direction="up">
            <div className="grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden">
              <div className="relative bg-gradient-to-br from-[#1a4b99] to-[#1d4ed8] min-h-72 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 16px)" }} />
                <div className="relative text-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mx-auto">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-snug">
                  現場の声に、まっすぐ応えます。
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  輸送についてのご相談は、どうぞお気軽に。<br />
                  お電話・お問い合わせフォーム、どちらからでも承ります。
                </p>
                <a
                  href="tel:0312345678"
                  className="text-[#1d4ed8] font-bold text-2xl flex items-center gap-2 mb-4 hover:text-[#1e3a8a] transition-colors"
                  onClick={() => trackEvent("tel_click", { location: "home_contact" })}
                  data-testid="link-tel-home"
                >
                  <Phone className="w-5 h-5" />
                  03-1234-5678
                </a>
                <Link href="/contact">
                  <button
                    className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm w-fit"
                    onClick={() => trackEvent("cta_contact_click", { location: "home_contact" })}
                    data-testid="button-contact-home"
                  >
                    <Mail className="w-4 h-4" />
                    お問い合わせはこちら
                  </button>
                </Link>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-12">
              <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">FAQ</span>
              <p className="text-gray-400 text-sm mt-2">よくあるご質問</p>
            </div>
          </AnimateIn>
          <AnimateIn direction="up" delay={100}>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-white border border-gray-200 rounded-lg px-5" data-testid={`faq-item-${i}`}>
                  <AccordionTrigger className="text-gray-800 font-semibold text-sm text-left py-4">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-gray-500 text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimateIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
