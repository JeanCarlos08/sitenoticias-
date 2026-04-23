import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="legal-container">
      <header className="legal-header">
        <Link to="/" className="legal-back">← VOLTAR AO COMANDO</Link>
        <h1 className="legal-title">SOBRE O HORIZON INTEL</h1>
        <p className="legal-subtitle">A vanguarda da inteligência geopolítica movida por IA</p>
      </header>

      <div className="legal-content">
        <section>
          <h2>Nossa Missão</h2>
          <p>
            O <strong>Horizon Intel</strong> nasceu da necessidade de democratizar o acesso a informações estratégicas de alta qualidade em um mundo saturado de ruído e desinformação. Nossa missão é fornecer um monitoramento contínuo, imparcial e tecnicamente profundo dos principais teatros de operações globais.
          </p>
        </section>

        <section>
          <div className="analysis-block" style={{ borderLeftColor: 'var(--cyan)' }}>
            <div className="analysis-title">🔬 METODOLOGIA TÁTICA</div>
            <p className="analysis-text">
              Diferente dos portais de notícias convencionais, nosso sistema opera através de um motor de IA customizado que processa simultaneamente dados de satélite, feeds de OSINT (Open Source Intelligence), relatórios governamentais e agências internacionais (como ISW, Reuters e Janes).
            </p>
          </div>
        </section>

        <section>
          <h2>Pilares de Inteligência</h2>
          <ul>
            <li><strong>Velocidade de Resposta:</strong> Atualizações constantes conforme os sinais são detectados no campo.</li>
            <li><strong>Atribuição Rígida:</strong> Todas as informações são cruzadas com fontes reais e auditáveis.</li>
            <li><strong>Análise Estratégica:</strong> Não apenas relatamos "o quê", mas explicamos o "porquê" e o impacto futuro.</li>
          </ul>
        </section>

        <section>
          <h2>Tecnologia</h2>
          <p>
            Utilizamos modelos de linguagem de última geração (SOTA) treinados especificamente para o domínio de defesa, geopolítica e economia. Nosso algoritmo classifica cada evento por Nível de Ameaça (Threat Level) e Score de Confiança, garantindo que o leitor saiba exatamente o peso de cada informação.
          </p>
        </section>

        <section style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link to="/contato" className="btn-war" style={{ display: 'inline-block', textDecoration: 'none' }}>
            ENTRE EM CONTATO COM A REDAÇÃO →
          </Link>
        </section>
      </div>

      <footer className="legal-footer">
        © {new Date().getFullYear()} HORIZON INTEL — INTEL_OPS DIVISION
      </footer>
    </div>
  )
}
