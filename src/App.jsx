import React, { useState } from 'react'
import './index.css'
import newsData from './data/news.json'

const categoryEmoji = {
  'Geopolítica': '🌍',
  'I.A.': '🤖',
  'Mistérios': '🔮',
  'Dopamina': '⚡',
  default: '📰'
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const safeNews = Array.isArray(newsData) ? newsData : []
  const categories = ['Todas', ...new Set(safeNews.map(i => i?.category).filter(Boolean))]

  const filtered = safeNews.filter(item => {
    const q = searchTerm.toLowerCase()
    const matchSearch = !q || item.title?.toLowerCase().includes(q) || item.excerpt?.toLowerCase().includes(q)
    const matchCat = selectedCategory === 'Todas' || item.category === selectedCategory
    return matchSearch && matchCat
  })

  const featured = filtered[0]
  const rest = filtered.slice(1)

  const closeModal = () => setSelectedArticle(null)

  return (
    <div className="app-container">

      {/* ── Header ── */}
      <header className="header">
        <div className="container header-inner">
          <div className="brand">AI<span className="brand-dot">.</span>NEWS</div>
          <div className="header-meta">
            Última atualização: <span>{safeNews[0]?.date || 'Hoje'}</span>
          </div>
          <nav>
            <ul className="nav-list">
              {['Home', 'Geopolítica', 'I.A.', 'Mistérios', 'Dopamina'].map(item => (
                <li
                  key={item}
                  className="nav-item"
                  onClick={() => setSelectedCategory(item === 'Home' ? 'Todas' : item)}
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
          <div className="hero-eyebrow">⚡ ALIMENTADO POR IA</div>
          <h1 className="hero-title">
            O Futuro <span className="highlight">Decodificado.</span><br />
            Notícias que Viciam.
          </h1>
          <p className="hero-sub">
            Geopolítica, Inteligência Artificial e os Mistérios que ninguém te conta.
            Curadoria automatizada por IA, atualizada todo dia.
          </p>
          <div className="hero-stats">
            <div>
              <div className="stat-value">{safeNews.length}</div>
              <div className="stat-label">Artigos Hoje</div>
            </div>
            <div>
              <div className="stat-value">4</div>
              <div className="stat-label">Categorias</div>
            </div>
            <div>
              <div className="stat-value">24h</div>
              <div className="stat-label">Atualização</div>
            </div>
            <div>
              <div className="stat-value">100%</div>
              <div className="stat-label">Gerado por IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <main className="container">

        {/* ── Featured article ── */}
        {featured && searchTerm === '' && (
          <section className="featured-section">
            <div className="section-label">🔥 DESTAQUE DO DIA</div>
            <div className="featured-card" onClick={() => setSelectedArticle(featured)}>
              <div className="featured-card-inner">
                <div>
                  <div className="featured-badge">{featured.category}</div>
                  <h2 className="featured-title">{featured.title}</h2>
                  <p className="featured-excerpt">{featured.excerpt}</p>
                  <button className="featured-read-btn">
                    Ler artigo completo <span>→</span>
                  </button>
                </div>
                <div className="featured-icon" aria-hidden="true">
                  {categoryEmoji[featured.category] || categoryEmoji.default}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Filters ── */}
        <div className="filters-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍  Pesquisar notícias..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="cat-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── News grid ── */}
        <div className="section-label">
          {selectedCategory === 'Todas' ? '📰 TODAS AS NOTÍCIAS' : `${categoryEmoji[selectedCategory] || '📰'} ${selectedCategory.toUpperCase()}`}
        </div>
        <div className="news-grid">
          {(searchTerm !== '' ? filtered : rest).length > 0 ? (
            (searchTerm !== '' ? filtered : rest).map(item => (
              <article key={item.id} className="news-card" onClick={() => setSelectedArticle(item)}>
                <span className="card-category">{item.category}</span>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-excerpt">{item.excerpt}</p>
                <div className="card-footer">
                  <span className="card-date">{item.date}</span>
                  <button className="card-btn">Ler mais →</button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p>Nenhuma notícia encontrada.<br />Tente outro termo ou categoria.</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Article Modal ── */}
      {selectedArticle && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-category">
              {categoryEmoji[selectedArticle.category]} {selectedArticle.category}
            </div>
            <h2 className="modal-title">{selectedArticle.title}</h2>
            <span className="modal-date">Publicado em {selectedArticle.date}</span>
            <div className="modal-divider" />
            <div className="modal-body">
              {selectedArticle.content
                ? selectedArticle.content.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                : <p>{selectedArticle.excerpt}</p>
              }
            </div>
            <div className="modal-footer">
              <span>© AI News Portal — Gerado por Inteligência Artificial</span>
              <button className="cat-btn" onClick={closeModal}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-logo">AI.NEWS PORTAL</div>
          <p className="footer-sub">
            Notícias do futuro, hoje. Gerado e curado por Inteligência Artificial.
          </p>
        </div>
      </footer>

    </div>
  )
}

export default App
