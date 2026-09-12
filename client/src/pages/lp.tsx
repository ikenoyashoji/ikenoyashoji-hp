import { useEffect } from "react";
import { Link } from "wouter";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-jp/700.css";
import "@fontsource/noto-sans-jp/900.css";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";

const phoneNumber = "046-212-2766";
const phoneHref = "tel:0462122766";
const blue = "#0758c8";

const faqs = [
  ["急なトラック手配でも相談できますか？", "はい、まずはお電話ください。荷物の内容・納期・配送先・必要な車両などを確認し、対応可能な方法を調整します。"],
  ["当日の配送にも対応できますか？", "車両の空き状況や距離、荷物の内容によって異なります。条件を確認し、対応可否を折り返しご案内します。"],
  ["どんな車両を手配できますか？", "2t・4t・大型車両を中心に、ご希望の車格と荷物・納品先の条件を確認して適した輸送方法を検討します。"],
  ["見積もりだけでも相談できますか？", "可能です。配送内容をお伺いしたうえで、条件に合わせてご案内します。内容が固まっていない段階でもご相談ください。"],
];

function callPhone(location: string) {
  trackEvent("cta_phone_click", { location, phone: phoneNumber });
}

function PhoneCta({ location, inverse = false, compact = false }: { location: string; inverse?: boolean; compact?: boolean }) {
  return (
    <a
      href={phoneHref}
      onClick={() => callPhone(location)}
      data-testid={`link-lp-phone-${location}`}
      className={`group inline-flex items-center gap-3 border px-4 py-3 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        inverse ? "border-white bg-white text-[#0758c8]" : "border-[#0758c8] bg-[#0758c8] text-white"
      } ${compact ? "text-sm" : "sm:px-6 sm:py-4"}`}
    >
      <Phone className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.7} />
      <span className="text-left">
        <span className="block text-[9px] font-medium tracking-[.18em] opacity-70">24時間・全国対応</span>
        <span className={`block font-mono font-bold tracking-[-.04em] ${compact ? "text-base" : "text-xl sm:text-2xl"}`}>{phoneNumber}</span>
      </span>
      {!compact && <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
    </a>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 900], [0, reduced ? 0 : -130]);
  const ghostX = useTransform(scrollY, [0, 900], ["0%", reduced ? "0%" : "-18%"]);
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[#0758c8] text-white">
      <div className="absolute inset-0 opacity-[.16]" aria-hidden="true" style={{ backgroundImage: "linear-gradient(90deg, transparent 49.8%, white 50%, transparent 50.2%), linear-gradient(0deg, transparent 49.8%, white 50%, transparent 50.2%)", backgroundSize: "clamp(110px, 16vw, 240px) clamp(110px, 16vw, 240px)" }} />
      <header className="relative z-20 flex items-start justify-between px-5 py-5 sm:px-10 sm:py-7">
        <div className="border-l border-white/70 pl-3">
          <p className="text-sm font-bold tracking-[.14em]">株式会社池ノ谷商事</p>
          <p className="mt-1 text-[9px] tracking-[.22em] text-white/65">TRUCK ARRANGEMENT / 24H</p>
        </div>
        <p className="hidden text-right text-[10px] leading-5 tracking-[.17em] text-white/70 sm:block">NATIONWIDE<br />KANAGAWA, JAPAN</p>
      </header>
      <motion.div style={{ x: ghostX }} className="absolute left-[-5vw] top-[22vh] whitespace-nowrap text-[30vw] font-black leading-none tracking-[-.12em] text-white/[.11]" aria-hidden="true">手配</motion.div>
      <motion.div style={{ y: titleY }} className="relative z-10 flex min-h-[calc(100svh-90px)] flex-col justify-between px-5 pb-28 pt-[15vh] sm:px-10 sm:pb-20 sm:pt-[12vh]">
        <div>
          <p className="mb-8 font-mono text-[10px] tracking-[.3em] text-white/70">NEED A TRUCK / TODAY OR TOMORROW?</p>
          <h1 className="max-w-5xl text-[clamp(3.2rem,10vw,10.5rem)] font-black leading-[.92] tracking-[-.09em]">
            電話一本。<br /><span className="text-[#bcd8ff]">トラック手配。</span>
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-white/80 sm:text-base">今日、明日の輸送に困ったら。条件をお聞きして空き状況を確認、折り返しご連絡します。</p>
        </div>
        <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-end sm:justify-between">
          <PhoneCta location="hero" inverse />
          <div className="flex items-center gap-3 text-[10px] tracking-[.16em] text-white/70"><ArrowDown className="h-4 w-4 animate-bounce" /> SCROLL TO ARRANGE</div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/25 px-5 py-3 text-[10px] tracking-[.15em] text-white/65 sm:px-10">急な配送 / スポット便 / チャーター便 / 定期輸送</div>
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
    <div className="min-h-screen bg-[#f4f7fb] pb-20 font-['Noto_Sans_JP',sans-serif] text-[#0758c8] md:pb-0">
      <main>
        <Hero />
        <section className="bg-[#f4f7fb] px-5 py-28 sm:px-10 sm:py-44">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.8fr_1.2fr]">
            <Reveal><p className="font-mono text-[10px] tracking-[.3em]">01 / START HERE</p><h2 className="mt-10 text-4xl font-bold leading-[1.05] tracking-[-.07em] sm:text-7xl">迷ったまま、<br />電話していい。</h2></Reveal>
            <div className="pt-2 lg:pt-20"><Reveal><p className="max-w-xl text-lg leading-9 tracking-[-.02em]">荷物の大きさ、納品先、希望日。全部決まっていなくても大丈夫です。まず条件をお聞きし、空いている車両があるかを確認。対応可否と次の一手を、こちらから折り返します。</p></Reveal><Reveal delay={.12}><div className="mt-16 grid border-t border-[#0758c8]/25 sm:grid-cols-3"><div className="border-b border-[#0758c8]/25 py-6 sm:border-b-0 sm:border-r"><b className="font-mono text-3xl">24</b><p className="mt-2 text-xs">時間受付</p></div><div className="border-b border-[#0758c8]/25 py-6 sm:border-b-0 sm:border-r sm:pl-7"><b className="font-mono text-3xl">47</b><p className="mt-2 text-xs">都道府県対応</p></div><div className="py-6 sm:pl-7"><b className="font-mono text-3xl">1</b><p className="mt-2 text-xs">まずは一本の電話</p></div></div></Reveal></div>
          </div>
        </section>

        <section className="relative bg-[#0758c8] text-white">
          <div className="sticky top-0 flex min-h-[55svh] items-center overflow-hidden px-5 sm:min-h-[70svh] sm:px-10"><p className="absolute right-5 top-8 font-mono text-[10px] tracking-[.25em] text-white/55 sm:right-10">02 / THE ROUTE</p><Reveal><h2 className="max-w-4xl text-[clamp(3.5rem,10vw,10rem)] font-black leading-[.88] tracking-[-.1em]">条件を聞く。<br /><span className="text-[#bcd8ff]">空きを見る。</span></h2></Reveal></div>
          <div className="relative z-10 grid min-h-[115vh] grid-rows-4 border-t border-white/25 bg-[#0758c8]">
            {[["01", "電話を受ける", "急ぎの配送でも、まだ内容が整理できていなくても大丈夫です。"], ["02", "条件を確認", "荷物・配送先・納期・必要な車両などをお聞きします。"], ["03", "空き状況を確認", "条件に合う車両と輸送方法があるかを確認します。"], ["04", "折り返しご連絡", "対応可否やお見積もりなど、確認した内容をご案内します。"]].map(([n, title, text]) => <div key={n} className="flex items-center border-b border-white/25 px-5 sm:px-[12vw]"><div className="grid w-full gap-5 sm:grid-cols-[100px_1fr_1fr] sm:items-center"><span className="font-mono text-sm text-white/60">{n}</span><h3 className="text-2xl font-bold tracking-[-.04em] sm:text-4xl">{title}</h3><p className="max-w-sm text-sm leading-7 text-white/70">{text}</p></div></div>)}
          </div>
        </section>

        <section className="overflow-hidden bg-[#f4f7fb] px-5 py-28 sm:px-10 sm:py-44">
          <Reveal><p className="font-mono text-[10px] tracking-[.3em]">03 / WHAT WE ARRANGE</p><h2 className="mt-10 max-w-5xl text-5xl font-bold leading-[.98] tracking-[-.08em] sm:text-8xl">運ぶものに、<br />ちょうどいい車両を。</h2></Reveal>
          <div className="mx-auto mt-24 max-w-6xl divide-y divide-[#0758c8]/25 border-y border-[#0758c8]/25">
            {[["2t車", "小口配送・市街地配送に"], ["4t車", "定期便・中量の輸送に"], ["大型車", "まとまった荷物・長距離に"]].map(([title, text], i) => <Reveal key={title} delay={i * .08}><div className="grid gap-3 py-9 sm:grid-cols-[1fr_1fr_1fr] sm:items-center"><span className="font-mono text-xs">0{i + 1}</span><h3 className="text-3xl font-bold tracking-[-.06em]">{title}</h3><p className="text-sm text-[#0758c8]/70">{text}</p></div></Reveal>)}
          </div>
          <p className="mx-auto mt-12 max-w-6xl text-sm leading-8 text-[#0758c8]/70">一般貨物運送・貨物利用運送・倉庫管理を行う池ノ谷商事。急なスポット配送から継続的な定期輸送まで、荷主様の状況に合わせて輸送方法を検討します。</p>
        </section>

        <section className="bg-[#dceaff] px-5 py-28 sm:px-10 sm:py-40"><div className="mx-auto max-w-5xl"><Reveal><p className="font-mono text-[10px] tracking-[.3em]">04 / FAQ</p><h2 className="mt-10 text-5xl font-bold tracking-[-.08em] sm:text-8xl">よくある質問。</h2></Reveal><div className="mt-20 divide-y divide-[#0758c8]/30 border-y border-[#0758c8]/30">{faqs.map(([q, a]) => <details key={q} className="group py-7"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-bold [&::-webkit-details-marker]:hidden"><span>{q}</span><ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" /></summary><p className="max-w-2xl pt-5 text-sm leading-8 text-[#0758c8]/75">{a}</p></details>)}</div></div></section>

        <section className="bg-[#0758c8] px-5 py-28 text-white sm:px-10 sm:py-44"><div className="mx-auto max-w-7xl"><Reveal><p className="font-mono text-[10px] tracking-[.3em] text-white/60">05 / CALL NOW</p><h2 className="mt-10 max-w-5xl text-[clamp(3.5rem,9vw,9rem)] font-black leading-[.9] tracking-[-.1em]">今日・明日の<br /><span className="text-[#bcd8ff]">輸送なら。</span></h2><p className="mt-10 max-w-md text-sm leading-8 text-white/75">空き状況は条件によって異なります。まずはお電話で、荷物と納期をお聞かせください。</p><PhoneCta location="bottom" inverse /></Reveal></div></section>
        <footer className="bg-[#0758c8] px-5 pb-28 text-white sm:px-10 sm:pb-12"><div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/25 pt-6 text-xs sm:flex-row sm:items-end sm:justify-between"><div><p className="font-bold">株式会社池ノ谷商事</p><p className="mt-2 text-white/60">緊急のトラック手配・全国の輸送相談</p></div><nav className="flex gap-4 text-white/70"><Link href="/privacy" className="hover:text-white">個人情報保護方針</Link><Link href="/" className="hover:text-white">コーポレートサイト</Link></nav></div></footer>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/20 bg-[#0758c8] px-3 py-2 md:hidden"><PhoneCta location="mobile_fixed" compact inverse /></div>
      <div className="fixed right-6 top-5 z-50 hidden md:block"><PhoneCta location="desktop_fixed" compact inverse /></div>
    </div>
  );
}