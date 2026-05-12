# 株式会社池ノ谷商事 - Webサイト

## プロジェクト概要
日本の物流会社「株式会社池ノ谷商事」の企業ウェブサイト。荷主・採用・協力会社向けのコンテンツとSEO強化機能を備えた管理画面を持つフルスタックアプリ。

## 技術スタック
- **Frontend**: React + TypeScript + Vite + Wouter + TanStack Query + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **AI**: OpenAI GPT-4o（記事生成・リライト・SEO分析）
- **Analytics**: GA4 + Microsoft Clarity（Cookie同意後のみロード）

## ファイル構成

### Backend
- `server/index.ts` - Express エントリーポイント
- `server/routes.ts` - 全APIルート定義（認証・記事・キーワード・分析・AI）
- `server/storage.ts` - データベース操作インターフェース（DrizzleStorage）
- `server/db.ts` - PostgreSQL接続設定

### Frontend
- `client/src/App.tsx` - ルーティング定義
- `client/src/lib/analytics.ts` - GA4/Clarity/内部アナリティクス
- `client/src/components/` - 共有コンポーネント
  - `header.tsx` - ナビゲーションヘッダー
  - `footer.tsx` - フッター
  - `cta-banner.tsx` - CTAセクション
  - `cookie-banner.tsx` - Cookieバナー
  - `admin-layout.tsx` - 管理画面レイアウト（サイドバー）

### 公開ページ (`client/src/pages/`)
- `home.tsx` - ホーム（荷主向けランディング）
- `recruit.tsx` - 採用情報
- `partner.tsx` - 協力会社募集
- `blog.tsx` - ブログ一覧
- `blog-post.tsx` - ブログ記事詳細
- `company.tsx` - 会社情報
- `contact.tsx` - お問い合わせ（荷主/採用/協力会社で動的切替）
- `privacy.tsx` - プライバシーポリシー

### 管理画面 (`client/src/pages/admin/`)
- `login.tsx` - ログイン
- `dashboard.tsx` - ダッシュボード（PVグラフ・イベント・問い合わせ）
- `articles.tsx` - 記事一覧（AI記事生成機能）
- `article-editor.tsx` - 記事エディタ（HTML編集・AIリライト・プレビュー）
- `keywords.tsx` - SEOキーワード管理
- `contacts.tsx` - 問い合わせ一覧
- `search-console.tsx` - サーチコンソールPDCAツール

### 共有スキーマ (`shared/schema.ts`)
テーブル: users, articles, keywords, contacts, page_views, events, search_console_data

## 環境変数
| 変数名 | 説明 | 必須 |
|--------|------|------|
| DATABASE_URL | PostgreSQL接続URL | ✅ |
| SESSION_SECRET | セッション秘密鍵 | ✅ |
| ADMIN_USER | 管理画面ユーザー名（デフォルト: admin） | |
| ADMIN_PASS | 管理画面パスワード（デフォルト: admin123） | |
| OPENAI_API_KEY | AI記事生成・リライト・分析 | AI機能に必要 |
| VITE_GA4_ID | Google Analytics 4 測定ID | |
| VITE_CLARITY_ID | Microsoft Clarity プロジェクトID | |
| SITE_URL | サイトURL（サイトマップ生成用） | |

## 管理画面アクセス
- URL: `/admin/login`
- デフォルト: admin / admin123
- 環境変数 `ADMIN_USER` / `ADMIN_PASS` で変更可

## デザイン
- プライマリ: ネイビーブルー (#0f2044)
- アクセント: ブルーグラデーション (#1a4b99 → #1d4ed8)
- ベース: ブラック＆ホワイト + ブルーグラデーションアクセント
- コーポレート物流のプレミアム・スタイリッシュなビジュアル

## 主な機能
1. **公開サイト**: 荷主・採用・協力会社向けページ + ブログ + お問い合わせフォーム
2. **Cookie同意**: GDPR/個人情報保護法対応のCookieバナー
3. **内部アナリティクス**: PV・イベント追跡をDBに保存、都道府県別（推定）
4. **管理画面**: 記事CRUD・キーワード管理・お問い合わせ確認・アナリティクス閲覧
5. **AI機能**: GPT-4oによる記事自動生成・SEOリライト・サーチコンソール分析
6. **SEO**: サイトマップ・robots.txt自動生成
7. **デモデータ**: 記事2件・キーワード10件が初回起動時にシード
