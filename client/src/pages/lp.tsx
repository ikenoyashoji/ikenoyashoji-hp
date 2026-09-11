import { useEffect } from "react";
import { Link } from "wouter";
import { AnimateIn } from "@/components/animate-in";
import { Phone, ArrowRight, Clock3, MapPin, Truck, Warehouse, ChevronDown } from "lucide-react";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import heroAerial from "@assets/hero_aerial_logistics.webp";
import transportImg from "@assets/BE3582A6-2E5C-49C7-8922-B23D966DDB2B_1779581062877.webp";
import warehouseImg from "@assets/3591D69C-9B93-4472-B7C0-24217B55FC36_1779427030587.webp";
import heroWoman from "@assets/woman_hero_enhanced.png";
import heroTruck from "@assets/hero_truck_clean.png";

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
        src={heroTruck}
        alt="緊急配送に対応するトラック"
        className="absolute bottom-[82px] right-[-38%] z-20 w-[145%] max-w-none drop-shadow-[0_18px_28px_rgba(0,22,70,0.28)]"
      />

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
        src={heroTruck}
        alt="緊急配送に対応するトラック"
        className="absolute bottom-0 right-[2%] z-20 w-[59%] max-w-none drop-shadow-[0_22px_34px_rgba(0,22,70,0.28)]"
      />

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
    <div className="min-h-screen bg-white text-[#111827] pb-16 md:pb-0">
      <main>
        <h1 className="sr-only">緊急のトラック手配なら池ノ谷商事｜全国対応</h1>
        <MobileHero />
        <DesktopHero />

        <section className="bg-[#0f2044] px-5 py-12 text-white sm:px-8 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-[10px] font-semibold tracking-[0.4em] text-[#83b7ff]">DO YOU HAVE THIS CONCERN?</p>
                <h2 className="font-serif text-2xl leading-tight sm:text-3xl">こんなお困りごとはありませんか？</h2>
              </div>
              <p className="text-xs leading-6 text-white/55">急なご依頼も、まずはご相談ください。</p>
            </div>
            <div className="grid gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-3">
              {concerns.map((item) => (
                <div key={item.number} className="bg-[#0f2044] px-6 py-7 sm:px-8 sm:py-9">
                  <span className="text-4xl font-light tracking-tight text-[#4d8ee8]">{item.number}</span>
                  <h3 className="mt-5 whitespace-pre-line text-lg font-semibold leading-[1.55] tracking-wide text-white">{item.title}</h3>
                  <p className="mt-4 text-xs leading-6 text-white/55">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
          <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#edf4fc]" />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <AnimateIn>
              <p className="mb-4 text-[10px] font-semibold tracking-[0.42em] text-[#1d4ed8]">WHY IKENOYASHOJI</p>
              <h2 className="font-serif text-3xl font-bold leading-[1.4] text-[#0f2044] sm:text-4xl">
                必要な車両を、<br />
                必要なときに。
              </h2>
              <div className="my-7 h-px w-14 bg-[#1d4ed8]" />
              <p className="text-sm leading-8 text-gray-600">
                池ノ谷商事は、神奈川県愛川町を拠点に、一般貨物運送・貨物利用運送・倉庫管理を行う物流会社です。
                急なスポット配送から継続的な定期輸送まで、荷主様の状況に合わせて輸送方法をご提案します。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["全国対応", "2t・4t・大型", "スポット・定期"].map((item) => (
                  <span key={item} className="border border-[#c8d8ef] bg-white px-4 py-2 text-xs font-medium tracking-wide text-[#1a4b99]">{item}</span>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={120}>
              <div className="relative">
                <img src={transportImg} alt="輸送車両と配送現場" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                <div className="absolute -bottom-5 -left-5 bg-[#164da3] px-5 py-4 text-white sm:-left-8 sm:px-7 sm:py-5">
                  <p className="text-[10px] tracking-[0.25em] text-white/70">LOGISTICS FOR TOMORROW</p>
                  <p className="mt-1 font-serif text-xl">運ぶ信頼、届ける真心</p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section className="bg-[#f4f7fb] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-xl">
              <p className="mb-4 text-[10px] font-semibold tracking-[0.42em] text-[#1d4ed8]">WHAT WE CAN DO</p>
              <h2 className="font-serif text-3xl font-bold text-[#0f2044] sm:text-4xl">緊急配送から定期輸送まで</h2>
              <p className="mt-5 text-sm leading-7 text-gray-600">お急ぎの配送も、継続的な輸送も。荷物と納期に合わせた物流を一緒に考えます。</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {services.map((item) => {
                const Icon = item.icon;
                return (
                  <AnimateIn key={item.number}>
                    <article className="group h-full border border-[#dce6f2] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#7fa9dc] hover:shadow-xl hover:shadow-[#0f2044]/5 sm:p-9">
                      <div className="flex items-start justify-between">
                        <span className="text-4xl font-light text-[#b9cee9]">{item.number}</span>
                        <Icon className="h-7 w-7 text-[#1d4ed8]" strokeWidth={1.4} />
                      </div>
                      <h3 className="mt-8 text-xl font-semibold tracking-wide text-[#0f2044]">{item.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-gray-600">{item.text}</p>
                    </article>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0f2044] px-5 py-20 text-white sm:px-8 sm:py-24">
          <img src={heroAerial} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" loading="lazy" />
          <div className="absolute inset-0 bg-[#0f2044]/80" />
          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <AnimateIn>
              <p className="mb-4 text-[10px] font-semibold tracking-[0.42em] text-[#83b7ff]">AVAILABLE VEHICLES</p>
              <h2 className="font-serif text-3xl font-bold leading-[1.45] sm:text-4xl">荷物と納品先に合わせて<br />車両を調整します。</h2>
              <p className="mt-6 max-w-xl text-sm leading-8 text-white/70">
                2t・4t・大型車両を中心に、荷物の大きさ・納品先の条件・納期を確認して、適した輸送方法をご案内します。
              </p>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-px bg-white/20">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.title} className="bg-[#0f2044]/80 px-3 py-5 sm:px-5">
                    <p className="text-xl font-semibold text-[#83b7ff] sm:text-2xl">{vehicle.title}</p>
                    <p className="mt-2 text-[10px] leading-5 text-white/60">{vehicle.text}</p>
                  </div>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={120}>
              <img src={warehouseImg} alt="池ノ谷商事の物流現場" className="aspect-[4/3] w-full object-cover opacity-95" loading="lazy" />
            </AnimateIn>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-4 text-[10px] font-semibold tracking-[0.42em] text-[#1d4ed8]">HOW IT WORKS</p>
              <h2 className="font-serif text-3xl font-bold text-[#0f2044] sm:text-4xl">電話相談の流れ</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                ["01", "お電話", "配送内容や納期をお聞かせください。"],
                ["02", "内容確認", "荷物・配送先・車両の希望を確認します。"],
                ["03", "車両調整", "条件に合う輸送方法を検討します。"],
                ["04", "ご案内", "対応可否とお見積もりをご案内します。"],
              ].map(([number, title, text]) => (
                <div key={number} className="relative border-t-2 border-[#d9e6f6] pt-5">
                  <span className="text-3xl font-light text-[#1d4ed8]">{number}</span>
                  <h3 className="mt-3 font-semibold tracking-wide text-[#0f2044]">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-gray-500">{text}</p>
                  {number !== "04" && <ArrowRight className="absolute -right-4 top-7 hidden h-4 w-4 text-[#9ebde4] md:block" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f7fb] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="mb-4 text-[10px] font-semibold tracking-[0.42em] text-[#1d4ed8]">FAQ</p>
              <h2 className="font-serif text-3xl font-bold text-[#0f2044] sm:text-4xl">よくあるご質問</h2>
            </div>
            <div className="divide-y divide-[#d7e2ef] border-y border-[#d7e2ef]">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold leading-6 text-[#0f2044] [&::-webkit-details-marker]:hidden">
                    <span><span className="mr-3 text-[#1d4ed8]">Q.</span>{faq.q}</span>
                    <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#1d4ed8] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 pl-7 text-sm leading-7 text-gray-600"><span className="mr-2 font-semibold text-[#1d4ed8]">A.</span>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-28">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-[#eef5fc] [clip-path:polygon(0_0,72%_0,100%_100%,0_100%)]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="mb-4 text-[10px] font-semibold tracking-[0.42em] text-[#1d4ed8]">CONTACT US</p>
            <h2 className="font-serif text-3xl font-bold leading-[1.45] text-[#0f2044] sm:text-5xl">緊急のトラック手配は、<br />まずはお電話ください。</h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-600">
              <span className="block">急な配送、スポット便、定期輸送。</span>
              <span className="block">まだ内容が固まっていない段階でも、お気軽にご相談ください。</span>
            </p>
            <PhoneButton
              location="bottom"
              className="mt-9 bg-[#164da3] px-6 py-5 text-white shadow-lg shadow-[#164da3]/20 hover:bg-[#0f2044] sm:px-10 sm:py-6"
            />
            <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-500"><MapPin className="h-3.5 w-3.5 text-[#1d4ed8]" />全国の輸送相談</p>
          </div>
        </section>

        <section className="border-t border-gray-100 bg-[#f7fbff] px-5 py-9 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold tracking-wide text-[#0f2044]">株式会社池ノ谷商事</p>
              <p className="mt-1 text-[11px] text-gray-500">緊急のトラック手配・全国の輸送相談</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-[11px] text-gray-500 sm:justify-end">
              <Link href="/privacy" className="hover:text-[#1d4ed8]">個人情報保護方針</Link>
              <span className="text-gray-300">／</span>
              <Link href="/" className="hover:text-[#1d4ed8]">コーポレートサイト</Link>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/20 bg-[#0f2044] px-3 py-2.5 shadow-[0_-4px_20px_rgba(15,32,68,0.18)] md:hidden">
        <PhoneButton location="mobile_fixed" compact className="w-full text-white" />
      </div>
    </div>
  );
}