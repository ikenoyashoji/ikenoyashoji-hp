import cron from "node-cron";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
// Note: images are stored as base64 data URLs in DB (persistent across restarts)

const CONFIG_FILE = path.resolve("auto-publish-config.json");

export interface AutoPublishConfig {
  enabled: boolean;
  cronTime: string;
  autoPublish: boolean;
  lastRun: string | null;
  lastArticleId: number | null;
  log: Array<{ date: string; title: string; articleId: number; status: string; imageGenerated: boolean }>;
}

const defaultConfig: AutoPublishConfig = {
  enabled: false,
  cronTime: "0 9 * * *",
  autoPublish: true,
  lastRun: null,
  lastArticleId: null,
  log: [],
};

export function loadConfig(): AutoPublishConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return { ...defaultConfig, ...JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8")) };
    }
  } catch {}
  return { ...defaultConfig };
}

export function saveConfig(config: AutoPublishConfig) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

async function callOpenAI(messages: any[], systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.75,
    }),
  });
  if (!response.ok) throw new Error(`OpenAI API error: ${response.status}`);
  const data = (await response.json()) as any;
  return data.choices[0].message.content as string;
}

async function generateFashionImage(category: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const subjectMap: Record<string, string> = {
    "採用情報": "confident Japanese professional driver standing beside a modern truck, editorial portrait, stylish industrial workwear, strong pose",
    "協力会社情報": "aerial cinematic view of a modern Japanese logistics hub at golden hour, abstract geometric cargo containers, premium editorial composition",
    "物流コラム": "sleek modern Japanese warehouse interior, high-end architectural photography, dramatic shadows and lines, editorial minimalism",
    "お知らせ": "clean Japanese corporate announcement visual, minimalist flat lay of business documents and modern logistics elements",
    "事例紹介": "dynamic split composition, before-after logistics optimization visualization, magazine double-page spread style",
  };

  const subject = subjectMap[category] || subjectMap["物流コラム"];
  const prompt = `High-end Japanese fashion magazine editorial photography. Vogue Japan, Numero magazine aesthetic. Dramatic studio lighting, bold graphic composition. ${subject}. Luxury premium feel, monochrome accents with one bold color accent, cinematic depth of field, no text overlays, ultra-sharp professional photography, aspirational lifestyle feel, 16:9 widescreen magazine spread.`;

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "dall-e-3", prompt, size: "1792x1024", quality: "standard", n: 1 }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as any;
    const dalleUrl = data.data?.[0]?.url;
    if (!dalleUrl) return null;

    // DALL-E URLs expire after 1 hour, so we download and convert to base64
    // This stores the image permanently in the database
    const imgRes = await fetch(dalleUrl);
    if (!imgRes.ok) return null;
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.error("[AutoPublish] Image generation error:", err);
    return null;
  }
}

export async function runAutoPublish(): Promise<{
  success: boolean;
  articleId?: number;
  title?: string;
  imageGenerated?: boolean;
  error?: string;
}> {
  console.log("[AutoPublish] Starting pipeline...");

  if (!process.env.OPENAI_API_KEY) {
    return { success: false, error: "OPENAI_API_KEY not configured" };
  }

  try {
    // Step 1: Research long-tail keywords
    console.log("[AutoPublish] Step 1: Keyword research...");
    const kwRaw = await callOpenAI(
      [{ role: "user", content: "物流・運送・ドライバー採用・協力会社に関するSEOロングテールキーワードを3つ提案してください。検索ボリュームは少なめでも具体的で競合が少なく、荷主・採用・協力会社のいずれかにとって実用的なキーワードを選んでください。今日の日付: " + new Date().toLocaleDateString("ja-JP") }],
      `あなたは日本のSEO専門家です。株式会社池ノ谷商事（神奈川県愛川町の物流・運送会社）のためにSEOキーワードを調査します。
被リンクが少なく、検索意図が明確なロングテールキーワードを選んでください。
結果はJSON配列のみで出力（説明不要）：
[{"keyword": "...", "target": "shipper|recruit|partner", "reason": "..."}]`
    );

    let selectedKw = { keyword: "物流コスト削減 中小企業 具体的な方法", target: "shipper" };
    try {
      const kwMatch = kwRaw.match(/\[[\s\S]*?\]/);
      if (kwMatch) {
        const kws = JSON.parse(kwMatch[0]);
        if (kws.length > 0) selectedKw = kws[0];
      }
    } catch {}

    console.log(`[AutoPublish] Keyword selected: ${selectedKw.keyword} (${selectedKw.target})`);

    // Step 2: Generate article
    console.log("[AutoPublish] Step 2: Article generation...");
    const targetLabel =
      selectedKw.target === "shipper" ? "荷主（物流を依頼する中小企業・EC事業者）"
      : selectedKw.target === "recruit" ? "求職者（ドライバー・物流スタッフ候補）"
      : "協力会社（個人事業主・小規模運送会社）";

    const articleRaw = await callOpenAI(
      [{ role: "user", content: `以下のキーワードでSEO記事を作成してください：「${selectedKw.keyword}」` }],
      `あなたは物流会社「株式会社池ノ谷商事」のSEO記事ライターです。E-E-A-T（経験・専門性・権威性・信頼性）を強く意識し、ターゲット読者（${targetLabel}）の検索意図に完全に沿った高品質な記事を作成します。

記事構成（必ず守ること）：
1. リード文：結論から始める（冒頭200文字以内で答えを提示）
2. h2：なぜ重要か（背景・課題）
3. h2：具体的な方法・解決策（3〜5ポイント、h3で各ポイント）
4. h2：実際の事例・データ
5. h2：よくある質問（FAQ 3〜5問）
6. h2：まとめと池ノ谷商事への相談CTA

JSON形式のみで出力（説明・コメント不要）：
{
  "title": "記事タイトル（35〜60文字、キーワードを含む）",
  "slug": "english-url-slug-max-60-chars",
  "metaDescription": "メタディスクリプション（90〜120文字）",
  "excerpt": "記事の要約（100〜150文字）",
  "category": "物流コラム",
  "tags": ["タグ1", "タグ2", "タグ3", "タグ4"],
  "content": "本文HTML（h2/h3タグ使用、3500〜4500文字、段落<p>タグ必須、リストは<ul><li>使用）",
  "faqData": [{"q": "質問", "a": "回答（100〜200文字）"}],
  "authorNote": "池ノ谷商事 ○○部"
}`
    );

    const jsonMatch = articleRaw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI article response format");
    const parsed = JSON.parse(jsonMatch[0]);

    // Step 3: Generate fashion magazine image
    console.log("[AutoPublish] Step 3: Image generation (fashion magazine style)...");
    const imageUrl = await generateFashionImage(parsed.category || "物流コラム");
    const imageGenerated = !!imageUrl;
    console.log(`[AutoPublish] Image: ${imageGenerated ? imageUrl : "failed"}`);

    // Step 4: Create article in DB
    const config = loadConfig();
    const safeSlug = (parsed.slug || "article").replace(/[^a-z0-9-]/g, "-").substring(0, 60) + "-" + Date.now();

    const article = await storage.createArticle({
      title: parsed.title,
      slug: safeSlug,
      metaDescription: parsed.metaDescription,
      content: parsed.content,
      excerpt: parsed.excerpt,
      category: parsed.category || "物流コラム",
      tags: parsed.tags || [],
      status: "draft",
      faqData: JSON.stringify(parsed.faqData || []),
      internalLinks: "[]",
      authorNote: parsed.authorNote || "池ノ谷商事 AI編集部",
      imageUrl: imageUrl || "",
    });

    // Step 5: Publish if configured
    if (config.autoPublish) {
      await storage.publishArticle(article.id);
    }

    // Update config log
    const newLog = {
      date: new Date().toISOString(),
      title: parsed.title,
      articleId: article.id,
      status: config.autoPublish ? "published" : "draft",
      imageGenerated,
    };
    config.lastRun = new Date().toISOString();
    config.lastArticleId = article.id;
    config.log = [newLog, ...(config.log || [])].slice(0, 30);
    saveConfig(config);

    console.log(`[AutoPublish] Done! Article #${article.id}: "${parsed.title}"`);
    return { success: true, articleId: article.id, title: parsed.title, imageGenerated };
  } catch (err: any) {
    console.error("[AutoPublish] Error:", err);
    return { success: false, error: err.message };
  }
}

let cronTask: ReturnType<typeof cron.schedule> | null = null;

export function startCron(cronTime: string) {
  if (cronTask) { cronTask.stop(); cronTask = null; }
  if (!cron.validate(cronTime)) {
    console.error(`[AutoPublish] Invalid cron expression: ${cronTime}`);
    return;
  }
  cronTask = cron.schedule(
    cronTime,
    async () => {
      console.log("[AutoPublish] Cron triggered!");
      const result = await runAutoPublish();
      console.log("[AutoPublish] Cron result:", result);
    },
    { timezone: "Asia/Tokyo" }
  );
  console.log(`[AutoPublish] Cron scheduled: ${cronTime} (Asia/Tokyo)`);
}

export function stopCron() {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
    console.log("[AutoPublish] Cron stopped.");
  }
}

export function initAutoPublisher() {
  const config = loadConfig();
  if (config.enabled) {
    startCron(config.cronTime);
  }
  console.log(`[AutoPublish] Initialized. Enabled=${config.enabled}, Cron=${config.cronTime}`);
}
