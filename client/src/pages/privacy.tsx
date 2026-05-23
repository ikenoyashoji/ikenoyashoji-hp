import { useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimateIn } from "@/components/animate-in";
import { trackPageView } from "@/lib/analytics";
import { setSeo } from "@/lib/seo";
import { Shield, Lock, Eye, UserCheck, Trash2, Mail, FileText, Cookie, Server, AlertCircle } from "lucide-react";
import heroImg from "@assets/スクリーンショット_2026-05-22_14.34.44_1779428095288.png";

const sections = [
  {
    id: "01",
    icon: FileText,
    title: "個人情報の取り扱いについて",
    content: (
      <p className="leading-relaxed text-gray-600 text-sm">
        株式会社池ノ谷商事（以下「当社」）は、お客様・求職者・協力会社の皆様の個人情報を適切に管理・保護することを経営上の重要課題のひとつとして位置づけています。個人情報の保護に関する法律（個人情報保護法）、その他関係法令・ガイドラインを遵守し、以下の方針に基づいて個人情報を取り扱います。
      </p>
    ),
  },
  {
    id: "02",
    icon: Eye,
    title: "収集する個人情報の種類",
    content: (
      <div className="space-y-4 text-sm text-gray-600">
        <p>当社では、以下の種類の個人情報を収集することがあります。</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "基本情報", items: ["氏名・ふりがな", "会社名・部署名・役職", "住所・郵便番号"] },
            { label: "連絡先情報", items: ["電話番号・FAX番号", "メールアドレス", "緊急連絡先"] },
            { label: "業務関連情報", items: ["お問い合わせ内容", "ご利用サービスに関する情報", "取引履歴・契約内容"] },
            { label: "採用関連情報", items: ["履歴書・職務経歴書", "資格・免許情報", "面接・選考に関する記録"] },
            { label: "ウェブ情報", items: ["IPアドレス", "Cookie・閲覧履歴", "アクセスログ・端末情報"] },
            { label: "その他", items: ["お客様からご提供いただいた情報", "法令に基づき収集した情報"] },
          ].map((group) => (
            <div key={group.label} className="bg-gray-50 border border-gray-100 p-4">
              <p className="font-semibold text-gray-800 text-xs tracking-wider mb-2">{group.label}</p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1 h-1 rounded-full bg-[#1d4ed8] flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "03",
    icon: UserCheck,
    title: "個人情報の利用目的",
    content: (
      <div className="text-sm text-gray-600 space-y-3">
        <p>収集した個人情報は、以下の目的の範囲内で利用します。目的外の利用は行いません。</p>
        <div className="space-y-2">
          {[
            { num: "1", title: "お問い合わせ対応", desc: "荷主・協力会社・一般の方からのお問い合わせへの回答および連絡" },
            { num: "2", title: "サービスのご提供", desc: "輸送・倉庫管理・物流コンサルティング等のサービス提供および契約管理" },
            { num: "3", title: "採用活動", desc: "求職者の選考、採否通知、入社手続きに関する連絡" },
            { num: "4", title: "協力会社登録・業務委託", desc: "協力会社の審査・登録・業務委託に関する連絡および管理" },
            { num: "5", title: "マーケティング・情報提供", desc: "サービス情報・イベント・コラムのご案内（同意をいただいた場合のみ）" },
            { num: "6", title: "法令対応", desc: "税務・行政対応など法令上必要な手続き" },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 p-3 border border-gray-100 bg-gray-50/50">
              <span className="text-[#1d4ed8] font-bold text-xs w-4 flex-shrink-0">{item.num}</span>
              <div>
                <p className="font-semibold text-gray-800 text-xs mb-0.5">{item.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "04",
    icon: Shield,
    title: "個人情報の第三者提供",
    content: (
      <div className="text-sm text-gray-600 space-y-3">
        <p className="leading-relaxed">当社は、以下の場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。</p>
        <ul className="space-y-2">
          {[
            "法令に基づく場合（捜査機関・行政機関からの適法な要請等）",
            "人の生命・身体・財産の保護のために必要な場合であって、ご本人の同意を得ることが困難な場合",
            "公衆衛生の向上または児童の健全な育成のために必要な場合",
            "国の機関もしくは地方公共団体が法令の定める事務を遂行することに協力する必要がある場合",
            "業務委託先への提供（秘密保持契約を締結した上で、業務遂行に必要な範囲のみ）",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-gray-500 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] flex-shrink-0 mt-1.5" />{item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "05",
    icon: Cookie,
    title: "Cookieおよびアクセス解析について",
    content: (
      <div className="text-sm text-gray-600 space-y-4">
        <p className="leading-relaxed">当社のウェブサイトでは、以下のツールを利用してアクセス状況を分析しています。これらはすべてお客様の同意に基づき利用されます。</p>
        <div className="space-y-3">
          {[
            { name: "Google Analytics 4（GA4）", desc: "Google LLCが提供するアクセス解析ツール。ページビュー・滞在時間・流入元などを分析します。収集データはGoogleのプライバシーポリシーに基づき管理されます。" },
            { name: "Microsoft Clarity", desc: "Microsoftが提供するヒートマップ・セッション録画ツール。ウェブサイトの利便性向上のために利用します。" },
            { name: "内部アナリティクス", desc: "当社独自のアクセスログ記録システム。ページビュー・問い合わせ動向の把握に利用します。" },
          ].map((tool) => (
            <div key={tool.name} className="border border-gray-100 p-4">
              <p className="font-semibold text-gray-800 text-xs mb-1">{tool.name}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">Cookieの受け入れ設定はブラウザ側で変更可能です。ただし、一部機能が制限される場合があります。</p>
      </div>
    ),
  },
  {
    id: "06",
    icon: Server,
    title: "個人情報の安全管理措置",
    content: (
      <div className="text-sm text-gray-600 space-y-3">
        <p className="leading-relaxed">当社は、個人情報への不正アクセス・漏えい・紛失・改ざん等を防止するため、以下の安全管理措置を実施しています。</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: "組織的措置", desc: "個人情報管理責任者の設置、取り扱いルールの整備" },
            { title: "人的措置", desc: "従業員への定期的な教育・研修の実施" },
            { title: "物理的措置", desc: "書類・機器の施錠管理、アクセス制限区域の設定" },
            { title: "技術的措置", desc: "SSL暗号化通信、アクセスログ管理、ウイルス対策" },
          ].map((m) => (
            <div key={m.title} className="bg-gray-50 border border-gray-100 p-4">
              <p className="font-semibold text-gray-800 text-xs mb-1">{m.title}</p>
              <p className="text-xs text-gray-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "07",
    icon: Lock,
    title: "個人情報の保存期間",
    content: (
      <div className="text-sm text-gray-600 space-y-3">
        <p className="leading-relaxed">個人情報の保存期間は利用目的に応じて以下のとおり定めています。保存期間終了後は、適切な方法で削除または廃棄します。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#0f2044] text-white">
                <th className="px-4 py-2 text-left font-medium tracking-wide">情報の種類</th>
                <th className="px-4 py-2 text-left font-medium tracking-wide">保存期間</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["お問い合わせ情報", "対応完了後 3年間"],
                ["採用選考情報（不採用）", "選考終了後 6ヶ月"],
                ["採用選考情報（採用）", "退職後 5年間"],
                ["取引先情報", "取引終了後 7年間"],
                ["ウェブアクセスログ", "取得後 12ヶ月"],
              ].map(([type, period], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-2.5 border-b border-gray-100 text-gray-700">{type}</td>
                  <td className="px-4 py-2.5 border-b border-gray-100 text-gray-500">{period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "08",
    icon: Trash2,
    title: "個人情報の開示・訂正・削除のご請求",
    content: (
      <div className="text-sm text-gray-600 space-y-3">
        <p className="leading-relaxed">ご本人から個人情報の利用目的の通知、開示、内容の訂正・追加・削除、利用の停止・消去、第三者への提供の停止をご希望の場合は、下記の問い合わせ窓口までお申し出ください。合理的な期間内に対応いたします。</p>
        <div className="bg-blue-50 border border-blue-100 p-4 text-xs text-blue-800 leading-relaxed">
          ご本人確認のため、運転免許証等の身分証明書の写しをご提出いただく場合があります。
        </div>
      </div>
    ),
  },
  {
    id: "09",
    icon: AlertCircle,
    title: "プライバシーポリシーの変更",
    content: (
      <p className="text-sm text-gray-600 leading-relaxed">
        当社は、法令の改正・業務内容の変更等に伴い、本プライバシーポリシーを改定することがあります。改定した場合は、当ウェブサイト上に掲載します。重要な変更については、サイト上で分かりやすくご案内します。
      </p>
    ),
  },
];

export default function Privacy() {
  useEffect(() => {
    trackPageView("/privacy");
    setSeo({
      title: "個人情報保護方針",
      description: "株式会社池ノ谷商事の個人情報保護方針（プライバシーポリシー）をご確認いただけます。お客様の個人情報を適切に管理・保護することをお約束します。",
      path: "/privacy",
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative mt-[100px] overflow-hidden">
        <img src={heroImg} alt="個人情報保護方針" className="w-full h-auto block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2044]/80 via-[#0f2044]/60 to-[#0f2044]/90" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 flex items-center justify-center text-center px-8">
          <AnimateIn>
            <p className="text-[#7eb3ff] text-[10px] tracking-[0.6em] mb-6">Ikenoyashoji Co.,Ltd.</p>
            <h1 className="hero-title text-2xl sm:text-4xl md:text-6xl font-extralight text-white tracking-[0.08em] sm:tracking-[0.15em] mb-6">個人情報保護方針</h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#1d4ed8] to-transparent mx-auto mb-6" />
            <p className="text-gray-300 text-sm tracking-widest">お客様の個人情報を、誠実かつ適切に管理します。</p>
          </AnimateIn>
        </div>
      </section>

      {/* Intro commitment card */}
      <section className="py-16 px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <AnimateIn>
            <div className="bg-[#0f2044] p-8 flex gap-6 items-start">
              <Shield className="w-8 h-8 text-[#7eb3ff] flex-shrink-0 mt-1" />
              <div>
                <p className="text-[#7eb3ff] text-xs tracking-[0.4em] uppercase mb-2">OUR COMMITMENT</p>
                <p className="text-white text-sm leading-relaxed">
                  株式会社池ノ谷商事は、お客様・取引先・求職者の皆様からお預かりする個人情報を、プライバシーの権利として尊重します。個人情報保護法および関連法令を遵守し、適切な安全管理のもとで取り扱うことをお約束します。
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Sections */}
      <main className="flex-1 pb-24 px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <AnimateIn key={section.id} delay={i * 50}>
                <div className="border border-gray-100 bg-white hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div className="w-8 h-8 bg-[#0f2044] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-[#1d4ed8] text-xs font-medium tracking-[0.3em]">{section.id}</span>
                      <h2 className="font-semibold text-gray-900 text-sm tracking-wide">{section.title}</h2>
                    </div>
                  </div>
                  <div className="px-6 py-5">{section.content}</div>
                </div>
              </AnimateIn>
            );
          })}

          {/* Contact box */}
          <AnimateIn delay={sections.length * 50}>
            <div className="border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#0f2044] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[#1d4ed8] text-xs font-medium tracking-[0.3em]">10</span>
                  <h2 className="font-semibold text-gray-900 text-sm tracking-wide">個人情報に関するお問い合わせ窓口</h2>
                </div>
              </div>
              <div className="pl-11 space-y-1 text-sm text-gray-600">
                <p className="font-semibold text-gray-800">株式会社池ノ谷商事　個人情報管理担当</p>
                <p>〒243-0303 神奈川県愛甲郡愛川町中津7287</p>
                <p>TEL: <a href="tel:046-212-2766" className="text-[#1d4ed8] hover:underline">046-212-2766</a>　FAX: 046-401-1714</p>
                <p>Email: <a href="mailto:info@ikenoyashoji.co.jp" className="text-[#1d4ed8] hover:underline">info@ikenoyashoji.co.jp</a></p>
                <p className="text-xs text-gray-400 mt-2">受付時間：平日 9:00〜21:00（土日祝・年末年始を除く）</p>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={(sections.length + 1) * 50}>
            <p className="text-gray-400 text-xs text-right border-t border-gray-100 pt-4">
              制定日：2023年2月20日　／　最終改定日：2025年4月1日
            </p>
          </AnimateIn>
        </div>
      </main>

      <Footer />
    </div>
  );
}
