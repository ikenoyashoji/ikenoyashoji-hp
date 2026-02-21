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
    document.title = "アクロス物流株式会社｜関東圏の物流・輸送サービス";
  }, []);

  const { data: articles } = useQuery<any[]>({ queryKey: ["/api/articles"] });
  const latestArticles = articles?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center pt-16 overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)" }} />
        </div>
        <div className="absolute bottom-8 left-4 right-4 pointer-events-none select-none">
          <p className="text-6xl md:text-8xl lg:text-9xl font-black italic text-white/[0.07] whitespace-nowrap overflow-hidden tracking-tight">
            Driven by Trust.
          </p>
        </div>
        <div className="absolute bottom-10 right-8 hidden md:block">
          <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text fill="rgba(255,255,255,0.5)" fontSize="7">
                <textPath href="#circle" letterSpacing="3">DRIVEN BY TRUST · DRIVEN BY TRUST · </textPath>
              </text>
            </svg>
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex justify-end">
          <div className="max-w-xl text-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              運ぶのは、信頼。<br />
              支えるのは、現場力。
            </h1>
            <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
              輸送と構内作業のプロとして、<br />
              半世紀以上にわたり信頼に応えてきました。
            </p>
            <div className="flex gap-3 justify-end flex-wrap">
              <Link href="/contact?type=shipper">
                <button
                  className="flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm"
                  onClick={() => trackEvent("cta_quote_click", { location: "hero" })}
                  data-testid="button-hero-quote"
                >
                  <Mail className="w-4 h-4" />
                  お問い合わせはこちら
                </button>
              </Link>
              <a
                href="/#services"
                className="flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-medium px-6 py-3 rounded-full transition-colors text-sm"
                data-testid="button-hero-services"
              >
                サービス詳細
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500">
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
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
                <span className="text-[#c0392b] font-black text-4xl italic font-serif">About Us</span>
                <p className="text-gray-400 text-sm mt-1">私たちについて</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-snug">
                現場に根ざし、信頼に応える。
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">
                アクロス物流は、関東に根ざした運輸・構内作業のプロフェッショナル集団。安全・確実・丁寧な業務を一つひとつ積み重ねてきました。
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                創業以来15年、地域社会とともに歩みながら、お客様との信頼関係を丁寧に築いてきた歴史があります。これからも、誠実な姿勢で現場に向き合い、確かな仕事を積み重ねてまいります。
              </p>
              <Link href="/company">
                <button className="flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm" data-testid="button-about-more">
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

      {/* Marquee / teal band */}
      <div className="bg-[#6B9E9E] py-6 overflow-hidden relative">
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
              <span className="text-[#c0392b] font-black text-4xl italic font-serif">Service</span>
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
                  <button className="mt-4 flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm w-fit" data-testid="button-service-more">
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
      <section className="py-20 bg-[#6B9E9E]/10 px-4">
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
                  <span className="text-[#c0392b] font-black text-3xl italic font-serif">Recruit</span>
                  <p className="text-gray-400 text-sm mt-1">採用情報</p>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-[#6B9E9E] mb-4 leading-snug">
                  支える仕事には、<br />
                  静かな誇りと、<br />
                  世界を動かす力がある。
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  アクロス物流が担うのは、製品輸送や構内作業といった、一見すると目立たないけれど、現場に欠かせない仕事です。誠実に、まっすぐに。現場を支える一員として、一緒に働いてみませんか。
                </p>
                <Link href="/recruit">
                  <button className="flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm w-fit" data-testid="button-recruit-more">
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
              <div className="relative bg-gradient-to-br from-gray-200 to-gray-400 min-h-72 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 to-gray-800/50" />
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
                  className="text-[#c0392b] font-bold text-2xl flex items-center gap-2 mb-4 hover:text-red-700 transition-colors"
                  onClick={() => trackEvent("tel_click", { location: "home_contact" })}
                  data-testid="link-tel-home"
                >
                  <Phone className="w-5 h-5" />
                  03-1234-5678
                </a>
                <Link href="/contact">
                  <button
                    className="flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm w-fit"
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

      {/* Blog/News */}
      {latestArticles.length > 0 && (
        <section className="py-20 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <AnimateIn direction="up">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="text-[#c0392b] font-black text-4xl italic font-serif">News</span>
                  <p className="text-gray-400 text-sm mt-1">お知らせ</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="px-3 py-1.5 bg-gray-800 text-white rounded-full">すべて</button>
                  <button className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50">お知らせ</button>
                  <button className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50">ブログ</button>
                </div>
              </div>
            </AnimateIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestArticles.map((a: any, i: number) => (
                <AnimateIn key={a.id} direction="up" delay={i * 100}>
                  <Link href={`/blog/${a.slug}`}>
                    <div className="group cursor-pointer" data-testid={`card-article-${a.id}`}>
                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg mb-4 overflow-hidden relative">
                        {a.imageUrl ? (
                          <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="absolute inset-0 flex items-end p-4">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 16px)" }} />
                            <span className="text-white/30 text-5xl font-black italic relative z-10">{a.category}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-[#1a4b99] text-sm md:text-base mb-2 group-hover:text-[#c0392b] transition-colors line-clamp-2">{a.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-3">{a.excerpt}</p>
                      <p className="text-gray-400 text-xs">
                        {a.publishedAt ? format(new Date(a.publishedAt), "yyyy.MM.dd", { locale: ja }) : format(new Date(a.createdAt), "yyyy.MM.dd", { locale: ja })}
                      </p>
                    </div>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimateIn direction="up">
            <div className="text-center mb-12">
              <span className="text-[#c0392b] font-black text-3xl italic font-serif">FAQ</span>
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
