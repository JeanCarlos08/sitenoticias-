import React, { useState } from 'react'
import './index.css'
import headerImg from './assets/header.png'
import newsData from './data/news.json'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const safeNewsData = Array.isArray(newsData) ? newsData : [];
  const categories = ['Todas', ...new Set(safeNewsData.map(item => item?.category).filter(Boolean))]

  const filteredNews = safeNewsData.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="app-container">
      <header className="glass" style={{ padding: '20px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <main style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="brand" style={{ fontSize: '24px', letterSpacing: '1px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI NEWS PORTAL
          </div>
          <nav>
            <ul style={{ display: 'flex', listStyle: 'none', gap: '30px', fontSize: '14px', fontWeight: 500 }}>
              {['Home', 'Geopolítica', 'I.A.', 'Mistérios'].map(cat => (
                <li key={cat} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>{cat}</li>
              ))}
            </ul>
          </nav>
        </main>
      </header>

      <section className="hero" style={{ height: '400px', backgroundImage: `url(${headerImg})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '40px', borderRadius: '16px', maxWidth: '800px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>O Futuro <span style={{ color: 'var(--accent-purple)' }}>Decodificado.</span>Notícias que Viciam.</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Geopolítica, I.A. e os Mistérios que ninguém te conta. Curadoria ultra-rápida por Inteligência Artificial.</p>
        </div>
      </section>

      <main>
        <div className="filters" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: '300px' }}>
            <input 
              type="text" 
              placeholder="Pesquisar notícias..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass"
              style={{ width: '100%', padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-glass)', color: 'white', outline: 'none' }}
            />
          </div>
          <div className="category-filters" style={{ display: 'flex', gap: '10px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'btn-primary' : 'glass'}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  border: selectedCategory === cat ? 'none' : '1px solid var(--border-glass)',
                  color: 'white'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          {filteredNews.length > 0 ? filteredNews.map(item => (
            <div key={item.id} className="glow-card" style={{ padding: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>{item.category}</span>
              <h3 style={{ fontSize: '22px', marginBottom: '12px', lineHeight: '1.4' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>{item.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>{item.date}</span>
                <button 
                  className="btn-primary" 
                  style={{ padding: '6px 16px', fontSize: '12px' }}
                  onClick={() => setSelectedArticle(item)}
                >
                  Ler mais
                </button>
              </div>
            </div>
          )) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Nenhuma notícia encontrada para essa busca.</p>
          )}
        </div>
      </main>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="glass modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '40px', borderRadius: '24px', border: '1px solid var(--border-glass)', boxShadow: '0 0 50px rgba(112, 0, 255, 0.2)' }}>
            <button onClick={() => setSelectedArticle(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase', marginBottom: '20px', display: 'block' }}>{selectedArticle.category}</span>
            <h2 style={{ fontSize: '36px', marginBottom: '24px', lineHeight: '1.2' }}>{selectedArticle.title}</h2>
            <div style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--text-main)', opacity: 0.9 }}>
              {selectedArticle.content ? selectedArticle.content.split('\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '20px' }}>{para}</p>
              )) : selectedArticle.excerpt}
            </div>
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px' }}>
              <span>Data: {selectedArticle.date}</span>
              <span>© AI News Portal</span>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: '100px', padding: '60px 0', borderTop: '1px solid var(--border-glass)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>&copy; 2026 AI News Portal. Criado com IA para o futuro.</p>
      </footer>
    </div>
  )
}


export default App
