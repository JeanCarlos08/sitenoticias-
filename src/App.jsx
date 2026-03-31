import React, { useState } from 'react'
import './index.css'
import newsData from './data/news.json'

const CAT_ICON = {
  'Conflitos':     '💥',
  'OTAN':          '🛡️',
  'Oriente Médio': '🕌',
  'Leste Europeu': '🌍',
  'Geopolítica':   '🗺️',
  default:         '📡'
}

const TICKER_TOPICS = [
  '🚨 GUERRA • Tensões aumentam no Leste Europeu',
  '⚠️ ALERTA • Novos ataques registrados no Oriente Médio',
  '🛡️ OTAN • Aliança reforça posicionamento nas fronteiras',
  '📡 CORRESPONDENTE • Cobertura ao vivo dos conflitos globais',
  '🗺️ GEOPOLÍTICA • Mudanças no equilíbrio de poder mundial',
]

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [article, setArticle] = useState(null)

  const data = Array.isArray(newsData) ? newsData : []
  const cats = ['Todas', ...new Set(data.map(i => i?.category).filter(Boolean))]

  const filtered = data.filter(item => {
    const q = search.toLowerCase()
    return (
      (!q || item.title?.toLowerCase().includes(q) || item.excerpt?.toLowerCase().includes(q)) &&
      (category === 'Todas' || item.category === category)
    )
  })

  const featured = filtered[0]
  const rest     = search ? filtered : filtered.slice(1)

  return (
    <div className="app-container">

      {/* ── Breaking news ticker ── */}
      <div className="ticker">
        <span className="ticker-inner">
          {[...TICKER_TOPICS, ...TICKER_TOPICS].map((t, i) => (
            <span key={i} style={{ marginRight: '80px' }}>🔴 {t}</span>
          ))}
        </span>
      </div>

      {/* ── Header ── */}
      <header className="header">
        <div className="container header-inner">
          <div>
            <div className="brand">⚔️ WARZONE NEWS</div>
            <span className="brand-sub">Portal de Geopolítica &amp; Conflitos Globais</span>
          </div>
          <div className="live-dot">AO VIVO</div>
          <nav>
            <ul className="nav-list">
              {['Home', 'Conflitos', 'OTAN', 'Oriente Médio', 'Leste Europeu'].map(item => (
                <li
                  key={item}
                  className="nav-item"
                  onClick={() => setCategory(item === 'Home' ? 'Todas' : item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">🚨 COBERTURA EM TEMPO REAL</div>
          <h1 className="hero-title">
            Guerras &amp; Conflitos<br />
            <span className="accent">Geopolítica Global</span>
          </h1>
          <p className="hero-sub">
            As últimas notícias dos conflitos ao redor do mundo, coletadas de
            múltiplas fontes e reescritas por correspondentes de IA em tempo real.
          </p>
          <div className="hero-stats">
            <div><div className="stat-val">{data.length}</div><div className="stat-lbl">Reportagens</div></div>
            <div><div className="stat-val">3+</div><div className="stat-lbl">Fontes</div></div>
            <div><div className="stat-val">24h</div><div className="stat-lbl">Atualização</div></div>
            <div><div className="stat-val">100%</div><div className="stat-lbl">Automatizado</div></div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <main className="container">

        {/* ── Featured ── */}
        {featured && !search && (
          <>
            <div className="section-label">🔥 ÚLTIMA HORA</div>
            <div className="featured-card" onClick={() => setArticle(featured)}>
              <div className="featured-inner">
                <div>
                  <div className="featured-badge">{featured.category}</div>
                  <h2 className="featured-title">{featured.title}</h2>
                  <p className="featured-excerpt">{featured.excerpt}</p>
                  {featured.source_label && (
                    <p className="featured-source">Fonte: {featured.source_label}</p>
                  )}
                  <button className="btn-war">Ler reportagem completa →</button>
                </div>
                <div className="featured-icon" aria-hidden>
                  {CAT_ICON[featured.category] || CAT_ICON.default}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Filters ── */}
        <div className="filters-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍  Buscar conflitos, países, operações..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="cat-buttons">
            {cats.map(c => (
              <button
                key={c}
                className={`cat-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="section-label">
          {category === 'Todas' ? '📡 TODAS AS REPORTAGENS' : `${CAT_ICON[category] || '📡'} ${category.toUpperCase()}`}
        </div>
        <div className="news-grid">
          {rest.length > 0 ? rest.map(item => (
            <article key={item.id} className="news-card" onClick={() => setArticle(item)}>
              <span className="card-category">{CAT_ICON[item.category]} {item.category}</span>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-excerpt">{item.excerpt}</p>
              <div className="card-footer">
                <div>
                  {item.source_label && <div className="card-source">{item.source_label}</div>}
                  <div className="card-date">{item.date}</div>
                </div>
                <button className="card-btn">Ler →</button>
              </div>
            </article>
          )) : (
            <div className="empty-state">
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p>Nenhuma reportagem encontrada.</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Modal ── */}
      {article && (
        <div className="modal-backdrop" onClick={() => setArticle(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setArticle(null)}>×</button>
            <div className="modal-category">
              {CAT_ICON[article.category]} {article.category}
            </div>
            <h2 className="modal-title">{article.title}</h2>
            <div className="modal-meta">
              <span>📅 {article.date}</span>
              {article.source_label && <span>{article.source_label}</span>}
            </div>
            <div className="modal-divider" />
            <div className="modal-body">
              {article.content
                ? article.content.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                : <p>{article.excerpt}</p>}
            </div>
            <div className="modal-footer">
              <span>© Warzone News — Powered by AI</span>
              <button className="cat-btn active" onClick={() => setArticle(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-logo">⚔️ WARZONE NEWS</div>
          <p className="footer-sub">
            Cobertura de conflitos globais em tempo real — gerada e curada por Inteligência Artificial.<br />
            Fontes: Google News • Reddit • NewsAPI
          </p>
        </div>
      </footer>

    </div>
  )
}

export default App
