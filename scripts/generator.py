import os
import json
import random
import requests
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import quote

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

WAR_CATEGORIES = ["Conflitos", "OTAN", "Oriente Médio", "Leste Europeu", "Geopolítica"]

# ── WAR QUERIES ────────────────────────────────────────────────────────────────

GOOGLE_RSS_QUERIES = [
    "guerra AND conflito AND 2026",
    "ataque militar geopolítica",
    "OTAN NATO guerra",
    "Oriente Médio conflito armado",
    "Ucrânia Rússia guerra",
    "tensão nuclear geopolítica",
    "Israel Hamas Gaza",
    "China Taiwan conflito",
]

REDDIT_SUBREDDITS = ["worldnews", "geopolitics", "europe", "UkraineRussiaReport"]

NEWSAPI_QUERIES = [
    {"q": "war conflict military attack", "cat": "Conflitos"},
    {"q": "NATO alliance geopolitics", "cat": "OTAN"},
    {"q": "Israel Hamas Middle East strike", "cat": "Oriente Médio"},
    {"q": "Ukraine Russia war frontline", "cat": "Leste Europeu"},
    {"q": "China Taiwan geopolitics tension", "cat": "Geopolítica"},
]

# ── SCRAPERS ───────────────────────────────────────────────────────────────────

def fetch_google_news_rss():
    """Busca artigos via Google News RSS — sem chave, 100% grátis"""
    articles = []
    for query in random.sample(GOOGLE_RSS_QUERIES, 4):
        encoded = quote(query)
        url = f"https://news.google.com/rss/search?q={encoded}&hl=pt-BR&gl=BR&ceid=BR:pt-419"
        try:
            resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
            root = ET.fromstring(resp.content)
            for item in root.findall(".//item")[:3]:
                title = item.findtext("title", "").replace(" - Google News", "")
                if title:
                    articles.append({
                        "title": title,
                        "source_label": "🌐 Google News",
                        "source_key": "google",
                        "category": random.choice(WAR_CATEGORIES)
                    })
        except Exception as e:
            print(f"[Google RSS] Erro: {e}")
    return articles


def fetch_reddit():
    """Busca posts de subreddits de geopolítica — sem chave, 100% grátis"""
    articles = []
    headers = {"User-Agent": "WarNewsBot/1.0"}
    for sub in random.sample(REDDIT_SUBREDDITS, 2):
        url = f"https://www.reddit.com/r/{sub}/hot.json?limit=5"
        try:
            resp = requests.get(url, headers=headers, timeout=10)
            data = resp.json()
            for post in data.get("data", {}).get("children", []):
                d = post.get("data", {})
                title = d.get("title", "")
                if title and not d.get("is_self") == False:
                    articles.append({
                        "title": title,
                        "source_label": f"💬 Reddit r/{sub}",
                        "source_key": "reddit",
                        "category": "Conflitos" if "ukrain" in title.lower() or "russia" in title.lower()
                                      else "Oriente Médio" if "israel" in title.lower() or "gaza" in title.lower()
                                      else "Geopolítica"
                    })
        except Exception as e:
            print(f"[Reddit] Erro em r/{sub}: {e}")
    return articles


def fetch_newsapi():
    """Busca via NewsAPI com queries de guerra"""
    if not NEWS_API_KEY:
        print("[NewsAPI] Chave não encontrada.")
        return []
    articles = []
    for item in NEWSAPI_QUERIES:
        url = (
            f"https://newsapi.org/v2/everything"
            f"?q={quote(item['q'])}&sortBy=publishedAt&pageSize=3&apiKey={NEWS_API_KEY}"
        )
        try:
            resp = requests.get(url, timeout=10)
            data = resp.json()
            if data.get("status") == "ok":
                for art in data.get("articles", []):
                    title = art.get("title", "")
                    if title and "[Removed]" not in title:
                        articles.append({
                            "title": title,
                            "source_label": f"📰 {art['source']['name']}",
                            "source_key": "newsapi",
                            "category": item["cat"]
                        })
        except Exception as e:
            print(f"[NewsAPI] Erro: {e}")
    return articles

# ── AI REWRITE ─────────────────────────────────────────────────────────────────

def rewrite_as_war_correspondent(news_item):
    """Usa Groq para reescrever a notícia como um correspondente de guerra, em PT-BR"""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}

    prompt = f"""Você é um correspondente de guerra premiado, cobrindo conflitos globais para um portal de geopolítica de elite.

Reescreva esta manchete em Português do Brasil como um artigo jornalístico impactante:
Título original: {news_item['title']}
Categoria: {news_item['category']}

Retorne APENAS um JSON com:
- "title": Um título em PT-BR, curto, explosivo e informativo.
- "excerpt": 2-3 frases que apresentem o conflito, mostrem urgência e prendam o leitor.
- "content": Artigo completo de 4 parágrafos — contexto histórico, situação atual, implicações geopolíticas e o que esperar a seguir.
- "category": exatamente "{news_item['category']}"
"""

    data = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "Você é um jornalista especializado em coberturas de guerra."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"}
    }

    try:
        resp = requests.post(url, headers=headers, json=data, timeout=30)
        return resp.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[Groq] Erro: {e}")
        return None

# ── MAIN ───────────────────────────────────────────────────────────────────────

def main():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🚨 Iniciando coleta de notícias de guerra...")

    if not GROQ_API_KEY:
        print("❌ GROQ_API_KEY não encontrada. Configure nos Secrets do GitHub.")
        return

    # Coleta de todas as fontes
    all_raw = []
    all_raw += fetch_google_news_rss()
    all_raw += fetch_reddit()
    all_raw += fetch_newsapi()

    print(f"📥 {len(all_raw)} manchetes coletadas. Iniciando reescrita com IA...")

    random.shuffle(all_raw)
    selected = all_raw[:12]

    articles = []
    for i, raw in enumerate(selected, 1):
        print(f"  [{i}/{len(selected)}] Reescrevendo: {raw['title'][:60]}...")
        result_json = rewrite_as_war_correspondent(raw)
        if result_json:
            try:
                article = json.loads(result_json)
                article["id"] = i
                article["date"] = datetime.now().strftime("%d %b %Y")
                article["source_label"] = raw.get("source_label", "📰 NewsAPI")
                article["source_key"] = raw.get("source_key", "newsapi")
                articles.append(article)
            except Exception as e:
                print(f"  ⚠️ JSON inválido: {e}")

    if articles:
        output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "news.json")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        print(f"\n✅ {len(articles)} artigos de guerra salvos com sucesso!")
    else:
        print("⚠️ Nenhum artigo foi gerado. Verifique as chaves de API.")

if __name__ == "__main__":
    main()
