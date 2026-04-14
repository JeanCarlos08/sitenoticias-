import json
import os
import random
from datetime import datetime, timedelta

OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "news.json")

CATEGORIES = {
    "Leste Europeu": ["Kharkiv", "Donbas", "Kyiv", "Zaporizhzhia", "Crimeia", "Guerra na Ucrânia", "Fronteiras Polônia"],
    "Oriente Médio": ["Gaza", "Tel Aviv", "Beirute", "Mar Vermelho", "Teerã", "Estreito de Hormuz", "Cisjordânia"],
    "Ásia-Pacífico": ["Taiwan", "Mar do Sul da China", "Seul", "Pyongyang", "Tóquio", "Manila", "Estreito de Malaca"],
    "OTAN": ["Bruxelas", "Artigo 5", "Flanco Leste", "Exercícios Steadfast", "Cúpula de Washington", "Defesa Europeia"],
    "África": ["Sahel", "Níger", "Sudão", "Mali", "Corno da África", "Líbia", "Somália"],
    "Geopolítica": ["ONU", "BRICS", "G7", "Sanções Econômicas", "Segurança Cibernética", "Inteligência Artificial na Defesa"]
}

SOURCES = ["Reuters Intel", "BBC Security", "Al Jazeera Defense", "Defense News", "Stratfor", "OSINT Signal", "Jane's Weekly"]

THREAT_LEVELS = ["🟢 BAIXO", "🟡 MODERADO", "🟠 ELEVADO", "🔴 CRÍTICO"]

FALLBACK_IMAGES = {
    'Conflitos':      'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop',
    'OTAN':           'https://images.unsplash.com/photo-1563200155-276906a2ff5b?q=80&w=1200&auto=format&fit=crop',
    'Oriente Médio':  'https://images.unsplash.com/photo-1601662400326-f7cc93e62f02?q=80&w=1200&auto=format&fit=crop',
    'Leste Europeu':  'https://images.unsplash.com/photo-1551829141-857118ee7a21?q=80&w=1200&auto=format&fit=crop',
    'Geopolítica':    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop',
    'Ásia-Pacífico':  'https://images.unsplash.com/photo-1535083783855-aaab04b2b09b?q=80&w=1200&auto=format&fit=crop',
    'África':         'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=1200&auto=format&fit=crop',
    'default':          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
}

def generate_article(item_id, category):
    topic = random.choice(CATEGORIES[category])
    now = datetime.now() - timedelta(hours=random.randint(0, 168)) # Até uma semana atrás
    
    title = f"Relatório de Inteligência: {topic} — {random.choice(['Análise Tática', 'Escalada de Tensão', 'Movimentação Estratégica', 'Impacto Global', 'Monitoramento Persistente'])}"
    
    excerpt = f"Este relatório detalha as últimas movimentações em {topic}, destacando o impacto na estabilidade regional e as implicações para a segurança internacional."
    
    bullets = [
        f"📍 Localização: Setor crítico em {topic}.",
        f"🚀 Atividade: {random.choice(['Aumento de patrulhas aéreas', 'Reposicionamento de artilharia', 'Novas sanções econômicas', 'Interferência eletrônica detectada'])}.",
        f"🎖️ Forças: {random.choice(['Unidades de elite identificadas', 'Reservas estratégicas ativadas', 'Coordenação multinacional em curso'])}.",
        f"📉 Impacto: Monitoramento de alta precisão indica {random.choice(['volatilidade moderada', 'risco severo de escalada', 'estabilidade sob pressão'])}."
    ]
    
    content = f"A situação em {topic} evoluiu rapidamente nas últimas 48 horas. Fontes de inteligência em campo sugerem que os principais atores estão se preparando para um novo ciclo de negociações ou, alternativamente, para uma demonstração de força significativa.\n\nPesquisadores do HORIZON INTEL observam que a retórica oficial tem se tornado mais agressiva, enquanto as movimentações de tropas e ativos logísticos indicam uma preparação para cenários de longo prazo. A análise técnica dos sinais coletados aponta para uma coordenação centralizada e objetivos ambiciosos.\n\nA resposta da comunidade internacional tem sido mista, com alguns grupos pedindo desescalada imediata e outros reforçando suas alianças defensivas. O cenário atual é de equilíbrio precário, onde qualquer incidente menor pode desencadear uma resposta assimétrica de grandes proporções.\n\nRecomenda-se o monitoramento contínuo dos canais de comunicação oficiais e das fontes OSINT de alta confiabilidade para atualizações em tempo real."

    strategic_analysis = f"Do ponto de vista estratégico, a crise em {topic} reflete a transição para uma ordem mundial multipolar mais fragmentada. A longo prazo, isso pode resultar no redesenho de rotas comerciais vitais e no fortalecimento de blocos regionais isolacionistas. O impacto nos mercados de commodities permanece como o principal indicador de curto prazo para a gravidade da situação."

    return {
        "id": item_id,
        "category": category,
        "title": title,
        "excerpt": excerpt,
        "bullet_points": bullets,
        "content": content,
        "strategic_analysis": strategic_analysis,
        "threat_level": random.choice(THREAT_LEVELS),
        "confidence_score": random.randint(88, 99),
        "date": now.strftime("%d %b %Y"),
        "published_at": now.isoformat(),
        "source_label": f"🌐 {random.choice(SOURCES)}",
        "source_key": "seed",
        "image_url": FALLBACK_IMAGES.get(category, FALLBACK_IMAGES['default']),
        "youtube_id": "" # Vazio por padrão no seed
    }

def main():
    articles = []
    print("Gerando 50 artigos de seed...")
    
    for i in range(1, 51):
        category = random.choice(list(CATEGORIES.keys()))
        articles.append(generate_article(i, category))
    
    # Ordenar por data (mais recentes primeiro)
    articles.sort(key=lambda x: x['published_at'], reverse=True)
    
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
        
    print(f"Sucesso! 50 artigos gerados em {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
