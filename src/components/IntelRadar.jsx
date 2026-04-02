import React, { useState } from 'react'

// Coordenadas SVG (viewBox 0 0 1000 500) aproximadas por região de conflito
const ZONES = [
  { id: 'ukraine',     x: 530, y: 155, label: 'Leste Europeu',  cat: 'Leste Europeu',  flag: '🛰️', color: '#0ea5e9' },
  { id: 'gaza',        x: 558, y: 215, label: 'Gaza / Oriente Médio', cat: 'Oriente Médio', flag: '🌍', color: '#f59e0b' },
  { id: 'taiwan',      x: 800, y: 215, label: 'Ásia-Pacífico',  cat: 'Ásia-Pacífico',  flag: '🇨🇳', color: '#0ea5e9' },
  { id: 'sahel',       x: 475, y: 265, label: 'Sahel / África', cat: 'África',          flag: '🌎', color: '#f59e0b' },
  { id: 'redsea',      x: 565, y: 248, label: 'Mar Vermelho',   cat: 'Oriente Médio',  flag: '⚓', color: '#ef4444' },
  { id: 'korea',       x: 810, y: 185, label: 'Coreia do Norte',cat: 'Ásia-Pacífico',  flag: '⚡', color: '#ef4444' },
]

export default function IntelRadar({ onFilter }) {
  const [hovered, setHovered] = useState(null)
  const [active,  setActive]  = useState(null)

  const handleClick = (zone) => {
    const next = active === zone.id ? null : zone.id
    setActive(next)
    if (onFilter) onFilter(next ? zone.cat : 'Todas')
  }

  return (
    <section className="radar-section" aria-label="Mapa global de zonas de conflito">
      <div className="section-label">🗺️ INTELLIGENCE RADAR — ZONAS ATIVAS</div>
      <div className="radar-wrapper">
        {/* Scanline overlay */}
        <div className="radar-scanline" aria-hidden="true" />

        <svg
          viewBox="0 0 1000 500"
          className="radar-svg"
          role="img"
          aria-label="Mapa SVG com zonas de conflito globais"
        >
          {/* Simplified world silhouette paths */}
          <defs>
            <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(14,165,233,0.06)" />
              <stop offset="100%" stopColor="rgba(5,6,8,0)" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="1000" height="500" fill="url(#radarBg)" rx="12" />

          {/* Grid lines */}
          {[100,200,300,400].map(y => (
            <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}
          {[100,200,300,400,500,600,700,800,900].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}

          {/* Continents (simplified shapes) */}
          {/* North America */}
          <path d="M80,80 L200,70 L220,130 L180,200 L120,220 L80,180 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* South America */}
          <path d="M160,240 L220,230 L240,340 L180,380 L140,320 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Europe */}
          <path d="M440,80 L560,75 L570,150 L520,170 L450,155 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Africa */}
          <path d="M450,185 L540,180 L570,310 L500,360 L440,310 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Asia */}
          <path d="M560,75 L860,80 L870,240 L760,260 L650,220 L575,210 L565,155 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Australia */}
          <path d="M760,310 L870,300 L880,380 L790,390 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Radar sweep animation */}
          <circle cx="500" cy="250" r="220" fill="none" stroke="rgba(14,165,233,0.08)" strokeWidth="1" />
          <circle cx="500" cy="250" r="140" fill="none" stroke="rgba(14,165,233,0.06)" strokeWidth="1" />
          <circle cx="500" cy="250" r="60"  fill="none" stroke="rgba(14,165,233,0.05)" strokeWidth="1" />

          {/* Conflict zone markers */}
          {ZONES.map(zone => (
            <g
              key={zone.id}
              onClick={() => handleClick(zone)}
              onMouseEnter={() => setHovered(zone.id)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`Zona de conflito: ${zone.label}`}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleClick(zone)}
            >
              {/* Pulse rings */}
              <circle cx={zone.x} cy={zone.y} r="18" fill="none" stroke={zone.color} strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Core dot */}
              <circle
                cx={zone.x} cy={zone.y} r="6"
                fill={active === zone.id ? zone.color : 'rgba(14,165,233,0.8)'}
                stroke={zone.color}
                strokeWidth="2"
                filter="url(#glow)"
              />
              {/* Tooltip on hover */}
              {hovered === zone.id && (
                <g>
                  <rect x={zone.x + 10} y={zone.y - 22} width="130" height="26" rx="4" fill="rgba(5,6,8,0.92)" stroke={zone.color} strokeWidth="1" />
                  <text x={zone.x + 18} y={zone.y - 4} fill={zone.color} fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700">
                    {zone.flag} {zone.label}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="radar-legend" aria-label="Legenda do radar">
          {ZONES.map(zone => (
            <button
              key={zone.id}
              className={`radar-legend-item ${active === zone.id ? 'active' : ''}`}
              onClick={() => handleClick(zone)}
              aria-pressed={active === zone.id}
              aria-label={`Filtrar por ${zone.label}`}
            >
              <span className="legend-dot" style={{ background: zone.color }} />
              {zone.flag} {zone.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
