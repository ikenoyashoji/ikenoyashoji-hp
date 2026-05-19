import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const FONT = "/tmp/NotoSansJP.otf";
const OUT_DIR = "client/public/docs";
fs.mkdirSync(OUT_DIR, { recursive: true });

function createDoc() {
  return new PDFDocument({
    size: "A4",
    margins: { top: 65, bottom: 65, left: 72, right: 72 },
    info: { Author: "株式会社池ノ谷商事", Creator: "株式会社池ノ谷商事" },
    bufferPages: true,
  });
}

function pageHeader(doc) {
  doc.font("JP").fontSize(8).fillColor("#aaaaaa")
    .text("株式会社池ノ谷商事", { align: "right" });
  doc.moveDown(0.2);
  doc.moveTo(72, doc.y).lineTo(523, doc.y).lineWidth(0.4).strokeColor("#dddddd").stroke();
  doc.moveDown(0.8);
}

function docTitle(doc, title, subtitle) {
  doc.font("JP").fontSize(17).fillColor("#0f2044").text(title, { align: "center" });
  doc.moveDown(0.4);
  doc.font("JP").fontSize(9.5).fillColor("#666666").text(subtitle, { align: "center" });
  doc.moveDown(0.6);
  doc.moveTo(72, doc.y).lineTo(523, doc.y).lineWidth(0.8).strokeColor("#0f2044").stroke();
  doc.moveDown(1.2);
}

function chapterTitle(doc, text) {
  doc.moveDown(0.6);
  doc.font("JP").fontSize(12).fillColor("#0f2044").text(text);
  doc.moveDown(0.15);
  doc.moveTo(72, doc.y).lineTo(523, doc.y).lineWidth(0.4).strokeColor("#1d4ed8").stroke();
  doc.moveDown(0.5);
}

function articleTitle(doc, text) {
  doc.moveDown(0.5);
  doc.font("JP").fontSize(10).fillColor("#1a1a1a").text(text);
  doc.moveDown(0.2);
}

function body(doc, text) {
  doc.font("JP").fontSize(9.2).fillColor("#333333")
    .text(text, { lineGap: 3.5, paragraphGap: 2 });
}

function indent(doc, text) {
  doc.font("JP").fontSize(9.2).fillColor("#333333")
    .text(text, { lineGap: 3.5, indent: 16 });
}

function addFooters(doc) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const pageNum = i - range.start + 1;
    doc.font("JP").fontSize(7.5).fillColor("#aaaaaa")
      .text(
        `株式会社池ノ谷商事　神奈川県愛甲郡愛川町中津7287　TEL: 046-286-0015`,
        72, 800, { align: "left" }
      )
      .text(`- ${pageNum} -`, 72, 800, { align: "right" });
  }
}

// ══════════════════════════════════════════════════════════
//  1. 標準貨物自動車運送約款
// ══════════════════════════════════════════════════════════
{
  const doc = createDoc();
  const out = fs.createWriteStream(path.join(OUT_DIR, "standard-cargo-terms.pdf"));
  doc.pipe(out);
  doc.registerFont("JP", FONT);

  pageHeader(doc);
  docTitle(doc, "標準貨物自動車運送約款", "国土交通省告示 平成29年（2017年）改正版準拠");

  body(doc, "本約款は、一般貨物自動車運送事業者である株式会社池ノ谷商事（以下「当社」という。許可番号：関自貨第1201号）が行う運送事業に関し、荷主と当社との間の運送契約の内容を定めるものです。");

  chapterTitle(doc, "第一章　総則");

  articleTitle(doc, "（事業の種類）\n第一条");
  body(doc, "当社が行う貨物自動車運送事業は、一般貨物自動車運送事業とする。");

  articleTitle(doc, "（適用範囲）\n第二条");
  body(doc, "当社が行う運送に関しては、法令又は別段の定めがある場合を除き、この運送約款の定めるところによる。\n２　この運送約款に定めのない事項については、法令又は一般慣習による。");

  articleTitle(doc, "（用語の定義）\n第三条");
  body(doc, "この運送約款において「荷送人」とは、当社に対し運送を委託する者をいう。\n２　「荷受人」とは、運送品の受取人をいう。\n３　「運送品」とは、当社が運送を引き受けた貨物をいう。\n４　「送り状」とは、荷送人が作成し当社に交付する書面であって、荷送人・荷受人の氏名又は名称及び住所、運送品の品名・個数・重量・容積、発地及び着地その他運送に必要な事項を記載したものをいう。");

  chapterTitle(doc, "第二章　運送の引受け");

  articleTitle(doc, "（運送の引受け）\n第四条");
  body(doc, "当社は、次の各号のいずれかに該当する場合には、運送の引受けを拒絶することができる。");
  indent(doc, "一　当該運送に適する設備がないとき。\n二　当該運送品が運送に適しない状態にあるとき。\n三　当該運送が法令の規定若しくは公序良俗に反するものであるとき。\n四　天災その他やむを得ない事由があるとき。\n五　荷送人が第五条の規定による申告を怠り、又は虚偽の申告をしたとき。");

  articleTitle(doc, "（申告義務）\n第五条");
  body(doc, "荷送人は、運送品を当社に引き渡すに際し、品名、個数及び重量を正確に申告しなければならない。\n２　荷送人は、運送品が危険品であるときは、その旨及び危険の程度その他安全な運送のために必要な事項を申告しなければならない。\n３　当社は、前二項の申告について、必要があると認めるときは、荷送人に対して運送品の点検を求めることができる。");

  articleTitle(doc, "（運賃及び料金）\n第六条");
  body(doc, "運賃及び料金は、当社が別途定める運賃・料金表によるものとし、荷送人との合意によって決定する。\n２　当社は、収受した運賃及び料金については、理由のいかんにかかわらず、これを返還しない。ただし、当社の責めに帰すべき事由により運送が完了しなかったときは、この限りでない。");

  chapterTitle(doc, "第三章　運送品の受取及び引渡し");

  articleTitle(doc, "（送り状）\n第七条");
  body(doc, "当社は、荷送人から送り状の交付を受けて運送品を受け取るものとする。\n２　荷送人の請求があるときは、送り状と引換えに受取書を交付する。\n３　当社は、受け取った運送品が送り状の記載と異なるときは、荷送人に通知して指示を求めることができる。");

  articleTitle(doc, "（運送品の確認）\n第八条");
  body(doc, "当社は、運送品を受け取るに際し、荷送人が申告した品名・個数・重量等を外観から確認することができる。\n２　荷送人はこれに協力するものとし、必要に応じて梱包の開示を求めることができる。\n３　運送品の内容物による損害については、荷送人の申告が正確でなかったことを原因とする場合、当社は責任を負わない。");

  articleTitle(doc, "（運送品の引渡し）\n第九条");
  body(doc, "当社は、運送品を荷受人に引き渡すに際し、荷受人の署名又は押印を求めることができる。\n２　荷受人が引取りを拒絶し、又は荷受人を確知できないときは、荷送人に通知のうえ指示を求める。指示を得られない場合は、当社の判断により保管又は処分することができる。\n３　引渡しを完了した後に生じた運送品の損害については、当社は責任を負わない。");

  chapterTitle(doc, "第四章　責任");

  articleTitle(doc, "（当社の損害賠償責任）\n第十条");
  body(doc, "当社は、運送品の受取から引渡しまでの間に生じた運送品の滅失、毀損又は延着について、当社に帰責事由がある場合に限り、その損害を賠償する責任を負う。\n２　前項の場合において、当社が損害賠償責任を負うべき損害の額は、運送品の引渡しが行われるべき地及び時における市場価格によって算定した当該運送品の価格を限度とする。\n３　当社の損害賠償の責任は、荷受人が運送品を受け取った日から十四日以内に当社に対して通知を発しない場合は、消滅する。ただし、当社が悪意の場合はこの限りでない。");

  articleTitle(doc, "（免責事項）\n第十一条");
  body(doc, "次の各号に掲げる事由による損害については、当社は責任を負わない。");
  indent(doc, "一　荷送人又は荷受人の故意又は過失\n二　運送品の欠陥、性質又は自然の消耗\n三　同盟罷業、同盟怠業、社会的騒擾その他の事変\n四　天災、地震、津波、落雷その他の不可抗力\n五　危険品について荷送人が申告を行わなかったこと\n六　行政機関の命令・処分");

  articleTitle(doc, "（特別な損害）\n第十二条");
  body(doc, "当社は、特別の事情によって生じた損害については、当社がその事情を予見し、又は予見することができた場合であっても、賠償の責任を負わない。");

  chapterTitle(doc, "第五章　雑則");

  articleTitle(doc, "（消滅時効）\n第十三条");
  body(doc, "運送に関する当社の損害賠償責任は、荷受人が運送品を受け取った日（運送品の全部滅失の場合にあっては引渡しがされるべき日）から一年を経過したときは、時効によって消滅する。");

  articleTitle(doc, "（準拠法及び管轄裁判所）\n第十四条");
  body(doc, "本約款は日本法に準拠し、解釈される。\n２　本約款に関連して生じる一切の紛争の第一審の専属的合意管轄裁判所は、横浜地方裁判所とする。");

  articleTitle(doc, "（約款の変更）\n第十五条");
  body(doc, "当社は、法令に定める手続を経た上で本約款を変更することができる。\n２　変更後の約款は当社ウェブサイト（https://ikenoyashoji.jp）に掲示することにより公示し、掲示の日から効力を生じる。");

  doc.moveDown(1.5);
  doc.moveTo(72, doc.y).lineTo(523, doc.y).lineWidth(0.4).strokeColor("#dddddd").stroke();
  doc.moveDown(0.8);
  doc.font("JP").fontSize(8.5).fillColor("#555555")
    .text("制定　2026年1月1日", { align: "left" });
  doc.moveDown(0.3);
  doc.font("JP").fontSize(8.5).fillColor("#555555")
    .text("株式会社池ノ谷商事　代表取締役　池ノ谷　翔", { align: "right" });

  doc.flushPages();
  addFooters(doc);
  doc.end();
  await new Promise(r => out.on("finish", r));
  console.log("✓ standard-cargo-terms.pdf");
}

// ══════════════════════════════════════════════════════════
//  2. 貨物利用運送約款
// ══════════════════════════════════════════════════════════
{
  const doc = createDoc();
  const out = fs.createWriteStream(path.join(OUT_DIR, "freight-forwarding-terms.pdf"));
  doc.pipe(out);
  doc.registerFont("JP", FONT);

  pageHeader(doc);
  docTitle(doc, "貨物利用運送約款", "貨物利用運送事業法（第一種）に基づく　登録番号：関自貨第542号");

  body(doc, "本約款は、第一種貨物利用運送事業者である株式会社池ノ谷商事（以下「当社」という。登録番号：関自貨第542号）が行う貨物利用運送事業に関し、荷送人と当社との間の利用運送契約の内容を定めるものです。");

  chapterTitle(doc, "第一章　総則");

  articleTitle(doc, "（事業の種類）\n第一条");
  body(doc, "当社が行う貨物利用運送事業は、第一種貨物利用運送事業（自動車を利用した内国貨物の運送）とする。");

  articleTitle(doc, "（適用範囲）\n第二条");
  body(doc, "当社が行う貨物利用運送に関しては、法令又は別段の定めがある場合を除き、この利用運送約款の定めるところによる。\n２　この利用運送約款に定めのない事項については、法令又は一般慣習による。");

  articleTitle(doc, "（用語の定義）\n第三条");
  body(doc, "この利用運送約款において「荷送人」とは、当社に対し貨物の運送を委託する者をいう。\n２　「実運送会社」とは、当社が運送の履行のために利用する一般貨物自動車運送事業者をいう。\n３　「利用運送」とは、実運送会社の行う運送（実運送）を利用して行う貨物の運送をいう。\n４　「運送品」とは、当社が利用運送の引受けをした貨物をいう。");

  chapterTitle(doc, "第二章　利用運送の引受け");

  articleTitle(doc, "（引受けの拒絶）\n第四条");
  body(doc, "当社は、次の各号のいずれかに該当する場合には、利用運送の引受けを拒絶することができる。");
  indent(doc, "一　利用する実運送会社が確保できないとき。\n二　運送品が運送に適しない状態にあるとき。\n三　当該運送が法令の規定若しくは公序良俗に反するものであるとき。\n四　天災その他やむを得ない事由があるとき。\n五　荷送人が第五条の規定による申告を怠り、又は虚偽の申告をしたとき。");

  articleTitle(doc, "（申告義務）\n第五条");
  body(doc, "荷送人は、運送品を当社に引き渡すに際し、品名、個数及び重量を正確に申告しなければならない。\n２　荷送人は、運送品が危険品であるときは、その旨及び危険の程度その他安全な運送のために必要な事項を申告しなければならない。\n３　荷送人が前二項の申告を怠り、又は虚偽の申告を行ったことにより当社又は第三者が損害を被った場合、荷送人はその損害を賠償しなければならない。");

  articleTitle(doc, "（運賃及び料金）\n第六条");
  body(doc, "運賃及び料金は、当社が別途定める運賃・料金表によるものとし、荷送人との合意によって決定する。\n２　当社は、収受した運賃及び料金については、理由のいかんにかかわらず返還しない。ただし、当社の責に帰すべき事由により利用運送が完了しなかったときは、この限りでない。\n３　消費税その他の公租公課は荷送人の負担とする。");

  chapterTitle(doc, "第三章　運送品の受取及び引渡し");

  articleTitle(doc, "（運送品の受取）\n第七条");
  body(doc, "当社は、荷送人から送り状の交付を受けて運送品を受け取る。\n２　荷送人の請求があるときは、送り状と引換えに受取書を交付する。\n３　当社は、受け取った運送品が送り状の記載と異なるときは、荷送人に通知して指示を求めることができる。");

  articleTitle(doc, "（実運送会社の選定）\n第八条");
  body(doc, "当社は、利用運送の履行に際し、適切な実運送会社を選定するものとする。\n２　当社は、複数の実運送会社を組み合わせて利用運送を履行することができる。\n３　実運送会社の選定にあたっては、法令遵守状況・安全管理体制・保険加入の有無を確認するものとする。");

  articleTitle(doc, "（運送品の引渡し）\n第九条");
  body(doc, "当社は、運送品を荷受人に引き渡すに際し、荷受人の署名又は押印を求めることができる。\n２　荷受人が引取りを拒絶し、又は荷受人を確知できないときは、荷送人に通知のうえ指示を求める。\n３　引渡しを完了した後に生じた運送品の損害については、当社は責任を負わない。");

  chapterTitle(doc, "第四章　責任");

  articleTitle(doc, "（当社の損害賠償責任）\n第十条");
  body(doc, "当社は、利用運送に係る運送品の受取から引渡しまでの間に生じた運送品の滅失、毀損又は延着について、当社に帰責事由がある場合に限り、その損害を賠償する責任を負う。\n２　当社が損害賠償責任を負うべき損害の額は、引渡しが行われるべき地及び時における市場価格によって算定した当該運送品の価格を限度とする。\n３　当社の損害賠償の責任は、荷受人が運送品を受け取った日から十四日以内に当社に対して通知を発しない場合は、消滅する。ただし、当社が悪意の場合はこの限りでない。");

  articleTitle(doc, "（実運送会社の行為）\n第十一条");
  body(doc, "当社が利用する実運送会社の行為（その使用人及び代理人の行為を含む。）については、当社の行為とみなす。\n２　実運送会社が損害賠償を行った場合であっても、当社の責任は免除されるものではない。");

  articleTitle(doc, "（免責事項）\n第十二条");
  body(doc, "次の各号に掲げる事由による損害については、当社は責任を負わない。");
  indent(doc, "一　荷送人又は荷受人の故意又は過失\n二　運送品の欠陥、性質又は自然の消耗\n三　危険品について荷送人が申告を行わなかったこと\n四　同盟罷業、同盟怠業、社会的騒擾その他の事変\n五　天災、地震、津波その他の不可抗力\n六　行政機関の命令・処分");

  articleTitle(doc, "（消滅時効）\n第十三条");
  body(doc, "利用運送に関する当社の損害賠償責任は、荷受人が運送品を受け取った日（全部滅失の場合は引渡しがされるべき日）から一年を経過したときは、時効によって消滅する。");

  chapterTitle(doc, "第五章　雑則");

  articleTitle(doc, "（個人情報の取扱い）\n第十四条");
  body(doc, "当社は、利用運送の履行に際して取得した荷送人及び荷受人の個人情報を、運送業務の遂行、連絡・通知、法令上の義務の履行その他正当な目的のためにのみ利用する。\n２　当社は、法令に定める場合を除き、荷送人及び荷受人の同意なく個人情報を第三者に提供しない。ただし、実運送会社への運送依頼に必要な範囲内での提供はこの限りでない。");

  articleTitle(doc, "（準拠法及び管轄裁判所）\n第十五条");
  body(doc, "本約款は日本法に準拠し、解釈される。\n２　本約款に関連して生じる一切の紛争の第一審の専属的合意管轄裁判所は、横浜地方裁判所とする。");

  articleTitle(doc, "（約款の変更）\n第十六条");
  body(doc, "当社は、法令に定める手続を経た上で本約款を変更することができる。\n２　変更後の約款は当社ウェブサイト（https://ikenoyashoji.jp）に掲示することにより公示し、掲示の日から効力を生じる。");

  doc.moveDown(1.5);
  doc.moveTo(72, doc.y).lineTo(523, doc.y).lineWidth(0.4).strokeColor("#dddddd").stroke();
  doc.moveDown(0.8);
  doc.font("JP").fontSize(8.5).fillColor("#555555")
    .text("制定　2023年9月1日", { align: "left" });
  doc.moveDown(0.3);
  doc.font("JP").fontSize(8.5).fillColor("#555555")
    .text("株式会社池ノ谷商事　代表取締役　池ノ谷　翔", { align: "right" });

  doc.flushPages();
  addFooters(doc);
  doc.end();
  await new Promise(r => out.on("finish", r));
  console.log("✓ freight-forwarding-terms.pdf");
}

console.log("Done — client/public/docs/");
