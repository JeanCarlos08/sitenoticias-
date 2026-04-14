"""
generate_sitemap.py — HORIZON INTEL
Gera automaticamente o public/sitemap.xml a partir de news.json.
Executado pelo GitHub Actions após o gerador de notícias.
"""

import json
import os
from datetime import datetime

BASE_URL = "https://horizonintel.vercel.app"  # Troque pelo seu domínio
NEWS_JSON = os.path.join(os.path.dirname(__file__), "..", "src", "data", "news.json")
SITEMAP_OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sitemap.xml")

STATIC_PAGES = [
    {"url": "/",           "priority": "1.0", "changefreq": "hourly"},
    {"url": "/privacidade","priority": "0.3", "changefreq": "yearly"},
    {"url": "/termos",     "priority": "0.3", "changefreq": "yearly"},
]

def slugify(text):
    import re
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text, flags=re.UNICODE)
    text = re.sub(r'[\s_-]+', '-', text)
    return text[:80]

def build_sitemap():
    with open(NEWS_JSON, "r", encoding="utf-8") as f:
        articles = json.load(f)

    now = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    urls = []

    # Static pages
    for page in STATIC_PAGES:
        urls.append(f"""  <url>
    <loc>{BASE_URL}{page['url']}</loc>
    <lastmod>{now}</lastmod>
    <changefreq>{page['changefreq']}</changefreq>
    <priority>{page['priority']}</priority>
  </url>""")

    # Article pages — usam o ID como âncora
    for article in articles:
        slug = slugify(article.get("title", f"artigo-{article['id']}"))
        loc = f"{BASE_URL}/#artigo-{article['id']}-{slug}"
        pub_date = article.get("published_at", now)[:10]
        urls.append(f"""  <url>
    <loc>{loc}</loc>
    <lastmod>{pub_date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>HORIZON INTEL</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>{pub_date}</news:publication_date>
      <news:title>{article.get('title','').replace('&','&amp;')}</news:title>
    </news:news>
  </url>""")

    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
{chr(10).join(urls)}
</urlset>"""

    os.makedirs(os.path.dirname(SITEMAP_OUT), exist_ok=True)
    with open(SITEMAP_OUT, "w", encoding="utf-8") as f:
        f.write(sitemap)

    print(f"✅ sitemap.xml gerado com {len(articles)} artigos + {len(STATIC_PAGES)} páginas estáticas.")
    print(f"   Salvo em: {SITEMAP_OUT}")

if __name__ == "__main__":
    build_sitemap()
