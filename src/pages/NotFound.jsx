import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found" role="main">
      <div className="not-found-inner">
        {/* Animated radar rings */}
        <div className="nf-radar" aria-hidden="true">
          <div className="nf-ring nf-ring-1" />
          <div className="nf-ring nf-ring-2" />
          <div className="nf-ring nf-ring-3" />
          <div className="nf-dot" />
        </div>

        <div className="nf-code">ERR_404</div>
        <h1 className="nf-title">🛰️ SINAL PERDIDO</h1>
        <p className="nf-sub">COORDENADAS INVÁLIDAS — SETOR NÃO IDENTIFICADO</p>
        <p className="nf-desc">
          A página que você tentou acessar não existe em nosso banco de dados de inteligência.
          Retorne à base para continuar o monitoramento.
        </p>

        <Link to="/" className="btn-war" aria-label="Retornar à página inicial">
          ← RETORNAR À BASE
        </Link>
      </div>
    </div>
  )
}
