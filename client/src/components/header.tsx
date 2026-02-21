import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mail, Truck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const navLinks = [
  { href: "/", label: "ホーム" },
  { href: "/#services", label: "サービスのご案内" },
  { href: "/company", label: "企業情報" },
  { href: "/recruit", label: "採用情報" },
  { href: "/blog", label: "お知らせ" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1">
                <span className="text-[#1a4b99] font-black text-xl tracking-tight italic">アクロス</span>
                <span className="text-[#c0392b] font-black text-xl tracking-tight italic">物流</span>
              </div>
              <span className="text-gray-500 text-[10px] tracking-widest">アクロス物流株式会社</span>
            </div>
          </Link>

          {/* Desktop Nav - pill container */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center gap-0.5 bg-gray-600/85 backdrop-blur-sm rounded-full px-3 py-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-white/90 hover:text-white transition-colors rounded-full hover:bg-white/10 whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/partner"
                className="px-3 py-1.5 text-sm text-white/90 hover:text-white transition-colors rounded-full hover:bg-white/10 whitespace-nowrap"
              >
                協力会社
              </Link>
            </div>
            <Link
              href="/contact"
              onClick={() => trackEvent("cta_contact_click", { location: "header" })}
              className="ml-3 flex items-center gap-1.5 bg-[#c0392b] hover:bg-[#a93226] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              data-testid="button-contact-header"
            >
              <Mail className="w-3.5 h-3.5" />
              お問い合わせ
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <button className="p-2 text-gray-600 hover:text-gray-900" data-testid="button-mobile-menu">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white border-gray-200 w-72">
              <div className="flex flex-col leading-none mb-8 mt-2">
                <div className="flex items-center gap-1">
                  <span className="text-[#1a4b99] font-black text-xl italic">アクロス</span>
                  <span className="text-[#c0392b] font-black text-xl italic">物流</span>
                </div>
                <span className="text-gray-400 text-[10px] tracking-widest">アクロス物流株式会社</span>
              </div>
              <nav className="flex flex-col gap-1">
                {[...navLinks, { href: "/partner", label: "協力会社" }].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-gray-700 hover:text-[#1a4b99] hover:bg-gray-50 rounded-md transition-colors text-sm"
                    data-testid={`link-nav-mobile-${link.label}`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6">
                <Link
                  href="/contact"
                  onClick={() => { setOpen(false); trackEvent("cta_contact_click", { location: "header_mobile" }); }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#c0392b] text-white rounded-full text-sm font-medium"
                  data-testid="button-contact-mobile"
                >
                  <Mail className="w-4 h-4" />
                  お問い合わせ
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
