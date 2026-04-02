import React, { useState, useEffect } from 'react'

const COOKIE_KEY = 'horizon_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false })

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY)
    if (!saved) setVisible(true)
  }, [])

  const acceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: true, marketing: true, necessary: true, ts: Date.now() }))
    setVisible(false)
  }

  const savePrefs = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, necessary: true, ts: Date.now() }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consentimento de cookies">
      <div className="cookie-inner">
        {!showSettings ? (
          <>
            <div className="cookie-left">
              <div className="cookie-title">🍪 Controle de Privacidade</div>
              <p className="cookie-text">
                Utilizamos cookies para garantir a melhor experiência de monitoramento. 
                Em conformidade com a <strong>LGPD</strong> e <strong>GDPR</strong>, você controla seus dados.{' '}
                <a href="/privacidade" className="cookie-link">Política de Privacidade</a>
              </p>
            </div>
            <div className="cookie-actions">
              <button className="cookie-btn-secondary" onClick={() => setShowSettings(true)} aria-label="Configurar preferências de cookies">
                Configurações
              </button>
              <button className="cookie-btn-primary" onClick={acceptAll} aria-label="Aceitar todos os cookies">
                Aceitar Tudo
              </button>
            </div>
          </>
        ) : (
          <div className="cookie-settings">
            <div className="cookie-title">⚙️ Configurações de Cookies</div>
            <div className="cookie-options">
              <label className="cookie-option">
                <div>
                  <strong>Necessários</strong>
                  <p>Essenciais para o funcionamento do site. Sempre ativos.</p>
                </div>
                <input type="checkbox" checked disabled aria-label="Cookies necessários (sempre ativos)" />
              </label>
              <label className="cookie-option">
                <div>
                  <strong>Analíticos</strong>
                  <p>Nos ajudam a entender como você usa o portal.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={e => setPrefs(p => ({ ...p, analytics: e.target.checked }))}
                  aria-label="Cookies analíticos"
                />
              </label>
              <label className="cookie-option">
                <div>
                  <strong>Marketing</strong>
                  <p>Permitem anúncios personalizados.</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={e => setPrefs(p => ({ ...p, marketing: e.target.checked }))}
                  aria-label="Cookies de marketing"
                />
              </label>
            </div>
            <div className="cookie-actions">
              <button className="cookie-btn-secondary" onClick={() => setShowSettings(false)} aria-label="Voltar">
                ← Voltar
              </button>
              <button className="cookie-btn-primary" onClick={savePrefs} aria-label="Salvar preferências de cookies">
                Salvar Preferências
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
