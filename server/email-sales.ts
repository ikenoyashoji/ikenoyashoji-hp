import cron from "node-cron";
import * as cheerio from "cheerio";
import nodemailer from "nodemailer";
import { storage } from "./storage";

// ── Search queries ────────────────────────────────────────────────────────────
const SEARCH_QUERIES = [
  { q: "神奈川 製造業 株式会社 物流 お問い合わせ", category: "shipper" },
  { q: "関東 食品メーカー 株式会社 配送 会社概要", category: "shipper" },
  { q: "神奈川 卸売業 株式会社 運送 委託 会社概要", category: "shipper" },
  { q: "埼玉 千葉 製造業 株式会社 物流 委託 お問い合わせ", category: "shipper" },
  { q: "東京 小売業 EC 株式会社 配送 倉庫 お問い合わせ", category: "shipper" },
  { q: "神奈川 建設資材 部品メーカー 株式会社 運送 お問い合わせ", category: "shipper" },
  { q: "運送会社 協力会社 業務委託 関東 募集 軽貨物", category: "partner" },
  { q: "軽貨物 個人事業主 業務委託 ドライバー 神奈川 お問い合わせ", category: "partner" },
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
  return Array.from(new Set(found)).filter(
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

// ── Large-company domains to skip ─────────────────────────────────────────────
const SKIP_DOMAINS = [
  // Search/social/platform
  "google.", "youtube.", "facebook.", "twitter.", "x.com", "instagram.", "linkedin.",
  "amazon.co.jp", "rakuten.co.jp", "yahoo.co.jp", "nikkei.com", "nhk.or.jp",
  "wikipedia.org", "wikimedia.org", "note.com", "zenn.dev", "qiita.com",
  "ameblo.jp", "livedoor.", "excite.co.jp", "fc2.com", "seesaa.net",
  // Government / org
  ".go.jp", "e-gov.go.jp", "mlit.go.jp", "mhlw.go.jp", "meti.go.jp", "pref.", ".or.jp", ".ed.jp",
  // Job boards & recruitment
  "recruit.co.jp", "mynavi.jp", "doda.jp", "indeed.com", "rikunabi.com",
  "hellowork", "stanby.com", "townwork.net", "baitoru.com", "en-gage.net",
  "hatalike.jp", "job-j.net", "doraever.jp", "plex-job.com", "kyu-jin",
  "hataraku.com", "work.co.jp", "careerjet.", "glassdoor.", "jobsearch.",
  "engage.jp", "jobmedley.", "type.jp", "dip-net.jp", "yumenavi.",
  "r-agent.com", "tempstaff.", "staffservice.", "pasona.", "adecco.",
  "manpower.", "persol.", "ricrute.", "int-info.", "an.r.recruit.",
  // SaaS/media/blog/news
  "freee.co.jp", "moneyforward.", "zaim.net", "yayoi-kk.", "freenance.",
  "lycbiz.com", "lycorp.co.jp", "smarthr.", "chatwork.", "slack.com",
  "notion.so", "hubspot.", "salesforce.", "boxil.jp", "itreview.jp",
  "prtimes.jp", "atpress.ne.jp", "dreamnews.jp", "newscast.jp",
  "itmedia.co.jp", "ascii.jp", "impress.co.jp", "toyo-keizai.net",
  "diamond.jp", "president.jp", "businessinsider.jp", "forbesjapan.com",
  "logi-today.com", "logistics.jp", "e-logit.com", "miraiebutsuryu",
  "logisticsnews.", "butsuryu.", "cargo-news.", "lnews.jp",
  // Comparison / ranking / portal
  "kakaku.com", "価格.com", "kuchikomi.", "ranking", "hikaku",
  "shopify.com", "makeshop.", "base.ec", "stores.jp", "shop-pro.jp",
  "wix.com", "jimdo.com", "amebaownd.", "studio.site",
  // Large logistics/corporations
  "jreast.co.jp", "jr-central.co.jp", "jr-west.co.jp", "jtb.co.jp",
  "toyota.co.jp", "honda.co.jp", "sony.co.jp", "panasonic.com",
  "softbank.jp", "ntt.co.jp", "docomo.co.jp", "au.com",
  "yamato-hd.co.jp", "sagawa-exp.co.jp", "nittsu.co.jp", "seino.co.jp",
  "fujifilm.com", "canon.jp", "epson.jp", "toshiba.", "hitachi.",
  "askul.co.jp", "monotaro.com", "misumi-ec.com",
];

// ── Pages to probe for email on a site ────────────────────────────────────────
const CONTACT_PATHS = [
  "/contact", "/contacts", "/contact.html",
  "/about", "/about.html", "/about-us",
  "/company", "/company.html", "/会社概要",
  "/inquiry", "/inquiry.html", "/お問い合わせ",
  "/form", "/recruit", "/採用情報",
  "/profile", "/overview", "/corporate",
];

function pickBestEmail(emails: string[]): string {
  if (emails.length === 0) return "";
  const ranked = emails
    .filter((e) =>
      !e.startsWith("noreply") &&
      !e.startsWith("no-reply") &&
      !e.startsWith("donotreply") &&
      !e.includes("@example") &&
      !e.includes("@w3.org") &&
      !e.includes("@sentry") &&
      !e.includes("@jquery") &&
      !e.includes("@wordpress") &&
      e.length < 80
    )
    .sort((a, b) => {
      // Prefer info@, sales@, contact@, inquiry@ over generic
      const score = (e: string) => {
        if (e.startsWith("info@") || e.startsWith("sales@") || e.startsWith("contact@")) return 3;
        if (e.startsWith("inquiry@") || e.startsWith("mail@") || e.startsWith("office@")) return 2;
        return 1;
      };
      return score(b) - score(a);
    });
  return ranked[0] || emails[0];
}

function parseYahooResults(html: string): Array<{ title: string; url: string }> {
  const $ = cheerio.load(html);
  const results: Array<{ title: string; url: string }> = [];
  const seen = new Set<string>();

  // Yahoo Japan search result links are in <a> tags inside .sw-Card or h3 > a
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href.startsWith("http")) return;

    // Filter out Yahoo internal links and known skip domains
    if (href.includes("yahoo.co.jp") || href.includes("yahoo.com")) return;
    if (href.includes("yimg.jp") || href.includes("lycorp.co.jp")) return;
    if (SKIP_DOMAINS.some((d) => href.includes(d))) return;
    if (href.includes("wikipedia") || href.includes("blogspot") || href.includes("note.com")) return;
    if (href.includes("mlit.go.jp") || href.includes("pref.") || href.includes(".go.jp")) return;

    let rootUrl = "";
    let host = "";
    try {
      const u = new URL(href);
      rootUrl = `${u.protocol}//${u.host}`;
      host = u.host;
    } catch { return; }

    if (seen.has(rootUrl)) return;
    seen.add(rootUrl);

    // Prefer .co.jp / .jp company domains; skip obvious non-company TLDs
    const isCompanyDomain = host.endsWith(".co.jp") || host.endsWith(".jp") || host.endsWith(".com");
    if (!isCompanyDomain) return;

    // Skip domains that look like blogs, EC platforms, or media
    if (/\.(info|biz|net|org)$/.test(host) && !host.endsWith(".co.jp")) return;

    const title = $(el).text().trim().replace(/[\|｜→▶\n]+/g, " ").trim();
    if (title && rootUrl) results.push({ title: title.substring(0, 80), url: rootUrl });
  });

  // Prioritize .co.jp domains (most likely Japanese companies)
  results.sort((a, b) => {
    const aScore = a.url.includes(".co.jp") ? 2 : a.url.includes(".jp") ? 1 : 0;
    const bScore = b.url.includes(".co.jp") ? 2 : b.url.includes(".jp") ? 1 : 0;
    return bScore - aScore;
  });

  return results;
}

async function findEmailOnSite(rootUrl: string): Promise<string> {
  // 1. Try homepage first
  const homeHtml = await fetchPageText(rootUrl);
  const homeEmails = extractEmails(homeHtml);
  const best = pickBestEmail(homeEmails);
  if (best) return best;

  // 2. Try to find a contact/inquiry link in the homepage HTML
  const $ = cheerio.load(homeHtml);
  const internalLinks: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (
      href.match(/contact|inquiry|about|company|form|お問い合わせ|会社概要|採用|recruit/i) &&
      !href.startsWith("http")
    ) {
      internalLinks.unshift(href.startsWith("/") ? href : `/${href}`);
    }
  });

  // 3. Combine heuristic paths + discovered internal links (unique, first 8)
  const pathsToTry = Array.from(new Set([...internalLinks, ...CONTACT_PATHS])).slice(0, 8);

  for (const path of pathsToTry) {
    await new Promise((r) => setTimeout(r, 400));
    const url = rootUrl.replace(/\/$/, "") + path;
    const pageHtml = await fetchPageText(url);
    if (!pageHtml) continue;
    const emails = extractEmails(pageHtml);
    const picked = pickBestEmail(emails);
    if (picked) {
      console.log(`[EmailSales] Found email via ${path}: ${picked}`);
      return picked;
    }
  }
  return "";
}

// ── Yahoo Japan crawler ───────────────────────────────────────────────────────
const YAHOO_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function fetchYahooPage(q: string, page: number): Promise<string> {
  const b = (page - 1) * 10 + 1;
  const url = `https://search.yahoo.co.jp/search?p=${encodeURIComponent(q)}&n=20&b=${b}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": YAHOO_UA,
        "Accept-Language": "ja,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timer);
    if (!res.ok) return "";
    return await res.text();
  } catch {
    clearTimeout(timer);
    return "";
  }
}

export async function crawlLeads(): Promise<number> {
  let added = 0;

  // Run multiple queries per crawl (rotate through all queries)
  const today = new Date().getDate();
  const startIdx = today % SEARCH_QUERIES.length;
  const queriesToRun = [
    SEARCH_QUERIES[startIdx],
    SEARCH_QUERIES[(startIdx + 1) % SEARCH_QUERIES.length],
    SEARCH_QUERIES[(startIdx + 2) % SEARCH_QUERIES.length],
  ];

  for (const { q, category } of queriesToRun) {
    console.log(`[EmailSales] Crawling Yahoo: "${q}"`);

    // Fetch page 1 and page 2 for more results
    const allResults: Array<{ title: string; url: string }> = [];
    for (const page of [1, 2]) {
      const html = await fetchYahooPage(q, page);
      if (!html) { console.warn(`[EmailSales] No response for page ${page}`); continue; }
      const parsed = parseYahooResults(html);
      for (const r of parsed) {
        if (!allResults.find((x) => x.url === r.url)) allResults.push(r);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    console.log(`[EmailSales] Found ${allResults.length} unique results for "${q}"`);

    for (const result of allResults.slice(0, 10)) {
      try {
        const existing = await (storage as any).getEmailLeadByWebsite?.(result.url);
        if (existing) {
          console.log(`[EmailSales] Skip (exists): ${result.url}`);
          continue;
        }

        const email = await findEmailOnSite(result.url);
        const company = result.title.substring(0, 80) || result.url;

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
        console.log(`[EmailSales] Added: "${company}" | email: ${email || "（なし）"} | ${result.url}`);

        await new Promise((r) => setTimeout(r, 600));
      } catch (err) {
        console.error("[EmailSales] Lead extract error:", err);
      }
    }
  }

  console.log(`[EmailSales] Total added: ${added}`);
  return added;
}

// ── AI email generation ───────────────────────────────────────────────────────
export async function generateEmailForLead(lead: any): Promise<{ subject: string; body: string; unsubscribeToken: string }> {
  const categoryLabel = CATEGORY_LABEL[lead.category] || "荷主";
  const { randomBytes } = await import("crypto");
  const unsubscribeToken: string = lead.unsubscribeToken || randomBytes(32).toString("hex");

  const baseBody = `${lead.company} 様

平素よりお世話になっております。株式会社池ノ谷商事です。

貴社の物流業務のコスト削減と輸送品質の向上をお手伝いできればと考えております。当社では、貴社の現在の物流状況を無料で診断し、最適な物流ソリューションをご提案いたします。

ぜひ一度お話を伺う機会をいただければ幸いです。

ご都合の良い日時をご教示ください。

何卒よろしくお願い申し上げます。`;

  const raw = await callOpenAI(
    [{ role: "user", content: `会社名：${lead.company}\nサイト：${lead.website}\nターゲット区分：${categoryLabel}` }],
    `あなたは株式会社池ノ谷商事（神奈川県愛川町の物流・運送会社）の営業担当です。
以下のメール本文テンプレートをそのまま使い、件名だけを会社・業種に合わせて生成してください。
本文は一切変更しないでください。

テンプレート本文：
---
${baseBody}
---

ルール：
- 件名は20〜40文字、具体的で読みやすく
- 本文はテンプレートをそのまま使用（変更不可）
- 「拝啓」「敬具」などの頭語・結語は使わない

JSON形式のみで出力：{"subject": "...", "body": "..."}`
  );

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return { subject: "【池ノ谷商事】物流サービスのご案内", body: baseBody, unsubscribeToken };
  const parsed = JSON.parse(match[0]);
  return { subject: parsed.subject || "", body: baseBody, unsubscribeToken };
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
                  <a href="mailto:info@ikenoyashoji.co.jp" style="display:inline-block;padding:15px 36px;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.1em;">メールでお問い合わせ →</a>
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
    from: `"株式会社池ノ谷商事" <sales@ikenoyashoji.fun>`,
    replyTo: "sales@ikenoyashoji.fun",
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
let cronTask: ReturnType<typeof cron.schedule> | null = null;

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
