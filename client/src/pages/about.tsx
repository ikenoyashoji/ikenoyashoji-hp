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
      <section className="relative mt-[100px] h-[520px] flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="池ノ谷商事について" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)", backgroundSize: "60px 60px" }} />
        <div className="relative text-center px-8">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] uppercase mb-6">IKENOYA SHOJI CO., LTD.</p>
            <h1 className="text-6xl md:text-7xl font-extralight text-white tracking-[0.15em] mb-6">池ノ谷商事について</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
            <p className="text-gray-300 text-sm tracking-widest">運ぶ信頼、届ける真心。</p>
          </AnimateIn>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
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
              <div className="space-y-6 text-gray-600 text-sm leading-loose">
                <p>
                  私たちは、<br />
                  誰もが公平に力を発揮できる環境を整え、仕事を通じて人と出会い、関わり合い、<br />
                  様々な経験を重ねながら、人生そのものを豊かに育んでいく場をつくっています。
                </p>
                <p>
                  物流を通して、すべての人の日常を支え、想いを運び、そっと寄り添う存在でありたい。<br />
                  届けた一つひとつが、誰かの未来を切り拓き、幸せの連鎖を生み出す力になると信じています。
                </p>
                <p>
                  また、私たちは人間らしさを何より大切にします。<br />
                  感謝、礼儀、誠実さを忘れずに、人として胸を張れる生き方を積み重ねていく。<br />
                  「ありがとう」の連鎖が、仕事の価値を生み、仲間との絆を深めます。
                </p>
                <p>
                  特別な力に頼ることなく、誰もが小さな成功体験を積み重ねられる、温かく公正な組織を育み、<br />
                  変わり続ける社会の中で、仲間と会社の未来を築いていきます。
                </p>
                <p>
                  そして私たちは、今までの価値観を尊重しながら、まだ見ぬ世界へ歩み続けます。<br />
                  新たな経験と価値観を重ね、豊かな未来を創り上げていきます。
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
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-6">— FROM THE CEO</p>
              <div className="space-y-5 text-gray-600 text-sm leading-[2]">
                <p>
                  株式会社池ノ谷商事は、2023年2月に神奈川県愛甲郡愛川町で創業いたしました。「運ぶ信頼、届ける真心」という理念のもと、お客様の荷物を大切に、そして確実にお届けすることを第一に考えてきました。
                </p>
                <p>
                  物流という仕事は、社会のインフラとして欠かすことのできない存在です。しかし、その重要性に見合った評価や環境が十分でないことも、長年の課題でした。私たちはドライバーをはじめとするすべてのスタッフが誇りを持って働ける会社をつくることで、物流業界全体の底上げにも貢献したいと考えています。
                </p>
                <p>
                  創業からわずか2年で従業員100名を超え、関東圏全域への物流ネットワークを構築できたのは、ひとえにお客様と仲間たちの信頼のおかげです。これからも「誠実・挑戦・共創・安全」の4つの価値観を大切にしながら、地域に根ざした総合物流企業として成長し続けます。
                </p>
              </div>
              <div className="mt-10 pt-8 border-t border-gray-100">
                <p className="text-gray-400 text-[10px] tracking-widest uppercase mb-1">Representative Director</p>
                <p className="text-gray-900 font-semibold tracking-wider">池ノ谷 翔</p>
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
