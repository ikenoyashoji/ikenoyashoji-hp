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
export async function generateEmailForLead(lead: any): Promise<{ subject: string; body: string; unsubscribeToken: string }> {
  const categoryLabel = CATEGORY_LABEL[lead.category] || "荷主";
  const { randomBytes } = await import("crypto");
  const unsubscribeToken: string = lead.unsubscribeToken || randomBytes(32).toString("hex");

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
- 最後に署名を入れる（池ノ谷商事 営業部、TEL:046-212-2766、Email:info@ikenoyashoji.co.jp）
- 特定の数値や名前は記載しない（相手の詳細が不明なため）

JSON形式のみで出力：{"subject": "...", "body": "..."}`
  );

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return { subject: "【池ノ谷商事】物流サービスのご案内", body: "お世話になっております。株式会社池ノ谷商事の営業担当です。", unsubscribeToken };
  const parsed = JSON.parse(match[0]);
  return { subject: parsed.subject || "", body: parsed.body || "", unsubscribeToken };
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

function buildHtmlEmail(body: string, unsubscribeToken?: string): string {
  const siteUrl = process.env.SITE_URL || "https://ikenoyashoji.jp";
  const unsubscribeUrl = unsubscribeToken ? `${siteUrl}/api/unsubscribe?token=${unsubscribeToken}` : "";

  const paragraphs = body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 16px 0;line-height:1.8;color:#1e293b;font-size:14px;">${line}</p>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    @keyframes logoPulse {
      0%,100% { box-shadow:0 0 0 0 rgba(147,197,253,0.55); }
      50% { box-shadow:0 0 0 14px rgba(147,197,253,0); }
    }
    @keyframes fadeSlideDown {
      from { opacity:0;transform:translateY(-10px); }
      to { opacity:1;transform:translateY(0); }
    }
    @keyframes accentShimmer {
      0% { background-position:0% 50%; }
      50% { background-position:100% 50%; }
      100% { background-position:0% 50%; }
    }
    .logo-ring { animation:logoPulse 2.5s ease-in-out infinite; }
    .hd-title { animation:fadeSlideDown 0.7s ease forwards; }
    .hd-sub { animation:fadeSlideDown 0.7s 0.18s ease both; }
    .accent-bar {
      background:linear-gradient(90deg,#1a4b99,#3b82f6,#60a5fa,#3b82f6,#1a4b99);
      background-size:200% 200%;
      animation:accentShimmer 3s ease infinite;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#dce7f5;font-family:'Helvetica Neue',Arial,'Hiragino Kaku Gothic ProN',Meiryo,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#dce7f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:8px;overflow:hidden;box-shadow:0 6px 32px rgba(15,32,68,0.18);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(160deg,#050e1f 0%,#0f2044 28%,#1a4b99 68%,#2563eb 100%);padding:44px 44px 40px 44px;text-align:center;">
              <div class="logo-ring" style="display:inline-block;width:72px;height:72px;border-radius:50%;border:2.5px solid rgba(147,197,253,0.65);background:rgba(255,255,255,0.05);margin:0 auto 22px auto;line-height:72px;text-align:center;vertical-align:middle;">
                <span style="font-size:30px;font-weight:900;color:#ffffff;font-family:serif;vertical-align:middle;line-height:72px;">池</span>
              </div>
              <p class="hd-title" style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.38em;color:#93c5fd;font-weight:400;text-transform:uppercase;">Ikenoyashoji Co., Ltd.</p>
              <p class="hd-title" style="margin:0 0 10px 0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:0.06em;">株式会社池ノ谷商事</p>
              <p class="hd-sub" style="margin:0;font-size:11px;color:rgba(255,255,255,0.5);letter-spacing:0.14em;">物流・運送サービスのご案内</p>
            </td>
          </tr>

          <!-- ACCENT LINE -->
          <tr><td class="accent-bar" style="height:4px;"></td></tr>

          <!-- BODY -->
          <tr>
            <td style="padding:40px 44px 28px 44px;background:#ffffff;">
              ${paragraphs}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:4px 44px 40px 44px;background:#ffffff;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="background:linear-gradient(135deg,#1a4b99 0%,#2563eb 100%);border-radius:4px;box-shadow:0 4px 14px rgba(37,99,235,0.35);">
                  <a href="https://ikenoyashoji.jp/contact" style="display:inline-block;padding:15px 36px;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.1em;">お問い合わせ・ご相談はこちら →</a>
                </td>
              </tr></table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr><td style="padding:0 44px;background:#ffffff;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"/></td></tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:26px 44px 30px 44px;background:#f8fafc;">
              <p style="margin:0 0 3px 0;font-size:13px;font-weight:800;color:#0f2044;">株式会社池ノ谷商事　営業部</p>
              <p style="margin:0 0 3px 0;font-size:11px;color:#64748b;">〒243-0303　神奈川県愛甲郡愛川町中津7287</p>
              <p style="margin:0 0 3px 0;font-size:11px;color:#64748b;">TEL: <a href="tel:046-212-2766" style="color:#1a4b99;text-decoration:none;">046-212-2766</a>　／　Email: <a href="mailto:info@ikenoyashoji.co.jp" style="color:#1a4b99;text-decoration:none;">info@ikenoyashoji.co.jp</a></p>
              <p style="margin:4px 0 0 0;font-size:11px;color:#64748b;">URL: <a href="https://ikenoyashoji.jp" style="color:#1a4b99;text-decoration:none;">https://ikenoyashoji.jp</a></p>
              ${unsubscribeUrl ? `
              <p style="margin:20px 0 0 0;padding-top:14px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;line-height:1.7;">
                このメールは株式会社池ノ谷商事 営業部よりお送りしております。<br/>
                今後このようなメールの受信を希望されない場合は<a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline;">こちらをクリックして配信停止</a>してください。
              </p>` : `
              <p style="margin:20px 0 0 0;padding-top:14px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;line-height:1.7;">このメールは株式会社池ノ谷商事 営業部よりお送りしております。</p>`}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendLeadEmail(lead: any): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) throw new Error("SMTP not configured");
  if (!lead.email) throw new Error("No email address");

  const html = buildHtmlEmail(lead.emailBody || "", lead.unsubscribeToken || "");

  await transporter.sendMail({
    from: `"株式会社池ノ谷商事 営業部" <sales@ikenoyashoji.fun>`,
    to: lead.email,
    subject: lead.emailSubject,
    text: lead.emailBody,
    html,
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
