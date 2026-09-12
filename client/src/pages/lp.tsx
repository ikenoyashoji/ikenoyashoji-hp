import { useEffect } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";

const phoneNumber = "046-212-2766";
const phoneHref = "tel:0462122766";

const faqs = [
  ["急なトラック手配でも相談できますか？", "はい、まずはお電話ください。荷物の内容・納期・配送先・必要な車両などを確認し、対応可能な方法を調整します。"],
  ["当日の配送にも対応できますか？", "車両の空き状況や距離、荷物の内容によって異なります。条件を確認し、対応可否を折り返しご案内します。"],
  ["どんな車両を手配できますか？", "2t・4t・大型車両を中心に、ご希望の車格と荷物・納品先の条件を確認して適した輸送方法を検討します。"],
  ["見積もりだけでも相談できますか？", "可能です。配送内容をお伺いしたうえで、条件に合わせてご案内します。内容が固まっていない段階でもご相談ください。"],
];

function phoneCta(location: string) {
  trackEvent("cta_phone_click", { location, phone: phoneNumber });
}

function PhoneLink({ location, inverse = false, compact = false }: { location: string; inverse?: boolean; compact?: boolean }) {
  return (
    <a href={phoneHref} onClick={() => phoneCta(location)} data-testid={`link-lp-phone-${location}`}
      className={`group inline-flex items-center gap-3 border-b-2 pb-2 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${inverse ? "border-white text-white" : "border-[#0758c8] text-[#0758c8]"} ${compact ? "text-sm" : "text-base sm:text-lg"}`}>
      <Phone className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.5} />
      <span><span className="block text-[9px] font-medium tracking-[.18em] opacity-65">24時間・全国対応</span><span className="block font-mono font-semibold tracking-[-.05em]">{phoneNumber}</span></span>
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </a>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 26 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .16 }} transition={{ duration: .7, delay, ease: [0.16, 1, .3, 1] }}>{children}</motion.div>;
}

function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : -120]);
  const markX = useTransform(scrollY, [0, 900], ["0%", reduced ? "0%" : "-24%"]);
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-white text-[#0758c8]">
      <header className="relative z-20 flex items-start justify-between px-5 py-6 sm:px-12 sm:py-8">
        <div className="border-l border-[#0758c8] pl-3"><p className="text-xs font-semibold tracking-[.12em]">株式会社池ノ谷商事</p><p className="mt-1 font-mono text-[8px] tracking-[.2em]">TRUCK ARRANGEMENT / 24H</p></div>
        <p className="hidden text-right font-mono text-[9px] leading-5 tracking-[.18em] sm:block">NATIONWIDE<br />KANAGAWA, JAPAN</p>
      </header>
      <motion.p
        style={{ x: markX, color: "transparent", WebkitTextStroke: "clamp(1px, .16vw, 2px) rgba(7, 88, 200, .42)" }}
        aria-hidden="true"
        className="absolute -left-[6vw] top-[21vh] whitespace-nowrap font-serif text-[30vw] font-black leading-none tracking-[-.14em]"
      >
        MOVE
      </motion.p>
      <motion.div style={{ y: titleY }} className="relative z-10 flex min-h-[calc(100svh-90px)] flex-col justify-between px-5 pb-20 pt-[17vh] sm:px-12 sm:pt-[13vh]">
        <div className="relative">
          <p className="mb-8 font-mono text-[9px] tracking-[.3em]">NEED A TRUCK / TODAY OR TOMORROW?</p>
          <h1 className="max-w-6xl font-serif text-[clamp(3.5rem,10vw,10.8rem)] font-medium leading-[.92] tracking-[-.1em]">電話一本。<br /><span className="ml-[12vw]">トラック手配。</span></h1>
          <p className="mt-9 ml-[12vw] max-w-xs text-sm leading-8 text-[#111] sm:text-base">条件をお聞きして空き状況を確認。対応可否を、こちらから折り返しご連絡します。</p>
        </div>
        <div className="flex items-end justify-between"><PhoneLink location="hero" /><span className="hidden font-mono text-[9px] tracking-[.2em] sm:flex sm:items-center sm:gap-3"><ArrowDown className="h-4 w-4" /> SCROLL TO ARRANGE</span></div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between border-t border-[#0758c8]/35 px-5 py-3 font-mono text-[9px] tracking-[.14em] sm:px-12"><span>急な配送 / スポット便 / 定期輸送</span><span className="hidden sm:block">01—05</span></div>
    </section>
  );
}

export default function Lp() {
  useEffect(() => {
    trackPageView("/lp");
    const description = "緊急のトラック手配なら池ノ谷商事。条件をお伺いし、車両の空き状況を確認して折り返しご案内します。24時間・全国対応。";
    setSeo({ title: "電話一本。トラック手配。｜緊急配送は池ノ谷商事", description, path: "/lp" });
    const data = { "@context": "https://schema.org", "@type": "Service", name: "緊急トラック手配・輸送サービス", provider: { "@type": "LocalBusiness", name: "株式会社池ノ谷商事", telephone: phoneNumber, areaServed: "全国" }, areaServed: "全国", description, serviceType: ["緊急配送", "スポット便", "チャーター便", "定期輸送"] };
    const script = document.createElement("script"); script.id = "lp-service-schema"; script.type = "application/ld+json"; script.textContent = JSON.stringify(data); document.head.appendChild(script);
    return () => document.getElementById("lp-service-schema")?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 text-[#0758c8] md:pb-0">
      <main>
        <Hero />
        <section className="px-5 py-32 sm:px-12 sm:py-52"><div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-[.7fr_1.3fr]"><Reveal><p className="font-mono text-[9px] tracking-[.3em]">01 / FIRST CALL</p><h2 className="mt-12 font-serif text-5xl leading-[1.02] tracking-[-.08em] sm:text-8xl">迷ったまま、<br /><span className="ml-10">電話していい。</span></h2></Reveal><Reveal delay={.12} className="lg:pt-28"><p className="max-w-lg text-lg leading-9 text-[#111]">荷物の大きさ、納品先、希望日。全部決まっていなくても大丈夫です。まず条件をお聞きし、空いている車両があるかを確認します。</p><div className="mt-20 flex items-start gap-10 border-t border-[#0758c8]/35 pt-5"><div><b className="font-mono text-4xl font-normal">24</b><p className="mt-2 text-[10px] tracking-[.12em]">HOURS / 受付</p></div><div><b className="font-mono text-4xl font-normal">47</b><p className="mt-2 text-[10px] tracking-[.12em]">都道府県 / 対応</p></div></div></Reveal></div></section>

        <section className="bg-[#0758c8] text-white"><div className="flex min-h-[55svh] items-center justify-center overflow-hidden px-5 sm:min-h-[72svh] sm:px-12"><div className="grid w-full max-w-7xl grid-cols-[auto_1fr] gap-8"><p className="font-mono text-[9px] tracking-[.25em] [writing-mode:vertical-rl]">02 / THE ROUTE</p><Reveal><h2 className="font-serif text-[clamp(3.5rem,10vw,10rem)] leading-[.88] tracking-[-.1em]">条件を聞く。<br /><span className="ml-[10vw] text-white/55">空きを見る。</span></h2></Reveal></div></div><div className="border-t border-white/40">{[["01", "電話を受ける", "急ぎの配送でも、まだ内容が整理できていなくても大丈夫です。"], ["02", "条件を確認", "荷物・配送先・納期・必要な車両などをお聞きします。"], ["03", "空き状況を確認", "条件に合う車両と輸送方法があるかを確認します。"], ["04", "折り返しご連絡", "対応可否やお見積もりなど、確認した内容をご案内します。"]].map(([n, title, text]) => <div key={n} className="border-b border-white/30 px-5 py-10 sm:px-[15vw] sm:py-14"><div className="grid gap-5 sm:grid-cols-[80px_1fr_1fr] sm:items-baseline"><span className="font-mono text-xs text-white/60">{n}</span><h3 className="font-serif text-3xl tracking-[-.05em] sm:text-5xl">{title}</h3><p className="max-w-sm text-sm leading-7 text-white/72">{text}</p></div></div>)}</div></section>

        <section className="px-5 py-32 sm:px-12 sm:py-52"><div className="mx-auto max-w-7xl"><Reveal><p className="font-mono text-[9px] tracking-[.3em]">03 / VEHICLE INDEX</p><div className="mt-12 flex items-start justify-between gap-8"><h2 className="font-serif text-5xl leading-[.95] tracking-[-.08em] sm:text-8xl">運ぶものに、<br />ちょうどいい車両を。</h2><span className="hidden font-serif text-8xl italic sm:block">3</span></div></Reveal><div className="mt-28 ml-auto max-w-5xl border-t border-[#0758c8]/35">{[["2t車", "小口配送・市街地配送に"], ["4t車", "定期便・中量の輸送に"], ["大型車", "まとまった荷物・長距離に"]].map(([title, text], i) => <Reveal key={title} delay={i * .08}><div className="grid grid-cols-[55px_1fr] items-baseline border-b border-[#0758c8]/35 py-9 sm:grid-cols-[90px_1fr_1fr]"><span className="font-mono text-xs">0{i + 1}</span><h3 className="font-serif text-3xl tracking-[-.06em] sm:text-5xl">{title}</h3><p className="col-start-2 mt-3 text-sm text-[#111] sm:col-start-auto">{text}</p></div></Reveal>)}</div><p className="mt-16 ml-auto max-w-xl text-sm leading-8 text-[#111]">一般貨物運送・貨物利用運送・倉庫管理を行う池ノ谷商事。急なスポット配送から継続的な定期輸送まで、荷主様の状況に合わせて輸送方法を検討します。</p></div></section>

        <section className="bg-[#0758c8] px-5 py-32 text-white sm:px-12 sm:py-48"><div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.8fr_1.2fr]"><Reveal><p className="font-mono text-[9px] tracking-[.3em] text-white/65">04 / QUESTIONS</p><h2 className="mt-12 font-serif text-6xl leading-[.9] tracking-[-.08em] sm:text-9xl">よくある<br />質問。</h2></Reveal><div className="divide-y divide-white/35 border-y border-white/35">{faqs.map(([q, a]) => <details key={q} className="group py-7"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-serif text-lg [&::-webkit-details-marker]:hidden"><span>{q}</span><ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" /></summary><p className="max-w-xl pt-5 text-sm leading-8 text-white/75">{a}</p></details>)}</div></div></section>

        <section className="px-5 py-36 sm:px-12 sm:py-56"><div className="mx-auto max-w-7xl"><Reveal><p className="font-mono text-[9px] tracking-[.3em]">05 / CALL NOW</p><h2 className="mt-12 max-w-5xl font-serif text-[clamp(4rem,11vw,11rem)] leading-[.85] tracking-[-.11em]">今日・明日の<br /><span className="ml-[12vw]">輸送なら。</span></h2><p className="mt-12 ml-[12vw] max-w-md text-sm leading-8 text-[#111]">空き状況は条件によって異なります。まずはお電話で、荷物と納期をお聞かせください。</p><div className="ml-[12vw] mt-10"><PhoneLink location="bottom" /></div></Reveal></div></section>
        <footer className="bg-[#0758c8] px-5 py-8 text-white sm:px-12"><div className="mx-auto flex max-w-7xl flex-col gap-5 border-t border-white/35 pt-5 text-xs sm:flex-row sm:items-end sm:justify-between"><div><p className="font-semibold">株式会社池ノ谷商事</p><p className="mt-2 text-white/65">緊急のトラック手配・全国の輸送相談</p></div><nav className="flex gap-5 text-white/70"><Link href="/privacy" className="hover:text-white">個人情報保護方針</Link><Link href="/" className="hover:text-white">コーポレートサイト</Link></nav></div></footer>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/25 bg-[#0758c8] px-4 py-3 md:hidden"><PhoneLink location="mobile_fixed" inverse compact /></div>
      <div className="fixed bottom-8 right-8 z-50 hidden bg-white/95 px-4 py-3 md:block"><PhoneLink location="desktop_fixed" compact /></div>
    </div>
  );
}