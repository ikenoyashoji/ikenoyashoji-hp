import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { trackPageView } from "@/lib/analytics";

export default function Privacy() {
  useEffect(() => {
    trackPageView("/privacy");
    document.title = "プライバシーポリシー｜株式会社池ノ谷商事";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <span className="text-[#1d4ed8] font-black text-3xl italic font-serif">Privacy Policy</span>
          <p className="text-gray-400 text-sm mt-1 mb-10">プライバシーポリシー</p>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-8">
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-3">1. 個人情報の取り扱いについて</h2>
              <p className="leading-relaxed">株式会社池ノ谷商事（以下「当社」）は、お客様の個人情報の取り扱いについて、個人情報の保護に関する法律（個人情報保護法）その他関係法令を遵守し、適切に管理いたします。</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-3">2. 収集する個人情報の種類</h2>
              <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                <li>氏名、会社名、部署名、役職</li>
                <li>住所、電話番号、メールアドレス</li>
                <li>お問い合わせ内容、ご利用サービスに関する情報</li>
                <li>ウェブサイトのアクセスログ（IPアドレス、Cookie情報等）</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-3">3. 個人情報の利用目的</h2>
              <ul className="list-disc pl-5 space-y-1 leading-relaxed">
                <li>お問い合わせへの対応・回答</li>
                <li>サービスのご提供・ご案内</li>
                <li>採用活動における選考および連絡</li>
                <li>協力会社登録審査および業務委託</li>
                <li>法令に基づく対応</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-3">4. 個人情報の第三者提供</h2>
              <p className="leading-relaxed">当社は、以下の場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。</p>
              <ul className="list-disc pl-5 space-y-1 mt-2 leading-relaxed">
                <li>法令に基づく場合</li>
                <li>人の生命・身体・財産の保護のために必要な場合</li>
                <li>公衆衛生の向上・児童の健全な育成のために必要な場合</li>
              </ul>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-3">5. Cookieについて</h2>
              <p className="leading-relaxed">当社のウェブサイトでは、Google Analytics（GA4）およびMicrosoft Clarityを利用して、ウェブサイトのアクセス状況を分析しています。これらのサービスはCookieを使用します。Cookieの使用はお客様の同意に基づきます。</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-3">6. 個人情報の安全管理</h2>
              <p className="leading-relaxed">当社は、個人情報への不正アクセス、紛失、破壊、改ざん、漏えい等を防止するため、適切な安全管理措置を講じます。</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-3">7. 個人情報の開示・訂正・削除</h2>
              <p className="leading-relaxed">ご本人から個人情報の開示・訂正・削除をご希望の場合は、以下の問い合わせ窓口までご連絡ください。</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-3">8. お問い合わせ</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="font-semibold text-gray-800 mb-1">株式会社池ノ谷商事 個人情報管理担当</p>
                <p>〒243-0303 神奈川県愛甲郡愛川町中津7287</p>
                <p>TEL: 046-212-2766　FAX: 046-401-1714</p>
                <p>Email: privacy@ikenoya-shoji.co.jp</p>
              </div>
            </section>
            <p className="text-gray-400 text-xs">制定日：2024年4月1日 / 最終改定日：2025年1月1日</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
