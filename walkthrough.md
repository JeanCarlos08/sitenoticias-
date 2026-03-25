# Walkthrough: AI News Portal

Concluímos a base do seu portal de notícias automatizado! O projeto combina um frontend moderno com um script de automação inteligente.

![Mockup do Site](C:\Users\user\.gemini\antigravity\brain\41b03ccc-10eb-4d3b-aa6a-70fb5c3a8ea7\news_portal_final_preview_1773974948194.png)

## O que foi desenvolvido

### 1. Frontend Premium (Vite + React)
- **Design Glassmorphism:** Interface escura com cartões translúcidos e efeitos de brilho (glow).
- **Responsividade:** O layout se ajusta a diferentes tamanhos de tela.
- **Tipografia Moderna:** Uso das fontes Inter e Outfit para um visual profissional.

### 2. Automação com IA (Python + Groq)
- **Script de Geração:** Localizado em `scripts/generator.py`.
- **Modelo Llama 3:** Utiliza a API do Groq (gratuita e ultra-rápida) para criar artigos originais.
- **Integração de Dados:** As notícias geradas são salvas em `src/data/news.json` e lidas automaticamente pelo site.

---

## Como usar seu novo portal

### Passo 1: Obter as Chaves de API (Gratuitas)
Para o site funcionar no modo "automático", você precisará de duas chaves:
1. **Groq API Key:** [groq.com](https://console.groq.com/keys) (Para a IA escrever os textos).
2. **NewsAPI Key:** [newsapi.org](https://newsapi.org/register) (Para buscar os temas do dia).

### Passo 2: Configurar as Chaves
Edite o arquivo `scripts/generator.py` e insira suas chaves ou use o arquivo `.env.example` para configurar as variáveis de ambiente.

### Passo 3: Rodar o Gerador
No terminal, entre na pasta do projeto e execute:
```powershell
# Instale as dependências de Python se necessário
pip install requests
# Rode o gerador
python scripts/generator.py
```

### Passo 4: Iniciar o Site
```powershell
npm run dev
```

---

## Estratégias de Monetização Recomendadas

1. **Google AdSense:** Assim que tiver ~20-30 artigos gerados, aplique para o AdSense.
2. **Afiliados Amazon/Tech:** O script pode ser modificado para incluir links de produtos relacionados às notícias de tecnologia.
3. **Newsletter Premium:** Use ferramentas como Substack para enviar os melhores resumos por e-mail.

> [!IMPORTANT]
> Lembre-se de revisar os textos gerados pela IA ocasionalmente para garantir que os fatos estão corretos, especialmente se você pretende monetizar com anúncios.

O projeto está pronto para crescer! O que achou do resultado?
