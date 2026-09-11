import { useEffect } from "react";
import { Link } from "wouter";
import { AnimateIn } from "@/components/animate-in";
import { Phone, ArrowRight, Clock3, MapPin, Truck, Warehouse, ChevronDown, Check, ShieldCheck, ArrowUpRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#f4f8fd] pb-16 text-[#10254b] md:pb-0">
      <main>
        <h1 className="sr-only">緊急のトラック手配なら池ノ谷商事｜全国対応</h1>
        <MobileHero />
        <DesktopHero />

        <section className="relative overflow-hidden bg-[#082b68] px-5 py-14 text-white sm:px-8 sm:py-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[34px] border-[#2d83ed]/20" />
          <div className="relative mx-auto max-w-7xl">
            <AnimateIn>
              <div className="flex flex-col gap-5 border-l-2 border-[#65b5ff] pl-5 sm:flex-row sm:items-end sm:justify-between sm:pl-7">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.42em] text-[#7fc6ff]">WHEN TIME MATTERS</p>
                  <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-4xl">その「困った」を、<br className="sm:hidden" />今日の輸送に変える。</h2>
                </div>
                <p className="max-w-xs text-xs leading-7 text-white/65">急な配送、納期変更、車両不足。状況が整理できていなくても大丈夫です。</p>
              </div>
            </AnimateIn>
            <div className="mt-12 grid gap-3 md:grid-cols-3">
              {concerns.map((item, index) => (
                <AnimateIn key={item.number} delay={index * 90}>
                  <article className="group min-h-[210px] border border-white/15 bg-white/[0.07] p-6 transition-colors hover:bg-white/[0.14] sm:p-8">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-[#66baff]">{item.number} / 03</span>
                      <ArrowUpRight className="h-5 w-5 text-white/40 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                    <h3 className="mt-9 whitespace-pre-line text-lg font-bold leading-[1.55]">{item.title}</h3>
                    <p className="mt-4 text-xs leading-6 text-white/55">{item.detail}</p>
                  </article>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f4f8fd] px-5 py-20 sm:px-8 sm:py-28">
          <div className="absolute right-0 top-0 h-72 w-[42%] bg-[#dfeeff] [clip-path:polygon(28%_0,100%_0,100%_100%,0_100%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <AnimateIn direction="left">
              <p className="text-[10px] font-bold tracking-[0.42em] text-[#1763c7]">THE IKENOYASHOJI STANDARD</p>
              <h2 className="mt-5 text-4xl font-black leading-[1.25] tracking-tight text-[#082b68] sm:text-6xl">必要な車両を、<br /><span className="text-[#1763c7]">必要なときに。</span></h2>
              <div className="mt-8 h-1 w-20 bg-[#1763c7]" />
              <p className="mt-8 max-w-md text-sm leading-8 text-[#52657f]">池ノ谷商事は、神奈川県愛川町を拠点に、一般貨物運送・貨物利用運送・倉庫管理を行う物流会社です。急なスポット配送から継続的な定期輸送まで、荷主様の状況に合わせて輸送方法をご提案します。</p>
              <div className="mt-8 grid grid-cols-2 gap-y-3 text-xs font-bold text-[#153e79] sm:grid-cols-3">
                {["全国対応", "2t・4t・大型", "スポット・定期"].map((item) => <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#1763c7]" />{item}</span>)}
              </div>
            </AnimateIn>
            <AnimateIn delay={120} direction="right">
              <div className="relative ml-auto max-w-2xl">
                <div className="absolute -bottom-5 -left-5 h-full w-full border-2 border-[#8ec8ff] sm:-bottom-7 sm:-left-7" />
                <img src={transportImg} alt="輸送車両と配送現場" className="relative aspect-[4/3] w-full object-cover" loading="lazy" />
                <div className="absolute bottom-0 right-0 bg-[#1763c7] px-5 py-4 text-white sm:px-8 sm:py-6">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-white/65">TRUST IN MOTION</p>
                  <p className="mt-1 text-lg font-bold">運ぶ信頼、届ける真心</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <AnimateIn>
              <div className="flex flex-col justify-between gap-5 border-b border-[#cbdcf0] pb-8 sm:flex-row sm:items-end">
                <div><p className="text-[10px] font-bold tracking-[0.42em] text-[#1763c7]">ONE CALL, MANY SOLUTIONS</p><h2 className="mt-4 text-3xl font-black text-[#082b68] sm:text-5xl">緊急配送から定期輸送まで</h2></div>
                <p className="max-w-xs text-xs leading-6 text-[#687b94]">荷物と納期を確認し、最適な輸送方法を一緒に考えます。</p>
              </div>
            </AnimateIn>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {services.map((item, index) => { const Icon = item.icon; return <AnimateIn key={item.number} delay={index * 100}><article className="group relative h-full overflow-hidden border border-[#d7e5f5] bg-[#f7faff] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#4b9aef] hover:shadow-[0_18px_45px_rgba(8,43,104,0.12)] sm:p-9"><span className="absolute right-5 top-4 font-mono text-6xl font-bold text-[#e4effb]">{item.number}</span><div className="relative"><Icon className="h-8 w-8 text-[#1763c7]" strokeWidth={1.5} /><h3 className="mt-12 text-xl font-bold text-[#082b68]">{item.title}</h3><p className="mt-4 text-sm leading-7 text-[#5b6f89]">{item.text}</p><div className="mt-8 h-px w-10 bg-[#1763c7] transition-all group-hover:w-20" /></div></article></AnimateIn> })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#061f4c] px-5 py-20 text-white sm:px-8 sm:py-28">
          <img src={heroAerial} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
          <div className="absolute inset-0 bg-[#061f4c]/85" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <AnimateIn direction="left"><p className="text-[10px] font-bold tracking-[0.42em] text-[#7fc6ff]">THE RIGHT TRUCK FOR THE JOB</p><h2 className="mt-5 text-3xl font-black leading-[1.35] sm:text-5xl">車両の選定まで、<br />こちらで引き受けます。</h2><p className="mt-6 max-w-xl text-sm leading-8 text-white/65">荷物の大きさ・納品先の条件・納期を確認して、2t・4t・大型車両を中心に適した輸送方法をご案内します。</p><div className="mt-9 grid max-w-xl grid-cols-3 gap-px bg-white/20">{vehicles.map((vehicle) => <div key={vehicle.title} className="bg-[#061f4c]/90 px-3 py-5 sm:px-5"><p className="text-xl font-bold text-[#80c7ff] sm:text-2xl">{vehicle.title}</p><p className="mt-2 text-[10px] leading-5 text-white/55">{vehicle.text}</p></div>)}</div></AnimateIn>
            <AnimateIn delay={120} direction="right"><div className="relative"><img src={warehouseImg} alt="池ノ谷商事の物流現場" className="aspect-[4/3] w-full object-cover" loading="lazy" /><div className="absolute -bottom-4 -left-4 border border-[#80c7ff]/60 bg-[#0b367b] px-4 py-3 text-xs font-bold sm:-left-5 sm:px-6">全国の輸送相談に対応</div></div></AnimateIn>
          </div>
        </section>

        <section className="bg-[#eaf3fc] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <AnimateIn><div className="text-center"><p className="text-[10px] font-bold tracking-[0.42em] text-[#1763c7]">FOUR SIMPLE STEPS</p><h2 className="mt-4 text-3xl font-black text-[#082b68] sm:text-5xl">電話相談の流れ</h2></div></AnimateIn>
            <div className="mt-12 grid gap-4 md:grid-cols-4">{[["01","お電話","配送内容や納期をお聞かせください。"],["02","内容確認","荷物・配送先・車両の希望を確認します。"],["03","車両調整","条件に合う輸送方法を検討します。"],["04","ご案内","対応可否とお見積もりをご案内します。"]].map(([number,title,text], index) => <AnimateIn key={number} delay={index * 90}><div className="relative border-t-4 border-[#1763c7] bg-white p-6 shadow-sm sm:p-7"><span className="font-mono text-sm font-bold text-[#1763c7]">{number}</span><h3 className="mt-5 font-bold text-[#082b68]">{title}</h3><p className="mt-3 text-xs leading-6 text-[#63758d]">{text}</p>{index < 3 && <ArrowRight className="absolute -right-3 top-8 hidden h-5 w-5 text-[#1763c7] md:block" />}</div></AnimateIn>)}</div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 sm:px-8 sm:py-28"><div className="mx-auto max-w-3xl"><AnimateIn><div className="mb-10"><p className="text-[10px] font-bold tracking-[0.42em] text-[#1763c7]">QUESTIONS, ANSWERED</p><h2 className="mt-4 text-3xl font-black text-[#082b68] sm:text-5xl">よくあるご質問</h2></div></AnimateIn><div className="divide-y divide-[#d5e3f2] border-y border-[#d5e3f2]">{faqs.map((faq) => <details key={faq.q} className="group py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold leading-6 text-[#082b68] [&::-webkit-details-marker]:hidden"><span><span className="mr-3 font-mono text-[#1763c7]">Q.</span>{faq.q}</span><ChevronDown className="h-5 w-5 flex-shrink-0 text-[#1763c7] transition-transform group-open:rotate-180" /></summary><p className="mt-5 border-l-2 border-[#80c7ff] pl-5 text-sm leading-7 text-[#61758e]"><span className="mr-2 font-mono font-bold text-[#1763c7]">A.</span>{faq.a}</p></details>)}</div></div></section>

        <section className="relative overflow-hidden bg-[#1763c7] px-5 py-20 text-white sm:px-8 sm:py-28"><div className="absolute right-[-8%] top-[-40%] h-[170%] w-[48%] rotate-[18deg] border-l border-white/15 bg-white/[0.04]" /><div className="relative mx-auto max-w-5xl text-center"><AnimateIn><ShieldCheck className="mx-auto h-10 w-10 text-[#a7daff]" strokeWidth={1.4} /><p className="mt-6 text-[10px] font-bold tracking-[0.42em] text-[#b3e0ff]">READY WHEN YOU ARE</p><h2 className="mt-5 text-3xl font-black leading-[1.4] sm:text-6xl">緊急のトラック手配は、<br />まずはお電話ください。</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/75">急な配送、スポット便、定期輸送。まだ内容が固まっていない段階でも、お気軽にご相談ください。</p><PhoneButton location="bottom" className="mt-9 bg-white px-6 py-5 text-[#1763c7] shadow-xl shadow-[#082b68]/20 hover:bg-[#eaf3fc] sm:px-10 sm:py-6" /><p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/65"><MapPin className="h-3.5 w-3.5" />全国の輸送相談</p></AnimateIn></div></section>

        <footer className="border-t border-[#cbdcf0] bg-[#061f4c] px-5 py-10 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold tracking-wide">株式会社池ノ谷商事</p><p className="mt-2 text-[11px] text-white/50">緊急のトラック手配・全国の輸送相談</p></div><div className="flex items-center gap-3 text-[11px] text-white/55"><Link href="/privacy" className="transition-colors hover:text-white">個人情報保護方針</Link><span className="text-white/20">／</span><Link href="/" className="transition-colors hover:text-white">コーポレートサイト</Link></div></div></footer>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/20 bg-[#061f4c] px-3 py-2.5 shadow-[0_-4px_20px_rgba(6,31,76,0.25)] md:hidden"><PhoneButton location="mobile_fixed" compact className="w-full text-white" /></div>
    </div>
  );
}