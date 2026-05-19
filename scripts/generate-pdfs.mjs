import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const FONT = "/tmp/NotoSansJP.otf";
const OUT_DIR = "client/public/docs";
fs.mkdirSync(OUT_DIR, { recursive: true });

function createDoc() {
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 60, bottom: 60, left: 70, right: 70 },
    info: { Author: "株式会社池ノ谷商事" },
  });
  doc.registerFont("JP", FONT);
  return doc;
}

function header(doc, title, subtitle) {
  doc.font("JP").fontSize(9).fillColor("#888888")
    .text("株式会社池ノ谷商事", { align: "right" });
  doc.moveDown(0.3);
  doc.moveTo(70, doc.y).lineTo(525, doc.y).lineWidth(0.5).strokeColor("#cccccc").stroke();
  doc.moveDown(1.2);
  doc.font("JP").fontSize(16).fillColor("#0f2044").text(title, { align: "center" });
  doc.moveDown(0.5);
  if (subtitle) {
    doc.font("JP").fontSize(10).fillColor("#555555").text(subtitle, { align: "center" });
  }
  doc.moveDown(1);
  doc.moveTo(70, doc.y).lineTo(525, doc.y).lineWidth(0.5).strokeColor("#cccccc").stroke();
  doc.moveDown(1.2);
}

function sectionTitle(doc, text) {
  doc.moveDown(0.8);
  doc.font("JP").fontSize(11).fillColor("#0f2044").text(text);
  doc.moveDown(0.3);
}

function body(doc, text) {
  doc.font("JP").fontSize(9.5).fillColor("#333333").text(text, { lineGap: 4 });
}

function footer(doc) {
  const pages = doc.bufferedPageRange();
  for (let i = pages.start; i < pages.start + pages.count; i++) {
    doc.switchToPage(i);
    doc.font("JP").fontSize(8).fillColor("#aaaaaa")
      .text(`株式会社池ノ谷商事　　神奈川県愛甲郡愛川町中津7287`, 70, 790, { align: "left" })
      .text(`${i - pages.start + 1} / ${pages.count}`, 70, 790, { align: "right" });
  }
}

// ── 1. 標準貨物自動車運送約款 ──────────────────────────────────────────
{
  const doc = createDoc({ bufferPages: true });
  const out = fs.createWriteStream(path.join(OUT_DIR, "standard-cargo-terms.pdf"));
  doc.pipe(out);

  header(doc, "標準貨物自動車運送約款", "（国土交通省告示 平成29年改正版準拠）");

  body(doc, "本約款は、一般貨物自動車運送事業者である株式会社池ノ谷商事（以下「当社」という。）が行う貨物自動車運送事業に関して、荷主と当社との間の運送契約の内容を定めるものです。");

  sectionTitle(doc, "第一章　総則");
  body(doc, "（事業の種類）\n第一条　当社が行う貨物自動車運送事業は、一般貨物自動車運送事業とする。\n\n（適用範囲）\n第二条　当社が行う運送に関しては、法令又は別段の定めがある場合を除き、この運送約款の定めるところによる。\n\n（用語の定義）\n第三条　この運送約款において「荷送人」とは、当社に対し運送を委託する者をいい、「荷受人」とは、運送品の受取人をいい、「荷主」とは荷送人及び荷受人をいう。\n　２　この運送約款において「運送品」とは、当社が運送を引き受けた貨物をいう。");

  sectionTitle(doc, "第二章　運送の引受け");
  body(doc, "（運送の引受け）\n第四条　当社は、次の各号のいずれかに該当する場合には、運送の引受けを拒絶することができる。\n　一　当該運送に適する設備がないとき。\n　二　当該運送品が運送に適しない状態にあるとき。\n　三　当該運送が法令の規定又は公序良俗に反するものであるとき。\n　四　天災その他やむを得ない事由があるとき。\n\n（運賃・料金の収受）\n第五条　当社は、運賃及び料金の収受について、荷送人との間で別途定める運賃・料金表によるものとする。");

  sectionTitle(doc, "第三章　運送品の受取及び引渡し");
  body(doc, "（運送品の受取）\n第六条　当社は、荷送人から運送品の受取に際し、荷送人の請求があるときは、送り状と引換えに受取書を交付する。\n\n（運送品の確認）\n第七条　当社は、運送品を受け取るにあたり、荷送人が申告した品名・個数・重量等を確認することができる。荷送人はこれに協力するものとする。\n\n（運送品の引渡し）\n第八条　当社は、運送品を荷受人に引き渡すに際し、荷受人の署名又は押印を求めることができる。荷受人が引取りを拒絶し、又は荷受人を確知できないときは、荷送人に通知のうえ指示を求めるものとする。");

  sectionTitle(doc, "第四章　責任");
  body(doc, "（当社の責任）\n第九条　当社は、運送品の受取から引渡しまでの間に生じた運送品の滅失、毀損又は延着について、当社に帰責事由がある場合に限り、その損害を賠償する責任を負う。\n\n（免責）\n第十条　次の各号に掲げる事由による損害については、当社は責任を負わない。\n　一　荷送人又は荷受人の故意又は過失\n　二　運送品の欠陥又は自然の消耗\n　三　同盟罷業、同盟怠業その他の争議行為\n　四　天災その他不可抗力\n\n（賠償額の限度）\n第十一条　当社が賠償する損害の額は、運送品の引渡しが行われるべき地及び時における市場価格によって算定した当該運送品の価格を限度とする。");

  sectionTitle(doc, "第五章　雑則");
  body(doc, "（準拠法）\n第十二条　本約款は日本法に準拠し、解釈される。\n\n（管轄裁判所）\n第十三条　本約款に関する紛争の第一審の専属的合意管轄裁判所は、横浜地方裁判所とする。\n\n（約款の変更）\n第十四条　当社は、本約款を変更する必要が生じた場合には、法令に定める手続を経た上で変更するものとし、変更後の約款を当社ウェブサイト等に掲示することによって公示する。");

  doc.moveDown(2);
  doc.font("JP").fontSize(9).fillColor("#888888")
    .text("制定：2026年1月　　　　株式会社池ノ谷商事　代表取締役　池ノ谷　慎之助", { align: "center" });

  doc.flushPages();
  footer(doc);
  doc.end();
  await new Promise(r => out.on("finish", r));
  console.log("✓ standard-cargo-terms.pdf");
}

// ── 2. 貨物利用運送約款 ──────────────────────────────────────────────
{
  const doc = createDoc({ bufferPages: true });
  const out = fs.createWriteStream(path.join(OUT_DIR, "freight-forwarding-terms.pdf"));
  doc.pipe(out);

  header(doc, "貨物利用運送約款", "（貨物利用運送事業法に基づく）");

  body(doc, "本約款は、第一種貨物利用運送事業者である株式会社池ノ谷商事（以下「当社」という。登録番号：関自貨第542号）が行う貨物利用運送事業に関して、荷主との間の利用運送契約の内容を定めるものです。");

  sectionTitle(doc, "第一章　総則");
  body(doc, "（事業の種類）\n第一条　当社が行う貨物利用運送事業は、第一種貨物利用運送事業（自動車を利用した内国貨物の運送）とする。\n\n（適用範囲）\n第二条　当社が行う利用運送に関しては、法令又は別段の定めがある場合を除き、この利用運送約款の定めるところによる。\n\n（定義）\n第三条　この約款において「荷送人」とは、当社に貨物の運送を委託する者をいう。「実運送会社」とは、当社が運送の履行のために利用する一般貨物自動車運送事業者をいう。");

  sectionTitle(doc, "第二章　利用運送の引受け");
  body(doc, "（引受けの拒絶）\n第四条　当社は、次の各号のいずれかに該当する場合には、利用運送の引受けを拒絶することができる。\n　一　利用する実運送会社が確保できないとき。\n　二　貨物が運送に適しない状態にあるとき。\n　三　天災その他やむを得ない事由があるとき。\n\n（運賃及び料金）\n第五条　運賃及び料金は、当社が別途定める運賃・料金表によるものとし、荷送人との合意によって決定する。");

  sectionTitle(doc, "第三章　責任");
  body(doc, "（当社の責任）\n第六条　当社は、利用運送に係る貨物の受取から引渡しまでの間に生じた貨物の滅失、毀損又は延着について、当社に帰責事由がある場合に限り、その損害を賠償する責任を負う。\n\n（実運送会社の行為）\n第七条　当社が利用する実運送会社の行為は、当社の行為とみなす。\n\n（免責）\n第八条　次の事由による損害については当社は責任を負わない。\n　一　荷送人の故意又は過失\n　二　貨物の性質による損傷・揮発・腐敗・変質\n　三　天災その他不可抗力による損害\n\n（賠償額の限度）\n第九条　当社が賠償する損害の額は、引渡しが行われるべき地及び時における市場価格によって算定した当該貨物の価格を限度とする。");

  sectionTitle(doc, "第四章　雑則");
  body(doc, "（準拠法及び管轄）\n第十条　本約款は日本法に準拠し、紛争の第一審の専属的合意管轄裁判所は横浜地方裁判所とする。\n\n（約款の変更）\n第十一条　当社は、法令の定める手続を経た上で本約款を変更することができる。変更後の約款は当社ウェブサイト等に掲示することにより公示する。");

  doc.moveDown(2);
  doc.font("JP").fontSize(9).fillColor("#888888")
    .text("制定：2023年9月　　　　株式会社池ノ谷商事　代表取締役　池ノ谷　慎之助", { align: "center" });

  doc.flushPages();
  footer(doc);
  doc.end();
  await new Promise(r => out.on("finish", r));
  console.log("✓ freight-forwarding-terms.pdf");
}

console.log("All PDFs generated in client/public/docs/");
