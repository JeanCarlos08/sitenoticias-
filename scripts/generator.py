import os
import requests
import json
from datetime import datetime
import random

# Configurações via variáveis de ambiente
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def fetch_latest_news():
    """Busca notícias reais usando NewsAPI com termos específicos de alto engajamento"""
    if not NEWS_API_KEY or NEWS_API_KEY == "SUA_CHAVE_AQUI":
        print("Aviso: NEWS_API_KEY não configurada. Usando mock.")
        return [
            {"title": "Tensões geopolíticas aumentam no Leste Europeu", "category": "Geopolítica"},
            {"title": "Nova IA atinge marco histórico em raciocínio", "category": "I.A."}
        ]

    topics = [
        {"q": "geopolitica OR conflito OR aliança", "cat": "Geopolítica"},
        {"q": "inteligencia artificial OR LLM OR robotica", "cat": "I.A."},
        {"q": "misterio OR conspiração OR fim do mundo OR profecia", "cat": "Mistérios"},
        {"q": "descoberta incrivel OR tecnologia futuro OR dopamina", "cat": "Dopamina"}
    ]
    
    all_news = []
    
    for topic in topics:
        url = f"https://newsapi.org/v2/everything?q={topic['q']}&language=pt&sortBy=publishedAt&pageSize=3&apiKey={NEWS_API_KEY}"
        try:
            response = requests.get(url)
            data = response.json()
            if data.get("status") == "ok":
                for article in data.get("articles", []):
                    all_news.append({
                        "title": article["title"],
                        "category": topic["cat"],
                        "source": article["source"]["name"]
                    })
        except Exception as e:
            print(f"Erro ao buscar notícias para {topic['cat']}: {e}")
            
    return all_news

def generate_article(news_item):
    """Gera um artigo completo e viciante usando Groq (Llama 3)"""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"""
    Como um jornalista investigativo de elite de um portal focado em alto impacto e 'dopamina',
    escreva um post curto e viciante sobre esta notícia: '{news_item['title']}'.
    
    Regras:
    1. Idioma: Português do Brasil.
    2. Tom: Provocativo, intrigante e profissional. Use ganchos que prendam a atenção.
    3. Categoria: Deve ser exatamente uma destas: {news_item['category']}.
    4. Formato: Retorne APENAS um objeto JSON com:
       - title: Um título curto e explosivo.
       - excerpt: Um resumo de 2-3 frases que cause curiosidade extrema.
       - category: A categoria mencionada acima.
    """

    data = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"}
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        return response.json()['choices'][0]['message']['content']
    except Exception as e:
        print(f"Erro ao gerar artigo: {e}")
        return None

def main():
    print(f"[{datetime.now()}] Iniciando geração de conteúdo de alto impacto...")
    
    if not GROQ_API_KEY:
        print("Erro: GROQ_API_KEY não encontrada.")
        return

    news_list = fetch_latest_news()
    articles = []
    
    # Seleciona até 10 notícias aleatórias para manter o portal dinâmico
    random.shuffle(news_list)
    selected_news = news_list[:10]
    
    for news in selected_news:
        print(f"Processando: {news['title'][:50]}...")
        article_json = generate_article(news)
        if article_json:
            try:
                article = json.loads(article_json)
                article['id'] = len(articles) + 1
                article['date'] = datetime.now().strftime("%d %b %Y")
                articles.append(article)
            except Exception as e:
                print(f"Erro ao processar JSON da IA: {e}")
            
    if articles:
        # Salva no arquivo que o React lê
        os.makedirs("../src/data", exist_ok=True)
        with open("../src/data/news.json", "w", encoding="utf-8") as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)
        print(f"Sucesso! {len(articles)} notícias viciantes geradas.")
    else:
        print("Nenhum artigo foi gerado.")

if __name__ == "__main__":
    main()
