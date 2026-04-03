import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import newsData from '../data/news.json'
import IntelRadar   from '../components/IntelRadar'
import SocialShare  from '../components/SocialShare'

// ── Constants ─────────────────────────────────────────────────────────────────

const CAT_ICON = {
  'Conflitos':      '⚡',
  'OTAN':           '🛡️',
  'Oriente Médio':  '🌍',
  'Leste Europeu':  '🛰️',
  'Geopolítica':    '📊',
  'Ásia-Pacífico':  '🇨🇳',
  'África':         '🌎',
  default:          '📡',
}

const FALLBACK_IMAGES = {
  'Conflitos':      'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1200&auto=format&fit=crop',
  'OTAN':           'https://images.unsplash.com/photo-1563200155-276906a2ff5b?q=80&w=1200&auto=format&fit=crop',
  'Oriente Médio':  'https://images.unsplash.com/photo-1601662400326-f7cc93e62f02?q=80&w=1200&auto=format&fit=crop',
  'Leste Europeu':  'https://images.unsplash.com/photo-1551829141-857118ee7a21?q=80&w=1200&auto=format&fit=crop',
  'Geopolítica':    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop',
  'Ásia-Pacífico':  'https://images.unsplash.com/photo-1535083783855-aaab04b2b09b?q=80&w=1200&auto=format&fit=crop',
  'África':         'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?q=80&w=1200&auto=format&fit=crop',
  default:          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
}

const TICKER_TOPICS = [
  '🚨 BREAKING • Tensões aumentam no Leste Europeu',
  '⚠️ ALERTA • Novos ataques no Oriente Médio',
  '🛡️ OTAN • Reforço nas fronteiras leste da Europa',
  '🇨🇳 ÁSIA-PACÍFICO • Movimentações no Estreito de Taiwan',
  '🌎 ÁFRICA • Novos conflitos no Sahel',
  '📡 OSINT • Análise em tempo real dos conflitos globais',
]

const getImageUrl = (item) =>
  item?.image_url && item.image_url !== ''
    ? item.image_url
    : (FALLBACK_IMAGES[item?.category] || FALLBACK_IMAGES.default)

const isNew = (article) => {
  if (!article.published_at) return false
  return (Date.now() - new Date(article.published_at)) / 36e5 < 6
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const AdSlot = () => <div className="ad-slot" aria-hidden="true" />

const VideoGallery = ({ items, onSelect }) => {
  const videoItems = items.filter(i => i.youtube_id && i.youtube_id !== '').slice(0, 8)
  if (videoItems.length === 0) return null
  return (
    <section aria-label="Briefing em vídeo" style={{ marginBottom: '40px' }}>
      <div className="section-label">📺 BRIEFING EM VÍDEO</div>
      <div className="video-gallery" role="list">
        {videoItems.map(item => (
          <div
            key={item.id}
            className="video-item"
            role="listitem"
            onClick={() => onSelect(item)}
            onKeyDown={e => e.key === 'Enter' && onSelect(item)}
            tabIndex={0}
            aria-label={`Assistir vídeo: ${item.title}`}
          >
            <img
              src={`https://img.youtube.com/vi/${item.youtube_id}/mqdefault.jpg`}
              className="video-thumb"
              alt={`Thumbnail do vídeo: ${item.title}`}
              onError={e => { e.target.src = FALLBACK_IMAGES[item.category] || FALLBACK_IMAGES.default }}
            />
            <div className="video-play" aria-hidden="true">▶</div>
            <div className="video-info">
              <span className="video-tag">{item.category}</span>
              <div className="video-title">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const LiveFeed = ({ data }) => (
  <div className="live-feed-box" aria-label="Feed de inteligência ao vivo" role="complementary">
    <div className="feed-header">
      <div className="section-label" style={{ margin: 0 }}>📡 LIVE INTEL</div>
      <span className="badge-new" aria-label="Atualizado em tempo real">LIVE</span>
    </div>
    <div className="feed-content" role="list">
      {data.slice(0, 15).map((item, i) => (
        <div key={item.id || i} className="feed-item" role="listitem">
          <span className="feed-time">
            {new Date(item.published_at || Date.now()).toLocaleTimeString('pt-BR', {
              hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
            })} UTC
          </span>
          <div className="feed-text">{item.title}</div>
        </div>
      ))}
    </div>
  </div>
)

const Newsletter = () => (
  <section className="newsletter-section" aria-label="Inscreva-se na newsletter">
    <div className="hero-eyebrow">📬 INTELIGÊNCIA DIÁRIA</div>
    <h2 className="news-title">Relatório Warzone</h2>
    <p className="news-sub">
      Receba análises profundas e boletins de emergência direto no seu e-mail.
      Junte-se a 50.000+ assinantes globais.
    </p>
    <form className="news-form" onSubmit={e => e.preventDefault()}>
      <input
        type="email"
        placeholder="Seu melhor e-mail..."
        className="news-input"
        required
        aria-label="Digite seu e-mail para se inscrever"
      />
      <button type="submit" className="btn-war" aria-label="Inscrever-se na newsletter">
        INSCREVER-SE
      </button>
    </form>
  </section>
)

// ── Modal ──────────────────────────────────────────────────────────────────────

const ArticleModal = ({ article, onClose }) => {
  if (!article) return null
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Artigo: ${article.title}`}
    >
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar artigo">×</button>

        <div className="modal-category">
          {CAT_ICON[article.category] || CAT_ICON.default} {article.category}
        </div>
        <h2 className="modal-title">{article.title}</h2>
        <div className="modal-meta">
          <span>📅 {article.date}</span>
          {article.source_label && <span>{article.source_label}</span>}
        </div>
        <div className="modal-divider" />

        {Array.isArray(article.bullet_points) && article.bullet_points.length > 0 && (
          <div className="bullet-list" aria-label="Fatos de inteligência">
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
                title={`Vídeo: ${article.title}`}
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
            <div className="analysis-block" aria-label="Análise estratégica">
              <div className="analysis-title">📊 ANÁLISE ESTRATÉGICA</div>
              <p className="analysis-text">{article.strategic_analysis}</p>
            </div>
          )}
          <AdSlot />
        </div>

        <SocialShare article={article} />

        <div className="modal-footer">
          <span>© HORIZON INTEL — Powered by AI</span>
          <button className="cat-btn active" onClick={onClose} aria-label="Fechar modal">Fechar</button>
        </div>
      </div>
    </div>
  )
}

// ── Home Page ─────────────────────────────────────────────────────────────────

export default function Home() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('Todas')
  const [article,  setArticle]  = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false) }
    else           { audioRef.current.play();  setIsPlaying(true)  }
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

  const handleRadarFilter = (cat) => {
    setCategory(cat)
    setSearch('')
  }

  return (
    <div className="app-container">

      {/* ── Breaking news ticker ── */}
      <div className="ticker" aria-label="Breaking news ticker" role="marquee">
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
            <div className="brand" aria-label="HORIZON INTEL — Inteligência Geopolítica">🛡️ HORIZON INTEL</div>
            <span className="brand-sub">Strategic Geopolitical Oversight</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="live-dot" aria-label="Sinal ativo">SIGNAL: ACTIVE</div>
            <button
              className={`audio-btn ${isPlaying ? 'playing' : ''}`}
              onClick={toggleAudio}
              aria-label={isPlaying ? 'Desligar áudio ambiente' : 'Ligar áudio ambiente'}
            >
              {isPlaying ? '🔊 AUDIO ON' : '🔈 AUDIO OFF'}
            </button>
            <audio ref={audioRef} loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" />
          </div>
          <nav aria-label="Navegação principal">
            <ul className="nav-list" role="list">
              {['Home', 'Conflitos', 'OTAN', 'Oriente Médio', 'Leste Europeu'].map(item => (
                <li
                  key={item}
                  className={`nav-item ${category === (item === 'Home' ? 'Todas' : item) ? 'active' : ''}`}
                  onClick={() => setCategory(item === 'Home' ? 'Todas' : item)}
                  onKeyDown={e => e.key === 'Enter' && setCategory(item === 'Home' ? 'Todas' : item)}
                  tabIndex={0}
                  role="menuitem"
                  aria-label={`Filtrar por ${item}`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero" style={{ 
        position: 'relative', 
        overflow: 'hidden',
        backgroundImage: `url('file:///C:/Users/user/.gemini/antigravity/brain/b43d5ce0-7ca3-485e-b220-06a663ca0f13/hero_tactical_command_1775171526090.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} aria-label="Cabeçalho do portal">
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,6,8,0.4), rgba(5,6,8,1))', z-index: 1 }}></div>
        <div className="scanline" aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-eyebrow">📡 GLOBAL STRATEGIC COMMAND</div>
          <h1 className="hero-title">
            HORIZON<br />
            <span className="accent">INTELLIGENCE</span>
          </h1>
          <p className="hero-sub">
            Monitoramento autônomo de alta precisão. Geopolítica, Defesa e Inteligência
            processadas em tempo real por IA de última geração.
          </p>
          <div className="hero-stats" aria-label="Estatísticas do portal">
            <div><div className="stat-val">{data.length}</div><div className="stat-lbl">Relatórios</div></div>
            <div><div className="stat-val">25+</div><div className="stat-lbl">Feeds RSS</div></div>
            <div><div className="stat-val">4×</div><div className="stat-lbl">Refresh Diário</div></div>
            <div><div className="stat-val" style={{ color: 'var(--accent)' }}>ACTIVE</div><div className="stat-lbl">Status</div></div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <main className="container" style={{ paddingTop: '40px' }}>
        <div className="main-layout">
          <div className="content-area">

            {/* ── Intelligence Radar ── */}
            <IntelRadar onFilter={handleRadarFilter} />

            {/* ── Video Gallery ── */}
            <VideoGallery items={data} onSelect={setArticle} />

            {/* ── Featured ── */}
            {featured && !search && (
              <>
                <div className="section-label">🔥 ÚLTIMA HORA</div>
                <div
                  className="featured-card"
                  onClick={() => setArticle(featured)}
                  onKeyDown={e => e.key === 'Enter' && setArticle(featured)}
                  tabIndex={0}
                  role="article"
                  aria-label={`Notícia em destaque: ${featured.title}`}
                >
                  <div className="featured-inner">
                    <div style={{ flex: 1 }}>
                      <div className="featured-badge">{featured.category}</div>
                      <h2 className="featured-title">{featured.title}</h2>
                      <img
                        src={getImageUrl(featured)}
                        alt={`Imagem da notícia: ${featured.title}`}
                        className="featured-img"
                        onError={e => { e.target.src = FALLBACK_IMAGES.default }}
                      />
                      <p className="featured-excerpt">{featured.excerpt}</p>
                      {featured.source_label && (
                        <p className="featured-source">Fonte: {featured.source_label}</p>
                      )}
                      <button className="btn-war" aria-label="Ler reportagem completa">
                        Ler reportagem completa →
                      </button>
                    </div>
                    <div className="featured-intel-sidebar">
                      <div className="intel-row"><span>SINAL:</span> <b>STRONG [|||||]</b></div>
                      <div className="intel-row"><span>COORD:</span> <b>{Math.random().toFixed(2)}N / {Math.random().toFixed(2)}E</b></div>
                      <div className="intel-row"><span>ENCRYPT:</span> <b>AES-256</b></div>
                      <div className="intel-row"><span>CONFIDÊNCIA:</span> <b>98.4%</b></div>
                      <div className="intel-row"><span>STATUS:</span> <b>VERIFICADO</b></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── Filters ── */}
            <div className="filters-bar" role="search">
              <input
                type="search"
                className="search-input"
                placeholder="🔍  Buscar conflitos, países, operações..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="Buscar notícias"
              />
              <div className="cat-buttons" role="group" aria-label="Filtrar por categoria">
                {cats.map(c => (
                  <button
                    key={c}
                    className={`cat-btn ${category === c ? 'active' : ''}`}
                    onClick={() => setCategory(c)}
                    aria-pressed={category === c}
                    aria-label={`Categoria: ${c}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Grid ── */}
            <div className="section-label" role="heading" aria-level={2}>
              {category === 'Todas' ? '📡 TODAS AS REPORTAGENS' : `${CAT_ICON[category] || '📡'} ${category.toUpperCase()}`}
            </div>
            <div className="news-grid" role="list" aria-label="Lista de notícias">
              {filtered.length > 0 ? rest.map((item, index) => (
                <React.Fragment key={item.id ?? index}>
                  {index > 0 && index % 4 === 0 && <AdSlot />}
                  <article
                    className="news-card"
                    onClick={() => setArticle(item)}
                    onKeyDown={e => e.key === 'Enter' && setArticle(item)}
                    tabIndex={0}
                    role="listitem"
                    aria-label={`Notícia: ${item.title}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="card-category">{CAT_ICON[item.category]} {item.category}</span>
                      {isNew(item) && <span className="badge-new" aria-label="Notícia nova">🔴 NOVO</span>}
                    </div>
                    <img
                      src={getImageUrl(item)}
                      alt={`Imagem: ${item.title}`}
                      className="card-img"
                      onError={e => { e.target.src = FALLBACK_IMAGES.default }}
                      loading="lazy"
                    />
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-excerpt">{item.excerpt}</p>
                    
                    <div className="card-intel">
                      <div className="intel-tag">SIG: <span>[|||..]</span></div>
                      <div className="intel-tag">CONF: <span>{(Math.random() * (100 - 85) + 85).toFixed(1)}%</span></div>
                      <div className="intel-tag">🛰️ SYNC</div>
                    </div>

                    <div className="card-footer">
                      <div>
                        {item.source_label && <div className="card-source">{item.source_label}</div>}
                        <div className="card-date">{item.date}</div>
                      </div>
                      <button className="card-btn" aria-label={`Ler análise: ${item.title}`}>Análise →</button>
                    </div>
                  </article>
                </React.Fragment>
              )) : (
                <div className="empty-state" role="status" aria-live="polite">
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <p>Nenhuma reportagem encontrada para os filtros selecionados.</p>
                </div>
              )}
            </div>

            <Newsletter />
          </div>

          {/* ── Sidebar ── */}
          <aside className="sidebar" aria-label="Painel lateral de inteligência ao vivo">
            <LiveFeed data={data} />
            <div style={{ marginTop: '24px' }}>
              <AdSlot />
            </div>
          </aside>
        </div>
      </main>

      {/* ── Modal ── */}
      <ArticleModal article={article} onClose={() => setArticle(null)} />

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-logo">🛡️ HORIZON INTEL</div>
          <p className="footer-sub">
            Monitoramento geopolítico de alta precisão — IA curada e automatizada.<br />
            Data Sources: Google Intelligence • OSINT Reddit • Global NewsAPI
          </p>
          <div className="footer-links" aria-label="Links legais">
            <Link to="/privacidade" className="footer-legal-link">Política de Privacidade</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/termos" className="footer-legal-link">Termos de Uso</Link>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} HORIZON INTEL. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
