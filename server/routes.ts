import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import createMemoryStore from "memorystore";
import { storage } from "./storage";
import { insertArticleSchema, insertKeywordSchema, insertContactSchema, insertPageViewSchema, insertEventSchema } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

declare module "express-session" {
  interface SessionData {
    isAdmin?: boolean;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

async function seedData() {
  try {
    const existingArticles = await storage.getArticles();
    if (existingArticles.length === 0) {
      await storage.createArticle({
        title: "【荷主必見】物流コスト削減の5つのポイント｜プロが教える実践テクニック",
        slug: "logistics-cost-reduction-5-points",
        metaDescription: "物流コストを効果的に削減するための5つの実践的なポイントを、物流のプロが詳しく解説します。定期輸送の活用や積載率の改善など、今すぐ実行できる方法を紹介。",
        content: `<h2>はじめに：物流コスト削減はなぜ重要か</h2>
<p>製造業・小売業・EC事業者を問わず、物流コストは企業の収益に直結する重要な経費です。近年のドライバー不足や燃料費高騰により、物流コストは年々増加傾向にあります。本記事では、実際の現場で効果が証明された5つのコスト削減方法をご紹介します。</p>

<h2>1. 定期輸送への切り替えでコストを安定化</h2>
<p>スポット輸送（都度依頼）は便利ですが、割高になることが多いです。定期的な輸送ニーズがある場合は、定期契約に切り替えることで15〜30%のコスト削減が期待できます。</p>
<p>定期輸送のメリット：</p>
<ul>
<li>単価が安定し予算管理がしやすい</li>
<li>優先的に車両が確保される</li>
<li>ドライバーが慣れた経路を走るため効率が上がる</li>
</ul>

<h2>2. 積載率の改善で輸送効率を最大化</h2>
<p>荷物が少ない状態での輸送（空荷・半荷）はコストの無駄遣いです。積載率を80%以上に維持することが、コスト効率化の重要な指標となります。</p>
<p>改善策として、複数の取引先との混載（共同配送）の活用が有効です。弊社では荷主様同士のマッチングも支援しており、大幅なコスト削減を実現しています。</p>

<h2>3. 中継輸送・幹線輸送の組み合わせで長距離コストを削減</h2>
<p>長距離輸送では、中継地点を設けることでドライバーの時間外労働を削減し、コストと安全性を両立できます。東京〜大阪間などの幹線輸送では、中継輸送の活用で20%程度のコスト削減事例があります。</p>

<h2>4. デジタル化による管理コストの削減</h2>
<p>配車管理・運行管理のデジタル化は、管理コストの大幅削減につながります。弊社ではGPSリアルタイム追跡システムを導入しており、無駄な問い合わせ対応を削減しています。</p>

<h2>5. 物流パートナーの見直しと一本化</h2>
<p>複数の物流会社を使い分けている場合、ワンストップで対応できる物流会社への一本化により、管理コスト・交渉コストを削減できます。</p>

<h2>まとめ</h2>
<p>物流コスト削減は一朝一夕にはできませんが、正しい方法を実践することで確実に効果が出ます。弊社では無料の物流コスト診断を実施しておりますので、お気軽にご相談ください。</p>`,
        excerpt: "物流コストを効果的に削減するための5つの実践的なポイントを解説。定期輸送の活用や積載率の改善など、今すぐ実行できる方法をプロが紹介します。",
        category: "物流コラム",
        tags: ["物流コスト", "コスト削減", "定期輸送", "積載率"],
        status: "published",
        faqData: JSON.stringify([
          { q: "物流コスト削減の効果はどのくらいで出ますか？", a: "定期輸送への切り替えは契約翌月から、積載率改善は3ヶ月程度で効果が現れます。平均的に10〜25%の削減実績があります。" },
          { q: "小規模な荷主でも定期輸送の契約はできますか？", a: "はい、週1便程度から定期契約が可能です。まずはお気軽にご相談ください。" },
        ]),
        authorNote: "池ノ谷商事 物流コンサルティング部",
      });

      await storage.createArticle({
        title: "トラックドライバー求人｜池ノ谷商事の待遇・福利厚生・1日の仕事の流れを公開",
        slug: "driver-recruitment-benefits",
        metaDescription: "池ノ谷商事のトラックドライバー求人情報。給与・休日・福利厚生など待遇面を詳しく紹介。未経験者歓迎、充実した研修制度あり。東京・関東エリアで募集中。",
        content: `<h2>池ノ谷商事でドライバーとして働く魅力</h2>
<p>私たち池ノ谷商事は、「ドライバーが誇りを持って働ける会社」を目指しています。単に荷物を運ぶだけでなく、社会インフラを支える重要な仕事として、一人ひとりのドライバーを大切にしています。</p>

<h2>給与・待遇について</h2>
<p>正社員ドライバーの基本給与：月給25万円〜35万円（経験・資格により異なります）</p>
<ul>
<li>各種手当：時間外手当、深夜手当、資格手当、皆勤手当</li>
<li>昇給：年1回（4月）</li>
<li>賞与：年2回（6月・12月）</li>
<li>退職金制度あり</li>
</ul>

<h2>充実した福利厚生</h2>
<ul>
<li>社会保険完備（健康保険・厚生年金・雇用保険・労災保険）</li>
<li>有給休暇（入社6ヶ月後から付与）</li>
<li>年間休日105日以上</li>
<li>制服支給</li>
<li>車両完備（個人持ち込み不要）</li>
<li>健康診断年1回</li>
</ul>

<h2>1日の仕事の流れ（例：定期便ドライバーの場合）</h2>
<p><strong>06:00</strong> 出社・点呼・車両点検</p>
<p><strong>07:00</strong> 積み込み作業開始</p>
<p><strong>08:00</strong> 配送ルート出発</p>
<p><strong>12:00</strong> 昼食休憩（1時間）</p>
<p><strong>15:00</strong> 配送完了・帰社</p>
<p><strong>16:00</strong> 車両清掃・翌日準備・退勤</p>

<h2>未経験者も安心の研修制度</h2>
<p>入社後2週間の座学研修と、ベテランドライバーによるOJT（最低1ヶ月）を実施。安全運転・接客マナー・物流知識をしっかり学べます。</p>

<h2>まとめ</h2>
<p>池ノ谷商事では、現在積極的に仲間を募集しています。「安定した仕事がしたい」「ドライバーの仕事で成長したい」という方、ぜひご応募ください。</p>`,
        excerpt: "池ノ谷商事のトラックドライバー求人情報。給与・休日・福利厚生など待遇面を詳しく紹介。未経験者歓迎、充実した研修制度があります。",
        category: "採用情報",
        tags: ["ドライバー求人", "トラック", "正社員", "関東"],
        status: "published",
        faqData: JSON.stringify([
          { q: "未経験でも応募できますか？", a: "はい、大歓迎です。充実した研修制度がありますので、安心してスタートできます。普通自動車免許（AT限定可）があればご応募いただけます。" },
          { q: "大型免許の取得サポートはありますか？", a: "はい、入社後に大型免許や各種資格を取得する場合、費用の一部を会社が負担します。" },
        ]),
        authorNote: "池ノ谷商事 人事採用部",
      });
    }

    const existingKeywords = await storage.getKeywords();
    if (existingKeywords.length === 0) {
      const seedKeywords = [
        { keyword: "物流 コスト削減 方法", target: "shipper", priority: 5, notes: "荷主向け最重要KW" },
        { keyword: "輸送 見積もり 無料 関東", target: "shipper", priority: 5, notes: "CV直結KW" },
        { keyword: "チャーター便 東京 当日", target: "shipper", priority: 4, notes: "スポット獲得" },
        { keyword: "スポット輸送 即日対応", target: "shipper", priority: 4, notes: "" },
        { keyword: "定期輸送 契約 メリット", target: "shipper", priority: 3, notes: "" },
        { keyword: "物流会社 協力会社 募集 関東", target: "partner", priority: 5, notes: "協力会社獲得" },
        { keyword: "軽貨物 業務委託 安定", target: "partner", priority: 4, notes: "" },
        { keyword: "トラックドライバー 求人 東京 正社員", target: "recruit", priority: 5, notes: "採用最重要" },
        { keyword: "ドライバー 待遇 福利厚生 良い", target: "recruit", priority: 4, notes: "" },
        { keyword: "配送 アウトソーシング 物流 委託", target: "shipper", priority: 3, notes: "" },
      ];
      for (const kw of seedKeywords) {
        await storage.createKeyword(kw);
      }
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}

async function callOpenAI(messages: any[], systemPrompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI error: ${err}`);
  }
  const data = (await response.json()) as any;
  return data.choices[0].message.content as string;
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "logistics-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({ checkPeriod: 86400000 }),
      cookie: { secure: false, httpOnly: true, maxAge: 86400000 },
    })
  );

  await seedData();

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin auth
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {});
    res.json({ success: true });
  });

  app.get("/api/admin/me", (req, res) => {
    if (req.session.isAdmin) {
      res.json({ isAdmin: true, username: ADMIN_USER });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Articles (public - published only)
  app.get("/api/articles", async (_req, res) => {
    const arts = await storage.getArticles("published");
    res.json(arts);
  });

  app.get("/api/articles/:slug", async (req, res) => {
    const article = await storage.getArticleBySlug(req.params.slug);
    if (!article || article.status !== "published") {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(article);
  });

  // Articles admin CRUD
  app.get("/api/admin/articles", requireAdmin, async (_req, res) => {
    const arts = await storage.getArticles();
    res.json(arts);
  });

  app.get("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    const article = await storage.getArticleById(Number(req.params.id));
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  });

  app.post("/api/admin/articles", requireAdmin, async (req, res) => {
    const parsed = insertArticleSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    const article = await storage.createArticle(parsed.data);
    res.json(article);
  });

  app.put("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    const article = await storage.updateArticle(Number(req.params.id), req.body);
    res.json(article);
  });

  app.post("/api/admin/articles/:id/publish", requireAdmin, async (req, res) => {
    const article = await storage.publishArticle(Number(req.params.id));
    res.json(article);
  });

  app.post("/api/admin/articles/:id/unpublish", requireAdmin, async (req, res) => {
    const article = await storage.updateArticle(Number(req.params.id), { status: "draft", publishedAt: null as any });
    res.json(article);
  });

  app.delete("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    await storage.deleteArticle(Number(req.params.id));
    res.json({ success: true });
  });

  // Keywords
  app.get("/api/keywords", async (_req, res) => {
    const kws = await storage.getKeywords();
    res.json(kws);
  });

  app.post("/api/admin/keywords", requireAdmin, async (req, res) => {
    const parsed = insertKeywordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    const kw = await storage.createKeyword(parsed.data);
    res.json(kw);
  });

  app.put("/api/admin/keywords/:id", requireAdmin, async (req, res) => {
    const kw = await storage.updateKeyword(Number(req.params.id), req.body);
    res.json(kw);
  });

  app.delete("/api/admin/keywords/:id", requireAdmin, async (req, res) => {
    await storage.deleteKeyword(Number(req.params.id));
    res.json({ success: true });
  });

  // Contact form
  app.post("/api/contacts", async (req, res) => {
    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    const contact = await storage.createContact(parsed.data);
    res.json(contact);
  });

  app.get("/api/admin/contacts", requireAdmin, async (_req, res) => {
    const cts = await storage.getContacts();
    res.json(cts);
  });

  // Analytics - pageview tracking
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const parsed = insertPageViewSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error });
      const pv = await storage.createPageView(parsed.data);
      res.json(pv);
    } catch {
      res.json({ ok: true });
    }
  });

  // Analytics - event tracking
  app.post("/api/analytics/event", async (req, res) => {
    try {
      const parsed = insertEventSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error });
      const ev = await storage.createEvent(parsed.data);
      res.json(ev);
    } catch {
      res.json({ ok: true });
    }
  });

  // Admin analytics dashboard
  app.get("/api/admin/analytics", requireAdmin, async (req, res) => {
    const days = Number(req.query.days) || 28;
    const pvs = await storage.getPageViews(days);
    const evts = await storage.getEvents(days);

    const pvByDay: Record<string, number> = {};
    for (const pv of pvs) {
      const day = pv.createdAt.toISOString().split("T")[0];
      pvByDay[day] = (pvByDay[day] || 0) + 1;
    }

    const evtByName: Record<string, number> = {};
    for (const ev of evts) {
      evtByName[ev.eventName] = (evtByName[ev.eventName] || 0) + 1;
    }

    const pvByPath: Record<string, number> = {};
    for (const pv of pvs) {
      pvByPath[pv.path] = (pvByPath[pv.path] || 0) + 1;
    }

    const pvByPrefecture: Record<string, number> = {};
    for (const pv of pvs) {
      const pref = pv.prefecture || "不明";
      pvByPrefecture[pref] = (pvByPrefecture[pref] || 0) + 1;
    }

    const topPages = Object.entries(pvByPath)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    const pvByDayArr = Object.entries(pvByDay)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }));

    res.json({
      totalPV: pvs.length,
      totalEvents: evts.length,
      pvByDay: pvByDayArr,
      eventsByName: Object.entries(evtByName).map(([name, count]) => ({ name, count })),
      topPages,
      pvByPrefecture: Object.entries(pvByPrefecture).map(([prefecture, count]) => ({ prefecture, count })).sort((a, b) => b.count - a.count).slice(0, 20),
    });
  });

  // AI article generation
  app.post("/api/admin/ai/generate", requireAdmin, async (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "OpenAI APIキーが設定されていません。環境変数 OPENAI_API_KEY を設定してください。" });
    }

    const { keyword, target, notes } = req.body;
    if (!keyword) return res.status(400).json({ error: "keyword is required" });

    const targetLabel = target === "shipper" ? "荷主（物流を依頼する企業）" : target === "recruit" ? "求職者（ドライバー・スタッフ候補）" : "協力会社（運送会社・個人事業主）";

    const systemPrompt = `あなたは物流会社「株式会社池ノ谷商事」のSEO記事ライターです。E-E-A-Tを意識し、読者の検索意図に沿った高品質な記事を作成します。ターゲット読者は${targetLabel}です。

記事は以下の構成で作成してください：
1. 結論（冒頭で答えを提示）
2. 理由・根拠（なぜそうなのか）
3. 具体例・事例
4. FAQ（3〜5問）
5. まとめ・CTA

出力はJSON形式で：
{
  "title": "記事タイトル（35〜60文字）",
  "slug": "url-slug-in-english",
  "metaDescription": "メタディスクリプション（90〜120文字）",
  "excerpt": "記事の要約（100〜150文字）",
  "category": "カテゴリ名（物流コラム/採用情報/協力会社情報/お知らせのいずれか）",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "content": "本文HTML（h2/h3タグ使用、3000〜4000文字）",
  "faqData": [{"q": "質問", "a": "回答"}],
  "internalLinks": [{"text": "リンクテキスト", "url": "/page"}],
  "authorNote": "池ノ谷商事 ○○部"
}`;

    try {
      const raw = await callOpenAI(
        [{ role: "user", content: `以下のキーワードで記事を作成してください：「${keyword}」\n補足：${notes || "なし"}` }],
        systemPrompt
      );

      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid AI response format");
      const parsed = JSON.parse(jsonMatch[0]);

      const article = await storage.createArticle({
        title: parsed.title,
        slug: parsed.slug,
        metaDescription: parsed.metaDescription,
        content: parsed.content,
        excerpt: parsed.excerpt,
        category: parsed.category,
        tags: parsed.tags || [],
        status: "draft",
        faqData: JSON.stringify(parsed.faqData || []),
        internalLinks: JSON.stringify(parsed.internalLinks || []),
        authorNote: parsed.authorNote,
        imageUrl: "",
      });

      res.json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI rewrite
  app.post("/api/admin/ai/rewrite/:id", requireAdmin, async (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "OpenAI APIキーが設定されていません。" });
    }

    const article = await storage.getArticleById(Number(req.params.id));
    if (!article) return res.status(404).json({ error: "Article not found" });

    const { analysisNote } = req.body;

    const systemPrompt = `あなたは物流会社のSEO専門家です。既存記事を改善してください。改善点：${analysisNote || "検索意図への合致、E-E-A-T強化、FAQ追加、内部リンク最適化"}

同じJSON形式で出力してください：
{
  "title": "改善されたタイトル",
  "metaDescription": "改善されたメタディスクリプション",
  "content": "改善された本文HTML",
  "faqData": [{"q": "質問", "a": "回答"}],
  "excerpt": "改善された要約"
}`;

    try {
      const raw = await callOpenAI(
        [{ role: "user", content: `以下の記事をリライトしてください：\nタイトル：${article.title}\n内容：${article.content.substring(0, 3000)}` }],
        systemPrompt
      );

      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid AI response");
      const parsed = JSON.parse(jsonMatch[0]);

      const updated = await storage.updateArticle(article.id, {
        title: parsed.title || article.title,
        metaDescription: parsed.metaDescription || article.metaDescription,
        content: parsed.content || article.content,
        excerpt: parsed.excerpt || article.excerpt,
        faqData: JSON.stringify(parsed.faqData || []),
        status: "draft",
      });

      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI analysis for Search Console
  app.post("/api/admin/ai/analyze", requireAdmin, async (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "OpenAI APIキーが設定されていません。" });
    }

    const { page, query, ctr, position, clicks, impressions } = req.body;

    const systemPrompt = `あなたはSEO専門家です。Google Search Consoleのデータを分析し、改善提案を提供してください。`;

    try {
      const analysis = await callOpenAI(
        [{
          role: "user",
          content: `以下のページのSEOデータを分析し、改善提案を日本語で提供してください：
ページ：${page}
クエリ：${query}
表示回数：${impressions}
クリック数：${clicks}
CTR：${(ctr * 100).toFixed(1)}%
平均掲載順位：${position?.toFixed(1)}位

改善提案（箇条書きで5点）、原因仮説（3点）、優先度（高/中/低）を含めてください。`
        }],
        systemPrompt
      );

      res.json({ analysis });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Search Console data management
  app.get("/api/admin/search-console", requireAdmin, async (_req, res) => {
    const data = await storage.getSearchConsoleData();
    res.json(data);
  });

  app.post("/api/admin/search-console/save", requireAdmin, async (req, res) => {
    const { data } = req.body;
    if (!Array.isArray(data)) return res.status(400).json({ error: "data must be array" });

    for (const row of data) {
      await storage.upsertSearchConsoleData(row);
    }
    res.json({ success: true, count: data.length });
  });

  // Admin logs - activity feed
  app.get("/api/admin/logs", requireAdmin, async (req, res) => {
    const days = Number(req.query.days) || 30;
    const [evts, pvs, cts, arts] = await Promise.all([
      storage.getEvents(days),
      storage.getPageViews(days),
      storage.getContacts(),
      storage.getArticles(),
    ]);

    const logs: any[] = [];

    for (const ev of evts.slice(0, 80)) {
      logs.push({ type: "event", label: ev.eventName, detail: ev.path || "", time: ev.createdAt });
    }

    for (const ct of cts.slice(0, 30)) {
      const typeLabel = ct.type === "shipper" ? "荷主" : ct.type === "recruit" ? "採用" : "協力会社";
      logs.push({ type: "contact", label: `問い合わせ受信（${typeLabel}）`, detail: `${ct.name} / ${ct.email}`, time: ct.createdAt });
    }

    for (const art of arts.filter((a) => a.publishedAt).slice(0, 20)) {
      logs.push({ type: "article_publish", label: `記事を公開`, detail: art.title, time: art.publishedAt });
    }
    for (const art of arts.slice(0, 20)) {
      logs.push({ type: "article_create", label: `記事を作成`, detail: art.title, time: art.createdAt });
    }

    logs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    const pvByDay: Record<string, number> = {};
    for (const pv of pvs) {
      const day = pv.createdAt.toISOString().split("T")[0];
      pvByDay[day] = (pvByDay[day] || 0) + 1;
    }

    res.json({
      logs: logs.slice(0, 100),
      totalPV: pvs.length,
      totalEvents: evts.length,
      totalContacts: cts.length,
      pvByDay: Object.entries(pvByDay).sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count })),
    });
  });

  // Admin settings status
  app.get("/api/admin/settings/status", requireAdmin, (_req, res) => {
    res.json({
      openai: !!process.env.OPENAI_API_KEY,
      smtp: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== "your-email@example.com"),
      smtpHost: process.env.SMTP_HOST || "",
      smtpPort: process.env.SMTP_PORT || "587",
      siteUrl: process.env.SITE_URL || "",
      ga4: !!(process.env.VITE_GA4_ID),
      clarity: !!(process.env.VITE_CLARITY_ID),
      adminUser: process.env.ADMIN_USER || "admin",
    });
  });

  // Email send
  app.post("/api/admin/email/send", requireAdmin, async (req, res) => {
    const { to, subject, body } = req.body;
    if (!to || !subject || !body) return res.status(400).json({ error: "to, subject, body は必須です" });

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    const isConfigured = smtpHost && smtpUser && smtpPass && smtpUser !== "your-email@example.com" && smtpPass !== "your-password";
    if (!isConfigured) {
      return res.status(503).json({ error: "SMTPサーバーが設定されていません。SMTP_HOST・SMTP_USER・SMTP_PASSを環境変数に設定してください。" });
    }

    try {
      const { createTransport } = await import("nodemailer");
      const transporter = createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser!, pass: smtpPass! },
      });

      const toList = Array.isArray(to) ? to : [to];
      const info = await transporter.sendMail({
        from: `株式会社池ノ谷商事 <${smtpFrom}>`,
        to: toList.join(", "),
        subject,
        text: body,
        html: body.replace(/\n/g, "<br>"),
      }) as any;

      res.json({ success: true, messageId: info.messageId, accepted: info.accepted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Sitemap
  app.get("/sitemap.xml", async (_req, res) => {
    const publishedArts = await storage.getArticles("published");
    const domain = process.env.SITE_URL || "https://example.com";

    const staticPages = ["/", "/recruit", "/partner", "/blog", "/company", "/contact", "/privacy"];
    const staticUrls = staticPages.map((p) => `  <url><loc>${domain}${p}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("\n");
    const articleUrls = publishedArts.map((a) => `  <url><loc>${domain}/blog/${a.slug}</loc><lastmod>${a.publishedAt?.toISOString().split("T")[0] || a.createdAt.toISOString().split("T")[0]}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${articleUrls}
</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(sitemap);
  });

  // Robots.txt
  app.get("/robots.txt", (_req, res) => {
    const domain = process.env.SITE_URL || "https://example.com";
    res.set("Content-Type", "text/plain");
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${domain}/sitemap.xml`);
  });

  // Admin stats summary
  app.get("/api/admin/stats", requireAdmin, async (_req, res) => {
    const [arts, kws, cts] = await Promise.all([
      storage.getArticles(),
      storage.getKeywords(),
      storage.getContacts(),
    ]);
    const pvs = await storage.getPageViews(7);
    const evts = await storage.getEvents(7);

    res.json({
      articles: { total: arts.length, published: arts.filter((a) => a.status === "published").length, draft: arts.filter((a) => a.status === "draft").length },
      keywords: kws.length,
      contacts: cts.length,
      pageViews7d: pvs.length,
      events7d: evts.length,
    });
  });

  return httpServer;
}
