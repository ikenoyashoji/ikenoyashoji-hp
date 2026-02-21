import { Link } from "wouter";
import { Truck, Phone, Mail, MapPin, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function Footer() {
  const handleTelClick = () => trackEvent("tel_click", { location: "footer" });
  const handleLineClick = () => trackEvent("line_click", { location: "footer" });

  return (
    <footer className="bg-[#0a1628] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-amber-500 rounded p-1.5">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-base">アクロス物流株式会社</div>
                <div className="text-blue-400 text-xs tracking-widest">ACROSS LOGISTICS CO., LTD.</div>
              </div>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-4">
              スピード・品質・安心のワンストップ物流サービス。関東圏を中心に全国対応。24時間365日、あなたの物流を支えます。
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="tel:0312345678"
                onClick={handleTelClick}
                className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
                data-testid="link-tel-footer"
              >
                <Phone className="w-4 h-4" />
                03-1234-5678
              </a>
              <a
                href="mailto:info@across-logistics.co.jp"
                className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
                data-testid="link-email-footer"
              >
                <Mail className="w-4 h-4" />
                info@across-logistics.co.jp
              </a>
              <div className="flex items-start gap-2 text-blue-300">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>〒135-0001 東京都江東区東陽1-1-1</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Clock className="w-4 h-4" />
                <span>24時間 365日対応</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4">サービス</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              {["定期輸送", "スポット輸送", "チャーター便", "幹線輸送", "中継輸送", "特殊輸送"].map((s) => (
                <li key={s}>
                  <a href="/#services" className="hover:text-white transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4">会社情報</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              {[
                { href: "/company", label: "会社概要" },
                { href: "/recruit", label: "採用情報" },
                { href: "/partner", label: "協力会社募集" },
                { href: "/blog", label: "ブログ" },
                { href: "/contact", label: "お問い合わせ" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400 mb-4">お問い合わせ</h3>
            <p className="text-sm text-blue-300 mb-3">荷物の輸送依頼・お見積もりはお気軽にご連絡ください。</p>
            <div className="flex flex-col gap-2">
              <Link href="/contact?type=shipper">
                <button className="w-full py-2.5 px-4 bg-amber-500 text-white text-sm font-bold rounded-md hover-elevate">
                  無料見積もりを依頼
                </button>
              </Link>
              <Link href="/contact">
                <button className="w-full py-2.5 px-4 bg-transparent border border-white/20 text-white text-sm rounded-md hover:bg-white/5 transition-colors">
                  お問い合わせフォーム
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-blue-400 text-xs">
            © {new Date().getFullYear()} アクロス物流株式会社. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-blue-400">
            <Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link>
            <Link href="/privacy#disclaimer" className="hover:text-white transition-colors">免責事項</Link>
            <Link href="/privacy#personal-info" className="hover:text-white transition-colors">個人情報の取扱い</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
