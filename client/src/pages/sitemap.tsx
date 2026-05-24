import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { ChevronRight, Truck, Users, Handshake, BookOpen, Building2, Info, Phone, Shield, Map, LayoutGrid } from "lucide-react";
import heroImg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.webp";

const siteStructure = [
  {
    category: "サービス・事業内容",
    en: "SERVICES",
    icon: Truck,
    links: [
      { label: "サービス一覧", href: "/services", desc: "8つの事業をワンストップで提供" },
      { label: "一般貨物自動車運送", href: "/services", desc: "長距離・近距離の一般貨物輸送" },
      { label: "貨物利用運送", href: "/services", desc: "最適なキャリアを組み合わせた輸送手配" },
      { label: "貨物軽自動車運送", href: "/services", desc: "軽バン・軽トラによる小口配送" },
      { label: "物流コンサルティング", href: "/services", desc: "最適な物流フロー設計をご提案" },
      { label: "倉庫管理", href: "/services", desc: "保管・入出庫・在庫管理の一括対応" },
      { label: "総合保険代理店", href: "/services", desc: "運送・貨物保険から企業向け保険まで" },
      { label: "各種車両販売・買取", href: "/services", desc: "新車・中古車販売および買取" },
      { label: "一般整備・車検・板金・レッカー", href: "/services", desc: "車両に関するあらゆるサービス" },
    ],
  },
  {
    category: "採用情報",
    en: "RECRUIT",
    icon: Users,
    links: [
      { label: "採用トップ", href: "/recruit", desc: "池ノ谷商事で働くことの魅力" },
      { label: "募集職種・待遇", href: "/recruit", desc: "ドライバー・事務・管理職など6職種" },
      { label: "福利厚生", href: "/recruit", desc: "15の充実した福利厚生" },
      { label: "キャリアパス・社員の声", href: "/recruit", desc: "入社から管理職へのステップと現役社員のコメント" },
      { label: "よくある質問", href: "/recruit", desc: "採用に関するQ&A 8問" },
      { label: "採用エントリー", href: "/contact?type=recruit", desc: "応募・ご質問はこちら" },
    ],
  },
  {
    category: "協力会社",
    en: "PARTNER",
    icon: Handshake,
    links: [
      { label: "協力会社募集", href: "/partner", desc: "個人事業主・法人の方へ" },
      { label: "ご登録の流れ・条件", href: "/partner", desc: "お問い合わせから契約まで" },
      { label: "協力会社向けお問い合わせ", href: "/contact?type=partner", desc: "登録ご希望の方はこちら" },
    ],
  },
  {
    category: "ブログ・コラム",
    en: "BLOG",
    icon: BookOpen,
    links: [
      { label: "ブログトップ", href: "/blog", desc: "物流・採用に関する最新コラム" },
      { label: "物流コラム", href: "/blog?category=物流コラム", desc: "荷主向け物流改善のヒント" },
      { label: "採用情報", href: "/blog?category=採用情報", desc: "ドライバー求人・働き方" },
      { label: "お知らせ", href: "/blog?category=お知らせ", desc: "池ノ谷商事からのお知らせ" },
    ],
  },
  {
    category: "会社情報",
    en: "COMPANY",
    icon: Building2,
    links: [
      { label: "会社の特徴・強み", href: "/about", desc: "3つの強みと差別化ポイント" },
      { label: "会社概要", href: "/company", desc: "設立・資本金・許認可番号など" },
      { label: "拠点情報", href: "/company", desc: "神奈川県愛川町 本社および各拠点" },
      { label: "沿革", href: "/company", desc: "2023年2月設立からの歩み" },
    ],
  },
  {
    category: "お問い合わせ",
    en: "CONTACT",
    icon: Phone,
    links: [
      { label: "お問い合わせフォーム", href: "/contact", desc: "荷主・採用・協力会社の窓口" },
      { label: "荷主・輸送のご相談", href: "/contact?type=shipper", desc: "輸送依頼・見積もりのご依頼" },
      { label: "採用のお問い合わせ", href: "/contact?type=recruit", desc: "求人・採用に関するご質問" },
      { label: "協力会社のご登録", href: "/contact?type=partner", desc: "協力会社として登録ご希望の方" },
    ],
  },
  {
    category: "サイトポリシー",
    en: "POLICY",
    icon: Shield,
    links: [
      { label: "個人情報保護方針", href: "/privacy", desc: "個人情報の取り扱いについて" },
      { label: "サイトマップ", href: "/sitemap", desc: "このページです" },
    ],
  },
];

const quickLinks = [
  { label: "ホーム", href: "/" },
  { label: "サービス", href: "/services" },
  { label: "採用情報", href: "/recruit" },
  { label: "協力会社", href: "/partner" },
  { label: "ブログ", href: "/blog" },
  { label: "会社概要", href: "/company" },
  { label: "会社の特徴", href: "/about" },
  { label: "お問い合わせ", href: "/contact" },
  { label: "個人情報保護方針", href: "/privacy" },
];

export default function SitemapPage() {
  useEffect(() => {
    trackPageView("/sitemap");
    setSeo({
      title: "サイトマップ",
      description: "株式会社池ノ谷商事のウェブサイト全ページ一覧です。サービス・採用・協力会社・会社情報・お問い合わせなどへのリンクをまとめています。",
      path: "/sitemap",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden">
        <img src={heroImg} alt="サイトマップ" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] uppercase mb-6">SITE MAP</p>
            <h1 className="hero-title text-2xl sm:text-4xl md:text-6xl font-extralight text-white tracking-[0.08em] sm:tracking-[0.15em] mb-6">サイトマップ</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
            <p className="text-gray-300 text-sm tracking-widest">全ページへのリンクをまとめています。</p>
          </AnimateIn>
        </div>
      </section>

      {/* Sitemap grid */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <AnimateIn>
            <div className="flex items-center gap-3 mb-10">
              <LayoutGrid className="w-5 h-5 text-[#1d4ed8]" />
              <span className="text-xs tracking-[0.4em] text-gray-400 uppercase">All Pages</span>
            </div>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-6">
            {siteStructure.map((section, i) => {
              const Icon = section.icon;
              return (
                <AnimateIn key={section.category} delay={i * 60}>
                  <div className="border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                      <div className="w-8 h-8 bg-[#0f2044] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] tracking-[0.3em] text-[#1d4ed8] font-medium uppercase">{section.en}</span>
                        <span className="text-gray-300 text-xs">/</span>
                        <h2 className="font-semibold text-gray-900 text-sm">{section.category}</h2>
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-50">
                      {section.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link
                            href={link.href}
                            className="flex items-start gap-3 px-6 py-3.5 hover:bg-blue-50/50 transition-colors group"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-[#1d4ed8] flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                            <div>
                              <span className="text-sm text-gray-800 group-hover:text-[#1d4ed8] transition-colors font-medium block">{link.label}</span>
                              <span className="text-xs text-gray-400 leading-relaxed">{link.desc}</span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              );
            })}
          </div>

          {/* Quick links */}
          <AnimateIn delay={siteStructure.length * 60 + 60}>
            <div className="mt-12 border-t border-gray-100 pt-8">
              <p className="text-xs tracking-[0.4em] text-gray-400 uppercase mb-4 flex items-center gap-2">
                <Map className="w-3.5 h-3.5" /> Quick Links
              </p>
              <div className="flex flex-wrap gap-2">
                {quickLinks.map((q) => (
                  <Link
                    key={q.href}
                    href={q.href}
                    className="border border-gray-200 text-gray-500 hover:border-[#1d4ed8] hover:text-[#1d4ed8] text-xs px-4 py-2 transition-colors"
                  >
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
