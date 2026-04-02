import os
import json
import random
import hashlib
import requests
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from urllib.parse import quote

GROQ_API_KEY    = os.getenv("GROQ_API_KEY")
NEWS_API_KEY    = os.getenv("NEWS_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "news.json")
MAX_ARTICLES = 150   # Limite máximo acumulado no JSON
ARTICLES_PER_CYCLE = 50

WAR_CATEGORIES = ["Conflitos", "OTAN", "Oriente Médio", "Leste Europeu", "Geopolítica", "Ásia-Pacífico", "África"]

# ── MEGA RSS FEEDS ─────────────────────────────────────────────────────────────
# Feeds internacionais de altíssima credibilidade — 100% grátis
RSS_FEEDS = [
    # ── Agências Internacionais
    {"url": "http://feeds.bbci.co.uk/news/world/rss.xml",                         "label": "🔵 BBC World News",   "cat": "Conflitos"},
    {"url": "https://www.aljazeera.com/xml/rss/all.xml",                          "label": "🟡 Al Jazeera",        "cat": "Oriente Médio"},
    {"url": "https://feeds.reuters.com/reuters/worldNews",                         "label": "📰 Reuters",           "cat": "Geopolítica"},
    {"url": "https://rss.dw.com/rdf/rss-en-world",                                "label": "🇩🇪 Deutsche Welle",   "cat": "Leste Europeu"},
    {"url": "https://www.france24.com/en/rss",                                     "label": "🇫🇷 France 24",        "cat": "Oriente Médio"},
    {"url": "https://apnews.com/rss/World-News",                                   "label": "📡 AP News",           "cat": "Conflitos"},
    {"url": "https://feeds.theguardian.com/theguardian/world/rss",                 "label": "🔹 The Guardian",      "cat": "Geopolítica"},
    {"url": "https://www.euronews.com/rss",                                        "label": "🇪🇺 Euronews",         "cat": "OTAN"},
    {"url": "https://en.rfi.fr/general.rss",                                       "label": "📻 RFI",               "cat": "África"},
    {"url": "https://www.stripes.com/rss/latest",                                  "label": "⭐ Stars & Stripes",   "cat": "Conflitos"},
    # ── Oriente Médio
    {"url": "https://www.middleeasteye.net/rss",                                   "label": "🕌 Middle East Eye",   "cat": "Oriente Médio"},
    {"url": "https://www.haaretz.com/rss",                                          "label": "🇮🇱 Haaretz",         "cat": "Oriente Médio"},
    # ── OTAN & Defesa
    {"url": "https://www.nato.int/cps/en/natolive/news.rss",                       "label": "🛡️ NATO Official",   "cat": "OTAN"},
    {"url": "https://www.defensenews.com/rss/",                                    "label": "🎖️ Defense News",     "cat": "OTAN"},
    {"url": "https://www.janes.com/feeds/news",                                    "label": "🔧 Janes",             "cat": "Conflitos"},
    # ── Ásia-Pacífico
    {"url": "https://asia.nikkei.com/rss/feed/nar",                                "label": "🇯🇵 Nikkei Asia",     "cat": "Ásia-Pacífico"},
    {"url": "https://www.scmp.com/rss/5/feed",                                     "label": "🇨🇳 SCMP",            "cat": "Ásia-Pacífico"},
    # ── Google News (por query)
    {"url": f"https://news.google.com/rss/search?q=guerra+militar+conflito&hl=pt-BR&gl=BR",    "label": "🌐 Google News",       "cat": "Conflitos"},
    {"url": f"https://news.google.com/rss/search?q=NATO+OTAN+military&hl=pt-BR&gl=BR",         "label": "🌐 Google OTAN",       "cat": "OTAN"},
    {"url": f"https://news.google.com/rss/search?q=Ukraine+Russia+war+frontline&hl=en-US",     "label": "🌐 Google Ukraine",    "cat": "Leste Europeu"},
    {"url": f"https://news.google.com/rss/search?q=Israel+Gaza+Hamas+airstrike&hl=en-US",      "label": "🌐 Google Gaza",       "cat": "Oriente Médio"},
    {"url": f"https://news.google.com/rss/search?q=China+Taiwan+tensions+military&hl=en-US",   "label": "🌐 Google Taiwan",     "cat": "Ásia-Pacífico"},
    {"url": f"https://news.google.com/rss/search?q=Africa+conflict+coup+military&hl=en-US",    "label": "🌐 Google Africa",     "cat": "África"},
    {"url": f"https://news.google.com/rss/search?q=North+Korea+missile+nuclear&hl=en-US",      "label": "🌐 Google Coreia",     "cat": "Ásia-Pacífico"},
]

REDDIT_SUBREDDITS = [
    ("worldnews",          "Conflitos"),
    ("geopolitics",        "Geopolítica"),
    ("europe",             "OTAN"),
    ("UkraineRussiaReport","Leste Europeu"),
    ("CredibleDefense",    "OTAN"),
    ("MiddleEastNews",     "Oriente Médio"),
    ("syriancivilwar",     "Oriente Médio"),
    ("Israel",             "Oriente Médio"),
    ("ChinaHistory",       "Ásia-Pacífico"),
    ("OSINT",              "Conflitos"),
    ("worldpolitics",      "Geopolítica"),
    ("GlobalTalk",         "Geopolítica"),
]

NEWSAPI_QUERIES = [
    {"q": "war conflict military attack troops",     "cat": "Conflitos"},
    {"q": "NATO alliance military geopolitics",      "cat": "OTAN"},
    {"q": "Israel Hamas Gaza Palestinian strike",    "cat": "Oriente Médio"},
    {"q": "Ukraine Russia war Kharkiv Kherson",      "cat": "Leste Europeu"},
    {"q": "China Taiwan Indo-Pacific tension",       "cat": "Ásia-Pacífico"},
    {"q": "Africa coup militia sahel conflict",      "cat": "África"},
    {"q": "nuclear weapon missile threat Kim",       "cat": "Ásia-Pacífico"},
]

# ── SCRAPERS ───────────────────────────────────────────────────────────────────

def deduplicate(articles):
    """Remove artigos com títulos muito similares por hash dos primeiros 60 chars"""
    seen = set()
    unique = []
    for a in articles:
        key = hashlib.md5(a["title"][:60].lower().strip().encode()).hexdigest()
        if key not in seen:
            seen.add(key)
            unique.append(a)
    return unique


def fetch_rss_feeds():
    """Busca artigos de todos os feeds RSS configurados"""
    articles = []
    feeds_to_try = random.sample(RSS_FEEDS, min(16, len(RSS_FEEDS)))
    for feed in feeds_to_try:
        try:
            resp = requests.get(feed["url"], timeout=12, headers={"User-Agent": "Mozilla/5.0 (HorizonIntel/2.0)"})
            if resp.status_code != 200:
                continue
            root = ET.fromstring(resp.content)
            items = root.findall(".//item")
            for item in items[:4]:
                title = item.findtext("title", "").replace(" - Google News", "").strip()
                if title and len(title) > 15:
                    articles.append({
                        "title": title,
                        "source_label": feed["label"],
                        "source_key": "rss",
                        "category": feed["cat"],
                        "image_url": "",
                    })
        except Exception as e:
            print(f"  [RSS] Falha em {feed['label']}: {e}")
    return articles


def fetch_reddit():
    """Busca posts dos subreddits OSINT e geopolítica"""
    articles = []
    headers = {"User-Agent": "HorizonIntelBot/2.0 (by /u/horizonintel)"}
    selected_subs = random.sample(REDDIT_SUBREDDITS, min(6, len(REDDIT_SUBREDDITS)))
    for sub, cat in selected_subs:
        url = f"https://www.reddit.com/r/{sub}/hot.json?limit=8"
        try:
            resp = requests.get(url, headers=headers, timeout=12)
            if resp.status_code != 200:
                continue
            posts = resp.json().get("data", {}).get("children", [])
            for post in posts:
                d = post.get("data", {})
                title = d.get("title", "").strip()
                score = d.get("score", 0)
                if title and len(title) > 20 and score > 100:
                    # Smart category detection
                    tl = title.lower()
                    detected_cat = cat
                    if any(w in tl for w in ["ukraine","russia","kharkiv","kherson","donbas"]):
                        detected_cat = "Leste Europeu"
                    elif any(w in tl for w in ["israel","gaza","hamas","hezbol","west bank","iran"]):
                        detected_cat = "Oriente Médio"
                    elif any(w in tl for w in ["china","taiwan","xinjiang","hong kong","korea","japan","india"]):
                        detected_cat = "Ásia-Pacífico"
                    elif any(w in tl for w in ["nato","otan","alliance","europe","poland","baltics"]):
                        detected_cat = "OTAN"
                    elif any(w in tl for w in ["africa","sahel","niger","mali","sudan","ethiopia","somalia"]):
                        detected_cat = "África"
                    articles.append({
                        "title": title,
                        "source_label": f"💬 r/{sub}",
                        "source_key": "reddit",
                        "category": detected_cat,
                        "image_url": d.get("thumbnail", "") if d.get("thumbnail", "").startswith("http") else "",
                    })
        except Exception as e:
            print(f"  [Reddit] Falha em r/{sub}: {e}")
    return articles


def fetch_newsapi():
    """Busca via NewsAPI com queries de conflito globais"""
    articles = []
    if not NEWS_API_KEY:
        print("  [NewsAPI] Chave não configurada, pulando.")
        return articles
    for q in random.sample(NEWSAPI_QUERIES, min(5, len(NEWSAPI_QUERIES))):
        url = (
            f"https://newsapi.org/v2/everything"
            f"?q={quote(q['q'])}&sortBy=publishedAt&pageSize=5"
            f"&language=en&apiKey={NEWS_API_KEY}"
        )
        try:
            resp = requests.get(url, timeout=12)
            data = resp.json()
            for a in data.get("articles", []):
                title = (a.get("title") or "").strip()
                if title and title != "[Removed]" and len(title) > 20:
                    articles.append({
                        "title": title,
                        "source_label": f"📰 {a.get('source', {}).get('name', 'NewsAPI')}",
                        "source_key": "newsapi",
                        "category": q["cat"],
                        "image_url": a.get("urlToImage") or "",
                    })
        except Exception as e:
            print(f"  [NewsAPI] Erro: {e}")
    return articles


def fetch_youtube_video(query):
    """Busca o ID de um vídeo relacionado no YouTube"""
    if not YOUTUBE_API_KEY:
        return ""
    url = f"https://www.googleapis.com/youtube/v3/search?q={quote(query)}&key={YOUTUBE_API_KEY}&maxResults=1&type=video&order=date"
    try:
        resp = requests.get(url, timeout=10)
        items = resp.json().get("items", [])
        if items:
            return items[0]["id"]["videoId"]
    except Exception as e:
        print(f"  [YouTube] Erro: {e}")
    return ""


# ── AI REWRITE ─────────────────────────────────────────────────────────────────

def clean_json_string(text):
    """Remove markdown backticks (```json ... ```) or any leading/trailing text from AI response"""
    if "```" in text:
        # Tenta extrair entre blocos de código
        try:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        except:
            pass
    return text.strip()


def rewrite_as_intel_report(news_item):
    """Usa Groq Llama3 para gerar um Relatório de Inteligência completo"""
    if not GROQ_API_KEY:
        print("  [Groq] Chave não configurada.")
        return None

    prompt = f"""Você é um analista sênior de inteligência geopolítica de uma agência de alto nível. Seu trabalho é converter manchetes brutas em Relatórios de Inteligência estruturados, profundos, imparciais e 100% factuais em Português do Brasil.

Manchete: {news_item['title']}
Categoria: {news_item['category']}

Gere um JSON com EXATAMENTE estas chaves:
1. "title": Título professional e factual em PT-BR (máx 120 chars).
2. "excerpt": Resumo factual de 2-3 frases (sem adjetivos emocionais).
3. "bullet_points": Lista JSON de 4 strings com fatos técnicos concretos (locais, datas, cifras, unidades militares, armamentos).
4. "content": Relatório de 7 parágrafos. Cobrindo: (1) Contexto histórico (2) Situação tática atual (3) Atores e posições (4) Reações diplomáticas (5) Impacto humanitário (6) Dimensão econômica (7) Perspectivas de curto prazo.
5. "strategic_analysis": 2 parágrafos sobre impacto macro (petróleo, bolsas, alianças, risco de escalada nuclear).
6. "category": exatamente "{news_item['category']}"

REGRAS:
- Zero especulação. Zero viés. Zero sensacionalismo.
- Apenas fatos verificáveis ou declarações de fontes oficiais públicas.
- Terminologia técnica de defesa e diplomacia.
"""

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "Você é um analista de inteligência sênior reconhecido pela precisão e imparcialidade. Responde apenas em JSON válido."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.3,
    }
    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=35
        )
        data = resp.json()
        if "choices" not in data:
            print(f"  [Groq] Resposta inesperada: {data}")
            return None
        return clean_json_string(data["choices"][0]["message"]["content"])
    except Exception as e:
        print(f"  [Groq] Erro: {e}")
        return None


# ── MAIN ───────────────────────────────────────────────────────────────────────

def main():
    print(f"\n{'='*60}")
    print(f"  🛰️  HORIZON INTEL — Ciclo de Varredura 24h")
    print(f"  🕐  {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"{'='*60}\n")

    # 1. Coletar artigos brutos de todas as fontes
    print("📡 Iniciando mega varredura de fontes...\n")
    raw_all = []
    print("  [1/3] Buscando RSS feeds internacionais...")
    raw_all += fetch_rss_feeds()
    print(f"        → {len([a for a in raw_all if a['source_key']=='rss'])} artigos RSS")

    print("  [2/3] Buscando subreddits OSINT...")
    raw_all += fetch_reddit()
    print(f"        → {len([a for a in raw_all if a['source_key']=='reddit'])} artigos Reddit")

    print("  [3/3] Buscando NewsAPI...")
    raw_all += fetch_newsapi()
    print(f"        → {len([a for a in raw_all if a['source_key']=='newsapi'])} artigos NewsAPI")

    print(f"\n  📊 Total bruto coletado: {len(raw_all)} manchetes")

    # 2. Deduplicar e selecionar os melhores
    unique = deduplicate(raw_all)
    random.shuffle(unique)
    selected = unique[:ARTICLES_PER_CYCLE]
    print(f"  ✅ Selecionados para processamento: {len(selected)}\n")

    # 3. Carregar artigos existentes para acumulação
    existing_articles = []
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                existing_articles = json.load(f)
            print(f"  📂 Artigos existentes carregados: {len(existing_articles)}\n")
        except:
            existing_articles = []

    # 4. Processar cada manchete com a IA
    print(f"{'='*60}")
    print(f"  🤖 Gerando Relatórios de Inteligência (IA Groq)...")
    print(f"{'='*60}\n")

    new_articles = []
    now_utc = datetime.now(timezone.utc)

    for i, raw in enumerate(selected, 1):
        print(f"  [{i:02d}/{len(selected)}] 📄 {raw['title'][:65]}...")
        result_json = rewrite_as_intel_report(raw)
        if not result_json:
            continue
        try:
            article = json.loads(result_json)

            # Garantir todos os campos
            article["id"] = int(now_utc.timestamp()) + i
            article["date"] = now_utc.strftime("%d %b %Y")
            article["published_at"] = now_utc.isoformat()
            article["source_label"] = raw.get("source_label", "📰 NewsAPI")
            article["source_key"] = raw.get("source_key", "rss")
            article["image_url"] = raw.get("image_url", "")
            article["youtube_id"] = ""
            if not isinstance(article.get("bullet_points"), list):
                article["bullet_points"] = []
            if not isinstance(article.get("strategic_analysis"), str):
                article["strategic_analysis"] = ""

            # Opcional: buscar vídeo no YouTube
            if YOUTUBE_API_KEY:
                print(f"          🎬 Buscando vídeo no YouTube...")
                article["youtube_id"] = fetch_youtube_video(article.get("title", raw["title"]))

            new_articles.append(article)
            print(f"          ✅ Relatório gerado: {article.get('title','')[:50]}")
        except Exception as e:
            print(f"          ❌ Erro ao processar: {e}")

    # 5. Combinar novos + existentes (novos primeiro) e limitar ao teto
    combined = new_articles + existing_articles

    # Rededuplicar IDs
    seen_ids = set()
    final_articles = []
    for a in combined:
        aid = a.get("id")
        if aid not in seen_ids:
            seen_ids.add(aid)
            final_articles.append(a)

    final_articles = final_articles[:MAX_ARTICLES]

    # 6. Salvar o JSON final
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(final_articles, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"  🎯 CICLO CONCLUÍDO")
    print(f"  📰 Novos relatórios gerados: {len(new_articles)}")
    print(f"  📂 Total acumulado no JSON: {len(final_articles)}")
    print(f"  💾 Salvo em: {OUTPUT_PATH}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
