import React from 'react'
import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <Link to="/" className="legal-back" aria-label="Voltar à página inicial">← RETORNAR À BASE</Link>
          <div className="hero-eyebrow">📋 CONFORMIDADE LEGAL</div>
          <h1 className="legal-title">Política de Privacidade</h1>
          <p className="legal-date">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="legal-body">
          <h2>1. Quem Somos</h2>
          <p>
            O <strong>HORIZON INTEL</strong> é um portal de notícias geopolíticas automatizado por inteligência artificial,
            dedicado ao monitoramento de conflitos globais, geopolítica e defesa estratégica. Nosso compromisso é com a
            transparência e o respeito à privacidade de nossos usuários, em conformidade com a <strong>Lei Geral de Proteção
            de Dados (LGPD — Lei nº 13.709/2018)</strong> e o <strong>Regulamento Geral sobre a Proteção de Dados (GDPR)</strong>.
          </p>

          <h2>2. Dados que Coletamos</h2>
          <p>Coletamos apenas os dados estritamente necessários para o funcionamento do portal:</p>
          <ul>
            <li><strong>E-mail (Newsletter):</strong> Fornecido voluntariamente para receber o boletim de inteligência.</li>
            <li><strong>Preferências de Cookies:</strong> Armazenadas localmente no seu navegador (<code>localStorage</code>).</li>
            <li><strong>Dados de Uso (Analíticos):</strong> Apenas se você consentir, podemos coletar dados anônimos de navegação.</li>
          </ul>

          <h2>3. Como Usamos seus Dados</h2>
          <ul>
            <li>Para enviar o <strong>Relatório Warzone</strong> (boletim de inteligência diário).</li>
            <li>Para melhorar a experiência do portal e a curadoria das notícias.</li>
            <li>Nunca vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.</li>
          </ul>

          <h2>4. Cookies</h2>
          <p>
            Utilizamos cookies de três categorias:
          </p>
          <ul>
            <li><strong>Necessários:</strong> Essenciais para autenticação e funcionamento.</li>
            <li><strong>Analíticos:</strong> Nos ajudam a entender o tráfego (somente com consentimento).</li>
            <li><strong>Marketing:</strong> Para anúncios personalizados (somente com consentimento).</li>
          </ul>
          <p>Você pode alterar suas preferências a qualquer momento através do banner de cookies.</p>

          <h2>5. Seus Direitos (LGPD Art. 18)</h2>
          <ul>
            <li><strong>Acesso:</strong> Solicitar quais dados temos sobre você.</li>
            <li><strong>Correção:</strong> Corrigir dados incompletos ou incorretos.</li>
            <li><strong>Exclusão:</strong> Solicitar a remoção dos seus dados.</li>
            <li><strong>Revogação de Consentimento:</strong> Cancelar sua assinatura ou preferências de cookie a qualquer momento.</li>
            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado.</li>
          </ul>

          <h2>6. Retenção de Dados</h2>
          <p>
            Dados de e-mail são mantidos enquanto você permanecer inscrito. Após o cancelamento, são excluídos em até 30 dias.
            Dados de cookies são armazenados localmente e expiram automaticamente.
          </p>

          <h2>7. Contato</h2>
          <p>
            Para exercer seus direitos ou tirar dúvidas, entre em contato pelo e-mail:{' '}
            <a href="mailto:privacidade@horizonintel.ai" className="cookie-link">privacidade@horizonintel.ai</a>
          </p>
        </div>

        <div className="legal-footer-links">
          <Link to="/termos" className="cookie-link">Termos de Uso</Link>
          <Link to="/" className="cookie-link">← Voltar ao Portal</Link>
        </div>
      </div>
    </div>
  )
}
