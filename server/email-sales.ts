import cron from "node-cron";
import * as cheerio from "cheerio";
import nodemailer from "nodemailer";
import { storage } from "./storage";

// ── Search queries ────────────────────────────────────────────────────────────
const SEARCH_QUERIES = [
  { q: "荷主 物流 委託 問い合わせ 関東 会社", category: "shipper" },
  { q: "EC事業者 配送 物流 アウトソーシング 神奈川", category: "shipper" },
  { q: "製造業 定期配送 委託 運送会社 募集", category: "shipper" },
  { q: "運送会社 協力会社 業務委託 関東 募集", category: "partner" },
  { q: "軽貨物 個人事業主 業務委託 ドライバー 関東", category: "partner" },
  { q: "ドライバー 求人 神奈川 正社員 大型", category: "recruit" },
];

const CATEGORY_LABEL: Record<string, string> = {
  shipper: "荷主",
  partner: "協力会社",
  recruit: "採用",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function callOpenAI(messages: any[], systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = (await res.json()) as any;
  return data.choices[0].message.content as string;
}

function extractEmails(html: string): string[] {
  const pattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const found = html.match(pattern) || [];
  return [...new Set(found)].filter(
    (e) => !e.includes("example") && !e.includes("sentry") && !e.includes("wpcf7") && !e.includes("jquery")
  );
}

async function fetchPageText(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; IkenoyaBot/1.0)" },
    });
    clearTimeout(timer);
    if (!res.ok) return "";
    return await res.text();
  } catch {
    clearTimeout(timer);
    return "";
  }
}

// ── DuckDuckGo crawler ────────────────────────────────────────────────────────
export async function crawlLeads(): Promise<number> {
  let added = 0;
  const queryIdx = new Date().getDate() % SEARCH_QUERIES.length;
  const { q, category } = SEARCH_QUERIES[queryIdx];

  console.log(`[EmailSales] Crawling DDG: "${q}"`);

  const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
  const html = await fetchPageText(ddgUrl);
  if (!html) { console.error("[EmailSales] No DDG response"); return 0; }

  const $ = cheerio.load(html);
  const results: Array<{ title: string; url: string; snippet: string }> = [];

  $(".result__body, .result").each((_, el) => {
    const title = $(el).find(".result__a, .result__title").first().text().trim();
    const href = $(el).find(".result__a").attr("href") || "";
    const snippet = $(el).find(".result__snippet").first().text().trim();
    const url = href.startsWith("http") ? href : href.includes("uddg=") ? decodeURIComponent(href.split("uddg=")[1]?.split("&")[0] || "") : "";
    if (title && url && url.startsWith("http")) results.push({ title, url, snippet });
  });

  console.log(`[EmailSales] Found ${results.length} DDG results`);

  for (const result of results.slice(0, 12)) {
    try {
      // Check if this website is already in DB
      const existing = await (storage as any).getEmailLeadByWebsite?.(result.url);
      if (existing) continue;

      // Try to extract email from the page
      const pageHtml = await fetchPageText(result.url);
      let emails = extractEmails(pageHtml);

      // Also try /contact page
      if (emails.length === 0) {
        const contactUrl = result.url.replace(/\/$/, "") + "/contact";
        const contactHtml = await fetchPageText(contactUrl);
        emails = extractEmails(contactHtml);
      }

      // Extract company name from title (remove common suffixes)
      const company = result.title.replace(/[\|｜\-–—].*$/, "").trim().substring(0, 80) || result.url;
      const email = emails[0] || "";

      await (storage as any).createEmailLead({
        company,
        website: result.url.substring(0, 200),
        email,
        contactName: "",
        category,
        status: "pending",
        emailSubject: "",
        emailBody: "",
        crawlQuery: q,
        errorMsg: "",
      });
      added++;
    } catch (err) {
      console.error("[EmailSales] Lead extract error:", err);
    }
  }

  console.log(`[EmailSales] Added ${added} new leads`);
  return added;
}

// ── AI email generation ───────────────────────────────────────────────────────
export async function generateEmailForLead(lead: any): Promise<{ subject: string; body: string }> {
  const categoryLabel = CATEGORY_LABEL[lead.category] || "荷主";

  const raw = await callOpenAI(
    [{ role: "user", content: `会社名：${lead.company}\nサイト：${lead.website}\nターゲット区分：${categoryLabel}` }],
    `あなたは株式会社池ノ谷商事（神奈川県愛川町の物流・運送会社）の営業担当です。
相手の会社の状況に合わせた、簡潔で礼儀正しいビジネスメールを日本語で作成してください。

ターゲット別メッセージ方針：
- 荷主（shipper）：物流コスト削減・輸送品質向上・無料物流診断の提案
- 協力会社（partner）：安定した仕事量・適正運賃・迅速支払の協力会社募集
- 採用（recruit）：待遇・職場環境・成長機会の求人案内

ルール：
- 件名は30〜50文字
- 本文は200〜300文字（短く、読みやすく）
- 最後に署名を入れる（池ノ谷商事 営業部、TEL:046-286-0015、Email:info@ikenoyashoji.co.jp）
- 特定の数値や名前は記載しない（相手の詳細が不明なため）

JSON形式のみで出力：{"subject": "...", "body": "..."}`
  );

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return { subject: "【池ノ谷商事】物流サービスのご案内", body: "お世話になっております。株式会社池ノ谷商事の営業担当です。" };
  const parsed = JSON.parse(match[0]);
  return { subject: parsed.subject || "", body: parsed.body || "" };
}

// ── SMTP sender ───────────────────────────────────────────────────────────────
export function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || "587");
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

export async function sendLeadEmail(lead: any): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) throw new Error("SMTP not configured");
  if (!lead.email) throw new Error("No email address");

  await transporter.sendMail({
    from: `"株式会社池ノ谷商事 営業部" <${process.env.SMTP_USER}>`,
    to: lead.email,
    subject: lead.emailSubject,
    text: lead.emailBody,
  });
  return true;
}

// ── Auto-send pipeline ────────────────────────────────────────────────────────
export async function runEmailSalesPipeline(): Promise<{ crawled: number; generated: number; sent: number; errors: number }> {
  console.log("[EmailSales] Starting pipeline...");
  let crawled = 0, generated = 0, sent = 0, errors = 0;

  // Step 1: Crawl new leads
  try { crawled = await crawlLeads(); } catch (e) { console.error("[EmailSales] Crawl error:", e); }

  // Step 2: Generate emails for leads that have an email address but no email content
  const allLeads = await (storage as any).getEmailLeads();
  const needsEmail = allLeads.filter((l: any) => l.email && !l.emailSubject && l.status === "pending");

  for (const lead of needsEmail.slice(0, 20)) {
    try {
      const { subject, body } = await generateEmailForLead(lead);
      await (storage as any).updateEmailLead(lead.id, { emailSubject: subject, emailBody: body });
      generated++;
    } catch (e) {
      console.error("[EmailSales] Gen error:", e);
    }
  }

  // Step 3: Send to 10 pending leads with email + content
  const readyLeads = (await (storage as any).getEmailLeads())
    .filter((l: any) => l.email && l.emailSubject && l.status === "pending")
    .slice(0, 10);

  for (const lead of readyLeads) {
    try {
      await sendLeadEmail(lead);
      await (storage as any).updateEmailLead(lead.id, { status: "sent", sentAt: new Date() });
      sent++;
    } catch (e: any) {
      await (storage as any).updateEmailLead(lead.id, { status: "failed", errorMsg: e.message });
      errors++;
    }
  }

  console.log(`[EmailSales] Done. crawled=${crawled} generated=${generated} sent=${sent} errors=${errors}`);
  return { crawled, generated, sent, errors };
}

// ── Cron ──────────────────────────────────────────────────────────────────────
let cronTask: cron.ScheduledTask | null = null;

export function startEmailSalesCron(cronTime = "0 10 * * *") {
  if (cronTask) { cronTask.stop(); cronTask = null; }
  cronTask = cron.schedule(cronTime, async () => {
    console.log("[EmailSales] Cron triggered!");
    await runEmailSalesPipeline();
  }, { timezone: "Asia/Tokyo" });
  console.log(`[EmailSales] Cron: ${cronTime}`);
}

export function stopEmailSalesCron() {
  cronTask?.stop(); cronTask = null;
}
