import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface CtaBannerProps {
  title?: string;
  subtitle?: string;
  quoteLabel?: string;
  contactLabel?: string;
  quoteType?: string;
}

export function CtaBanner({
  title = "まずはお気軽にご相談ください",
  subtitle = "見積もりは無料・最短30分で回答。24時間365日対応しています。",
  quoteLabel = "無料で見積もりを依頼する",
  contactLabel = "お問い合わせ",
  quoteType = "shipper",
}: CtaBannerProps) {
  return (
    <section className="bg-gradient-to-r from-[#0f2044] to-[#1a3a7a] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{title}</h2>
        <p className="text-blue-200 mb-8 text-base md:text-lg">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href={`/contact?type=${quoteType}`}>
            <Button
              size="lg"
              className="bg-amber-500 text-white font-bold border-amber-400 text-base px-8 min-w-[220px]"
              onClick={() => trackEvent("cta_quote_click", { location: "cta_banner" })}
              data-testid="button-cta-quote"
            >
              {quoteLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white bg-transparent min-w-[180px] text-base"
              onClick={() => trackEvent("cta_contact_click", { location: "cta_banner" })}
              data-testid="button-cta-contact"
            >
              {contactLabel}
            </Button>
          </Link>
          <a
            href="tel:0312345678"
            className="flex items-center gap-2 text-amber-300 font-semibold text-base hover:text-amber-200 transition-colors"
            onClick={() => trackEvent("tel_click", { location: "cta_banner" })}
            data-testid="link-cta-tel"
          >
            <Phone className="w-5 h-5" />
            03-1234-5678
          </a>
        </div>
      </div>
    </section>
  );
}
