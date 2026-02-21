import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Truck, Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/#services", label: "サービス" },
  { href: "/recruit", label: "採用情報" },
  { href: "/partner", label: "協力会社" },
  { href: "/blog", label: "ブログ" },
  { href: "/company", label: "会社情報" },
];

export function Header() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const handleCtaClick = () => {
    trackEvent("cta_contact_click", { location: "header" });
  };
  const handleQuoteClick = () => {
    trackEvent("cta_quote_click", { location: "header" });
  };
  const handleTelClick = () => {
    trackEvent("tel_click", { location: "header" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f2044] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-amber-500 rounded p-1.5">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold text-base tracking-tight">アクロス物流</span>
              <span className="text-blue-300 text-[10px] tracking-widest">ACROSS LOGISTICS</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-blue-100 hover:text-white transition-colors rounded-md hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <a
              href="tel:0312345678"
              onClick={handleTelClick}
              className="flex items-center gap-1.5 text-white text-sm font-medium px-3 py-1.5 rounded border border-white/20 hover:bg-white/10 transition-colors"
              data-testid="link-tel-header"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>03-1234-5678</span>
            </a>
            <Link href="/contact?type=shipper" onClick={handleQuoteClick} data-testid="button-quote-header">
              <Button size="sm" className="bg-amber-500 text-white font-bold border-amber-400">
                無料見積もり
              </Button>
            </Link>
            <Link href="/contact" onClick={handleCtaClick} data-testid="button-contact-header">
              <Button size="sm" variant="outline" className="border-white/30 text-white bg-transparent">
                お問い合わせ
              </Button>
            </Link>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button size="icon" variant="ghost" className="text-white" data-testid="button-mobile-menu">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0f2044] border-blue-900 w-72">
              <div className="flex items-center gap-2 mb-8 mt-2">
                <div className="bg-amber-500 rounded p-1.5">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">アクロス物流</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    data-testid={`link-nav-mobile-${link.label}`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href="tel:0312345678"
                  onClick={handleTelClick}
                  className="flex items-center justify-center gap-2 py-3 rounded-md border border-white/20 text-white text-sm"
                  data-testid="link-tel-mobile"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  03-1234-5678
                </a>
                <Link href="/contact?type=shipper" onClick={() => { setOpen(false); handleQuoteClick(); }}>
                  <Button className="w-full bg-amber-500 text-white font-bold border-amber-400" data-testid="button-quote-mobile">
                    無料見積もりを依頼
                  </Button>
                </Link>
                <Link href="/contact" onClick={() => { setOpen(false); handleCtaClick(); }}>
                  <Button variant="outline" className="w-full border-white/30 text-white bg-transparent" data-testid="button-contact-mobile">
                    お問い合わせ
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
