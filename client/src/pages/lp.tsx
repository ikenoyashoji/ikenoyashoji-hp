import { useEffect } from "react";
import { Link } from "wouter";
import { AnimateIn } from "@/components/animate-in";
import { Phone, ArrowRight, Clock3, MapPin, Truck, Warehouse, ChevronDown, Check, ArrowUpRight } from "lucide-react";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import heroAerial from "@assets/hero_aerial_logistics.webp";
import transportImg from "@assets/BE3582A6-2E5C-49C7-8922-B23D966DDB2B_1779581062877.webp";
import warehouseImg from "@assets/3591D69C-9B93-4472-B7C0-24217B55FC36_1779427030587.webp";
import heroWoman from "@assets/woman_hero_enhanced.png";

const phoneNumber = "046-212-2766";
const phoneHref = "tel:0462122766";

const phoneCta = (location: string) => {
  trackEvent("cta_phone_click", { location, phone: phoneNumber });
};

const concerns = [
  { number: "01", title: "急な配送に\n対応できる車両がない", detail: "急な案件や納期変更で、車両の手配にお困りではありませんか？" },
  { number: "02", title: "今日・明日の\nトラックを手配したい", detail: "スポット便やチャーター便など、まずは荷物と納期をお聞かせください。" },
  { number: "03", title: "繁忙期だけ\n輸送力を増やしたい", detail: "定期便から一時的な増車まで、物量に合わせてご相談いただけます。" },
];

const services = [
  { number: "01", title: "緊急配送", text: "急な配送や納期変更にも、まずはお電話ください。荷物・距離・納期を確認し、対応可能な車両を調整します。", icon: Clock3 },
  { number: "02", title: "スポット・チャーター便", text: "一度限りの配送から、車両を貸し切るチャーター便まで、配送条件に合わせてご提案します。", icon: Truck },
  { number: "03", title: "定期輸送", text: "毎週・毎月の定期便や、繁忙期の輸送力確保もご相談ください。継続的な物流を支えます。", icon: Warehouse },
];

const vehicles = [
  { title: "2t車", text: "小口配送・市街地配送に" },
  { title: "4t車", text: "定期便・中量の輸送に" },
  { title: "大型車", text: "まとまった荷物・長距離に" },
];

const faqs = [
  { q: "急なトラック手配でも相談できますか？", a: "はい、まずはお電話ください。荷物の内容・納期・配送先・必要な車両などを確認し、対応可能な方法を調整します。" },
  { q: "当日の配送にも対応できますか？", a: "車両の空き状況や距離、荷物の内容によって異なります。対応可否を確認しますので、急ぎの場合もお早めにお電話ください。" },
  { q: "2t・4t・大型の車両を指定できますか？", a: "ご希望の車格をお聞きします。荷物の大きさや納品先の条件も確認し、適した車両をご案内します。" },
  { q: "見積もりだけでも相談できますか？", a: "可能です。配送内容をお伺いしたうえで、条件に合わせてご案内します。お気軽にご相談ください。" },
];

function PhoneButton({ location, className = "", compact = false, label = "まずは電話で相談する" }: { location: string; className?: string; compact?: boolean; label?: string }) {
  return (
    <a
      href={phoneHref}
      onClick={() => phoneCta(location)}
      className={`group inline-flex items-center justify-center gap-3 transition-all duration-300 ${className}`}
      data-testid={`link-lp-phone-${location}`}
    >
      <Phone className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.8} />
      <span className="text-left">
        {!compact && <span className="block text-[10px] font-medium tracking-[0.16em] opacity-75">{label}</span>}
        <span className={`block font-semibold tracking-[0.06em] ${compact ? "text-base" : "text-2xl sm:text-3xl"}`}>{phoneNumber}</span>
      </span>
      {!compact && <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
    </a>
  );
}

function HeroPhoneBar({ location }: { location: string }) {
  const isDesktop = location === "hero_desktop";
  return (
    <div className={`absolute z-50 bg-white text-[#0758c8] shadow-[0_18px_45px_rgba(0,24,80,0.22)] ${isDesktop ? "bottom-10 left-[5%] w-[350px]" : "bottom-4 left-4 right-4"}`}>
      <a
        href={phoneHref}
        onClick={() => phoneCta(location)}
        className="group flex h-[88px] items-center justify-center gap-3 px-5"
        data-testid={`link-lp-phone-${location}`}
      >
        <Phone className="h-8 w-8 flex-shrink-0 fill-[#0758c8] stroke-[#0758c8]" strokeWidth={1.5} />
        <span className="h-11 w-px bg-[#0758c8]/25" />
        <span className="text-left">
          <span className="block whitespace-nowrap text-[clamp(1.7rem,7vw,2.35rem)] font-black leading-none tracking-[-0.04em]">{phoneNumber}</span>
          <span className="mt-2 block text-center text-[10px] font-bold tracking-[0.13em]">今すぐ電話で相談する</span>
        </span>
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}

function MobileHero() {
  return (
    <section className="relative h-[100svh] min-h-[700px] w-full overflow-hidden bg-[radial-gradient(circle_at_72%_18%,#2b7eea_0%,#1265d4_34%,#0649ae_100%)] text-white md:hidden">
      <div className="absolute left-5 top-6 z-20 border-l border-white/70 pl-3">
        <p className="text-[13px] font-bold tracking-[0.15em]">緊急トラック手配</p>
        <p className="mt-2 text-[10px] tracking-[0.14em] text-white/70">NATIONWIDE LOGISTICS</p>
      </div>

      <p className="absolute left-[53%] top-[226px] z-10 w-max -translate-x-1/2 whitespace-nowrap text-[42vw] font-black leading-none tracking-[-0.08em] text-white">
        運ぶ。
      </p>

      <img
        src={heroWoman}
        alt="物流手配を担当するスタッフ"
        loading="eager"
        decoding="async"
        className="absolute bottom-[72px] left-[-10%] z-30 w-[102%] max-w-none object-contain drop-shadow-[0_14px_18px_rgba(0,22,70,0.24)]"
      />

      <HeroPhoneBar location="hero_mobile" />
    </section>
  );
}

function DesktopHero() {
  return (
    <section className="relative hidden h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[radial-gradient(circle_at_72%_18%,#2b7eea_0%,#1265d4_34%,#0649ae_100%)] text-white md:block">
      <div className="absolute left-[4%] top-8 z-20 border-l border-white/70 pl-4">
        <p className="text-base font-bold tracking-[0.15em]">緊急トラック手配・全国対応</p>
        <p className="mt-3 text-xs tracking-[0.14em] text-white/70">IKENOYASHOJI LOGISTICS SERVICE</p>
      </div>

      <p className="absolute left-[55%] top-[190px] z-10 w-max -translate-x-1/2 whitespace-nowrap text-[clamp(14rem,28vw,26rem)] font-black leading-none tracking-[-0.08em] text-white">
        運ぶ。
      </p>

      <img
        src={heroWoman}
        alt="物流手配を担当するスタッフ"
        loading="eager"
        decoding="async"
        className="absolute bottom-0 left-[29%] z-30 w-[42%] max-w-[480px] object-contain drop-shadow-[0_16px_22px_rgba(0,22,70,0.24)]"
      />

      <HeroPhoneBar location="hero_desktop" />
    </section>
  );
}

export default function Lp() {
  useEffect(() => {
    trackPageView("/lp");
    const description = "緊急のトラック手配なら池ノ谷商事。急な配送・当日配送・スポット便・チャーター便・定期輸送まで、2t・4t・大型車両で全国の輸送相談に対応します。";
    setSeo({
      title: "緊急のトラック手配｜急な配送・スポット便は池ノ谷商事",
      description,
      path: "/lp",
    });

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "緊急トラック手配・輸送サービス",
      provider: {
        "@type": "LocalBusiness",
        name: "株式会社池ノ谷商事",
        telephone: phoneNumber,
        areaServed: "全国",
      },
      areaServed: "全国",
      description,
      serviceType: ["緊急配送", "スポット便", "チャーター便", "定期輸送"],
    };
    const script = document.createElement("script");
    script.id = "lp-service-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    return () => document.getElementById("lp-service-schema")?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-16 text-[#0758c8] md:pb-0">
      <main>
        <h1 className="sr-only">緊急のトラック手配なら池ノ谷商事｜全国対応</h1>
        <MobileHero />
        <DesktopHero />

        <section className="bg-white px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
          <div className="mx-auto max-w-7xl">
            <AnimateIn><p className="text-[10px] font-bold tracking-[0.48em] text-[#0758c8]">WHEN TIME MATTERS</p><h2 className="mt-7 max-w-5xl text-[clamp(3.1rem,10vw,8.5rem)] font-black leading-[.92] tracking-[-.08em] text-[#0758c8]">その「困った」を、<br />今日の輸送に。</h2><p className="mt-9 max-w-sm text-sm leading-8 text-[#0758c8]/70">急な配送、納期変更、車両不足。状況が整理できていなくても、まずはご相談ください。</p></AnimateIn>
            <div className="mt-16 grid border-t border-[#0758c8]/20 md:grid-cols-3">
              {concerns.map((item, index) => <AnimateIn key={item.number} delay={index * 90}><article className="border-b border-[#0758c8]/20 py-7 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"><div className="flex justify-between"><span className="font-mono text-xs text-[#0758c8]">{item.number}</span><ArrowUpRight className="h-4 w-4 text-[#0758c8]" /></div><h3 className="mt-8 whitespace-pre-line text-lg font-bold leading-[1.55] text-[#0758c8]">{item.title}</h3><p className="mt-4 text-xs leading-6 text-[#0758c8]/65">{item.detail}</p></article></AnimateIn>)}
            </div>
          </div>
        </section>

        <section className="border-t border-[#0758c8]/15 bg-white px-5 py-20 sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <AnimateIn direction="left"><p className="text-[10px] font-bold tracking-[0.48em] text-[#0758c8]">THE IKENOYASHOJI STANDARD</p><h2 className="mt-6 text-5xl font-black leading-[1.05] tracking-[-.06em] text-[#0758c8] sm:text-7xl">必要な車両を、<br />必要なときに。</h2><p className="mt-8 max-w-sm text-sm leading-8 text-[#0758c8]/70">池ノ谷商事は、神奈川県愛川町を拠点に、一般貨物運送・貨物利用運送・倉庫管理を行う物流会社です。急なスポット配送から継続的な定期輸送まで、荷主様の状況に合わせて輸送方法をご提案します。</p><div className="mt-9 space-y-3 text-xs font-bold text-[#0758c8]">{["全国対応", "2t・4t・大型", "スポット・定期"].map((item) => <p key={item} className="flex items-center gap-2"><Check className="h-4 w-4" />{item}</p>)}</div></AnimateIn>
            <AnimateIn delay={120} direction="right"><div className="relative"><img src={transportImg} alt="輸送車両と配送現場" className="aspect-[4/3] w-full object-cover" loading="lazy" /><p className="mt-4 text-[10px] font-bold tracking-[0.3em] text-[#0758c8]">TRUST IN MOTION / 運ぶ信頼、届ける真心</p></div></AnimateIn>
          </div>
        </section>

        <section className="border-t border-[#0758c8]/15 bg-white px-5 py-20 sm:px-8 sm:py-32"><div className="mx-auto max-w-7xl"><AnimateIn><p className="text-[10px] font-bold tracking-[0.48em] text-[#0758c8]">ONE CALL, MANY SOLUTIONS</p><h2 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-.06em] text-[#0758c8] sm:text-7xl">緊急配送から<br />定期輸送まで。</h2><p className="mt-7 max-w-sm text-sm leading-8 text-[#0758c8]/70">荷物と納期を確認し、最適な輸送方法を一緒に考えます。</p></AnimateIn>
          <div className="mt-16 border-t border-[#0758c8]/20">{services.map((item, index) => { const Icon = item.icon; return <AnimateIn key={item.number} delay={index * 90}><article className="group grid gap-5 border-b border-[#0758c8]/20 py-8 md:grid-cols-[.18fr_.42fr_1fr] md:items-start"><span className="font-mono text-sm text-[#0758c8]">{item.number}</span><h3 className="text-2xl font-bold text-[#0758c8]">{item.title}</h3><div className="flex gap-4"><Icon className="mt-1 h-5 w-5 flex-none text-[#0758c8]" strokeWidth={1.5} /><p className="max-w-xl text-sm leading-8 text-[#0758c8]/70">{item.text}</p></div></article></AnimateIn> })}</div>
        </div></section>

        <section className="bg-[#0758c8] px-5 py-20 text-white sm:px-8 sm:py-32"><div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-end"><AnimateIn direction="left"><p className="text-[10px] font-bold tracking-[0.48em] text-white/70">THE RIGHT TRUCK FOR THE JOB</p><h2 className="mt-6 text-5xl font-black leading-[1.03] tracking-[-.06em] sm:text-7xl">車両の選定まで、<br />こちらで引き受けます。</h2><p className="mt-8 max-w-md text-sm leading-8 text-white/70">荷物の大きさ・納品先の条件・納期を確認して、2t・4t・大型車両を中心に適した輸送方法をご案内します。</p><div className="mt-10 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/25 pt-6">{vehicles.map((vehicle) => <div key={vehicle.title}><p className="text-2xl font-bold text-white">{vehicle.title}</p><p className="mt-1 text-xs text-white/65">{vehicle.text}</p></div>)}</div></AnimateIn><AnimateIn delay={120} direction="right"><div><img src={warehouseImg} alt="池ノ谷商事の物流現場" className="aspect-[4/3] w-full object-cover" loading="lazy" /><p className="mt-4 text-[10px] tracking-[0.3em] text-white/65">NATIONWIDE LOGISTICS / 全国の輸送相談に対応</p></div></AnimateIn></div></section>

        <section className="bg-white px-5 py-20 sm:px-8 sm:py-32"><div className="mx-auto max-w-7xl"><AnimateIn><p className="text-[10px] font-bold tracking-[0.48em] text-[#0758c8]">FOUR SIMPLE STEPS</p><h2 className="mt-6 text-5xl font-black leading-[1.02] tracking-[-.06em] text-[#0758c8] sm:text-7xl">電話相談の流れ。</h2></AnimateIn><div className="mt-16 grid border-t border-[#0758c8]/35 md:grid-cols-4">{[["01","お電話","配送内容や納期をお聞かせください。"],["02","内容確認","荷物・配送先・車両の希望を確認します。"],["03","車両調整","条件に合う輸送方法を検討します。"],["04","ご案内","対応可否とお見積もりをご案内します。"]].map(([number,title,text], index) => <AnimateIn key={number} delay={index * 90}><div className="border-b border-[#0758c8]/35 py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"><span className="font-mono text-sm text-[#0758c8]">{number}</span><h3 className="mt-7 text-lg font-bold text-[#0758c8]">{title}</h3><p className="mt-3 text-xs leading-6 text-[#0758c8]/65">{text}</p></div></AnimateIn>)}</div></div></section>

        <section className="border-t border-[#0758c8]/15 bg-white px-5 py-20 sm:px-8 sm:py-32"><div className="mx-auto max-w-5xl"><AnimateIn><p className="text-[10px] font-bold tracking-[0.48em] text-[#0758c8]">QUESTIONS, ANSWERED</p><h2 className="mt-6 text-5xl font-black leading-[1.02] tracking-[-.06em] text-[#0758c8] sm:text-7xl">よくあるご質問。</h2></AnimateIn><div className="mt-16 divide-y divide-[#0758c8]/20 border-y border-[#0758c8]/20">{faqs.map((faq) => <details key={faq.q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold leading-6 text-[#0758c8] [&::-webkit-details-marker]:hidden"><span><span className="mr-3 font-mono">Q.</span>{faq.q}</span><ChevronDown className="h-5 w-5 flex-shrink-0 text-[#0758c8] transition-transform group-open:rotate-180" /></summary><p className="mt-5 max-w-3xl pl-7 text-sm leading-7 text-[#0758c8]/70"><span className="mr-2 font-mono font-bold">A.</span>{faq.a}</p></details>)}</div></div></section>

        <section className="bg-[#0758c8] px-5 py-20 text-white sm:px-8 sm:py-32"><div className="mx-auto max-w-7xl"><AnimateIn><p className="text-[10px] font-bold tracking-[0.48em] text-white/70">READY WHEN YOU ARE</p><h2 className="mt-7 max-w-5xl text-5xl font-black leading-[.98] tracking-[-.07em] sm:text-8xl">緊急のトラック手配は、<br />まずはお電話ください。</h2><p className="mt-8 max-w-md text-sm leading-8 text-white/75">急な配送、スポット便、定期輸送。まだ内容が固まっていない段階でも、お気軽にご相談ください。</p><PhoneButton location="bottom" className="mt-9 bg-white px-6 py-5 text-[#0758c8] hover:bg-white/90 sm:px-10 sm:py-6" /><p className="mt-4 flex items-center gap-2 text-[11px] text-white/65"><MapPin className="h-3.5 w-3.5" />全国の輸送相談</p></AnimateIn></div></section>

        <footer className="border-t border-white/25 bg-[#0758c8] px-5 py-10 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold tracking-wide">株式会社池ノ谷商事</p><p className="mt-2 text-[11px] text-white/65">緊急のトラック手配・全国の輸送相談</p></div><div className="flex items-center gap-3 text-[11px] text-white/70"><Link href="/privacy" className="transition-colors hover:text-white">個人情報保護方針</Link><span className="text-white/30">／</span><Link href="/" className="transition-colors hover:text-white">コーポレートサイト</Link></div></div></footer>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/25 bg-[#0758c8] px-3 py-2.5 md:hidden"><PhoneButton location="mobile_fixed" compact className="w-full text-white" /></div>
    </div>
  );
}