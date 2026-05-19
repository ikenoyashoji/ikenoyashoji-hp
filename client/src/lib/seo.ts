const SITE_NAME = "株式会社池ノ谷商事";
const DEFAULT_OG_IMAGE = "/og-image.png";
const BASE_URL = "https://ikenoyashoji.jp";

interface SeoOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}

function setMeta(name: string, content: string, useProperty = false) {
  const attr = useProperty ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function setSeo({ title, description, path = "/", ogImage = DEFAULT_OG_IMAGE }: SeoOptions) {
  const fullTitle = `${title}｜${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  document.title = fullTitle;

  setMeta("description", description);
  setMeta("robots", "index, follow");
  setLink("canonical", url);

  setMeta("og:type", "website", true);
  setMeta("og:site_name", SITE_NAME, true);
  setMeta("og:title", fullTitle, true);
  setMeta("og:description", description, true);
  setMeta("og:image", ogImage, true);
  setMeta("og:url", url, true);
  setMeta("og:locale", "ja_JP", true);

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", fullTitle);
  setMeta("twitter:description", description);
  setMeta("twitter:image", ogImage);
}
