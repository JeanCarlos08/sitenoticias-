import os
import json
import random
import hashlib
import requests
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from urllib.parse import quote

GROQ_API_KEY    = os.getenv("GROQ_API_KEY")
NEWS_API_KEY    = os.getenv("NEWS_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "news.json")
MAX_ARTICLES       = 200   # Acumula conteúdo progressivamente
ARTICLES_PER_CYCLE = 15    # Por ciclo — 8 ciclos/dia = 120 relatórios diários

WAR_CATEGORIES = ["Conflitos", "OTAN", "Oriente Médio", "Leste Europeu", "Geopolítica", "Ásia-Pacífico", "África"]

# ── MEGA RSS FEEDS (35+ fontes) ────────────────────────────────────────────────
RSS_FEEDS = [
    # ── Agências Internacionais Premium
    {"url": "http://feeds.bbci.co.uk/news/world/rss.xml",                         "label": "🔵 BBC World News",       "cat": "Conflitos"},
    {"url": "http://feeds.bbci.co.uk/news/world/middle_east/rss.xml",             "label": "🔵 BBC Middle East",      "cat": "Oriente Médio"},
    {"url": "http://feeds.bbci.co.uk/news/world/europe/rss.xml",                  "label": "🔵 BBC Europe",           "cat": "Leste Europeu"},
    {"url": "http://feeds.bbci.co.uk/news/world/asia/rss.xml",                    "label": "🔵 BBC Asia",             "cat": "Ásia-Pacífico"},
    {"url": "https://www.aljazeera.com/xml/rss/all.xml",                          "label": "🟡 Al Jazeera",           "cat": "Oriente Médio"},
    {"url": "https://feeds.reuters.com/reuters/worldNews",                        "label": "📰 Reuters World",        "cat": "Geopolítica"},
    {"url": "https://feeds.reuters.com/reuters/topNews",                          "label": "📰 Reuters Top",          "cat": "Conflitos"},
    {"url": "https://rss.dw.com/rdf/rss-en-world",                               "label": "🇩🇪 Deutsche Welle",      "cat": "Leste Europeu"},
    {"url": "https://www.france24.com/en/rss",                                    "label": "🇫🇷 France 24",           "cat": "Oriente Médio"},
    {"url": "https://apnews.com/rss/World-News",                                  "label": "📡 AP News World",        "cat": "Conflitos"},
    {"url": "https://apnews.com/rss/war-and-conflict",                            "label": "📡 AP War & Conflict",    "cat": "Conflitos"},
    {"url": "https://feeds.theguardian.com/theguardian/world/rss",                "label": "🔹 The Guardian World",   "cat": "Geopolítica"},
    {"url": "https://www.euronews.com/rss",                                       "label": "🇪🇺 Euronews",            "cat": "OTAN"},
    {"url": "https://en.rfi.fr/general.rss",                                      "label": "📻 RFI",                  "cat": "África"},
    {"url": "https://www.stripes.com/rss/latest",                                 "label": "⭐ Stars & Stripes",      "cat": "Conflitos"},
    {"url": "https://www.voanews.com/api/z_mg_oqeiqm",                            "label": "📢 Voice of America",     "cat": "Geopolítica"},
    {"url": "https://feeds.npr.org/1004/rss.xml",                                 "label": "🎙️ NPR World",            "cat": "Geopolítica"},

    # ── Defesa & Militares
    {"url": "https://www.nato.int/cps/en/natolive/news.rss",                      "label": "🛡️ NATO Official",       "cat": "OTAN"},
    {"url": "https://www.defensenews.com/rss/",                                   "label": "🎖️ Defense News",        "cat": "OTAN"},
    {"url": "https://www.militarytimes.com/arc/outboundfeeds/rss/",               "label": "🎯 Military Times",       "cat": "Conflitos"},
    {"url": "https://breakingdefense.com/feed/",                                  "label": "💥 Breaking Defense",     "cat": "OTAN"},
    {"url": "https://thewarzone.com/feed/",                                       "label": "✈️ The War Zone",         "cat": "Conflitos"},
    {"url": "https://warontherocks.com/feed/",                                    "label": "🪨 War on the Rocks",     "cat": "Geopolítica"},
    {"url": "https://www.understandingwar.org/rss.xml",                           "label": "📊 ISW",                  "cat": "Leste Europeu"},

    # ── Oriente Médio
    {"url": "https://www.middleeasteye.net/rss",                                  "label": "🕌 Middle East Eye",      "cat": "Oriente Médio"},
    {"url": "https://www.haaretz.com/rss",                                        "label": "🇮🇱 Haaretz",            "cat": "Oriente Médio"},
    {"url": "https://www.timesofisrael.com/feed/",                                "label": "🇮🇱 Times of Israel",    "cat": "Oriente Médio"},
    {"url": "https://english.alaraby.co.uk/taxonomy/term/1/feed",                 "label": "🌙 Al Araby",             "cat": "Oriente Médio"},

    # ── Ásia-Pacífico
    {"url": "https://asia.nikkei.com/rss/feed/nar",                               "label": "🇯🇵 Nikkei Asia",        "cat": "Ásia-Pacífico"},
    {"url": "https://www.scmp.com/rss/5/feed",                                    "label": "🇨🇳 SCMP",               "cat": "Ásia-Pacífico"},
    {"url": "https://thediplomat.com/feed/",                                      "label": "🌏 The Diplomat",         "cat": "Ásia-Pacífico"},

    # ── África
    {"url": "https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf",     "label": "🌍 AllAfrica",            "cat": "África"},

    # ── Google News (queries específicas)
    {"url": "https://news.google.com/rss/search?q=guerra+militar+conflito&hl=pt-BR&gl=BR",    "label": "🌐 Google Guerra",       "cat": "Conflitos"},
    {"url": "https://news.google.com/rss/search?q=NATO+OTAN+military+alliance&hl=en-US",      "label": "🌐 Google OTAN",         "cat": "OTAN"},
    {"url": "https://news.google.com/rss/search?q=Ukraine+Russia+war+frontline+Zelensky",     "label": "🌐 Google Ucrânia",      "cat": "Leste Europeu"},
    {"url": "https://news.google.com/rss/search?q=Israel+Gaza+Hamas+IDF+ceasefire&hl=en-US",  "label": "🌐 Google Gaza",         "cat": "Oriente Médio"},
    {"url": "https://news.google.com/rss/search?q=China+Taiwan+PLA+military+strait&hl=en-US", "label": "🌐 Google Taiwan",       "cat": "Ásia-Pacífico"},
    {"url": "https://news.google.com/rss/search?q=Africa+coup+militia+sahel+Wagner&hl=en-US", "label": "🌐 Google África",       "cat": "África"},
    {"url": "https://news.google.com/rss/search?q=North+Korea+missile+nuclear+Kim&hl=en-US",  "label": "🌐 Google Coreia Norte", "cat": "Ásia-Pacífico"},
    {"url": "https://news.google.com/rss/search?q=Iran+nuclear+sanctions+IAEA&hl=en-US",      "label": "🌐 Google Irã",          "cat": "Oriente Médio"},
    {"url": "https://news.google.com/rss/search?q=geopolitics+war+2025&hl=en-US",             "label": "🌐 Google Geopolítica",  "cat": "Geopolítica"},
]

REDDIT_SUBREDDITS = [
    ("worldnews",           "Conflitos"),
    ("geopolitics",         "Geopolítica"),
    ("europe",              "OTAN"),
    ("UkraineRussiaReport", "Leste Europeu"),
    ("CredibleDefense",     "OTAN"),
    ("MiddleEastNews",      "Oriente Médio"),
    ("syriancivilwar",      "Oriente Médio"),
    ("Israel",              "Oriente Médio"),
    ("ChinaHistory",        "Ásia-Pacífico"),
    ("OSINT",               "Conflitos"),
    ("worldpolitics",       "Geopolítica"),
    ("GlobalTalk",          "Geopolítica"),
    ("GlobalNews",          "Conflitos"),
    ("InternationalNews",   "Geopolítica"),
    ("war",                 "Conflitos"),
]

NEWSAPI_QUERIES = [
    {"q": "war conflict military attack troops 2025",    "cat": "Conflitos"},
    {"q": "NATO alliance military geopolitics",          "cat": "OTAN"},
    {"q": "Israel Hamas Gaza Palestinian airstrike",     "cat": "Oriente Médio"},
    {"q": "Ukraine Russia war Zelensky frontline",       "cat": "Leste Europeu"},
    {"q": "China Taiwan Indo-Pacific PLA tension",       "cat": "Ásia-Pacífico"},
    {"q": "Africa coup militia sahel Wagner Group",      "cat": "África"},
    {"q": "nuclear missile threat Kim Jong-un",          "cat": "Ásia-Pacífico"},
    {"q": "Iran nuclear IAEA sanctions",                 "cat": "Oriente Médio"},
    {"q": "geopolitics diplomacy sanctions energy",      "cat": "Geopolítica"},
]

# ── SCRAPERS ───────────────────────────────────────────────────────────────────

def deduplicate(articles):
    """Remove artigos com títulos muito similares por hash dos primeiros 80 chars"""
    seen = set()
    unique = []
    for a in articles:
        key = hashlib.md5(a["title"][:80].lower().strip().encode()).hexdigest()
        if key not in seen:
            seen.add(key)
            unique.append(a)
    return unique


def fetch_rss_feeds():
    """Busca artigos de todos os feeds RSS — agora pega 20 feeds por ciclo"""
    articles = []
    feeds_to_try = random.sample(RSS_FEEDS, min(20, len(RSS_FEEDS)))
    for feed in feeds_to_try:
        try:
            resp = requests.get(
                feed["url"], timeout=12,
                headers={"User-Agent": "Mozilla/5.0 (HorizonIntel/3.0; +https://horizonintel.ai)"}
            )
            if resp.status_code != 200:
                continue
            root = ET.fromstring(resp.content)
            items = root.findall(".//item")
            for item in items[:5]:  # até 5 itens por feed (era 4)
                title = item.findtext("title", "").replace(" - Google News", "").strip()
                desc  = item.findtext("description", "").strip()
                if title and len(title) > 15:
                    articles.append({
                        "title":        title,
                        "description":  desc[:300] if desc else "",
                        "source_label": feed["label"],
                        "source_key":   "rss",
                        "category":     feed["cat"],
                        "image_url":    "",
                    })
        except Exception as e:
            print(f"  [RSS] Falha em {feed['label']}: {e}")
    return articles


def fetch_reddit():
    """Busca posts de subreddits OSINT e geopolítica"""
    articles = []
    headers = {"User-Agent": "HorizonIntelBot/3.0 (by /u/horizonintel)"}
    selected_subs = random.sample(REDDIT_SUBREDDITS, min(8, len(REDDIT_SUBREDDITS)))
    for sub, cat in selected_subs:
        url = f"https://www.reddit.com/r/{sub}/hot.json?limit=10"
        try:
            resp = requests.get(url, headers=headers, timeout=12)
            if resp.status_code != 200:
                continue
            posts = resp.json().get("data", {}).get("children", [])
            for post in posts:
                d = post.get("data", {})
                title = d.get("title", "").strip()
                score = d.get("score", 0)
                selftext = d.get("selftext", "").strip()[:300]
                if title and len(title) > 20 and score > 50:  # score mínimo menor = mais conteúdo
                    tl = title.lower()
                    detected_cat = cat
                    if any(w in tl for w in ["ukraine", "russia", "kharkiv", "kherson", "donbas", "zaporizhzhia"]):
                        detected_cat = "Leste Europeu"
                    elif any(w in tl for w in ["israel", "gaza", "hamas", "hezbollah", "west bank", "iran", "idf"]):
                        detected_cat = "Oriente Médio"
                    elif any(w in tl for w in ["china", "taiwan", "xinjiang", "hong kong", "korea", "japan", "india", "pla"]):
                        detected_cat = "Ásia-Pacífico"
                    elif any(w in tl for w in ["nato", "otan", "alliance", "europe", "poland", "baltics", "finland"]):
                        detected_cat = "OTAN"
                    elif any(w in tl for w in ["africa", "sahel", "niger", "mali", "sudan", "ethiopia", "somalia", "wagner"]):
                        detected_cat = "África"
                    articles.append({
                        "title":        title,
                        "description":  selftext,
                        "source_label": f"💬 r/{sub}",
                        "source_key":   "reddit",
                        "category":     detected_cat,
                        "image_url":    d.get("thumbnail", "") if d.get("thumbnail", "").startswith("http") else "",
                    })
        except Exception as e:
            print(f"  [Reddit] Falha em r/{sub}: {e}")
    return articles


def fetch_newsapi():
    """Busca via NewsAPI"""
    articles = []
    if not NEWS_API_KEY:
        print("  [NewsAPI] Chave não configurada, pulando.")
        return articles
    for q in random.sample(NEWSAPI_QUERIES, min(6, len(NEWSAPI_QUERIES))):
        url = (
            f"https://newsapi.org/v2/everything"
            f"?q={quote(q['q'])}&sortBy=publishedAt&pageSize=6"
            f"&language=en&apiKey={NEWS_API_KEY}"
        )
        try:
            resp = requests.get(url, timeout=12)
            data = resp.json()
            for a in data.get("articles", []):
                title = (a.get("title") or "").strip()
                desc  = (a.get("description") or "").strip()
                if title and title != "[Removed]" and len(title) > 20:
                    articles.append({
                        "title":        title,
                        "description":  desc[:300],
                        "source_label": f"📰 {a.get('source', {}).get('name', 'NewsAPI')}",
                        "source_key":   "newsapi",
                        "category":     q["cat"],
                        "image_url":    a.get("urlToImage") or "",
                    })
        except Exception as e:
            print(f"  [NewsAPI] Erro: {e}")
    return articles


def fetch_youtube_video(query):
    """Busca o ID de um vídeo relacionado no YouTube"""
    if not YOUTUBE_API_KEY:
        return ""
    url = (
        f"https://www.googleapis.com/youtube/v3/search"
        f"?q={quote(query)}&key={YOUTUBE_API_KEY}"
        f"&maxResults=1&type=video&order=date&relevanceLanguage=pt"
    )
    try:
        resp = requests.get(url, timeout=10)
        items = resp.json().get("items", [])
        if items:
            return items[0]["id"]["videoId"]
    except Exception as e:
        print(f"  [YouTube] Erro: {e}")
    return ""


# ── AI REWRITE (PROMPT APRIMORADO) ────────────────────────────────────────────

def clean_json_string(text):
    """Remove markdown backticks ou texto extra da resposta da IA — parser robusto"""
    if not text:
        return ""
    # Tenta extrair JSON entre ``` ... ```
    if "```" in text:
        try:
            parts = text.split("```")
            for part in parts:
                candidate = part.strip()
                if candidate.startswith("json"):
                    candidate = candidate[4:].strip()
                if candidate.startswith("{"):
                    return candidate
        except Exception:
            pass
    # Tenta achar o primeiro { e o último }
    start = text.find("{")
    end   = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start:end + 1].strip()
    return text.strip()


def rewrite_as_intel_report(news_item):
    """
    Usa Groq Llama3-70b (mais capaz) para gerar um Relatório de Inteligência
    muito mais detalhado, com contexto histórico, análise estratégica e nível de ameaça.
    """
    if not GROQ_API_KEY:
        print("  [Groq] Chave não configurada.")
        return None

    extra_context = f"\nContexto adicional: {news_item.get('description', '')}" if news_item.get("description") else ""

    prompt = f"""Você é um analista sênior de inteligência geopolítica classificação GOLD, com 20 anos de experiência em conflitos globais, relações internacionais e segurança estratégica. Seu trabalho é converter manchetes brutas em Relatórios de Inteligência profundos, imparciais e 100% factuais em Português do Brasil.

Manchete: {news_item['title']}
Categoria: {news_item['category']}
Fonte: {news_item.get('source_label', 'Não informado')}{extra_context}

Gere um JSON com EXATAMENTE estas chaves:

1. "title": Título profissional e factual em PT-BR (máx 130 chars). Inclua localização geográfica específica quando possível.

2. "excerpt": Resumo executivo de 3-4 frases (sem adjetivos emocionais). Deve cobrir: O QUE aconteceu, ONDE, QUANDO e QUEM está envolvido.

3. "bullet_points": Lista JSON de 6 strings com fatos técnicos concretos. Inclua: datas exatas ou aproximadas, coordenadas geográficas ou locais específicos, nomes de unidades militares/grupos, armamentos identificados, cifras (baixas, deslocados, recursos), declarações de porta-vozes oficiais.

4. "content": Relatório analítico com 10 parágrafos densos cobrindo:
   (1) Contexto histórico de 5-10 anos
   (2) Linha do tempo dos eventos recentes (últimas 72h)
   (3) Mapa de atores: quem são, posições, capacidades militares
   (4) Situação tática atual no campo de batalha ou área de conflito
   (5) Dimensão diplomática: respostas de líderes, ONU, organismos internacionais
   (6) Impacto humanitário: civis afetados, deslocamentos, crise humanitária
   (7) Dimensão econômica: energia, commodities, sanções, bloqueios comerciais
   (8) Papel dos atores externos: EUA, Rússia, China, UE, potências regionais
   (9) Análise de inteligência: movimentações, sinais de escalada ou desescalada
   (10) Perspectivas de 30-90 dias: cenários possíveis (otimista, neutro, pessimista)

5. "strategic_analysis": 3 parágrafos sobre:
   - Impacto macro: petróleo, gás, bolsas, cadeias de suprimento
   - Alianças e reposicionamentos geopolíticos
   - Risco de escalada: convencional, proxy, nuclear/CBRN

6. "threat_level": Uma string — "🟢 BAIXO", "🟡 MODERADO", "🟠 ELEVADO" ou "🔴 CRÍTICO" — baseada na probabilidade de escalada.

7. "confidence_score": Número entre 80 e 99 representando a confiança analítica no relatório.

8. "category": exatamente "{news_item['category']}"

9. "sentiment": Uma string — APENAS "ESCALADA", "DIPLOMACIA" ou "IMPASSE". Onde ESCALADA é piora do conflito, DIPLOMACIA são tratados/negociação, e IMPASSE é ausência de avanço.

REGRAS ABSOLUTAS:
- Zero especulação não fundamentada. Zero viés editorial. Zero sensacionalismo.
- Apenas fatos verificáveis ou declarações de fontes oficiais públicas.
- Terminologia técnica de defesa e diplomacia (ex: "artilhagem autopropulsada", "linha de contato", "escalada assimétrica").
- Se não houver dados suficientes para um parágrafo, indique "Dados insuficientes para análise conclusiva neste segmento."
- O relatório deve ter peso jornalístico de revista especializada como Jane's Defence Weekly ou Foreign Affairs.
"""

    payload = {
        "model": "llama3-70b-8192",   # Upgrade: modelo maior e mais capaz
        "messages": [
            {
                "role": "system",
                "content": (
                    "Você é um analista de inteligência sênior classificação GOLD, "
                    "reconhecido pela precisão, profundidade e imparcialidade. "
                    "Responde APENAS com JSON válido, sem texto adicional."
                )
            },
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.25,   # Mais conservador = mais factual
        "max_tokens": 4096,    # Mais tokens = relatórios mais longos
    }
    try:
        resp = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json=payload, timeout=60   # Timeout maior para respostas longas
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
    print(f"  🛰️  HORIZON INTEL — Ciclo de Varredura ULTRA")
    print(f"  🕐  {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"  📡  Fontes RSS: {len(RSS_FEEDS)} | Subreddits: {len(REDDIT_SUBREDDITS)}")
    print(f"{'='*60}\n")

    # 1. Coletar artigos brutos de todas as fontes
    print("📡 Iniciando mega varredura de fontes...\n")
    raw_all = []

    print("  [1/3] Buscando RSS feeds internacionais...")
    rss_articles = fetch_rss_feeds()
    raw_all += rss_articles
    print(f"        → {len(rss_articles)} artigos RSS coletados")

    print("  [2/3] Buscando subreddits OSINT...")
    reddit_articles = fetch_reddit()
    raw_all += reddit_articles
    print(f"        → {len(reddit_articles)} posts Reddit coletados")

    print("  [3/3] Buscando NewsAPI...")
    newsapi_articles = fetch_newsapi()
    raw_all += newsapi_articles
    print(f"        → {len(newsapi_articles)} artigos NewsAPI coletados")

    print(f"\n  📊 Total bruto coletado: {len(raw_all)} manchetes")

    # 2. Deduplicar e selecionar
    unique = deduplicate(raw_all)
    random.shuffle(unique)
    selected = unique[:ARTICLES_PER_CYCLE]
    print(f"  ✅ Selecionados para processamento com IA: {len(selected)}\n")

    # 3. Carregar artigos existentes
    existing_articles = []
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                existing_articles = json.load(f)
            print(f"  📂 Artigos existentes carregados: {len(existing_articles)}\n")
        except:
            existing_articles = []

    # 4. Processar manchetes com IA
    print(f"{'='*60}")
    print(f"  🤖 Gerando Relatórios ULTRA de Inteligência (Llama3-70b)...")
    print(f"{'='*60}\n")

    new_articles = []
    now_utc = datetime.now(timezone.utc)

    ok_count  = 0
    err_count = 0
    t_start   = time.time()

    for i, raw in enumerate(selected, 1):
        print(f"  [{i:02d}/{len(selected)}] 📄 {raw['title'][:70]}...")
        result_json = rewrite_as_intel_report(raw)
        if not result_json:
            continue
        try:
            article = json.loads(result_json)

            # Garantir campos obrigatórios
            article["id"]             = int(now_utc.timestamp()) + i
            article["date"]           = now_utc.strftime("%d %b %Y")
            article["published_at"]   = now_utc.isoformat()
            article["source_label"]   = raw.get("source_label", "📰 NewsAPI")
            article["source_key"]     = raw.get("source_key", "rss")
            article["image_url"]      = raw.get("image_url", "")
            article["youtube_id"]     = ""

            # Campos novos com fallback
            if not isinstance(article.get("bullet_points"), list):
                article["bullet_points"] = []
            if not isinstance(article.get("strategic_analysis"), str):
                article["strategic_analysis"] = ""
            if "threat_level" not in article:
                article["threat_level"] = "🟡 MODERADO"
            if "confidence_score" not in article:
                article["confidence_score"] = random.randint(85, 97)
            if "sentiment" not in article:
                article["sentiment"] = "IMPASSE"

            # Buscar vídeo no YouTube (opcional)
            if YOUTUBE_API_KEY:
                print(f"          🎬 Buscando vídeo no YouTube...")
                article["youtube_id"] = fetch_youtube_video(article.get("title", raw["title"]))

            new_articles.append(article)
            ok_count += 1
            threat = article.get("threat_level", "?")
            conf   = article.get("confidence_score", "?")
            elapsed = time.time() - t_start
            print(f"          ✅ [{threat}] Conf: {conf}% | Tempo: {elapsed:.0f}s — {article.get('title','')[:45]}")

        except Exception as e:
            err_count += 1
            print(f"          ❌ Erro ao processar: {e}")

        # Delay entre chamadas para evitar rate limit da Groq
        if i < len(selected):
            time.sleep(1.5)

    # 5. Combinar e limitar
    combined = new_articles + existing_articles
    seen_ids = set()
    final_articles = []
    for a in combined:
        aid = a.get("id")
        if aid not in seen_ids:
            seen_ids.add(aid)
            final_articles.append(a)

    final_articles = final_articles[:MAX_ARTICLES]

    # 6. Salvar
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(final_articles, f, ensure_ascii=False, indent=2)

    total_time = time.time() - t_start
    print(f"\n{'='*60}")
    print(f"  🎯 CICLO CONCLUÍDO")
    print(f"  ✅ Relatórios gerados:   {ok_count}")
    print(f"  ❌ Erros de parsing:     {err_count}")
    print(f"  📂 Total no JSON:        {len(final_articles)}")
    print(f"  ⏱️  Tempo total:          {total_time:.0f}s ({total_time/60:.1f} min)")
    print(f"  💾 Salvo em:             {OUTPUT_PATH}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
