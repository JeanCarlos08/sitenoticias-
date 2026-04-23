import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// Reutilizamos a lógica de config (em um projeto real, isso estaria num arquivo de config central)
const FORMSPREE_ID = 'SEU_FORM_ID_AQUI' 

export default function Contact() {
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!FORMSPREE_ID || FORMSPREE_ID === 'SEU_FORM_ID_AQUI') {
      alert('Configuração de envio pendente pela administração.')
      return
    }
    setStatus('loading')
    const formData = new FormData(e.target)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch { setStatus('error') }
  }

  return (
    <div className="legal-container">
      <header className="legal-header">
        <Link to="/" className="legal-back">← VOLTAR AO COMANDO</Link>
        <h1 className="legal-title">CENTRAL DE COMUNICAÇÃO</h1>
        <p className="legal-subtitle">Parcerias, Reportagem e Suporte Técnico</p>
      </header>

      <div className="legal-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '30px' }} className="mobile-grid">
          
          <section>
            <h2>Canais Oficiais</h2>
            <p>Se você possui informações estratégicas (tips) ou deseja propor parcerias comerciais, utilize os canais abaixo:</p>
            
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>📡 TELEGRAM:</span><br />
                <a href="https://t.me/horizonintel" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--soft)' }}>@horizonintel</a>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>📧 EMAIL:</span><br />
                <span style={{ color: 'var(--soft)' }}>contato@horizonintel.ai</span>
              </div>
            </div>

            <div className="analysis-block" style={{ marginTop: '30px', fontSize: '12px' }}>
              <div className="analysis-title">⚠️ AVISO DE SEGURANÇA</div>
              <p className="analysis-text">
                Para denúncias confidenciais, recomendamos o uso de emails criptografados ou serviços de mensagens seguras. Não armazenamos logs de IP nos contatos iniciais.
              </p>
            </div>
          </section>

          <section>
            <h2>Envie uma Mensagem</h2>
            {status === 'ok' ? (
              <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', padding: '20px', borderRadius: '4px', color: '#10b981' }}>
                📡 <strong>Sinal Enviado:</strong> Sua mensagem foi interceptada por nossa equipe. Responderemos em breve.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold' }}>IDENTIFICAÇÃO (NOME)</label>
                  <input name="name" type="text" className="news-input" style={{ width: '100%' }} required />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold' }}>CANAL DE RESPOSTA (EMAIL)</label>
                  <input name="email" type="email" className="news-input" style={{ width: '100%' }} required />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold' }}>ASSUNTO</label>
                  <select name="subject" className="news-input" style={{ width: '100%', background: 'var(--bg-card)' }}>
                    <option>Parceria Comercial</option>
                    <option>Sugestão de Reportagem / Tips</option>
                    <option>Problemas Técnicos</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold' }}>MENSAGEM CLASSIFICADA</label>
                  <textarea name="message" rows="5" className="news-input" style={{ width: '100%', resize: 'none' }} required></textarea>
                </div>

                <button type="submit" className="btn-war" disabled={status === 'loading'}>
                  {status === 'loading' ? 'TRANSMITINDO...' : 'ENVIAR MENSAGEM →'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>

      <footer className="legal-footer">
        © {new Date().getFullYear()} HORIZON INTEL — INTEL_OPS DIVISION
      </footer>
    </div>
  )
}
