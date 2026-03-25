import os
import requests
import json
from datetime import datetime

# Configurações (Essas seriam via variáveis de ambiente no GitHub Actions)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "SUA_CHAVE_AQUI")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "SUA_CHAVE_AQUI")

def fetch_latest_news():
    """Busca notícias reais usando NewsAPI (ou mock se sem chave)"""
    # Exemplo: https://newsapi.org/v2/top-headlines?country=br&apiKey=...
    # Para teste, vamos usar um mock
    return [
        {"title": "Nova IA da Google supera expectativas", "source": "Tech News"},
        {"title": "Descoberta água em Marte", "source": "Science Daily"}
    ]

def generate_article(topic):
    """Gera um artigo completo usando Groq (Llama 3)"""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    prompt = f"Escreva um artigo de notícias curto e profissional em Português sobre: {topic}. " \
             f"Inclua um título chamativo, um resumo (excerpt) e a categoria. Formate como JSON."

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
    print("Iniciando geração de notícias...")
    news_list = fetch_latest_news()
    articles = []
    
    for news in news_list:
        print(f"Gerando artigo para: {news['title']}...")
        article_json = generate_article(news['title'])
        if article_json:
            article = json.loads(article_json)
            article['date'] = datetime.now().strftime("%d %b %Y")
            articles.append(article)
            
    # Salva no arquivo que o React lê (ex: src/data/news.json)
    os.makedirs("../src/data", exist_ok=True)
    with open("../src/data/news.json", "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    
    print(f"Sucesso! {len(articles)} notícias geradas.")

if __name__ == "__main__":
    main()
