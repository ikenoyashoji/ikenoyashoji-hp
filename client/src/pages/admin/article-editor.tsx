import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, ArrowLeft, Wand2, Globe } from "lucide-react";
import { Link } from "wouter";

const categories = ["物流コラム", "採用情報", "協力会社情報", "お知らせ", "事例紹介"];

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === "new";
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [rewriting, setRewriting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

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
      title: "",
      slug: "",
      metaDescription: "",
      excerpt: "",
      content: "",
      category: "物流コラム",
      tags: "",
      status: "draft",
      imageUrl: "",
      faqData: "[]",
      authorNote: "",
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
      .replace(/[ぁ-ん]+/g, "ja")
      .replace(/[一-龯ー]+/g, "jp")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 60);
    form.setValue("slug", slug || `article-${Date.now()}`);
  };

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 bg-[#0f2044]" />
          <Skeleton className="h-96 w-full bg-[#0f2044]" />
        </div>
      </AdminLayout>
    );
  }

  const contentValue = form.watch("content");

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Link href="/admin/articles">
              <Button size="sm" variant="ghost" className="text-blue-400 text-xs h-7 px-2">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> 一覧へ
              </Button>
            </Link>
            <h1 className="text-lg font-black text-white">{isNew ? "新規記事作成" : "記事編集"}</h1>
            {!isNew && article?.status && (
              <Badge className={`text-[10px] ${article.status === "published" ? "bg-green-700 text-green-100" : "bg-blue-900 text-blue-300"}`}>
                {article.status === "published" ? "公開中" : "下書き"}
              </Badge>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {!isNew && (
              <Button
                size="sm"
                variant="outline"
                className="border-blue-700 text-blue-300 bg-transparent text-xs h-7"
                onClick={handleRewrite}
                disabled={rewriting}
                data-testid="button-rewrite"
              >
                <Wand2 className="w-3.5 h-3.5 mr-1" />
                {rewriting ? "リライト中..." : "AIリライト"}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-blue-700 text-blue-300 bg-transparent text-xs h-7"
              onClick={() => form.handleSubmit((d) => saveMutation.mutate(d))()}
              disabled={saveMutation.isPending}
              data-testid="button-save-draft"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              {saveMutation.isPending ? "保存中..." : "下書き保存"}
            </Button>
            {!isNew && (
              <Button
                size="sm"
                className="bg-green-600 text-white border-green-500 text-xs h-7"
                onClick={() => publishMutation.mutate()}
                disabled={publishMutation.isPending}
                data-testid="button-publish"
              >
                <Globe className="w-3.5 h-3.5 mr-1" />
                {publishMutation.isPending ? "公開中..." : "公開する"}
              </Button>
            )}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))}>
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-[#0f2044] border border-blue-900 rounded-lg p-4 space-y-3">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-300 text-xs">タイトル</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO記事のタイトルを入力..."
                          className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600"
                          {...field}
                          data-testid="input-article-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex gap-2">
                    <FormField control={form.control} name="slug" render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-blue-300 text-xs">スラッグ（URL）</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="url-slug-here"
                            className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs"
                            {...field}
                            data-testid="input-article-slug"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-end">
                      <Button type="button" size="sm" variant="outline" className="border-blue-700 text-blue-300 bg-transparent text-xs h-9" onClick={autoSlug}>
                        自動生成
                      </Button>
                    </div>
                  </div>
                  <FormField control={form.control} name="metaDescription" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-300 text-xs">メタディスクリプション（90〜120文字推奨）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="検索結果に表示される説明文..."
                          className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs resize-none"
                          rows={2}
                          {...field}
                          data-testid="textarea-meta"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="excerpt" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-300 text-xs">抜粋（一覧ページ表示用）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="記事の概要を100〜150文字で..."
                          className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs resize-none"
                          rows={2}
                          {...field}
                          data-testid="textarea-excerpt"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <div className="bg-[#0f2044] border border-blue-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-300 text-xs font-semibold">本文（HTML）</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-[10px] text-blue-400"
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {previewMode ? "編集" : "プレビュー"}
                    </Button>
                  </div>
                  {previewMode ? (
                    <div
                      className="prose prose-sm prose-invert max-w-none min-h-64 bg-[#0a1628] rounded p-4 text-blue-100"
                      dangerouslySetInnerHTML={{ __html: contentValue }}
                    />
                  ) : (
                    <FormField control={form.control} name="content" render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="<h2>見出し2</h2><p>本文...</p>"
                            className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs font-mono resize-none"
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

                <div className="bg-[#0f2044] border border-blue-900 rounded-lg p-4">
                  <FormLabel className="text-blue-300 text-xs font-semibold">FAQ データ（JSON形式）</FormLabel>
                  <FormField control={form.control} name="faqData" render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Textarea
                          placeholder='[{"q": "質問1", "a": "回答1"}]'
                          className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs font-mono resize-none"
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

              <div className="space-y-4">
                <div className="bg-[#0f2044] border border-blue-900 rounded-lg p-4 space-y-3">
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-300 text-xs">ステータス</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-[#0a1628] border-blue-800 text-white text-xs h-8" data-testid="select-article-status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0f2044] border-blue-800">
                            <SelectItem value="draft" className="text-blue-200 text-xs">下書き</SelectItem>
                            <SelectItem value="published" className="text-blue-200 text-xs">公開</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-300 text-xs">カテゴリ</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-[#0a1628] border-blue-800 text-white text-xs h-8" data-testid="select-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0f2044] border-blue-800">
                            {categories.map((c) => <SelectItem key={c} value={c} className="text-blue-200 text-xs">{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="tags" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-300 text-xs">タグ（カンマ区切り）</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="物流, 輸送, コスト削減"
                          className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs h-8"
                          {...field}
                          data-testid="input-tags"
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-300 text-xs">アイキャッチ画像URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs h-8"
                          {...field}
                          data-testid="input-image-url"
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="authorNote" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-300 text-xs">著者メモ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="池ノ谷商事 ○○部"
                          className="bg-[#0a1628] border-blue-800 text-white placeholder:text-blue-600 text-xs h-8"
                          {...field}
                          data-testid="input-author"
                        />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>

                {!isNew && article?.slug && (
                  <a
                    href={`/blog/${article.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-400 text-xs hover:text-white transition-colors"
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
