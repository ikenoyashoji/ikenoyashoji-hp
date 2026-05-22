import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AdminLayout } from "@/components/admin-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, ArrowLeft, Wand2, Globe, Upload, X, ImageIcon } from "lucide-react";
import { Link } from "wouter";

const categories = ["物流コラム", "採用情報", "お知らせ"];

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [rewriting, setRewriting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: article, isLoading } = useQuery<any>({
    queryKey: ["/api/admin/articles", id],
    queryFn: async () => {
      if (isNew) return null;
      const res = await fetch(`/api/admin/articles/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !isNew,
  });

  const form = useForm({
    defaultValues: {
      title: "", slug: "", metaDescription: "", excerpt: "", content: "",
      category: "物流コラム", tags: "", status: "draft", imageUrl: "", faqData: "[]", authorNote: "",
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title || "",
        slug: article.slug || "",
        metaDescription: article.metaDescription || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        category: article.category || "物流コラム",
        tags: (article.tags || []).join(", "),
        status: article.status || "draft",
        imageUrl: article.imageUrl || "",
        faqData: article.faqData || "[]",
        authorNote: article.authorNote || "",
      });
    }
  }, [article]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = { ...data, tags: data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) };
      if (isNew) return apiRequest("POST", "/api/admin/articles", payload);
      return apiRequest("PUT", `/api/admin/articles/${id}`, payload);
    },
    onSuccess: (saved: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({ title: isNew ? "記事を作成しました" : "記事を保存しました" });
      if (isNew) navigate(`/admin/articles/${saved.id}`);
    },
    onError: () => toast({ title: "保存に失敗しました", variant: "destructive" }),
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      await saveMutation.mutateAsync(form.getValues());
      return apiRequest("POST", `/api/admin/articles/${id}/publish`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({ title: "記事を公開しました" });
    },
  });

  const handleRewrite = async () => {
    if (isNew || !id) return;
    setRewriting(true);
    try {
      const res = await fetch(`/api/admin/ai/rewrite/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisNote: "検索意図強化、FAQ追加、内部リンク最適化" }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const updated = await res.json();
      form.setValue("title", updated.title);
      form.setValue("content", updated.content);
      form.setValue("metaDescription", updated.metaDescription);
      form.setValue("excerpt", updated.excerpt);
      toast({ title: "AIリライト完了", description: "内容を確認して保存してください" });
    } catch (err: any) {
      toast({ title: "リライト失敗", description: err.message, variant: "destructive" });
    } finally {
      setRewriting(false);
    }
  };

  const autoSlug = () => {
    const title = form.getValues("title");
    const slug = title.toLowerCase()
      .replace(/[ぁ-ん]+/g, "ja").replace(/[一-龯ー]+/g, "jp")
      .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").substring(0, 60);
    form.setValue("slug", slug || `article-${Date.now()}`);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData, credentials: "include" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      const { url } = await res.json();
      form.setValue("imageUrl", url);
      toast({ title: "画像をアップロードしました" });
    } catch (err: any) {
      toast({ title: "アップロード失敗", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-3 max-w-4xl">
          <Skeleton className="h-8 w-64 bg-gray-100" />
          <Skeleton className="h-96 w-full bg-gray-100" />
        </div>
      </AdminLayout>
    );
  }

  const contentValue = form.watch("content");
  const inputClass = "border-gray-200 text-gray-900 placeholder:text-gray-300 rounded-none focus:border-black focus:ring-0 text-sm";

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/admin/articles">
              <span className="flex items-center gap-1 text-gray-400 text-xs hover:text-gray-900 cursor-pointer transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> 一覧へ
              </span>
            </Link>
            <span className="text-gray-200">|</span>
            <h1 className="text-base font-bold text-gray-900">{isNew ? "新規記事作成" : "記事編集"}</h1>
            {!isNew && article?.status && (
              <span className={`text-[10px] px-1.5 py-0.5 border ${article.status === "published" ? "border-gray-900 text-gray-900" : "border-gray-300 text-gray-400"}`}>
                {article.status === "published" ? "公開中" : "下書き"}
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {!isNew && (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs hover:border-black transition-colors disabled:opacity-40"
                onClick={handleRewrite}
                disabled={rewriting}
                data-testid="button-rewrite"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {rewriting ? "リライト中..." : "AIリライト"}
              </button>
            )}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 text-xs hover:border-black transition-colors disabled:opacity-40"
              onClick={() => form.handleSubmit((d) => saveMutation.mutate(d))()}
              disabled={saveMutation.isPending}
              data-testid="button-save-draft"
            >
              <Save className="w-3.5 h-3.5" />
              {saveMutation.isPending ? "保存中..." : "下書き保存"}
            </button>
            {!isNew && (
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs hover:bg-gray-800 transition-colors disabled:opacity-40"
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending}
                data-testid="button-publish"
              >
                <Globe className="w-3.5 h-3.5" />
                {publishMutation.isPending ? "公開中..." : "公開する"}
              </button>
            )}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))}>
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Main column */}
              <div className="lg:col-span-2 space-y-3">
                <div className="bg-white border border-gray-200 p-4 space-y-3">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs font-medium">タイトル</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO記事のタイトルを入力..." className={inputClass} {...field} data-testid="input-article-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex gap-2">
                    <FormField control={form.control} name="slug" render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-gray-600 text-xs font-medium">スラッグ（URL）</FormLabel>
                        <FormControl>
                          <Input placeholder="url-slug-here" className={`${inputClass} text-xs`} {...field} data-testid="input-article-slug" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-end">
                      <button type="button" className="px-3 h-9 border border-gray-300 text-gray-600 text-xs hover:border-black transition-colors" onClick={autoSlug}>
                        自動生成
                      </button>
                    </div>
                  </div>
                  <FormField control={form.control} name="metaDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs font-medium">メタディスクリプション（90〜120文字推奨）</FormLabel>
                      <FormControl>
                        <Textarea placeholder="検索結果に表示される説明文..." className={`${inputClass} text-xs resize-none`} rows={2} {...field} data-testid="textarea-meta" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="excerpt" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs font-medium">抜粋（一覧ページ表示用）</FormLabel>
                      <FormControl>
                        <Textarea placeholder="記事の概要を100〜150文字で..." className={`${inputClass} text-xs resize-none`} rows={2} {...field} data-testid="textarea-excerpt" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-white border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 text-xs font-semibold">本文（HTML）</span>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 transition-colors"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Eye className="w-3 h-3" />
                      {previewMode ? "編集" : "プレビュー"}
                    </button>
                  </div>
                  {previewMode ? (
                    <div
                      className="prose prose-sm max-w-none min-h-64 bg-gray-50 border border-gray-100 p-4 text-gray-800"
                      dangerouslySetInnerHTML={{ __html: contentValue }}
                    />
                  ) : (
                    <FormField control={form.control} name="content" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="<h2>見出し2</h2><p>本文...</p>"
                            className="border-gray-200 text-gray-900 placeholder:text-gray-300 text-xs font-mono rounded-none resize-none focus:border-black focus:ring-0"
                            rows={20}
                            {...field}
                            data-testid="textarea-content"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </div>

                <div className="bg-white border border-gray-200 p-4">
                  <p className="text-gray-600 text-xs font-semibold mb-2">FAQ データ（JSON形式）</p>
                  <FormField control={form.control} name="faqData" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder='[{"q": "質問1", "a": "回答1"}]'
                          className="border-gray-200 text-gray-900 placeholder:text-gray-300 text-xs font-mono rounded-none resize-none focus:border-black focus:ring-0"
                          rows={4}
                          {...field}
                          data-testid="textarea-faq"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-3">
                <div className="bg-white border border-gray-200 p-4 space-y-3">
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs font-medium">ステータス</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="border-gray-200 text-gray-700 text-xs h-8 rounded-none" data-testid="select-article-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-gray-200">
                            <SelectItem value="draft" className="text-xs">下書き</SelectItem>
                            <SelectItem value="published" className="text-xs">公開</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs font-medium">カテゴリ</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="border-gray-200 text-gray-700 text-xs h-8 rounded-none" data-testid="select-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-none border-gray-200">
                            {categories.map((c) => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="tags" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs font-medium">タグ（カンマ区切り）</FormLabel>
                      <FormControl>
                        <Input placeholder="物流, 輸送, コスト削減" className={`${inputClass} text-xs h-8`} {...field} data-testid="input-tags" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs font-medium">アイキャッチ画像</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {/* Preview */}
                          {field.value ? (
                            <div className="relative aspect-video bg-gray-100 border border-gray-200 overflow-hidden">
                              <img
                                src={field.value}
                                alt="アイキャッチ"
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white p-0.5 rounded"
                                onClick={() => field.onChange("")}
                                title="画像を削除"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-gray-400 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <ImageIcon className="w-6 h-6 text-gray-300" />
                              <span className="text-gray-400 text-[10px]">クリックして画像をアップロード</span>
                            </div>
                          )}
                          {/* Upload button */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            data-testid="input-image-file"
                          />
                          <button
                            type="button"
                            className="w-full flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-xs h-7 hover:border-gray-400 transition-colors disabled:opacity-50"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            data-testid="button-upload-image"
                          >
                            <Upload className="w-3 h-3" />
                            {uploading ? "アップロード中..." : "画像をアップロード"}
                          </button>
                          {/* URL直接入力 */}
                          <Input
                            placeholder="または画像URLを入力..."
                            className={`${inputClass} text-[11px] h-7`}
                            value={field.value}
                            onChange={field.onChange}
                            data-testid="input-image-url"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="authorNote" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-600 text-xs font-medium">著者メモ</FormLabel>
                      <FormControl>
                        <Input placeholder="池ノ谷商事 ○○部" className={`${inputClass} text-xs h-8`} {...field} data-testid="input-author" />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                {!isNew && article?.slug && (
                  <a
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-gray-400 text-xs hover:text-gray-900 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> 公開ページを確認 →
                  </a>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
