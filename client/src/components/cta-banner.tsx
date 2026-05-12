import { Link } from "wouter";
import { Phone, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  quoteLabel?: string;
  contactLabel?: string;
  quoteType?: string;
}

export function CtaBanner({
  title = "現場の声に、まっすぐ応えます。",
  subtitle = "輸送についてのご相談は、どうぞお気軽に。お電話・お問い合わせフォーム、どちらからでも承ります。",
  quoteLabel = "お問い合わせはこちら",
  contactLabel = "お問い合わせ",
  quoteType = "shipper",
}: CtaBannerProps) {
  return (
    <section className="relative py-20 px-4 bg-gray-50 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-500 mb-8 text-sm md:text-base leading-relaxed max-w-xl mx-auto">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="tel:0312345678"
            className="flex items-center gap-2 text-[#1d4ed8] font-bold text-xl hover:text-[#1e3a8a] transition-colors"
            onClick={() => trackEvent("tel_click", { location: "cta_banner" })}
            data-testid="link-cta-tel"
          >
            <Phone className="w-5 h-5" />
            03-1234-5678
          </a>
          <Link href={`/contact?type=${quoteType}`}>
            <button
              className="flex items-center gap-2 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm"
              onClick={() => trackEvent("cta_quote_click", { location: "cta_banner" })}
              data-testid="button-cta-quote"
            >
              <Mail className="w-4 h-4" />
              {quoteLabel}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
