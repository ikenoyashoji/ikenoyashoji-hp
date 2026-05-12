import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function Footer() {
  const handleTelClick = () => trackEvent("tel_click", { location: "footer" });

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <div className="flex items-center gap-0.5 mb-1">
                <span className="text-blue-300 font-black text-xl italic">池ノ谷</span>
                <span className="text-blue-400 font-black text-xl italic">商事</span>
              </div>
              <div className="text-gray-400 text-xs tracking-widest">株式会社池ノ谷商事</div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              スピード・品質・安心のワンストップ物流サービス。関東圏を中心に全国対応。
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">ページ</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { href: "/", label: "ホーム" },
                { href: "/company", label: "企業情報" },
                { href: "/#services", label: "サービスのご案内" },
                { href: "/recruit", label: "採用情報" },
                { href: "/partner", label: "協力会社募集" },
                { href: "/blog", label: "お知らせ" },
                { href: "/contact", label: "お問い合わせ" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">お問い合わせ</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <a
                href="tel:0312345678"
                onClick={handleTelClick}
                className="flex items-center gap-2 hover:text-white transition-colors"
                data-testid="link-tel-footer"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                03-1234-5678
              </a>
              <a
                href="mailto:info@ikenoya-shoji.co.jp"
                className="flex items-center gap-2 hover:text-white transition-colors"
                data-testid="link-email-footer"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                info@ikenoya-shoji.co.jp
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>〒135-0001 東京都江東区東陽1-1-1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} 株式会社池ノ谷商事. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
