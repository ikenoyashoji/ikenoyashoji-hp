import { useEffect } from "react";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CtaBanner } from "@/components/cta-banner";
import { trackPageView } from "@/lib/analytics";
import { CheckCircle, ChevronRight, MapPin, Phone } from "lucide-react";

const companyInfo = [
  { label: "会社名", value: "アクロス物流株式会社" },
  { label: "英語表記", value: "ACROSS LOGISTICS CO., LTD." },
  { label: "設立", value: "2009年（平成21年）4月" },
  { label: "資本金", value: "3,000万円" },
  { label: "代表取締役", value: "山田 太郎" },
  { label: "本社所在地", value: "〒135-0001 東京都江東区東陽1-1-1 東陽ビル3F" },
  { label: "TEL", value: "03-1234-5678" },
  { label: "FAX", value: "03-1234-5679" },
  { label: "Email", value: "info@across-logistics.co.jp" },
  { label: "営業時間", value: "24時間・365日対応（事務：平日9:00〜18:00）" },
  { label: "事業内容", value: "一般貨物自動車運送事業、貨物利用運送事業、貨物軽自動車運送事業" },
  { label: "車両台数", value: "自社50台 + 提携100台以上" },
  { label: "従業員数", value: "約120名（パート・アルバイト含む）" },
  { label: "加盟団体", value: "公益社団法人 全日本トラック協会、東京都トラック協会" },
];

export default function Company() {
  useEffect(() => {
    trackPageView("/company");
    document.title = "企業情報｜アクロス物流株式会社";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero - representative message style */}
      <section className="pt-16 relative min-h-[60vh] flex items-stretch">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-200 to-gray-400 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/40" />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="relative text-center">
              <div className="w-32 h-32 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-4xl font-black">山</span>
              </div>
              <div className="text-white font-bold">山田 太郎</div>
              <div className="text-white/60 text-sm">代表取締役</div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 bg-white flex items-center p-8 md:p-16">
          <div>
            <div className="mb-4">
              <span className="text-[#c0392b] font-black text-4xl italic font-serif">Company</span>
              <p className="text-gray-400 text-sm mt-1">企業情報</p>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-snug">
              誠実に、まっすぐに。<br />
              地域に根ざし、信頼を育んできました。
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              アクロス物流は、2009年の創業以来、安全・確実・丁寧をモットーに、輸送業務と構内作業に取り組んできました。長年の経験と現場力を活かし、地域社会とともに歩みながら、お客様との信頼関係を一つひとつ丁寧に築いてきた歴史があります。
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              これからも、誠実な姿勢で現場に向き合い、確かな仕事を積み重ねてまいります。
            </p>
            <Link href="/contact">
              <button className="flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white font-medium px-6 py-3 rounded-full transition-colors text-sm">
                View More.
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Wide photo strip */}
      <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden" style={{ minHeight: 260 }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px)" }} />
        <div className="max-w-7xl mx-auto px-4 h-full flex items-end py-8">
          <p className="text-white/20 text-5xl font-black italic tracking-tight">Driven by Trust.</p>
        </div>
      </div>

      {/* Philosophy */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <span className="text-[#c0392b] font-black text-3xl italic font-serif">Philosophy</span>
            <p className="text-gray-400 text-sm mt-1">企業理念</p>
          </div>
          <div className="bg-[#6B9E9E] rounded-xl p-8 mb-8 text-center">
            <p className="text-2xl md:text-3xl font-black text-white mb-2">"物流で、社会をつなぐ。"</p>
            <p className="text-white/60 text-sm">CONNECTING SOCIETY THROUGH LOGISTICS</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "誠実", desc: "お客様・パートナー・社員に対して、常に誠実であることを第一とします。" },
              { title: "安全", desc: "全ての業務において安全を最優先に。事故ゼロの実現に向けて取り組みます。" },
              { title: "革新", desc: "テクノロジーと現場力を融合させ、物流の常識を変え続けます。" },
            ].map((p) => (
              <div key={p.title} className="border border-gray-200 rounded-lg p-6 hover-elevate">
                <div className="text-[#c0392b] font-black text-2xl mb-2">{p.title}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company info */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-[#c0392b] font-black text-3xl italic font-serif">Overview</span>
            <p className="text-gray-400 text-sm mt-1">会社概要</p>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {companyInfo.map((item, i) => (
              <div key={item.label} className={`flex ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <div className="w-40 md:w-48 flex-shrink-0 px-4 py-3 font-semibold text-sm text-gray-600 border-r border-gray-100 bg-gray-50">
                  {item.label}
                </div>
                <div className="px-4 py-3 text-sm text-gray-700 flex-1">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-[#c0392b] font-black text-3xl italic font-serif">Certifications</span>
            <p className="text-gray-400 text-sm mt-1">認証・取組み</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Gマーク認証取得", desc: "国土交通省認定の安全優良事業所として認定を受けています。" },
              { title: "ISO 9001認証", desc: "品質マネジメントシステムの国際規格を取得し、品質向上に取り組んでいます。" },
              { title: "グリーン経営認証", desc: "環境負荷低減に取り組むグリーン経営認証を取得しています。" },
              { title: "働きやすい職場認証", desc: "ドライバーが働きやすい環境づくりに取り組み、認証を取得しています。" },
            ].map((c) => (
              <div key={c.title} className="flex gap-3 p-4 border border-gray-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#6B9E9E] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-800 text-sm mb-1">{c.title}</div>
                  <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
