import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import session from "express-session";
import createMemoryStore from "memorystore";
import bcrypt from "bcrypt";
import multer from "multer";
import express from "express";
import { storage } from "./storage";
import { insertArticleSchema, insertKeywordSchema, insertContactSchema, insertPageViewSchema, insertEventSchema, insertEmailLeadSchema, insertSearchConsoleSchema } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

const uploadsDir = path.resolve("public/uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("画像ファイルのみアップロードできます"));
  },
});

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

const CATEGORY_IMAGES: Record<string, string> = {
  "物流コラム": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80&auto=format&fit=crop",
  "採用情報": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80&auto=format&fit=crop",
  "採用": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80&auto=format&fit=crop",
  "荷主向け": "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800&q=80&auto=format&fit=crop",
  "協力会社": "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80&auto=format&fit=crop",
  "お知らせ": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80&auto=format&fit=crop",
  "default": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop",
};

async function migrateArticleImages() {
  try {
    const allArticles = await storage.getArticles();
    const noImageArticles = allArticles.filter(a => !a.imageUrl || a.imageUrl === "");
    for (const article of noImageArticles) {
      const img = CATEGORY_IMAGES[article.category ?? ""] || CATEGORY_IMAGES["default"];
      await storage.updateArticle(article.id, { imageUrl: img });
    }
    if (noImageArticles.length > 0) {
      console.log(`[migrate] ${noImageArticles.length}件の記事に画像を設定しました`);
    }
  } catch (e) {
    console.error("[migrate] 記事画像マイグレーション失敗:", e);
  }
}

async function fixBlogCategories() {
  try {
    const allArticles = await storage.getArticles();
    const blogArticles = allArticles.filter(a => a.category === "BLOG" || a.category === "blog");
    for (const article of blogArticles) {
      await storage.updateArticle(article.id, { category: "物流コラム" });
    }
    if (blogArticles.length > 0) {
      console.log(`[fix] ${blogArticles.length}件の記事のカテゴリを"BLOG"→"物流コラム"に修正しました`);
    }
  } catch (e) {
    console.error("[fix] カテゴリ修正失敗:", e);
  }
}

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
        imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80&auto=format&fit=crop",
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
        imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80&auto=format&fit=crop",
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
  const rawKey = (process.env.OPENAI_API_KEY || "").trim();
  const apiKey = rawKey.match(/(sk-[A-Za-z0-9_\-]+)/)?.[1] || rawKey.replace(/[^\x20-\x7E]/g, "").trim();
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

// DALL-E 3 でファッション誌風ヒーロー画像を生成して public/uploads に保存
async function generateArticleImage(title: string, keyword: string, category?: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const cat = category || "物流コラム";

  const fullPrompt = `高級感のある企業採用サイト向けの雑誌風ビジュアルデザイン。

シネマティックで洗練された構図。
プロカメラマンが撮影したような高品質な広告写真。

自然光、明るい昼間、透明感のある空気感。
スタイリッシュで清潔感のある物流現場。

モデルは20代〜30代の日本人。
爽やかで好印象、清潔感、自然な笑顔。
作業服はネイビー系でスタイリッシュ、現代的。

カメラワークはファッション雑誌風。
ローアングル、斜め構図、被写界深度、背景ぼかし。
シネマティックライティング。
余白を意識したレイアウト。

高級企業の採用LPのような世界観。
「働きたくなる会社」の空気感。

超高解像度、photorealistic、premium quality、luxury corporate branding、editorial magazine style、commercial photography、soft natural light、clean composition、cinematic atmosphere、ultra detailed、8k`;

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: fullPrompt,
      n: 1,
      size: "1536x1024",
      quality: "high",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DALL-E error: ${err}`);
  }

  const data = (await res.json()) as any;
  const b64 = data.data[0].b64_json as string;
  const buffer = Buffer.from(b64, "base64");

  const filename = `ai-gen-${Date.now()}.webp`;
  const savePath = path.join(uploadsDir, filename);
  // Convert to WebP for smaller file size
  const sharp = await import("sharp");
  const webpBuffer = await sharp.default(buffer).webp({ quality: 85 }).toBuffer();
  fs.writeFileSync(savePath, webpBuffer);

  return `/uploads/${filename}`;
}

// ─── Simple in-memory rate limiter ────────────────────────────────────────────
interface RateLimitEntry { count: number; resetAt: number }
const rateLimitStore = new Map<string, RateLimitEntry>();

function rateLimit(opts: { windowMs: number; max: number; keyFn?: (req: Request) => string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = opts.keyFn ? opts.keyFn(req) : (req.ip || "unknown");
    const now = Date.now();
    let entry = rateLimitStore.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 1, resetAt: now + opts.windowMs };
      rateLimitStore.set(key, entry);
    } else {
      entry.count++;
    }
    if (entry.count > opts.max) {
      res.setHeader("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ error: "リクエストが多すぎます。しばらく待ってから再試行してください。" });
    }
    next();
  };
}
// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of Array.from(rateLimitStore)) {
    if (now > v.resetAt) rateLimitStore.delete(k);
  }
}, 600_000).unref();
// ──────────────────────────────────────────────────────────────────────────────

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  // Serve uploaded images as static files
  app.use("/uploads", express.static(uploadsDir));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "logistics-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({ checkPeriod: 86400000 }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 86400000,
        sameSite: "lax",
      },
    })
  );

  await seedData();
  await fixBlogCategories();
  await migrateArticleImages();

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin auth
  app.post("/api/admin/login",
    rateLimit({ windowMs: 15 * 60_000, max: 10, keyFn: (r) => `login:${r.ip}` }),
    async (req, res) => {
    const { username, password } = req.body;
    // Check env-var master account first
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      req.session.isAdmin = true;
      return res.json({ success: true });
    }
    // Check DB admin users
    const dbUser = await storage.getAdminUserByUsername(username);
    if (dbUser && await bcrypt.compare(password, dbUser.passwordHash)) {
      req.session.isAdmin = true;
      return res.json({ success: true });
    }
    res.status(401).json({ error: "Invalid credentials" });
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
    try {
      const arts = await storage.getArticles("published");
      res.json(arts);
    } catch (err: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article || article.status !== "published") {
        return res.status(404).json({ error: "Not found" });
      }
      res.json(article);
    } catch (err: any) {
      res.status(500).json({ error: "Internal server error" });
    }
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
    try {
      const partial = insertArticleSchema.partial().safeParse(req.body);
      if (!partial.success) return res.status(400).json({ error: partial.error });
      const article = await storage.updateArticle(Number(req.params.id), partial.data);
      res.json(article);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/admin/articles/:id/publish", requireAdmin, async (req, res) => {
    const article = await storage.publishArticle(Number(req.params.id));
    res.json(article);
  });

  app.post("/api/admin/articles/:id/unpublish", requireAdmin, async (req, res) => {
    const article = await storage.updateArticle(Number(req.params.id), { status: "draft", publishedAt: null } as any);
    res.json(article);
  });

  app.delete("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    await storage.deleteArticle(Number(req.params.id));
    res.json({ success: true });
  });

  // Keywords
  app.get("/api/keywords", async (_req, res) => {
    try {
      const kws = await storage.getKeywords();
      res.json(kws);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/keywords", requireAdmin, async (req, res) => {
    try {
      const parsed = insertKeywordSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error });
      const kw = await storage.createKeyword(parsed.data);
      res.json(kw);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put("/api/admin/keywords/:id", requireAdmin, async (req, res) => {
    try {
      const partial = insertKeywordSchema.partial().safeParse(req.body);
      if (!partial.success) return res.status(400).json({ error: partial.error });
      const kw = await storage.updateKeyword(Number(req.params.id), partial.data);
      res.json(kw);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/keywords/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteKeyword(Number(req.params.id));
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Contact form
  app.post("/api/contacts",
    rateLimit({ windowMs: 10 * 60_000, max: 5, keyFn: (r) => `contact:${r.ip}` }),
    async (req, res) => {
    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error });
    const contact = await storage.createContact(parsed.data);
    res.json(contact);

    // 問い合わせ通知メールを info@ikenoyashoji.co.jp に送信（非同期・失敗しても無視）
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    if (smtpHost && smtpUser && smtpPass) {
      const typeLabel = contact.type === "shipper" ? "荷主・輸送" : contact.type === "recruit" ? "採用" : "協力会社";
      const typeColor = contact.type === "shipper" ? "#1a4b99" : contact.type === "recruit" ? "#0f7a4a" : "#7a5c0f";
      const sentAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
      const plainText = [
        `【お問い合わせ通知】${typeLabel}のお問い合わせが届きました`,
        `種別　: ${typeLabel}`,
        `お名前: ${contact.name}`,
        `メール: ${contact.email}`,
        `電話　: ${contact.phone || "未記入"}`,
        `会社名: ${contact.company || "未記入"}`,
        `メッセージ:\n${contact.message || "未記入"}`,
        `管理画面: https://ikenoyashoji.jp/admin`,
        `送信日時: ${sentAt}`,
      ].join("\n");
      const htmlBody = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- ヘッダー -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f2044 0%,#1a4b99 100%);padding:32px 40px;">
            <p style="margin:0 0 4px 0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;">IKENOYA SHOJI Co.,Ltd.</p>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">お問い合わせ通知</h1>
          </td>
        </tr>
        <!-- 種別バッジ -->
        <tr>
          <td style="padding:28px 40px 0;">
            <span style="display:inline-block;background:${typeColor};color:#fff;font-size:13px;font-weight:700;padding:6px 16px;border-radius:20px;letter-spacing:1px;">${typeLabel}</span>
            <p style="margin:12px 0 0;color:#555;font-size:14px;">${sentAt} に新しいお問い合わせが届きました。</p>
          </td>
        </tr>
        <!-- 内容テーブル -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <tr style="border-bottom:1px solid #edf0f5;">
                <td style="padding:12px 0;color:#888;font-size:13px;font-weight:600;width:100px;">お名前</td>
                <td style="padding:12px 0;color:#1a1a2e;font-size:15px;font-weight:600;">${contact.name} 様</td>
              </tr>
              <tr style="border-bottom:1px solid #edf0f5;">
                <td style="padding:12px 0;color:#888;font-size:13px;font-weight:600;">メール</td>
                <td style="padding:12px 0;"><a href="mailto:${contact.email}" style="color:#1a4b99;font-size:15px;text-decoration:none;">${contact.email}</a></td>
              </tr>
              <tr style="border-bottom:1px solid #edf0f5;">
                <td style="padding:12px 0;color:#888;font-size:13px;font-weight:600;">電話番号</td>
                <td style="padding:12px 0;color:#1a1a2e;font-size:15px;">${contact.phone || '<span style="color:#bbb;">未記入</span>'}</td>
              </tr>
              <tr style="border-bottom:1px solid #edf0f5;">
                <td style="padding:12px 0;color:#888;font-size:13px;font-weight:600;">会社名</td>
                <td style="padding:12px 0;color:#1a1a2e;font-size:15px;">${contact.company || '<span style="color:#bbb;">未記入</span>'}</td>
              </tr>
              <tr>
                <td style="padding:16px 0 8px;color:#888;font-size:13px;font-weight:600;vertical-align:top;">メッセージ</td>
                <td style="padding:16px 0 8px;color:#1a1a2e;font-size:14px;line-height:1.7;white-space:pre-wrap;">${(contact.message || "未記入").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- CTAボタン -->
        <tr>
          <td style="padding:8px 40px 36px;">
            <a href="https://ikenoyashoji.jp/admin/contacts" style="display:inline-block;background:linear-gradient(135deg,#1a4b99,#1d4ed8);color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.5px;">管理画面で確認する →</a>
          </td>
        </tr>
        <!-- フッター -->
        <tr>
          <td style="background:#f4f6f9;padding:20px 40px;border-top:1px solid #edf0f5;">
            <p style="margin:0;color:#aaa;font-size:12px;line-height:1.6;">このメールは <strong>ikenoyashoji.jp</strong> のお問い合わせフォームから自動送信されました。<br>株式会社池ノ谷商事 / 〒243-0303 神奈川県愛甲郡愛川町中津7287</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
      import("nodemailer").then(({ createTransport }) => {
        const transporter = createTransport({ host: smtpHost, port: smtpPort, secure: smtpPort === 465, auth: { user: smtpUser, pass: smtpPass } });
        transporter.sendMail({
          from: `株式会社池ノ谷商事 <${smtpFrom}>`,
          to: "info@ikenoyashoji.co.jp",
          subject: `【お問い合わせ】${typeLabel} - ${contact.name}様`,
          text: plainText,
          html: htmlBody,
        }).catch((e: Error) => console.error("[ContactNotify] メール送信失敗:", e.message));
      });
    }
  });

  app.get("/api/admin/contacts", requireAdmin, async (_req, res) => {
    const cts = await storage.getContacts();
    res.json(cts);
  });

  // Analytics - pageview tracking
  app.post("/api/analytics/pageview",
    rateLimit({ windowMs: 60_000, max: 120, keyFn: (r) => `pv:${r.ip}` }),
    async (req, res) => {
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
  app.post("/api/analytics/event",
    rateLimit({ windowMs: 60_000, max: 120, keyFn: (r) => `ev:${r.ip}` }),
    async (req, res) => {
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
  "category": "カテゴリ名（物流コラム/採用情報/お知らせのいずれか）",
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

      // DALL-E 3 でヒーロー画像を生成（失敗しても記事は保存する）
      let imageUrl = "";
      try {
        imageUrl = await generateArticleImage(parsed.title, keyword, parsed.category);
      } catch (imgErr: any) {
        console.error("[ImageGen] 画像生成失敗（記事は保存）:", imgErr.message);
      }

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
        imageUrl,
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
    if (data.length > 5000) return res.status(400).json({ error: "data exceeds maximum of 5000 rows" });

    const errors: number[] = [];
    const valid: any[] = [];
    for (let i = 0; i < data.length; i++) {
      const parsed = insertSearchConsoleSchema.safeParse(data[i]);
      if (parsed.success) {
        valid.push(parsed.data);
      } else {
        errors.push(i);
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ error: `Invalid rows at indices: ${errors.slice(0, 5).join(", ")}` });
    }

    try {
      for (const row of valid) {
        await storage.upsertSearchConsoleData(row);
      }
      res.json({ success: true, count: valid.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Visitor analytics - detailed session data
  app.get("/api/admin/visitors", requireAdmin, async (req, res) => {
    const days = Number(req.query.days) || 30;
    const [pvs, evts] = await Promise.all([storage.getPageViews(days), storage.getEvents(days)]);

    function parseDevice(ua: string): string {
      if (!ua) return "不明";
      if (/iPad/i.test(ua)) return "タブレット";
      if (/Mobile|Android|iPhone|iPod/i.test(ua)) return "スマートフォン";
      return "PC";
    }
    function parseBrowser(ua: string): string {
      if (!ua) return "不明";
      if (/Edg\//i.test(ua)) return "Edge";
      if (/OPR|Opera/i.test(ua)) return "Opera";
      if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) return "Chrome";
      if (/Firefox/i.test(ua)) return "Firefox";
      if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
      return "その他";
    }
    function parseOS(ua: string): string {
      if (!ua) return "不明";
      if (/Windows/i.test(ua)) return "Windows";
      if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) return "macOS";
      if (/iPhone/i.test(ua)) return "iOS";
      if (/iPad/i.test(ua)) return "iPadOS";
      if (/Android/i.test(ua)) return "Android";
      if (/Linux/i.test(ua)) return "Linux";
      return "その他";
    }
    function parseSource(referrer: string): string {
      if (!referrer) return "ダイレクト";
      const r = referrer.toLowerCase();
      if (/google\./i.test(r)) return "Google検索";
      if (/bing\./i.test(r)) return "Bing検索";
      if (/yahoo\./i.test(r)) return "Yahoo!検索";
      if (/duckduckgo\./i.test(r)) return "DDG検索";
      if (/t\.co|twitter\.com|x\.com/i.test(r)) return "Twitter/X";
      if (/instagram\./i.test(r)) return "Instagram";
      if (/facebook\./i.test(r)) return "Facebook";
      if (/line\./i.test(r)) return "LINE";
      if (/linkedin\./i.test(r)) return "LinkedIn";
      try { return new URL(referrer).hostname; } catch { return "外部リンク"; }
    }
    function parseSourceCategory(referrer: string): string {
      if (!referrer) return "direct";
      const r = referrer.toLowerCase();
      if (/google\.|bing\.|yahoo\.|duckduckgo\./i.test(r)) return "organic";
      if (/t\.co|twitter\.com|x\.com|instagram\.|facebook\.|line\.|linkedin\./i.test(r)) return "social";
      return "referral";
    }

    // Group page views by sessionId
    const sessionMap = new Map<string, any>();
    for (const pv of pvs) {
      const sid = pv.sessionId || "unknown";
      if (!sessionMap.has(sid)) {
        sessionMap.set(sid, {
          sessionId: sid,
          startAt: pv.createdAt,
          lastAt: pv.createdAt,
          pages: [],
          referrer: pv.referrer || "",
          userAgent: pv.userAgent || "",
          prefecture: pv.prefecture || "",
          events: [],
        });
      }
      const s = sessionMap.get(sid);
      s.pages.push({ path: pv.path, time: pv.createdAt });
      if (new Date(pv.createdAt) < new Date(s.startAt)) s.startAt = pv.createdAt;
      if (new Date(pv.createdAt) > new Date(s.lastAt)) s.lastAt = pv.createdAt;
      if (!s.referrer && pv.referrer) s.referrer = pv.referrer;
      if (!s.userAgent && pv.userAgent) s.userAgent = pv.userAgent;
      if (!s.prefecture && pv.prefecture) s.prefecture = pv.prefecture;
    }

    // Attach events to sessions
    for (const ev of evts) {
      const sid = ev.sessionId || "unknown";
      if (sessionMap.has(sid)) {
        sessionMap.get(sid).events.push({ name: ev.eventName, path: ev.path, time: ev.createdAt, properties: ev.properties });
      }
    }

    const sessions = Array.from(sessionMap.values()).map((s) => ({
      ...s,
      device: parseDevice(s.userAgent),
      browser: parseBrowser(s.userAgent),
      os: parseOS(s.userAgent),
      source: parseSource(s.referrer),
      sourceCategory: parseSourceCategory(s.referrer),
      pageCount: s.pages.length,
      hasCV: s.events.length > 0,
      duration: Math.round((new Date(s.lastAt).getTime() - new Date(s.startAt).getTime()) / 1000),
    })).sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

    // Aggregate stats
    const sourceBreakdown: Record<string, number> = {};
    const deviceBreakdown: Record<string, number> = {};
    const browserBreakdown: Record<string, number> = {};
    const prefBreakdown: Record<string, number> = {};
    const pathBreakdown: Record<string, number> = {};

    for (const s of sessions) {
      sourceBreakdown[s.source] = (sourceBreakdown[s.source] || 0) + 1;
      deviceBreakdown[s.device] = (deviceBreakdown[s.device] || 0) + 1;
      browserBreakdown[s.browser] = (browserBreakdown[s.browser] || 0) + 1;
      const pref = s.prefecture || "不明";
      prefBreakdown[pref] = (prefBreakdown[pref] || 0) + 1;
    }
    for (const pv of pvs) {
      pathBreakdown[pv.path] = (pathBreakdown[pv.path] || 0) + 1;
    }

    const cvSessions = sessions.filter((s) => s.hasCV).length;
    const avgPages = sessions.length ? (pvs.length / sessions.length).toFixed(1) : "0";

    res.json({
      sessions: sessions.slice(0, 500),
      totalSessions: sessions.length,
      totalPV: pvs.length,
      totalEvents: evts.length,
      cvSessions,
      cvRate: sessions.length ? ((cvSessions / sessions.length) * 100).toFixed(1) : "0",
      avgPages,
      sourceBreakdown: Object.entries(sourceBreakdown).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
      deviceBreakdown: Object.entries(deviceBreakdown).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
      browserBreakdown: Object.entries(browserBreakdown).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
      prefBreakdown: Object.entries(prefBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([name, count]) => ({ name, count })),
      topPages: Object.entries(pathBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([path, count]) => ({ path, count })),
    });
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
  app.get("/api/admin/settings/status", requireAdmin, async (_req, res) => {
    const stats = await storage.getDbStats();
    res.json({
      openai: !!process.env.OPENAI_API_KEY,
      smtp: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_USER !== "your-email@example.com"),
      smtpHost: process.env.SMTP_HOST || "",
      smtpPort: process.env.SMTP_PORT || "587",
      smtpUser: process.env.SMTP_USER || "",
      smtpFrom: process.env.SMTP_FROM || process.env.SMTP_USER || "",
      siteUrl: process.env.SITE_URL || "",
      ga4: !!(process.env.VITE_GA4_ID),
      ga4Id: process.env.VITE_GA4_ID || "",
      clarity: !!(process.env.VITE_CLARITY_ID),
      clarityId: process.env.VITE_CLARITY_ID || "",
      adminUser: process.env.ADMIN_USER || "admin",
      adminPassSet: !!(process.env.ADMIN_PASS),
      ...stats,
    });
  });

  // Test SMTP connection
  app.post("/api/admin/settings/test-smtp", requireAdmin, async (req, res) => {
    const { to } = req.body;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    if (!smtpHost || !smtpUser || !smtpPass) {
      return res.status(503).json({ error: "SMTP設定が不完全です。SMTP_HOST・SMTP_USER・SMTP_PASSを環境変数に設定してください。" });
    }
    try {
      const { createTransport } = await import("nodemailer");
      const transporter = createTransport({ host: smtpHost, port: smtpPort, secure: smtpPort === 465, auth: { user: smtpUser, pass: smtpPass } });
      await transporter.verify();
      await transporter.sendMail({
        from: `池ノ谷商事 管理システム <${smtpFrom}>`,
        to: to || smtpUser,
        subject: "【テスト】SMTPメール送信テスト",
        text: "このメールは管理画面からのSMTP接続テストです。正常に送信されています。",
      });
      res.json({ success: true, message: `${to || smtpUser} にテストメールを送信しました` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Test OpenAI connection
  app.post("/api/admin/settings/test-openai", requireAdmin, async (_req, res) => {
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "OPENAI_API_KEYが設定されていません" });
    try {
      const { default: OpenAI } = await import("openai" as any);
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const r = await client.chat.completions.create({ model: "gpt-4o", messages: [{ role: "user", content: "ping" }], max_tokens: 5 });
      res.json({ success: true, model: r.model, message: "OpenAI APIへの接続が確認できました" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Export contacts as CSV
  app.get("/api/admin/export/contacts", requireAdmin, async (_req, res) => {
    const cts = await storage.getContacts();
    const header = "ID,種別,名前,会社名,メール,電話,内容,日時";
    const rows = cts.map((c) => [
      c.id, c.type, `"${(c.name || "").replace(/"/g, '""')}"`, `"${(c.company || "").replace(/"/g, '""')}"`,
      c.email, c.phone || "", `"${(c.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      c.createdAt?.toISOString() || "",
    ].join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="contacts-${new Date().toISOString().split("T")[0]}.csv"`);
    res.send("\uFEFF" + header + "\n" + rows);
  });

  // Export articles as CSV
  app.get("/api/admin/export/articles", requireAdmin, async (_req, res) => {
    const arts = await storage.getArticles();
    const header = "ID,タイトル,スラッグ,カテゴリ,ステータス,公開日,作成日";
    const rows = arts.map((a) => [
      a.id, `"${(a.title || "").replace(/"/g, '""')}"`, a.slug, a.category, a.status,
      a.publishedAt?.toISOString().split("T")[0] || "", a.createdAt?.toISOString().split("T")[0] || "",
    ].join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="articles-${new Date().toISOString().split("T")[0]}.csv"`);
    res.send("\uFEFF" + header + "\n" + rows);
  });

  // Export email leads as CSV
  app.get("/api/admin/export/leads", requireAdmin, async (_req, res) => {
    const leads = await storage.getEmailLeads();
    const header = "ID,会社名,ウェブサイト,メール,担当者,カテゴリ,ステータス,送信日,作成日";
    const rows = leads.map((l) => [
      l.id, `"${(l.company || "").replace(/"/g, '""')}"`, l.website || "", l.email || "",
      `"${(l.contactName || "").replace(/"/g, '""')}"`, l.category || "", l.status || "",
      l.sentAt?.toISOString().split("T")[0] || "", l.createdAt?.toISOString().split("T")[0] || "",
    ].join(",")).join("\n");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="leads-${new Date().toISOString().split("T")[0]}.csv"`);
    res.send("\uFEFF" + header + "\n" + rows);
  });

  // Clear analytics data
  app.delete("/api/admin/analytics/pageviews", requireAdmin, async (_req, res) => {
    const count = await storage.clearPageViews();
    res.json({ success: true, deleted: count });
  });
  app.delete("/api/admin/analytics/events", requireAdmin, async (_req, res) => {
    const count = await storage.clearEvents();
    res.json({ success: true, deleted: count });
  });

  // Email Leads CRUD
  app.get("/api/admin/email-leads", requireAdmin, async (req, res) => {
    const status = req.query.status as string | undefined;
    const leads = await storage.getEmailLeads(status);
    res.json(leads);
  });

  app.post("/api/admin/email-leads", requireAdmin, async (req, res) => {
    try {
      const parsed = insertEmailLeadSchema.partial().safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error });
      const lead = await storage.createEmailLead(parsed.data as any);
      res.json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/admin/email-leads/:id", requireAdmin, async (req, res) => {
    try {
      const parsed = insertEmailLeadSchema.partial().safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: parsed.error });
      const lead = await storage.updateEmailLead(Number(req.params.id), parsed.data as any);
      res.json(lead);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/admin/email-leads/:id", requireAdmin, async (req, res) => {
    await storage.deleteEmailLead(Number(req.params.id));
    res.json({ ok: true });
  });

  app.post("/api/admin/email-leads/:id/generate", requireAdmin, async (req, res) => {
    const target = await storage.getEmailLeadById(Number(req.params.id));
    if (!target) return res.status(404).json({ error: "Not found" });
    const { generateEmailForLead } = await import("./email-sales");
    const { subject, body, unsubscribeToken } = await generateEmailForLead(target);
    const updated = await storage.updateEmailLead(target.id, { emailSubject: subject, emailBody: body, unsubscribeToken });
    res.json(updated);
  });

  app.get("/api/admin/email-templates", requireAdmin, async (_req, res) => {
    const templates = await storage.getEmailTemplates();
    res.json(templates);
  });

  app.post("/api/admin/email-templates", requireAdmin, async (req, res) => {
    const { name, subject, body, category } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    const tpl = await storage.createEmailTemplate({ name, subject: subject || "", body: body || "", category: category || "shipper" });
    res.json(tpl);
  });

  app.delete("/api/admin/email-templates/:id", requireAdmin, async (req, res) => {
    await storage.deleteEmailTemplate(Number(req.params.id));
    res.json({ ok: true });
  });

  app.get("/api/unsubscribe", async (req, res) => {
    const token = req.query.token as string;
    if (!token) return res.status(400).send("<h2>無効なリクエストです</h2>");
    const leads = await storage.getEmailLeads();
    const lead = leads.find((l) => l.unsubscribeToken === token);
    if (!lead) return res.status(404).send("<h2>リンクが無効または期限切れです</h2>");
    await storage.updateEmailLead(lead.id, { status: "skipped" });
    res.send(`<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"/><title>配信停止完了</title><style>body{margin:0;font-family:'Helvetica Neue',Arial,sans-serif;background:#e8eef8;display:flex;align-items:center;justify-content:center;min-height:100vh;}div{background:#fff;border-radius:8px;padding:48px 40px;text-align:center;box-shadow:0 4px 24px rgba(15,32,68,.1);max-width:480px;}h1{color:#0f2044;font-size:20px;margin:0 0 12px;}p{color:#64748b;font-size:14px;line-height:1.7;margin:0 0 24px;}a{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#1a4b99,#2563eb);color:#fff;border-radius:4px;text-decoration:none;font-size:13px;font-weight:700;}</style></head><body><div><h1>✅ 配信停止が完了しました</h1><p>今後、株式会社池ノ谷商事からの<br/>営業メールは送信されません。</p><a href="https://ikenoyashoji.jp">サイトへ戻る</a></div></body></html>`);
  });

  app.post("/api/admin/email-leads/:id/send", requireAdmin, async (req, res) => {
    let target = await storage.getEmailLeadById(Number(req.params.id));
    if (!target) return res.status(404).json({ error: "Not found" });
    if (!target.email) return res.status(400).json({ error: "No email address" });
    try {
      const { sendLeadEmail, generateEmailForLead } = await import("./email-sales");
      // Auto-generate subject/body if missing
      if (!target.emailSubject || !target.emailBody) {
        const { subject, body, unsubscribeToken } = await generateEmailForLead(target);
        target = await storage.updateEmailLead(target.id, { emailSubject: subject, emailBody: body, unsubscribeToken }) as any;
      }
      await sendLeadEmail(target);
      const updated = await storage.updateEmailLead(target.id, { status: "sent", sentAt: new Date() });
      res.json(updated);
    } catch (err: any) {
      await storage.updateEmailLead(target.id, { status: "failed", errorMsg: err.message });
      res.status(500).json({ error: err.message });
    }
  });

  let crawlStatus: { running: boolean; added: number; finishedAt: string | null } = {
    running: false, added: 0, finishedAt: null,
  };
  let cronPausedLocal = true;

  app.get("/api/admin/email-sales/crawl-status", requireAdmin, (_req, res) => {
    res.json(crawlStatus);
  });

  app.post("/api/admin/email-sales/crawl", requireAdmin, async (_req, res) => {
    if (crawlStatus.running) return res.json({ started: false, reason: "already running" });
    crawlStatus = { running: true, added: 0, finishedAt: null };
    res.json({ started: true });
    import("./email-sales").then(({ crawlLeads }) =>
      crawlLeads()
        .then((count) => { crawlStatus = { running: false, added: count, finishedAt: new Date().toISOString() }; })
        .catch(() => { crawlStatus = { running: false, added: 0, finishedAt: new Date().toISOString() }; })
    );
  });

  app.post("/api/admin/email-sales/pipeline", requireAdmin, async (req, res) => {
    const { runEmailSalesPipeline } = await import("./email-sales");
    const result = await runEmailSalesPipeline();
    res.json(result);
  });

  app.get("/api/admin/email-sales/cron-status", requireAdmin, (_req, res) => {
    res.json({ paused: cronPausedLocal, cronTime: process.env.EMAIL_SALES_CRON || "0 9 * * *" });
  });

  app.post("/api/admin/email-sales/cron-pause", requireAdmin, async (req, res) => {
    const { setCronPaused } = await import("./email-sales");
    const { paused } = req.body;
    cronPausedLocal = !!paused;
    setCronPaused(!!paused);
    res.json({ paused: cronPausedLocal });
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

  // Auto-publish
  app.get("/api/admin/auto-publish/status", requireAdmin, async (_req, res) => {
    const { loadConfig } = await import("./auto-publish");
    res.json(loadConfig());
  });

  app.post("/api/admin/auto-publish/toggle", requireAdmin, async (req, res) => {
    const { loadConfig, saveConfig, startCron, stopCron } = await import("./auto-publish");
    const config = loadConfig();
    config.enabled = !config.enabled;
    if (config.enabled) startCron(config.cronTime);
    else stopCron();
    saveConfig(config);
    res.json({ enabled: config.enabled });
  });

  app.patch("/api/admin/auto-publish/settings", requireAdmin, async (req, res) => {
    const { loadConfig, saveConfig, startCron, stopCron } = await import("./auto-publish");
    const { cronTime, autoPublish } = req.body;
    const config = loadConfig();
    if (cronTime !== undefined) config.cronTime = cronTime;
    if (autoPublish !== undefined) config.autoPublish = autoPublish;
    if (config.enabled) { stopCron(); startCron(config.cronTime); }
    saveConfig(config);
    res.json(config);
  });

  app.post("/api/admin/auto-publish/trigger", requireAdmin, async (_req, res) => {
    const { runAutoPublish } = await import("./auto-publish");
    const result = await runAutoPublish();
    res.json(result);
  });

  // Image upload
  app.post("/api/admin/upload", requireAdmin, upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "ファイルが見つかりません" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  // Admin user management
  app.get("/api/admin/managers", requireAdmin, async (_req, res) => {
    const admins = await storage.getAdminUsers();
    // Never return password hashes
    res.json(admins.map(({ passwordHash: _, ...a }) => a));
  });

  app.post("/api/admin/managers", requireAdmin, async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: "username と password は必須です" });
    if (password.length < 8) return res.status(400).json({ error: "パスワードは8文字以上にしてください" });
    const existing = await storage.getAdminUserByUsername(username);
    if (existing) return res.status(409).json({ error: "そのユーザー名はすでに使用されています" });
    const passwordHash = await bcrypt.hash(password, 12);
    const created = await storage.createAdminUser(username, passwordHash, role || "admin");
    const { passwordHash: _, ...safe } = created;
    res.json(safe);
  });

  app.patch("/api/admin/managers/:id/password", requireAdmin, async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 8) return res.status(400).json({ error: "パスワードは8文字以上にしてください" });
    const passwordHash = await bcrypt.hash(password, 12);
    await storage.updateAdminUserPassword(Number(req.params.id), passwordHash);
    res.json({ success: true });
  });

  app.delete("/api/admin/managers/:id", requireAdmin, async (_req, res) => {
    await storage.deleteAdminUser(Number(_req.params.id));
    res.json({ success: true });
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
