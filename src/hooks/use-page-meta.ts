import { useEffect } from "react";

const SITE_URL = "https://www.hiveclinicuk.com";
const DEFAULT_OG = `${SITE_URL}/og-default.jpg`;

type Meta = {
  canonicalPath?: string;
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
};

function upsertMeta(selector: string, attr: string, attrName: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta") as any;
    el.setAttribute(attr, attrName);
    document.head.appendChild(el);
  }
  el.setAttribute(selector.startsWith("link") ? "href" : "content", value);
}

export function usePageMeta(title: string, description: string, opts: Meta = {}) {
  useEffect(() => {
    document.title = title;

    // description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // canonical
    const path = opts.canonicalPath ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const canonicalUrl = `${SITE_URL}${path}`;
    upsertMeta('link[rel="canonical"]', "rel", "canonical", canonicalUrl);

    // Open Graph
    const og = opts.ogImage ?? DEFAULT_OG;
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    upsertMeta('meta[property="og:image"]', "property", "og:image", og);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", og);

    // JSON-LD (page-specific)
    const PAGE_LD_ID = "page-jsonld";
    document.getElementById(PAGE_LD_ID)?.remove();
    if (opts.jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = PAGE_LD_ID;
      script.text = JSON.stringify(opts.jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = "Hive Clinic | Aesthetic Clinic Manchester City Centre";
    };
  }, [title, description, opts.canonicalPath, opts.ogImage, JSON.stringify(opts.jsonLd ?? null)]);
}
