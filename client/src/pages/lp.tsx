import { useEffect, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Phone, X } from "lucide-react";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";

const phoneNumber = "046-212-2766";
const phoneHref = "tel:0462122766";
const details = [
  ["急なトラック手配でも相談できますか？", "はい、まずはお電話ください。荷物の内容・納期・配送先・必要な車両などを確認し、対応可能な方法を調整します。"],
  ["当日の配送にも対応できますか？", "車両の空き状況や距離、荷物の内容によって異なります。条件を確認し、対応可否を折り返しご案内します。"],
  ["どんな車両を手配できますか？", "2t・4t・大型車両を中心に、ご希望の車格と荷物・納品先の条件を確認して適した輸送方法を検討します。"],
];

function call(location: string) {
  trackEvent("cta_phone_click", { location, phone: phoneNumber });
}

function PhoneAction({ location }: { location: string }) {
  return <a href={phoneHref} onClick={() => call(location)} data-testid={`link-lp-phone-${location}`} className="group pointer-events-auto inline-grid grid-cols-[2rem_auto] items-end gap-x-2 border border-current px-3 py-2 text-current transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
    <span className="col-start-2 mb-1 font-mono text-[8px] tracking-[.18em] opacity-70">24H / 全国対応</span>
    <Phone className="mb-1 h-5 w-5" strokeWidth={1.25} />
    <strong className="font-mono text-[clamp(1.45rem,2.3vw,2rem)] leading-none tracking-[-.07em]">{phoneNumber}</strong>
  </a>;
}

function Scene({ children, opacity, y = 0, scale = 1, className = "" }: { children: React.ReactNode; opacity: any; y?: any; scale?: any; className?: string }) {
  return <motion.div style={{ opacity, y, scale }} className={`pointer-events-none absolute inset-0 flex ${className}`}>{children}</motion.div>;
}

function BackdropWord({ children, blue = false, large = false }: { children: React.ReactNode; blue?: boolean; large?: boolean }) {
  return <p aria-hidden="true" style={{ WebkitTextStroke: `1px ${blue ? "rgba(7, 88, 200, .7)" : "rgba(255, 255, 255, .7)"}`, color: "transparent" }} className={`absolute right-[3vw] whitespace-nowrap text-right font-serif leading-none tracking-[-.1em] opacity-20 ${large ? "top-[20%] text-[clamp(6rem,24vw,24rem)]" : "top-[27%] text-[clamp(4.5rem,18vw,18rem)]"}`}>
    {children}
  </p>;
}

function InfoPanel({ open, close }: { open: boolean; close: () => void }) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [open, close]);
  return <AnimatePresence>{open && <motion.aside role="dialog" aria-modal="true" aria-labelledby="info-title" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .55, ease: [.16, 1, .3, 1] }} className="fixed inset-y-0 right-0 z-[100] w-full max-w-xl overflow-y-auto border-l border-[#0758c8]/30 bg-white px-6 py-7 text-[#0758c8] sm:px-12">
    <div className="flex items-start justify-between border-b border-[#0758c8]/35 pb-5"><p className="font-mono text-[9px] tracking-[.25em]">INFO / SERVICE NOTES</p><button onClick={close} aria-label="情報を閉じる" className="focus-visible:outline focus-visible:outline-2"><X className="h-5 w-5" /></button></div>
    <h2 id="info-title" className="mt-16 font-serif text-5xl leading-[.9] tracking-[-.08em] sm:text-7xl">輸送のこと。<br />電話のこと。</h2>
    <div className="mt-12 space-y-10 text-sm leading-8 text-[#111]">
      <p>株式会社池ノ谷商事は、神奈川県愛川町を拠点に一般貨物運送・貨物利用運送・倉庫管理を行っています。24時間、全国の輸送相談を受け付けています。</p>
      <div className="border-y border-[#0758c8]/35 py-6"><p className="font-mono text-[9px] tracking-[.2em] text-[#0758c8]">ARRANGEMENT</p><p className="mt-4">お電話で荷物・納期・配送先・必要な車両などの条件を確認し、車両の空き状況を確認します。対応可否やお見積もりは、確認後に折り返しご案内します。空き状況によってはご希望に添えない場合があります。</p></div>
      <div><p className="font-mono text-[9px] tracking-[.2em] text-[#0758c8]">VEHICLE TYPES</p><div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#0758c8]/35 pt-4 text-[#0758c8]"><span>2t車<br /><small className="text-[#111]">小口配送</small></span><span>4t車<br /><small className="text-[#111]">中量輸送</small></span><span>大型車<br /><small className="text-[#111]">長距離</small></span></div></div>
      <div><p className="font-mono text-[9px] tracking-[.2em] text-[#0758c8]">FAQ</p>{details.map(([q, a]) => <details key={q} className="group border-b border-[#0758c8]/25 py-4"><summary className="flex cursor-pointer list-none justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" /></summary><p className="pt-3">{a}</p></details>)}</div>
    </div>
    <div className="mt-14 flex flex-wrap gap-5 border-t border-[#0758c8]/35 pt-5 text-xs"><Link href="/privacy" onClick={close} className="underline underline-offset-4">個人情報保護方針</Link><Link href="/" onClick={close} className="underline underline-offset-4">コーポレートサイト</Link></div>
  </motion.aside>}</AnimatePresence>;
}

export default function Lp() {
  const [infoOpen, setInfoOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const staticProgress = useMotionValue(0);
  const progress = reduced ? staticProgress : scrollYProgress;
  const hudColor = useTransform(progress, [.60, .64, .81, .85], ["#ffffff", "#0758c8", "#0758c8", "#ffffff"]);
  const op = (a: number, b: number) => useTransform(progress, [a - .035, a, b, b + .035], [0, 1, 1, 0]);
  const s1 = op(0, .2); const s2 = op(.18, .41); const s3 = op(.39, .65); const s4 = op(.63, .81); const s5 = op(.79, 1.02);
  useEffect(() => {
    trackPageView("/lp");
    const description = "緊急のトラック手配なら池ノ谷商事。条件をお伺いし、車両の空き状況を確認して折り返しご案内します。24時間・全国対応。";
    setSeo({ title: "電話一本。トラック手配。｜緊急配送は池ノ谷商事", description, path: "/lp" });
    const data = { "@context": "https://schema.org", "@type": "Service", name: "緊急トラック手配・輸送サービス", provider: { "@type": "LocalBusiness", name: "株式会社池ノ谷商事", telephone: phoneNumber, areaServed: "全国" }, areaServed: "全国", description, serviceType: ["緊急配送", "スポット便", "チャーター便", "定期輸送"] };
    const script = document.createElement("script"); script.id = "lp-service-schema"; script.type = "application/ld+json"; script.textContent = JSON.stringify(data); document.head.appendChild(script);
    return () => document.getElementById("lp-service-schema")?.remove();
  }, []);
  return <div className="bg-[#0758c8] text-white">
    <main className="relative" style={{ height: "800vh" }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[#0758c8]" />
        <motion.div style={{ color: hudColor }} className="pointer-events-none absolute inset-0 z-30">
          <header className="absolute left-0 right-0 top-0 flex justify-between px-5 py-6 sm:px-12 sm:py-8"><div className="border-l border-current pl-3"><p className="font-serif text-sm font-bold tracking-[-.02em] sm:text-base">株式会社池ノ谷商事</p></div><button onClick={() => setInfoOpen(true)} className="pointer-events-auto font-mono text-[10px] tracking-[.2em] focus-visible:outline focus-visible:outline-2">INFO</button></header>
          <div className="fixed bottom-6 right-5 md:hidden"><PhoneAction location="mobile_fixed" /></div>
          <div className="fixed bottom-8 right-8 hidden md:block"><PhoneAction location="desktop_fixed" /></div>
        </motion.div>
        <Scene opacity={s1} className="items-center px-5 pt-20 sm:px-[6vw]"><BackdropWord large>MOVE</BackdropWord><div className="relative z-10 w-full -translate-y-[4vh]"><p className="font-mono text-[9px] tracking-[.3em]">01 / MOVE</p><h1 className="-ml-8 mt-10 max-w-6xl font-serif text-[clamp(5rem,16vw,16rem)] leading-[.82] tracking-[-.12em] sm:-ml-[4vw]">運ぶ。</h1><div aria-hidden="true" className="ml-1 mt-10 flex items-start gap-3 sm:ml-[1vw] sm:mt-12"><span className="relative block h-14 w-px overflow-hidden bg-white/25"><span className="absolute left-0 top-0 h-5 w-px animate-bounce bg-white" /></span><span className="pt-0.5 font-mono text-[8px] tracking-[.28em] text-white/65 [writing-mode:vertical-rl]">SCROLL</span></div></div></Scene>
        <Scene opacity={s2} className="items-center px-5 pt-20 sm:px-[6vw]"><BackdropWord>MISSING</BackdropWord><div className="relative z-10 w-full -translate-y-[7vh]"><p className="font-mono text-[9px] tracking-[.3em]">02 / PROBLEM</p><h2 className="-ml-8 mt-10 font-serif text-[clamp(3rem,11vw,11rem)] leading-[.86] tracking-[-.11em] sm:-ml-[4vw]">今日の<span className="sm:hidden"><br /></span>トラックが、<br /><span className="ml-[4vw]">見つからない。</span></h2></div></Scene>
        <Scene opacity={s3} className="items-center px-5 sm:px-[6vw]"><BackdropWord>ARRANGE</BackdropWord><div className="relative z-10 w-full -translate-y-[8vh]"><p className="font-mono text-[9px] tracking-[.3em]">03 / SOLUTION</p><h2 className="-ml-8 mt-10 font-serif text-[clamp(3rem,10vw,10rem)] leading-[.86] tracking-[-.11em] sm:-ml-[4vw]">電話一本で、<br /><span className="ml-[4vw]">トラック<span className="sm:hidden"><br /></span>手配します。</span></h2></div></Scene>
        <Scene opacity={s4} className="items-center bg-white px-5 text-[#0758c8] sm:px-[6vw]"><BackdropWord blue>ALWAYS</BackdropWord><div className="relative z-10 grid w-full grid-cols-[auto_1fr] gap-8"><p className="font-mono text-[9px] tracking-[.25em] [writing-mode:vertical-rl]">04 / ALWAYS ON</p><div><p className="font-mono text-[10px] tracking-[.3em] text-[#0758c8]/65">24 HOURS / NATIONWIDE</p><p className="-ml-8 mt-8 font-serif text-[clamp(4rem,14vw,14rem)] leading-[.8] tracking-[-.12em] sm:-ml-[5vw]">24<br /><span className="ml-[4vw]">HOURS</span></p></div></div></Scene>
        <Scene opacity={s5} className="items-center px-5 sm:px-[6vw]"><BackdropWord>CALL</BackdropWord><div className="relative z-10 w-full -translate-y-[6vh]"><p className="font-mono text-[9px] tracking-[.3em]">05 / CALL NOW</p><h2 className="-ml-8 mt-10 font-serif text-[clamp(3.4rem,12vw,12rem)] leading-[.82] tracking-[-.11em] sm:-ml-[4vw]">今、<br /><span className="ml-[4vw]">電話する。</span></h2><a href={phoneHref} onClick={() => call("final_scene")} data-testid="link-lp-phone-final_scene" className="group pointer-events-auto ml-[4vw] mt-10 inline-grid min-w-[min(34rem,88vw)] grid-cols-[2.5rem_1fr] items-end gap-x-3 border-b border-white pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"><span className="col-start-2 mb-1 font-mono text-[9px] tracking-[.22em] opacity-70">24H / 全国対応</span><Phone className="mb-2 h-7 w-7" strokeWidth={1.2} /><strong className="font-mono text-[clamp(2.5rem,6vw,5.5rem)] leading-none tracking-[-.08em]">{phoneNumber}</strong></a></div></Scene>
      </div>
    </main>
    <InfoPanel open={infoOpen} close={() => setInfoOpen(false)} />
  </div>;
}