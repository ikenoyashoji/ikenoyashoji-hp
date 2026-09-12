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
  ["どんな車両を手配できますか？", "軽貨物・2t・4t・大型まで、荷物や納品先の条件に合う車両を検討します。"],
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

function BackdropWord({ children, blue = false, large = false, x = 0, scale = 1 }: { children: React.ReactNode; blue?: boolean; large?: boolean; x?: any; scale?: any }) {
  return <motion.p aria-hidden="true" style={{ x, scale, WebkitTextStroke: `1px ${blue ? "rgba(7, 88, 200, .7)" : "rgba(255, 255, 255, .7)"}`, color: "transparent" }} className={`absolute right-[3vw] whitespace-nowrap text-right font-serif leading-none tracking-[-.1em] ${blue ? "opacity-25" : "opacity-20"} ${large ? "top-[20%] text-[clamp(6rem,24vw,24rem)]" : "top-[27%] text-[clamp(4.5rem,18vw,18rem)]"}`}>
    {children}
  </motion.p>;
}

function CinematicCopy({ children, y, scale, filter, className = "" }: { children: React.ReactNode; y: any; scale: any; filter: any; className?: string }) {
  return <div className={`relative z-10 w-full ${className}`}><motion.div style={{ y, scale, filter, transformOrigin: "left center" }}>{children}</motion.div></div>;
}

function ScrollCue({ blue = false }: { blue?: boolean }) {
  const reduced = useReducedMotion();
  return <div aria-hidden="true" className={`absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-start gap-3 sm:bottom-9 ${blue ? "text-[#0758c8]" : "text-white"}`}>
    <span className="relative block h-14 w-px overflow-hidden">
      <span className="absolute inset-0 bg-current opacity-20" />
      <motion.span
        initial={{ y: "-100%" }}
        animate={reduced ? undefined : { y: ["-100%", "175%"] }}
        transition={{ duration: 1.2, ease: "linear", repeat: Infinity, repeatDelay: .35 }}
        style={{ background: "linear-gradient(to bottom, transparent 0%, currentColor 42%, currentColor 58%, transparent 100%)" }}
        className="absolute -left-px top-0 h-8 w-[3px]"
      />
    </span>
    <span className="pt-0.5 font-mono text-[8px] tracking-[.28em] opacity-65 [writing-mode:vertical-rl]">SCROLL</span>
  </div>;
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
  return <AnimatePresence>{open && <motion.aside role="dialog" aria-modal="true" aria-labelledby="info-title" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .55, ease: [.16, 1, .3, 1] }} className="fixed inset-y-0 right-0 z-[100] w-full max-w-xl overflow-y-auto border-l border-[#0758c8]/25 bg-white text-[#0758c8]">
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#0758c8]/20 bg-white/95 px-6 py-5 backdrop-blur sm:px-12"><p className="font-mono text-[9px] tracking-[.25em]">INFO / TRUCK ARRANGEMENT</p><button onClick={close} aria-label="情報を閉じる" className="p-1 focus-visible:outline focus-visible:outline-2"><X className="h-5 w-5" strokeWidth={1.25} /></button></div>
    <div className="px-6 pb-10 pt-12 sm:px-12 sm:pt-16">
      <p className="font-mono text-[9px] tracking-[.25em] text-[#0758c8]/60">24 HOURS / NATIONWIDE</p>
      <h2 id="info-title" className="mt-5 whitespace-nowrap font-serif text-[clamp(1.5rem,5vw,2.5rem)] leading-none tracking-[-.09em]">急ぎの輸送を、まず電話で。</h2>
      <p className="mt-8 max-w-md text-sm leading-7 text-[#111]">当日・翌日のトラック手配も、まずはご相談ください。荷物と配送条件を伺い、対応可能な車両を確認します。</p>
      <a href={phoneHref} onClick={() => call("info_panel")} className="relative left-1/2 mt-8 inline-grid -translate-x-1/2 grid-cols-[1.75rem_auto] items-end gap-x-2 border border-[#0758c8] px-3 py-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        <span className="col-start-2 font-mono text-[8px] tracking-[.2em] opacity-65">24H / 全国対応</span><Phone className="mb-0.5 h-4 w-4" strokeWidth={1.25} /><strong className="font-mono text-[clamp(1.4rem,4vw,1.9rem)] leading-none tracking-[-.07em]">{phoneNumber}</strong>
      </a>

      <div className="mt-16 border-t border-[#0758c8]/25">
        <section className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#0758c8]/25 py-8"><p className="font-mono text-[9px] tracking-[.2em]">01</p><div><h3 className="font-serif text-2xl tracking-[-.05em]">対応内容</h3><p className="mt-4 text-sm leading-7 text-[#111]">一般貨物運送・貨物利用運送を通じ、全国の輸送をご相談いただけます。軽貨物から大型まで、条件に合う車両の手配を検討します。</p></div></section>
        <section className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#0758c8]/25 py-8"><p className="font-mono text-[9px] tracking-[.2em]">02</p><div><h3 className="font-serif text-2xl tracking-[-.05em]">手配の流れ</h3><ol className="mt-5 space-y-4 text-sm text-[#111]"><li className="grid grid-cols-[1.5rem_1fr] gap-3"><span className="font-mono text-[9px] text-[#0758c8]">1</span><span>荷物・納期・配送先・必要な車両を伺います。</span></li><li className="grid grid-cols-[1.5rem_1fr] gap-3"><span className="font-mono text-[9px] text-[#0758c8]">2</span><span>車両の空き状況と対応条件を確認します。</span></li><li className="grid grid-cols-[1.5rem_1fr] gap-3"><span className="font-mono text-[9px] text-[#0758c8]">3</span><span>対応可否とお見積もりを折り返しご案内します。</span></li></ol><p className="mt-5 border-l border-[#0758c8]/40 pl-4 text-xs leading-6 text-[#111]/65">空き状況や輸送条件により、ご希望に添えない場合があります。</p></div></section>
        <section className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#0758c8]/25 py-8"><p className="font-mono text-[9px] tracking-[.2em]">03</p><div className="min-w-0"><h3 className="font-serif text-2xl tracking-[-.05em]">車両</h3><div className="mt-5 grid grid-cols-4 border-y border-[#0758c8]/25 text-center"><div className="py-4"><strong className="font-serif text-lg sm:text-xl">軽貨物</strong><small className="mt-1 block text-[9px] text-[#111]/60">小口配送</small></div><div className="border-l border-[#0758c8]/25 py-4"><strong className="font-serif text-xl">2t</strong><small className="mt-1 block text-[9px] text-[#111]/60">小型</small></div><div className="border-x border-[#0758c8]/25 py-4"><strong className="font-serif text-xl">4t</strong><small className="mt-1 block text-[9px] text-[#111]/60">中型</small></div><div className="py-4"><strong className="font-serif text-xl">大型</strong><small className="mt-1 block text-[9px] text-[#111]/60">大型輸送</small></div></div></div></section>
        <section className="grid grid-cols-[3rem_1fr] gap-4 py-8"><p className="font-mono text-[9px] tracking-[.2em]">04</p><div className="min-w-0"><h3 className="font-serif text-2xl tracking-[-.05em]">よくある質問</h3><div className="mt-3">{details.map(([q, a]) => <details key={q} className="group border-b border-[#0758c8]/20 py-4 text-[#111]"><summary className="flex cursor-pointer list-none justify-between gap-4 text-sm font-semibold leading-6 [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="mt-1 h-4 w-4 shrink-0 text-[#0758c8] transition-transform group-open:rotate-180" /></summary><p className="pt-3 text-sm leading-7 text-[#111]/70">{a}</p></details>)}</div></div></section>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#0758c8]/25 pt-6 font-mono text-[9px] tracking-[.12em]"><Link href="/privacy" onClick={close}>PRIVACY</Link><Link href="/" onClick={close}>CORPORATE</Link></div>
    </div>
  </motion.aside>}</AnimatePresence>;
}

export default function Lp() {
  const [infoOpen, setInfoOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const staticProgress = useMotionValue(0);
  const progress = reduced ? staticProgress : scrollYProgress;
  const hudColor = useTransform(progress, [.60, .64, .81, .85], ["#ffffff", "#0758c8", "#0758c8", "#ffffff"]);
  const fixedCtaOpacity = useTransform(progress, [0, .75, .79, 1], [1, 1, 0, 0]);
  const fixedCtaPointerEvents = useTransform(progress, value => value >= .79 ? "none" : "auto");
  const op = (a: number, b: number) => useTransform(progress, [a, a + .035, b, b + .035], [0, 1, 1, 0]);
  const s1 = op(-.035, .20); const s2 = op(.20, .40); const s3 = op(.40, .60); const s4 = op(.60, .80); const s5 = op(.80, 1.02);
  const film = (a: number, b: number) => ({
    y: useTransform(progress, [a, a + .07, b, b + .07], [120, 0, 0, -90]),
    scale: useTransform(progress, [a, a + .07, b, b + .07], [.9, 1, 1, 1.08]),
    filter: useTransform(progress, [a, a + .07, b, b + .07], ["blur(14px)", "blur(0px)", "blur(0px)", "blur(10px)"]),
    wordX: useTransform(progress, [a, a + .035, b, b + .035], [140, 0, 0, -180]),
    wordScale: useTransform(progress, [a, a + .035, b, b + .035], [.82, 1, 1, 1.18]),
  });
  const f1 = film(-.07, .20); const f2 = film(.20, .40); const f3 = film(.40, .60); const f4 = film(.60, .80); const f5 = film(.80, 1.02);
  const finalCtaOpacity = useTransform(progress, [.82, .87], [0, 1]);
  const finalCtaY = useTransform(progress, [.82, .87], [50, 0]);
  useEffect(() => {
    trackPageView("/lp");
    const description = "緊急のトラック手配なら池ノ谷商事。条件をお伺いし、車両の空き状況を確認して折り返しご案内します。24時間・全国対応。";
    setSeo({ title: "電話一本。トラック手配。｜緊急配送は池ノ谷商事", description, path: "/lp" });
    const data = { "@context": "https://schema.org", "@type": "Service", name: "緊急トラック手配・輸送サービス", provider: { "@type": "LocalBusiness", name: "株式会社池ノ谷商事", telephone: phoneNumber, areaServed: "全国" }, areaServed: "全国", description, serviceType: ["緊急配送", "スポット便", "チャーター便", "定期輸送"] };
    const script = document.createElement("script"); script.id = "lp-service-schema"; script.type = "application/ld+json"; script.textContent = JSON.stringify(data); document.head.appendChild(script);
    return () => document.getElementById("lp-service-schema")?.remove();
  }, []);
  return <div className="bg-[#0758c8] text-white">
    <main className="relative" style={{ height: "900vh" }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[#0758c8]" />
        <motion.div style={{ color: hudColor }} className="pointer-events-none absolute inset-0 z-30">
          <header className="absolute left-0 right-0 top-0 flex justify-between px-5 py-6 sm:px-12 sm:py-8"><div className="border-l border-current pl-3"><p className="font-serif text-sm font-bold tracking-[-.02em] sm:text-base">株式会社池ノ谷商事</p></div><button onClick={() => setInfoOpen(true)} className="pointer-events-auto font-mono text-[10px] tracking-[.2em] focus-visible:outline focus-visible:outline-2">INFO</button></header>
          <motion.div style={{ opacity: fixedCtaOpacity, pointerEvents: fixedCtaPointerEvents }} className="fixed bottom-6 right-5 md:hidden"><PhoneAction location="mobile_fixed" /></motion.div>
          <motion.div style={{ opacity: fixedCtaOpacity, pointerEvents: fixedCtaPointerEvents }} className="fixed bottom-8 right-8 hidden md:block"><PhoneAction location="desktop_fixed" /></motion.div>
        </motion.div>
        <Scene opacity={s1} className="items-center px-5 pt-20 sm:px-[6vw]"><BackdropWord large x={f1.wordX} scale={f1.wordScale}>MOVE</BackdropWord><CinematicCopy {...f1} className="-translate-y-[4vh]"><p className="font-mono text-[9px] tracking-[.3em]">01 / MOVE</p><h1 className="-ml-8 mt-10 max-w-6xl font-serif text-[clamp(5rem,16vw,16rem)] leading-[.82] tracking-[-.12em] sm:-ml-[4vw]">運ぶ。</h1></CinematicCopy><ScrollCue /></Scene>
        <Scene opacity={s2} className="items-center px-5 pt-20 sm:px-[6vw]"><BackdropWord x={f2.wordX} scale={f2.wordScale}>MISSING</BackdropWord><CinematicCopy {...f2} className="-translate-y-[7vh]"><p className="font-mono text-[9px] tracking-[.3em]">02 / MISSING</p><h2 className="-ml-8 mt-10 font-serif text-[clamp(3rem,11vw,11rem)] leading-[.94] tracking-[-.11em] sm:-ml-[4vw]">今日の<span className="sm:hidden"><br /></span>トラックが<br />見つからない。</h2></CinematicCopy><ScrollCue /></Scene>
        <Scene opacity={s3} className="items-center px-5 sm:px-[6vw]"><BackdropWord x={f3.wordX} scale={f3.wordScale}>ARRANGE</BackdropWord><CinematicCopy {...f3} className="-translate-y-[2vh]"><p className="font-mono text-[9px] tracking-[.3em]">03 / ARRANGE</p><h2 className="-ml-8 mt-10 font-serif text-[clamp(3rem,10vw,10rem)] leading-[1.02] tracking-[-.11em] sm:-ml-[4vw]">電話一本で<br /><span className="-ml-[6vw] inline-block sm:-ml-[2.5vw]">トラック<span className="sm:hidden"><br /></span>手配します。</span></h2></CinematicCopy><ScrollCue /></Scene>
        <Scene opacity={s4} className="items-center bg-white px-5 text-[#0758c8] sm:px-[6vw]"><BackdropWord blue x={f4.wordX} scale={f4.wordScale}>ALWAYS</BackdropWord><CinematicCopy {...f4}><p className="font-mono text-[9px] tracking-[.3em]">04 / ALWAYS</p><p className="-ml-8 mt-8 font-serif text-[clamp(4rem,14vw,14rem)] leading-[.95] tracking-[-.12em] sm:-ml-[5vw]">24<br /><span className="ml-[4vw]">HOURS</span></p></CinematicCopy><ScrollCue blue /></Scene>
        <Scene opacity={s5} className="items-center px-5 sm:px-[6vw]"><BackdropWord x={f5.wordX} scale={f5.wordScale}>CALL</BackdropWord><CinematicCopy {...f5} className="translate-y-[2vh]"><p className="font-mono text-[9px] tracking-[.3em]">05 / CALL NOW</p><h2 className="-ml-8 mt-10 whitespace-nowrap font-serif text-[clamp(3.4rem,12vw,12rem)] leading-none tracking-[-.11em] sm:-ml-[4vw]">今すぐ相談する。</h2></CinematicCopy><motion.div style={{ opacity: finalCtaOpacity, y: finalCtaY }} className="pointer-events-auto absolute bottom-7 left-1/2 z-10 -translate-x-1/2 scale-110 sm:bottom-9"><PhoneAction location="final_scene" /></motion.div></Scene>
      </div>
    </main>
    <InfoPanel open={infoOpen} close={() => setInfoOpen(false)} />
  </div>;
}