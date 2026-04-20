import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  canonical?: string;
}

const ensureMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const ensureLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export const SEO = ({ title, description, canonical }: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | Lumina English Academy`;
    document.title = fullTitle;
    if (description) {
      ensureMeta("description", description);
      ensureMeta("og:title", fullTitle, "property");
      ensureMeta("og:description", description, "property");
      ensureMeta("og:type", "website", "property");
    }
    const url = canonical ?? window.location.origin + window.location.pathname;
    ensureLink("canonical", url);
  }, [title, description, canonical]);

  return null;
};
