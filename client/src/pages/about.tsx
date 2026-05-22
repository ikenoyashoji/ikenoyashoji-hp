import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import heroImg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.png";

const values = [
  { num: "01", title: "人間らしさ", sub: "Humanity", desc: "感謝、礼儀、誠実さを忘れずに、人として胸を張れる生き方を積み重ねる。「ありがとう」の連鎖が仕事の価値を生み、仲間との絆を深めます。" },
  { num: "02", title: "公平な環境", sub: "Fairness", desc: "誰もが公平に力を発揮できる場をつくる。特別な力に頼ることなく、誰もが小さな成功体験を積み重ねられる、温かく公正な組織を育みます。" },
  { num: "03", title: "共に育む", sub: "Co-growth", desc: "仕事を通じて人と出会い、関わり合い、様々な経験を重ねながら、人生そのものを豊かに育んでいく場をつくっています。" },
  { num: "04", title: "豊かさの追求", sub: "Enrichment", desc: "今までの価値観を尊重しながら、まだ見ぬ世界へ歩み続ける。新たな経験と価値観を重ね、すべての人の人生を豊かにし続けます。" },
];


export default function About() {
  useEffect(() => {
    trackPageView("/about");
    setSeo({
      title: "池ノ谷商事について｜企業理念・代表メッセージ",
      description: "「すべての人の人生を豊かに。」を企業理念に掲げる株式会社池ノ谷商事。企業理念と代表取締役・池ノ谷翔のメッセージをご紹介します。",
      path: "/about",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden">
        <img src={heroImg} alt="池ノ谷商事について" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <AnimateIn>
            <h1 className="hero-title text-5xl md:text-6xl font-extralight text-white tracking-[0.15em] mb-6">池ノ谷商事について</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
          </AnimateIn>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-28 bg-white px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-20">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">PHILOSOPHY</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">企業理念</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="mb-16 text-center">
              <h3 className="text-3xl md:text-4xl font-light text-gray-900 mb-10 leading-relaxed">
                「すべての人の人生を豊かに。」
              </h3>
              <div className="space-y-6 text-gray-600 text-sm leading-loose max-w-3xl mx-auto">
                <p>
                  私たちは、誰もが公平に力を発揮できる環境を整え、仕事を通じて人と出会い、関わり合い、様々な経験を重ねながら、人生そのものを豊かに育んでいく場をつくっています。
                </p>
                <p>
                  物流を通して、すべての人の日常を支え、想いを運び、そっと寄り添う存在でありたい。届けた一つひとつが、誰かの未来を切り拓き、幸せの連鎖を生み出す力になると信じています。
                </p>
                <p>
                  また、私たちは人間らしさを何より大切にします。感謝、礼儀、誠実さを忘れずに、人として胸を張れる生き方を積み重ねていく。「ありがとう」の連鎖が、仕事の価値を生み、仲間との絆を深めます。
                </p>
                <p>
                  特別な力に頼ることなく、誰もが小さな成功体験を積み重ねられる、温かく公正な組織を育み、変わり続ける社会の中で、仲間と会社の未来を築いていきます。
                </p>
                <p>
                  そして私たちは、今までの価値観を尊重しながら、まだ見ぬ世界へ歩み続けます。新たな経験と価値観を重ね、豊かな未来を創り上げていきます。
                </p>
                <p className="font-medium text-gray-700">
                  池ノ谷商事は、「人を育て、想いを運び、未来へつながる豊かさを届け続けます。」
                </p>
              </div>
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="grid md:grid-cols-3 gap-px bg-gray-100">
              {[
                { title: "Mission", sub: "使命", body: "すべての人の人生を豊かにするために、物流を通じて日常を支え、想いを運び、届けた一つひとつが誰かの幸せへとつながる連鎖を生み出し続ける。" },
                { title: "Vision", sub: "ビジョン", body: "すべての物流を、再現性ある仕組みで。誰がやっても成果が出る「非属人的で自走する物流の未来」を構造からつくる。" },
                { title: "Value", sub: "価値観", body: "誰もが公平に力を発揮できる環境の中で、感謝・礼儀・誠実さを軸に人として誠実に生きる。小さな成功体験を積み重ね、仲間と共に豊かな未来を築く。" },
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

      {/* CEO Message */}
      <section className="py-24 bg-white px-8">
        <div className="max-w-4xl mx-auto">
          <AnimateIn>
            <div className="text-center mb-16">
              <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">MESSAGE</p>
              <h2 className="text-4xl font-light text-gray-900 tracking-[0.2em] mb-4">代表メッセージ</h2>
              <div className="w-8 h-0.5 bg-[#1d4ed8] mx-auto" />
            </div>
          </AnimateIn>
          <AnimateIn>
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-relaxed" style={{ fontFamily: "'Noto Serif JP', serif" }}>「運ぶ信頼、届ける真心」</h3>
              <div className="space-y-5 text-gray-600 text-sm leading-[2]">
                <p>
                  弊社は2023年2月に法人設立、軽貨物輸送ならびに貨物取扱事業から始まりました。<br />
                  設立当初から、社員たちには常々言っております。<br />
                  自分たちの夢と希望をのせれる会社にしていこう、と。
                </p>
                <p>
                  楽しく働ける職場環境、頑張りが正当に認められる環境、<br />
                  これらを目指して日々努力しております。
                </p>
                <p>
                  社員がイキイキと働ける環境、コレは品質に直結するものだと弊社では考えております。<br />
                  お客様には確かな品質を、社員には充足感のある環境を、そしてその好循環を。<br />
                  この想いで精進してまいります。
                </p>
              </div>
              <div className="mt-10 pt-8 border-t border-gray-100 text-right">
                <p className="text-gray-400 text-[10px] tracking-widest uppercase mb-1">Representative Director</p>
                <img src="/signature.png" alt="池ノ谷 翔" className="h-10 inline-block" />
                <p className="text-gray-400 text-xs mt-0.5">代表取締役</p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0f2044] text-center px-8">
        <AnimateIn>
          <p className="text-gray-400 text-xs tracking-[0.4em] uppercase mb-4">CONTACT</p>
          <h2 className="text-3xl font-light text-white tracking-[0.2em] mb-8">お気軽にお問い合わせください</h2>
          <div className="flex justify-center">
            <Link href="/contact">
              <button className="border border-white text-white hover:bg-white hover:text-[#0f2044] px-10 py-4 text-sm tracking-widest transition-colors" data-testid="button-about-contact">
                お問い合わせ
              </button>
            </Link>
          </div>
        </AnimateIn>
      </section>

      <Footer />
    </div>
  );
}
