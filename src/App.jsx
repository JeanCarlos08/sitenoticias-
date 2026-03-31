import React, { useState, useRef } from 'react'
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

const FALLBACK_IMAGES = {
  'Conflitos':     'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop',
  'OTAN':          'https://images.unsplash.com/photo-1563200155-276906a2ff5b?q=80&w=1200&auto=format&fit=crop',
  'Oriente Médio': 'https://images.unsplash.com/photo-1601662400326-f7cc93e62f02?q=80&w=1200&auto=format&fit=crop',
  'Leste Europeu': 'https://images.unsplash.com/photo-1551829141-857118ee7a21?q=80&w=1200&auto=format&fit=crop',
  'Geopolítica':   'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop',
  default:         'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop'
}

const getImageUrl = (item) => item.image_url && item.image_url !== "" ? item.image_url : (FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.default);


const TICKER_TOPICS = [
  '🚨 GUERRA • Tensões aumentam no Leste Europeu',
  '⚠️ ALERTA • Novos ataques registrados no Oriente Médio',
  '🛡️ OTAN • Aliança reforça posicionamento nas fronteiras',
  '📡 CORRESPONDENTE • Cobertura ao vivo dos conflitos globais',
  '🗺️ GEOPOLÍTICA • Mudanças no equilíbrio de poder mundial',
]

const AdSlot = () => <div className="ad-slot" aria-hidden="true" />

const Newsletter = () => (
  <section className="newsletter-section">
    <div className="hero-eyebrow">📬 INTELIGÊNCIA DIÁRIA</div>
    <h2 className="news-title">Relatório Warzone</h2>
    <p className="news-sub">
      Receba análises profundas e boletins de emergência direto no seu e-mail. 
      Junte-se a 50.000+ assinantes globais.
    </p>
    <form className="news-form" onSubmit={e => e.preventDefault()}>
      <input type="email" placeholder="Seu melhor e-mail..." className="news-input" required />
      <button type="submit" className="btn-war">INSCREVER-SE</button>
    </form>
  </section>
)

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [article, setArticle] = useState(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="live-dot">AO VIVO</div>
            <button className={`audio-btn ${isPlaying ? 'playing' : ''}`} onClick={toggleAudio}>
              {isPlaying ? '🔊 AUDIO ON' : '🔈 AUDIO OFF'}
            </button>
            <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" />
          </div>
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
                  <img src={getImageUrl(featured)} alt={featured.title} className="featured-img" />
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
          {rest.length > 0 ? rest.map((item, index) => (
            <React.Fragment key={item.id}>
              {index > 0 && index % 4 === 0 && <AdSlot />}
              <article className="news-card" onClick={() => setArticle(item)}>
                <span className="card-category">{CAT_ICON[item.category]} {item.category}</span>
                <img src={getImageUrl(item)} alt={item.title} className="card-img" />
                <h3 className="card-title">{item.title}</h3>
                <p className="card-excerpt">{item.excerpt}</p>
                <div className="card-footer">
                  <div>
                    {item.source_label && <div className="card-source">{item.source_label}</div>}
                    <div className="card-date">{item.date}</div>
                  </div>
                  <button className="card-btn">Análise →</button>
                </div>
              </article>
            </React.Fragment>
          )) : (
            <div className="empty-state">
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p>Nenhuma reportagem encontrada.</p>
            </div>
          )}
        </div>
        <Newsletter />
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
            
            {article.bullet_points && article.bullet_points.length > 0 && (
              <div className="bullet-list">
                <div className="bullet-title">📍 Fatos de Inteligência</div>
                {article.bullet_points.map((pt, idx) => (
                  <div key={idx} className="bullet-item">{pt}</div>
                ))}
              </div>
            )}

            {(article.youtube_id || getImageUrl(article)) && (
              <div className="modal-media">
                {article.youtube_id ? (
                  <iframe 
                    width="100%" height="360" 
                    src={`https://www.youtube.com/embed/${article.youtube_id}`} 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                ) : (
                  <img src={getImageUrl(article)} alt={article.title} />
                )}
              </div>
            )}

            <div className="modal-body">
              {article.content
                ? article.content.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                : <p>{article.excerpt}</p>}
              
              {article.strategic_analysis && (
                <div className="analysis-block">
                  <div className="analysis-title">📊 ANÁLISE ESTRATÉGICA</div>
                  <p className="analysis-text">{article.strategic_analysis}</p>
                </div>
              )}

              <AdSlot />
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
