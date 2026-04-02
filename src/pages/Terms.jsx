import React from 'react'
import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="legal-header">
          <Link to="/" className="legal-back" aria-label="Voltar à página inicial">← RETORNAR À BASE</Link>
          <div className="hero-eyebrow">⚖️ FRAMEWORK LEGAL</div>
          <h1 className="legal-title">Termos de Uso</h1>
          <p className="legal-date">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="legal-body">
          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar o <strong>HORIZON INTEL</strong>, você concorda com estes Termos de Uso. Se não concordar
            com qualquer parte, por favor não utilize o portal.
          </p>

          <h2>2. Natureza do Conteúdo</h2>
          <p>
            O HORIZON INTEL é um portal de <strong>informações geopolíticas e de defesa</strong> processadas por
            inteligência artificial. Todo o conteúdo é gerado automaticamente a partir de fontes públicas (RSS feeds,
            APIs de notícias, Reddit OSINT). <strong>Não garantimos a exatidão, completude ou atualidade das informações.</strong>
          </p>

          <h2>3. Isenção de Responsabilidade por IA</h2>
          <p>
            O conteúdo é gerado por modelos de linguagem (LLM). Os relatórios são para fins informativos e de 
            análise estratégica únicamente. O HORIZON INTEL não é responsável por:
          </p>
          <ul>
            <li>Decisões tomadas com base nas informações publicadas.</li>
            <li>Imprecisões nos relatórios gerados por IA.</li>
            <li>Indisponibilidade temporária do portal por manutenção ou falhas de API.</li>
          </ul>

          <h2>4. Uso Aceitável</h2>
          <p>Ao usar o portal, você concorda em NÃO:</p>
          <ul>
            <li>Reproduzir ou redistribuir o conteúdo gerado sem atribuição.</li>
            <li>Usar o portal para fins ilegais ou que violem direitos de terceiros.</li>
            <li>Tentar acessar sistemas internos ou fazer scraping automatizado.</li>
          </ul>

          <h2>5. Propriedade Intelectual</h2>
          <p>
            O design, a marca "HORIZON INTEL", os componentes de software e a curadoria algorítmica são
            propriedade do portal. O conteúdo bruto das notícias pertence às suas fontes originais,
            devidamente creditadas em cada relatório.
          </p>

          <h2>6. Newsletter e Comunicações</h2>
          <p>
            Ao se inscrever na Newsletter, você concorda em receber o <strong>Relatório Warzone</strong>.
            Você pode cancelar sua inscrição a qualquer momento pelo link de descadastramento no rodapé
            de cada e-mail.
          </p>

          <h2>7. Modificações</h2>
          <p>
            Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas
            serão comunicadas com 7 dias de antecedência através do portal.
          </p>

          <h2>8. Lei Aplicável</h2>
          <p>
            Estes Termos são regidos pelas leis da <strong>República Federativa do Brasil</strong>, ficando eleito
            o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.
          </p>
        </div>

        <div className="legal-footer-links">
          <Link to="/privacidade" className="cookie-link">Política de Privacidade</Link>
          <Link to="/" className="cookie-link">← Voltar ao Portal</Link>
        </div>
      </div>
    </div>
  )
}
