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

// ── Sub-components & "Faz Tudo" Widgets ──────────────────────────────────────────────

const MacroTicker = () => {
  const [prices, setPrices] = useState({ brent: 82.45, gold: 2341.10, btc: 64230.00 })
  React.useEffect(() => {
    const int = setInterval(() => {
      setPrices(p => ({
        brent: p.brent + (Math.random() - 0.5) * 0.5,
        gold: p.gold + (Math.random() - 0.5) * 5,
        btc: p.btc + (Math.random() - 0.5) * 100
      }))
    }, 3000)
    return () => clearInterval(int)
  }, [])
  return (
    <div className="macro-ticker">
      <div className="macro-title">🌐 MACRO IMPACTO (AO VIVO)</div>
      <div className="macro-items">
        <div className={`macro-item ${Math.random() > 0.5 ? 'up' : 'down'}`}>
          <span className="macro-label">Petróleo BRENT</span>
          <span className="macro-value">${prices.brent.toFixed(2)}</span>
        </div>
        <div className={`macro-item ${Math.random() > 0.5 ? 'up' : 'down'}`}>
          <span className="macro-label">Ouro (Oz)</span>
          <span className="macro-value">${prices.gold.toFixed(2)}</span>
        </div>
        <div className={`macro-item ${Math.random() > 0.5 ? 'up' : 'down'}`}>
          <span className="macro-label">Bitcoin</span>
          <span className="macro-value">${prices.btc.toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}

const DailyBriefing = ({ topArticles }) => {
  if (!topArticles || topArticles.length < 2) return null
  return (
    <div className="daily-briefing">
      <div className="briefing-title">📋 BRIEFING EXECUTIVO DE INTELIGÊNCIA</div>
      <div className="briefing-content">
        Nas últimas 24 horas, nossos sistemas identificaram operações críticas: 
        <strong style={{color: 'var(--red)'}}> {topArticles[0]?.title}</strong>. 
        Em paralelo, focos de tensão continuam acerca de 
        <strong style={{color: 'var(--amber)'}}> {topArticles[1]?.title}</strong>. 
        O monitoramento autônomo está ativo e contínuo. Nível de ameaça global sendo reavaliado.
      </div>
      <div className="briefing-glitch">⚙️</div>
    </div>
  )
}

const GeoMapFilter = ({ activeCat, onFilter }) => {
  return (
    <div className="geo-map-container" aria-label="Mapa Estratégico Global">
      <div className="section-label" style={{ marginTop: 0 }}>地图 TEATRO DE OPERAÇÕES</div>
      <svg className="geo-map-svg" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
         {/* Background */}
         <rect x="0" y="0" width="1000" height="400" fill="rgba(14,165,233,0.02)" />
         
         <g onClick={() => onFilter('Oriente Médio')} className={`map-region ${activeCat === 'Oriente Médio' ? 'active' : ''}`}>
            <rect x="530" y="160" width="80" height="70" rx="4" />
            <text x="570" y="198" fill="var(--text)" fontSize="14" fontWeight="800" textAnchor="middle">Oriente Médio</text>
         </g>
         <g onClick={() => onFilter('Leste Europeu')} className={`map-region ${activeCat === 'Leste Europeu' ? 'active' : ''}`}>
            <rect x="480" y="70" width="100" height="80" rx="4" />
            <text x="530" y="115" fill="var(--text)" fontSize="14" fontWeight="800" textAnchor="middle">Leste Europeu</text>
         </g>
         <g onClick={() => onFilter('Ásia-Pacífico')} className={`map-region ${activeCat === 'Ásia-Pacífico' ? 'active' : ''}`}>
            <rect x="680" y="90" width="150" height="150" rx="4" />
            <text x="755" y="170" fill="var(--text)" fontSize="14" fontWeight="800" textAnchor="middle">Ásia-Pacífico</text>
         </g>
         <g onClick={() => onFilter('África')} className={`map-region ${activeCat === 'África' ? 'active' : ''}`}>
            <rect x="430" y="240" width="120" height="140" rx="4" />
            <text x="490" y="315" fill="var(--text)" fontSize="14" fontWeight="800" textAnchor="middle">África</text>
         </g>
         <g onClick={() => onFilter('OTAN')} className={`map-region ${activeCat === 'OTAN' ? 'active' : ''}`}>
            <rect x="180" y="70" width="280" height="120" rx="4" />
             <text x="320" y="135" fill="var(--text)" fontSize="14" fontWeight="800" textAnchor="middle">OTAN / Ocidente</text>
         </g>
         
         <text x="500" y="380" fill="var(--muted)" fontSize="10" textAnchor="middle" letterSpacing="2">CLIQUE NO MAPA PARA FILTRAR OS RELATÓRIOS TÁTICOS</text>
      </svg>
    </div>
  )
}

const AFFILIATE_PRODUCTS = [
  {
    title: "ProtonMail — Criptografia de Ponta",
    desc: "Comunicação 100% blindada e anônima. Padrão-ouro em OpSec localizado na Suíça.",
    icon: "✉️",
    url: "https://proton.me/",
    type: "OPSEC PREMIUM"
  },
  {
    title: "Rádio Comunicador Tático (Baofeng)",
    desc: "Equipamento essencial de sobrevivência. Comunicação vital em qualquer cenário.",
    icon: "📻",
    url: "https://amazon.com.br/",
    type: "SURVIVAL GEAR"
  },
  {
    title: "DigitalOcean — Cloud Serverless",
    desc: "Hospede seus projetos OSINT em servidores Cloud de altíssima performance.",
    icon: "☁️",
    url: "https://www.digitalocean.com/",
    type: "TECH INFRA"
  },
  {
    title: "📚 Prisioneiros da Geografia",
    desc: "Entenda como o mapa dita os conflitos globais. Leitura obrigatória de geopolítica.",
    icon: "📖",
    url: "https://amazon.com.br/",
    type: "INTEL CORE"
  },
  {
    title: "Incogni — Proteção de Dados",
    desc: "Elimine seus dados pessoais da lista de corretores e varejistas de dados.",
    icon: "🕵️‍♂️",
    url: "https://incogni.com/",
    type: "PRIVACY TOOL"
  },
  {
    title: "YubiKey 5 NFC — Segurança Máxima",
    desc: "Chave física de grau militar contra phishing e invasão das suas contas.",
    icon: "🔑",
    url: "https://www.yubico.com/",
    type: "HARDWARE SEC"
  }
]

const AdSlot = ({ label, index = 0 }) => {
  const item = AFFILIATE_PRODUCTS[index % AFFILIATE_PRODUCTS.length]
  return (
    <a href={item.url} target="_blank" rel="noreferrer" className="ad-slot" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', padding: '32px 24px', gap: '8px', zIndex: 10, position: 'relative' }}>
      {label && <span style={{ position: 'absolute', top: 10, left: 14, fontSize: '9px', color: 'var(--cyan)' }}>{label}</span>}
      <div style={{ fontSize: '36px', marginBottom: '4px' }}>{item.icon}</div>
      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text)', letterSpacing: '1px' }}>{item.title}</div>
      <div style={{ fontSize: '12px', color: 'var(--soft)', textTransform: 'none', letterSpacing: '0.5px', maxWidth: '80%' }}>{item.desc}</div>
      <div style={{ marginTop: '16px', padding: '8px 24px', backgroundColor: 'rgba(14, 165, 233, 0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)', borderRadius: '4px', fontSize: '11px', fontWeight: '900', transition: 'all 0.2s' }}>
        ACESSAR RECURSO →
      </div>
    </a>
  )
}

const AffiliateSection = () => (
  <div className="affiliate-section">
    <div className="affiliate-title">🛰️ FONTES & EQUIPAMENTOS RECOMENDADOS</div>
    <div className="affiliate-grid">
      <a href="https://nordvpn.com" target="_blank" rel="noreferrer" className="affiliate-item">
        <span className="affiliate-icon">🛡️</span>
        <div className="affiliate-text">
          <div>NordVPN — Segurança OSINT</div>
          <span>Proteja seu tráfego de inteligência.</span>
        </div>
      </a>
      <a href="https://amazon.com" target="_blank" rel="noreferrer" className="affiliate-item">
        <span className="affiliate-icon">📚</span>
        <div className="affiliate-text">
          <div>Geopolítica: Livro Essencial</div>
          <span>Análise clássica atualizada.</span>
        </div>
      </a>
    </div>
  </div>
)

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

const ThreatMeter = ({ data }) => {
  const levels = { '🟢 BAIXO': 20, '🟡 MODERADO': 50, '🟠 ELEVADO': 75, '🔴 CRÍTICO': 95, '—': 10 }
  const avg = data.length > 0 
    ? data.reduce((acc, curr) => acc + (levels[curr.threat_level] || 10), 0) / data.length 
    : 10
  
  return (
    <div className="threat-meter-box" aria-label="Medidor de Tensão Global">
      <div className="meter-label">GLOBAL THREAT LEVEL</div>
      <div className="meter-container">
        <div className="meter-fill" style={{ width: `${avg}%`, backgroundColor: avg > 70 ? 'var(--red)' : avg > 40 ? '#f59e0b' : 'var(--cyan)' }} />
      </div>
      <div className="meter-status">{avg > 70 ? 'CRITICAL' : avg > 40 ? 'ELEVATED' : 'STABLE'} — {avg.toFixed(0)}% OPS_INTEL</div>
    </div>
  )
}

const LiveTerminal = () => {
  const logs = [
    "INTERCEPTING ENCRYPTED SIGNAL...", "DECODING PACKET 0x4F23...", "OSINT FEED: ACTIVE", "SATELLITE SYNC: 98%",
    "GEO-TARGETING: SECTOR 7...", "DETECTING ANOMALIES...", "SIGNAL STRENGTH: OPTIMAL", "ENCRYPTION: AES-256"
  ]
  const [current, setCurrent] = useState(0)
  
  React.useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % logs.length), 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="live-terminal">
      <span className="terminal-prefix">INTEL_LOG ></span>
      <span className="terminal-text">{logs[current]}</span>
    </div>
  )
}

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
            <div className={`analysis-block ${article.is_premium ? 'premium-blur-container' : ''}`} aria-label="Análise estratégica">
              <div className="analysis-title">📊 ANÁLISE ESTRATÉGICA</div>
              <div className={article.is_premium ? 'premium-blur' : ''}>
                <p className="analysis-text">{article.strategic_analysis}</p>
              </div>
              
              {article.is_premium && (
                <div className="paywall-overlay">
                  <div className="paywall-title">CONTEÚDO CLASSIFICADO</div>
                  <div className="paywall-text">Esta análise técnica profunda é exclusiva para assinantes do Horizon Intel Premium.</div>
                  <button className="btn-war" onClick={() => window.location.hash = 'newsletter'}>DESBLOQUEAR ACESSO RELATÓRIOS →</button>
                </div>
              )}
            </div>
          )}
          <AdSlot label="INNER REPORT AD" />
        </div>

        <AffiliateSection />
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
  const [isScanning, setIsScanning] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTerminal, setIsTerminal] = useState(false)
  const [visibleCount, setVisibleCount] = useState(7)
  const audioRef = useRef(null)

  React.useEffect(() => {
    if (isTerminal) document.body.classList.add('theme-terminal')
    else document.body.classList.remove('theme-terminal')
  }, [isTerminal])

  const handleSetArticle = (art) => {
    if (!art) { setArticle(null); return }
    setIsScanning(true)
    setTimeout(() => {
      setArticle(art)
      setIsScanning(false)
    }, 800)
  }

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
      <div className="ticker" aria-label="Breaking news ticker" role="marquee" id="newsletter">
        <span className="ticker-inner">
          {[...TICKER_TOPICS, ...TICKER_TOPICS].map((t, i) => (
            <span key={i} style={{ marginRight: '80px' }}>🔴 {t}</span>
          ))}
        </span>
      </div>

      <div className="container" style={{ marginTop: '20px' }}>
        <AdSlot label="TOP LEADERBOARD PARTNER" />
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
            <button
              className="audio-btn"
              onClick={() => setIsTerminal(!isTerminal)}
              style={{ color: isTerminal ? '#0f0' : '', borderColor: isTerminal ? '#0f0' : '' }}
            >
              ⌨️ {isTerminal ? 'TERMINAL: ON' : 'TERMINAL: OFF'}
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
        backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} aria-label="Cabeçalho do portal">
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,6,8,0.4), rgba(5,6,8,1))', zIndex: 1 }}></div>
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
          <ThreatMeter data={data} />
        </div>
      </section>

      {/* ── Main ── */}
      <main className="container" style={{ paddingTop: '40px' }}>
        <div className="main-layout">
          <div className="content-area">

            {/* ── Daily Briefing ── */}
            <DailyBriefing topArticles={data.slice(0, 3)} />

            {/* ── Intelligence Radar ── */}
            <IntelRadar onFilter={handleRadarFilter} newsData={data} />

            {/* ── Video Gallery ── */}
            <VideoGallery items={data} onSelect={handleSetArticle} />

            {/* ── Featured ── */}
            {featured && !search && (
              <>
                <div className="section-label">🔥 ÚLTIMA HORA</div>
                <div
                  className="featured-card"
                  onClick={() => handleSetArticle(featured)}
                  onKeyDown={e => e.key === 'Enter' && handleSetArticle(featured)}
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
                      <div className="intel-row"><span>COORD:</span> <b>{((featured.id || 1) % 90).toFixed(2)}N / {((featured.id || 1) % 180).toFixed(2)}E</b></div>
                      <div className="intel-row"><span>ENCRYPT:</span> <b>AES-256</b></div>
                      <div className="intel-row"><span>CONFIANÇA:</span> <b>{featured.confidence_score || 97}%</b></div>
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
              <button className="cat-btn" onClick={() => setCategory('Todas')} style={{marginLeft: 'auto'}}>RESET FILTERS</button>
            </div>

            {/* ── Geo Map Filter ── */}
            <GeoMapFilter activeCat={category} onFilter={setCategory} />

            {/* ── Grid ── */}
            <div className="section-label" role="heading" aria-level={2}>
              {category === 'Todas' ? '📡 TODAS AS REPORTAGENS' : `${CAT_ICON[category] || '📡'} ${category.toUpperCase()}`}
            </div>
            <div className="news-grid" role="list" aria-label="Lista de notícias">
              {filtered.length > 0 ? rest.slice(0, visibleCount - 1).map((item, index) => (
                <React.Fragment key={item.id ?? index}>
                  {index > 0 && index % 4 === 0 && <AdSlot index={index} />}
                  <article
                    className="news-card"
                    onClick={() => handleSetArticle(item)}
                    onKeyDown={e => e.key === 'Enter' && handleSetArticle(item)}
                    tabIndex={0}
                    role="listitem"
                    aria-label={`Notícia: ${item.title}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="card-category">{CAT_ICON[item.category]} {item.category}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {item.is_premium && <span className="badge-premium">CLASSIFIED</span>}
                        {item.is_sponsored && <span className="badge-sponsored">SPONSORED</span>}
                        {isNew(item) && <span className="badge-new" aria-label="Notícia nova">🔴 NOVO</span>}
                      </div>
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
                      <div className="intel-tag">{item.threat_level || '🟡 MOD'}</div>
                      {item.sentiment && (
                        <div className={`badge-sentiment sentiment-${item.sentiment.toLowerCase().replace(' ', '')}`}>
                          {item.sentiment === 'ESCALADA' ? '🔴' : item.sentiment === 'DIPLOMACIA' ? '🟢' : '🟡'} {item.sentiment}
                        </div>
                      )}
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

            {filtered.length > visibleCount && (
              <div style={{ textAlign: 'center', margin: '40px 0' }}>
                <button 
                  className="btn-war" 
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  style={{ background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)' }}
                >
                  CARREGAR MAIS RELATÓRIOS ⚔️
                </button>
              </div>
            )}

            <Newsletter />
          </div>

          {/* ── Sidebar ── */}
          <aside className="sidebar" aria-label="Painel lateral de inteligência ao vivo">
            <MacroTicker />
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

      <LiveTerminal />

      {/* ── Scanning Overlay ── */}
      {isScanning && (
        <div className="scanning-overlay">
          <div className="scanning-text">DATA_BURST_SCANNING...</div>
          <div className="scanning-progress" />
        </div>
      )}
    </div>
  )
}
