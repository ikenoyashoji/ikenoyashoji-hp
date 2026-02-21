import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { trackPageView } from "@/lib/analytics";

export default function Privacy() {
  useEffect(() => {
    trackPageView("/privacy");
    document.title = "プライバシーポリシー｜アクロス物流株式会社";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-16 bg-[#0f2044]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-2xl md:text-3xl font-black text-white">プライバシーポリシー</h1>
          <p className="text-blue-200 mt-2 text-sm">最終更新日：2024年4月1日</p>
        </div>
      </section>

      <main className="flex-1 py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto prose prose-slate max-w-none prose-headings:text-[#0f2044] prose-headings:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground text-sm">

          <p>アクロス物流株式会社（以下「当社」）は、お客様の個人情報の保護を重要な責務と認識し、以下のプライバシーポリシーを定めます。</p>

          <h2 id="personal-info">第1条（個人情報の定義）</h2>
          <p>「個人情報」とは、個人情報保護法に定める個人情報を指し、生存する個人に関する情報であって、氏名、住所、電話番号、メールアドレスその他の記述等により特定の個人を識別できるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含む）をいいます。</p>

          <h2>第2条（個人情報の収集）</h2>
          <p>当社は、以下の方法で個人情報を収集することがあります：</p>
          <ul>
            <li>お問い合わせフォームへの入力</li>
            <li>電話・メールでのお問い合わせ</li>
            <li>採用応募フォームへの入力</li>
            <li>協力会社登録フォームへの入力</li>
            <li>Webサイトのアクセスログ（Cookie等）</li>
          </ul>

          <h2>第3条（個人情報の利用目的）</h2>
          <p>当社が収集した個人情報は、以下の目的で利用します：</p>
          <ul>
            <li>お問い合わせへの回答・対応</li>
            <li>輸送サービスの提供・見積もりの送付</li>
            <li>採用選考・採用連絡</li>
            <li>協力会社登録・案件案内</li>
            <li>サービス改善のための分析</li>
            <li>法令に基づく対応</li>
          </ul>

          <h2>第4条（個人情報の第三者提供）</h2>
          <p>当社は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません：</p>
          <ul>
            <li>お客様の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
          </ul>

          <h2>第5条（アクセス解析ツールについて）</h2>
          <p>当社は、Webサイトの利用状況を分析するため、以下のツールを使用しています：</p>
          <ul>
            <li><strong>Google Analytics 4（GA4）</strong>：Googleが提供するアクセス解析サービスです。Cookieを使用してアクセス情報を収集します。収集されたデータはGoogleのプライバシーポリシーに従って管理されます。</li>
            <li><strong>Microsoft Clarity</strong>：Microsoftが提供するヒートマップ・セッション録画サービスです。ユーザーの操作をCookieで追跡します。</li>
          </ul>
          <p>これらのツールはお客様の明示的な同意（Cookieバナーでの「同意」クリック）後にのみ有効化されます。</p>
          <p>なお、当社は都道府県別のアクセス統計も収集しています。これはIPアドレスから推定した<strong>「推定」</strong>値であり、精度は参考レベルです。</p>

          <h2>第6条（Cookieについて）</h2>
          <p>当社は、Cookieを使用することがあります。お客様はブラウザの設定でCookieを無効にすることができますが、その場合一部のサービスが正常に機能しない場合があります。</p>

          <h2 id="disclaimer">第7条（免責事項）</h2>
          <p>当社Webサイトのコンテンツや情報については正確性に努めていますが、その内容の完全性・正確性・最新性について保証するものではありません。当社Webサイトの利用に起因するいかなる損害についても、当社は責任を負いません。</p>
          <p>また、当社Webサイトからリンクされた外部Webサイトの内容については、当社は関知しておりません。</p>

          <h2>第8条（個人情報の安全管理）</h2>
          <p>当社は、収集した個人情報の漏洩、紛失、改ざんを防止するため、適切な安全管理措置を講じます。個人情報を取り扱う従業員に対して、適切な教育・監督を実施します。</p>

          <h2>第9条（個人情報の開示・訂正・削除）</h2>
          <p>お客様は、当社が保有する自己の個人情報について、開示・訂正・削除を請求することができます。下記お問い合わせ窓口までご連絡ください。</p>

          <h2>第10条（プライバシーポリシーの変更）</h2>
          <p>当社は、法令の改正等に応じて本プライバシーポリシーを適宜見直し、改定することがあります。変更後のプライバシーポリシーは当サイトに掲載した時点から有効とします。</p>

          <h2>第11条（お問い合わせ窓口）</h2>
          <p>個人情報の取扱いに関するお問い合わせは、以下の窓口までご連絡ください：</p>
          <p>
            アクロス物流株式会社 個人情報取扱窓口<br />
            住所：〒135-0001 東京都江東区東陽1-1-1<br />
            電話：03-1234-5678（平日9:00〜18:00）<br />
            Email：privacy@across-logistics.co.jp
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
