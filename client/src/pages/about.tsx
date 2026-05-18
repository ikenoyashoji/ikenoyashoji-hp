import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import heroImg from "@assets/about_hero.png";

const values = [
  { num: "01", title: "誠実", sub: "Integrity", desc: "約束を守り、正直に、誠実に。すべての取引先・スタッフに対して真摯に向き合います。" },
  { num: "02", title: "挑戦", sub: "Challenge", desc: "変化を恐れず、常に改善と成長を追い求める姿勢を大切にします。" },
  { num: "03", title: "共創", sub: "Co-creation", desc: "お客様・スタッフ・地域と共に、より良い物流の未来をつくります。" },
  { num: "04", title: "安全", sub: "Safety", desc: "人命と荷物の安全を最優先に、安心できる物流環境を提供します。" },
];

const marqueeItems = ["誠実", "挑戦", "共創", "安全", "Integrity", "Challenge", "Co-creation", "Safety", "誠実", "挑戦", "共創", "安全", "Integrity", "Challenge", "Co-creation", "Safety"];

export default function About() {
  useEffect(() => {
    trackPageView("/about");
    setSeo({
      title: "池ノ谷商事について｜経営理念・代表メッセージ",
      description: "「運ぶ信頼、届ける真心」を経営理念に掲げる株式会社池ノ谷商事。Mission・Vision・Valueと代表取締役・池ノ谷翔のメッセージをご紹介します。",
      path: "/about",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden" style={{ minHeight: "400px" }}>
        <img src={heroImg} alt="池ノ谷商事について" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#0f2044]/80" />
        <div className="absolute inset-0 flex items-end pb-16 px-8">
          <div className="max-w-5xl mx-auto w-full">
            <AnimateIn>
              <p className="text-[#7eb3ff] text-xs tracking-[0.5em] uppercase mb-3">IKENOYA SHOJI CO., LTD.</p>
              <h1 className="text-5xl font-extralight text-white tracking-[0.15em] mb-4">池ノ谷商事について</h1>
              <div className="w-12 h-0.5 bg-[#1d4ed8]" />
              <p className="text-gray-300 text-sm mt-4 tracking-wide">運ぶ信頼、届ける真心。</p>
            </AnimateIn>
          </div>
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

      {/* Philosophy */}
      <section className="py-28 bg-white px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-20">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">PHILOSOPHY</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">経営理念</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-[#1a4b99] text-xs tracking-[0.5em] uppercase mb-6">CORPORATE PHILOSOPHY</p>
              <h3 className="text-4xl md:text-5xl font-extralight text-gray-900 tracking-[0.3em] mb-6 leading-relaxed">
                運ぶ信頼、<br />届ける真心。
              </h3>
              <div className="w-16 h-px bg-gray-200 mx-auto mb-8" />
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
                物を運ぶことは、人と人をつなぐことです。<br />
                私たちは単なる輸送会社ではなく、お客様の大切な荷物に込められた想いを、<br className="hidden md:inline" />
                誠実と真心をもって届けることを使命としています。
              </p>
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="grid md:grid-cols-3 gap-px bg-gray-100">
              {[
                { title: "Mission", sub: "使命", body: "物流を通じて、荷主・ドライバー・地域社会の三方が豊かになる物流インフラを創る。" },
                { title: "Vision", sub: "ビジョン", body: "神奈川から全国へ。信頼される総合物流パートナーとして、日本の物流を支える。" },
                { title: "Value", sub: "価値観", body: "誠実・挑戦・共創・安全。この4つの価値観を軸にすべての意思決定を行う。" },
              ].map((item) => (
                <div key={item.title} className="bg-white p-8 text-center">
                  <p className="text-[#1d4ed8] text-xs tracking-[0.4em] uppercase mb-2">{item.title}</p>
                  <p className="text-gray-800 font-semibold mb-4">{item.sub}</p>
                  <div className="w-6 h-0.5 bg-[#1d4ed8] mx-auto mb-4" />
                  <p className="text-gray-500 text-xs leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">VALUES</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">大切にしていること</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <div className="grid md:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <AnimateIn key={v.num} delay={i * 80}>
                <div className="bg-white border border-gray-100 p-8 flex gap-6">
                  <div className="flex-shrink-0">
                    <span className="text-[#1d4ed8] text-xs font-medium tracking-[0.3em]">{v.num}</span>
                    <div className="w-px h-12 bg-gray-200 mx-auto mt-2" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-gray-900 tracking-wider mb-1">{v.title}</h3>
                    <p className="text-gray-400 text-xs italic tracking-wide mb-3">{v.sub}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                  </div>
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
          <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-8">お気軽にお問い合わせください</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-10 py-4 text-sm tracking-widest transition-colors" data-testid="button-about-contact">
                お問い合わせ
              </button>
            </Link>
            <Link href="/company">
              <button className="border border-white/40 text-white/70 hover:border-white hover:text-white px-10 py-4 text-sm tracking-widest transition-colors" data-testid="button-about-company">
                会社概要
              </button>
            </Link>
          </div>
        </AnimateIn>
      </section>

      <Footer />
    </div>
  );
}
