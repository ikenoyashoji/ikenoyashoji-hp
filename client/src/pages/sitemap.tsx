import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import { ChevronRight } from "lucide-react";

const sitemapData = [
  {
    category: "メインページ",
    en: "MAIN",
    links: [
      { label: "ホーム", href: "/" },
      { label: "池ノ谷商事について", href: "/about" },
    ],
  },
  {
    category: "企業情報",
    en: "COMPANY",
    links: [
      { label: "企業情報", href: "/company" },
      { label: "会社概要", href: "/company" },
      { label: "拠点情報", href: "/company" },
      { label: "組織図・沿革", href: "/company" },
    ],
  },
  {
    category: "事業紹介",
    en: "SERVICES",
    links: [
      { label: "事業紹介トップ", href: "/services" },
      { label: "一般貨物自動車運送業", href: "/services" },
      { label: "倉庫管理・荷役作業", href: "/services" },
      { label: "３PL（サードパーティロジスティクス）", href: "/services" },
      { label: "物流コンサルティング", href: "/services" },
      { label: "総合保険代理店", href: "/services" },
      { label: "車両販売・整備", href: "/services" },
    ],
  },
  {
    category: "採用情報",
    en: "RECRUIT",
    links: [
      { label: "採用情報トップ", href: "/recruit" },
      { label: "募集職種", href: "/recruit" },
      { label: "1日の流れ", href: "/recruit" },
      { label: "よくある質問", href: "/recruit" },
      { label: "応募フォーム", href: "/contact?type=recruit" },
    ],
  },
  {
    category: "協力会社",
    en: "PARTNER",
    links: [
      { label: "協力会社募集", href: "/partner" },
      { label: "協力会社登録フォーム", href: "/contact?type=partner" },
    ],
  },
  {
    category: "お知らせ",
    en: "NEWS",
    links: [
      { label: "お知らせ一覧", href: "/blog" },
      { label: "物流コラム", href: "/blog" },
      { label: "採用情報", href: "/blog" },
    ],
  },
  {
    category: "お問い合わせ",
    en: "CONTACT",
    links: [
      { label: "お問い合わせ", href: "/contact" },
      { label: "荷主・輸送のご相談", href: "/contact?type=shipper" },
      { label: "採用のお問い合わせ", href: "/contact?type=recruit" },
      { label: "協力会社のご登録", href: "/contact?type=partner" },
    ],
  },
  {
    category: "その他",
    en: "OTHER",
    links: [
      { label: "個人情報保護方針", href: "/privacy" },
      { label: "サイトマップ", href: "/sitemap" },
    ],
  },
];

export default function Sitemap() {
  useEffect(() => {
    trackPageView("/sitemap");
    document.title = "サイトマップ｜株式会社池ノ谷商事";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section
        className="mt-[100px] flex items-end pb-14 px-8 overflow-hidden"
        style={{ minHeight: "200px", background: "linear-gradient(135deg, #0f2044 0%, #1a4b99 60%, #1d4ed8 100%)" }}
      >
        <div className="max-w-5xl mx-auto w-full">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-xs tracking-[0.5em] uppercase mb-3">SITEMAP</p>
            <h1 className="text-5xl font-extralight text-white tracking-[0.15em] mb-4">サイトマップ</h1>
            <div className="w-12 h-0.5 bg-[#1d4ed8]" />
          </AnimateIn>
        </div>
      </section>

      {/* Sitemap grid */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sitemapData.map((section, i) => (
              <AnimateIn key={section.category} delay={i * 50}>
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <span className="text-[10px] tracking-[0.4em] text-[#1d4ed8] uppercase font-medium">{section.en}</span>
                    <div className="w-px h-3 bg-gray-200" />
                    <span className="text-sm font-semibold text-gray-800">{section.category}</span>
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href}>
                          <span className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1d4ed8] transition-colors group cursor-pointer">
                            <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#1d4ed8] transition-colors flex-shrink-0" />
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
