import { useEffect } from "react";
import { Link } from "wouter";
import { AnimateIn } from "@/components/animate-in";
import { Footer } from "@/components/footer";
import { Phone, ArrowRight, Clock3, MapPin, Truck, Warehouse, ChevronDown } from "lucide-react";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import heroTruck from "@assets/5029A6E0-F753-4C3C-9B97-E2826E325D91_1779426563754.webp";
import heroAerial from "@assets/hero_aerial_logistics.webp";
import transportImg from "@assets/BE3582A6-2E5C-49C7-8922-B23D966DDB2B_1779581062877.webp";
import warehouseImg from "@assets/3591D69C-9B93-4472-B7C0-24217B55FC36_1779427030587.webp";

const phoneNumber = "046-212-2766";
const phoneHref = "tel:0462122766";

const phoneCta = (location: string) => {
  trackEvent("cta_phone_click", { location, phone: phoneNumber });
};

function LpHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center" aria-label="池ノ谷商事ホーム">
          <img src="/logo-full.jpg" alt="株式会社池ノ谷商事" className="h-10 w-auto object-contain sm:h-12" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <span className="hidden text-xs font-medium tracking-[0.12em] text-gray-500 sm:block">荷主様向け・全国対応</span>
          <a
            href={phoneHref}
            onClick={() => phoneCta("lp_header")}
            className="flex items-center gap-2 bg-[#0f2044] px-3 py-2 text-white transition-colors hover:bg-[#164da3] sm:gap-3 sm:px-5 sm:py-2.5"
            data-testid="link-lp-phone-header"
          >
            <Phone className="h-4 w-4" strokeWidth={1.8} />
            <span className="text-left">
              <span className="hidden text-[9px] tracking-[0.12em] text-white/70 sm:block">まずは電話で相談する</span>
              <span className="text-sm font-semibold tracking-wide sm:text-base">{phoneNumber}</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}

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
      <LpHeader />

      <main>
        <section className="relative mt-[74px] min-h-[650px] overflow-hidden bg-[#eef5fc] sm:min-h-[720px]">
          <img
            src={heroTruck}
            alt="高速道路を走るトラック"
            className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:object-center"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/15 md:from-white md:via-white/90 md:to-white/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f2044]/20 via-transparent to-transparent" />
          <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-16 sm:min-h-[720px] sm:px-10 lg:px-16">
            <div className="max-w-xl">
              <AnimateIn>
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.48em] text-[#1a4b99] sm:text-xs">Ikenoyashoji logistics service</p>
                <div className="mb-5 h-px w-12 bg-[#1d4ed8]" />
                <h1 className="max-w-3xl font-serif text-[clamp(1.45rem,5.5vw,4.15rem)] font-bold leading-[1.18] tracking-[0.02em] text-[#0f2044]">
                  <span className="block" style={{ whiteSpace: "nowrap" }}>緊急のトラック手配なら</span>
                  <span className="mt-2 block text-[0.82em] text-[#164da3]" style={{ whiteSpace: "nowrap" }}>
                    <span className="hidden sm:inline">今日、トラックが必要になった方へ。</span>
                    <span className="sm:hidden">今日、必要になった方へ。</span>
                  </span>
                </h1>
                <p className="mt-7 max-w-md text-sm leading-8 text-gray-600 sm:text-base">
                  急な配送、車両不足、当日・翌日の輸送相談に。<br />
                  荷物や納期がまだ整理できていなくても、わかる範囲でお聞かせください。
                </p>
              </AnimateIn>

              <AnimateIn delay={120}>
                <PhoneButton
                  location="hero"
                  className="mt-8 bg-[#0f2044] px-5 py-4 text-white shadow-xl shadow-[#0f2044]/15 hover:bg-[#164da3] sm:px-7 sm:py-5"
                />
                <p className="mt-3 text-[11px] leading-5 tracking-[0.04em] text-gray-500">
                  荷物・納期・配送先がわかる範囲で大丈夫です。<br />
                  「今日運べるかだけ聞きたい」というご相談もOKです。
                </p>
              </AnimateIn>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 hidden h-24 w-[42%] bg-[#0f2044] [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] md:block" />
        </section>

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

        <section className="border-t border-gray-100 px-5 py-12 sm:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 sm:flex-row">
            <p className="text-xs leading-6 text-gray-500">株式会社池ノ谷商事の事業内容や会社情報はこちら</p>
            <Link href="/services" className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#1a4b99] hover:text-[#1d4ed8]">
              事業紹介を見る <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/20 bg-[#0f2044] px-3 py-2.5 shadow-[0_-4px_20px_rgba(15,32,68,0.18)] md:hidden">
        <PhoneButton location="mobile_fixed" compact className="w-full text-white" />
      </div>
    </div>
  );
}