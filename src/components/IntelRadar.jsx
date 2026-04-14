import React, { useState, useEffect, useRef } from 'react'

// Coordenadas SVG (viewBox 0 0 1000 500) aproximadas por região de conflito
const ZONES = [
  { id: 'ukraine',  x: 530, y: 155, label: 'Leste Europeu',       cat: 'Leste Europeu',  flag: '🛰️', color: '#0ea5e9' },
  { id: 'gaza',     x: 558, y: 215, label: 'Gaza / Oriente Médio',cat: 'Oriente Médio',  flag: '🌍', color: '#f59e0b' },
  { id: 'taiwan',   x: 800, y: 215, label: 'Ásia-Pacífico',       cat: 'Ásia-Pacífico',  flag: '🇨🇳', color: '#0ea5e9' },
  { id: 'sahel',    x: 475, y: 265, label: 'Sahel / África',      cat: 'África',          flag: '🌎', color: '#f59e0b' },
  { id: 'redsea',   x: 565, y: 248, label: 'Mar Vermelho',        cat: 'Oriente Médio',  flag: '⚓', color: '#ef4444' },
  { id: 'korea',    x: 810, y: 185, label: 'Coreia do Norte',     cat: 'Ásia-Pacífico',  flag: '⚡', color: '#ef4444' },
]

// Contador de artigos por categoria — exibido no tooltip
const CAT_COUNTS = {}

export default function IntelRadar({ onFilter, newsData = [] }) {
  const [hovered, setHovered] = useState(null)
  const [active,  setActive]  = useState(null)
  const [sweepAngle, setSweepAngle] = useState(0)
  const [blip, setBlip] = useState(null)         // zona que recebeu "blip" do sweep
  const rafRef = useRef(null)
  const lastTs  = useRef(null)

  // Sweep animation via requestAnimationFrame
  useEffect(() => {
    const SPEED = 30 // graus/segundo
    const tick = (ts) => {
      if (lastTs.current !== null) {
        const dt = (ts - lastTs.current) / 1000
        setSweepAngle(prev => {
          const next = (prev + SPEED * dt) % 360
          // Detectar quando o sweep passa por uma zona → blip
          ZONES.forEach(z => {
            // Ângulo da zona em relação ao centro (500, 250)
            const dx = z.x - 500
            const dy = z.y - 250
            const zoneAngle = ((Math.atan2(dy, dx) * 180 / Math.PI) + 360) % 360
            const diff = Math.abs(((next - zoneAngle) + 360) % 360)
            if (diff < SPEED * dt * 2 + 1) {
              setBlip(z.id)
              setTimeout(() => setBlip(bb => bb === z.id ? null : bb), 800)
            }
          })
          return next
        })
      }
      lastTs.current = ts
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Contar artigos por categoria
  newsData.forEach(a => {
    if (a?.category) CAT_COUNTS[a.category] = (CAT_COUNTS[a.category] || 0) + 1
  })

  const handleClick = (zone) => {
    const next = active === zone.id ? null : zone.id
    setActive(next)
    if (onFilter) onFilter(next ? zone.cat : 'Todas')
  }

  // Converte ângulo em coordenada XY para a linha de sweep (do centro para a borda)
  const sweepRad  = (sweepAngle - 90) * Math.PI / 180
  const sweepEndX = 500 + 240 * Math.cos(sweepRad)
  const sweepEndY = 250 + 240 * Math.sin(sweepRad)

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
          <defs>
            <radialGradient id="radarBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="rgba(14,165,233,0.06)" />
              <stop offset="100%" stopColor="rgba(5,6,8,0)" />
            </radialGradient>

            {/* Sweep gradient — cone de luz */}
            <radialGradient id="sweepGrad" cx="0%" cy="50%" r="100%" gradientUnits="userSpaceOnUse"
              x1="500" y1="250" x2={sweepEndX} y2={sweepEndY}
            >
              <stop offset="0%"   stopColor="rgba(14,165,233,0.18)" />
              <stop offset="100%" stopColor="rgba(14,165,233,0)" />
            </radialGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="blipGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
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
          <path d="M80,80 L200,70 L220,130 L180,200 L120,220 L80,180 Z"    fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <path d="M160,240 L220,230 L240,340 L180,380 L140,320 Z"          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <path d="M440,80 L560,75 L570,150 L520,170 L450,155 Z"            fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <path d="M450,185 L540,180 L570,310 L500,360 L440,310 Z"          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <path d="M560,75 L860,80 L870,240 L760,260 L650,220 L575,210 L565,155 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <path d="M760,310 L870,300 L880,380 L790,390 Z"                   fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

          {/* Radar rings */}
          <circle cx="500" cy="250" r="240" fill="none" stroke="rgba(14,165,233,0.1)"  strokeWidth="1" />
          <circle cx="500" cy="250" r="160" fill="none" stroke="rgba(14,165,233,0.08)" strokeWidth="1" />
          <circle cx="500" cy="250" r="80"  fill="none" stroke="rgba(14,165,233,0.06)" strokeWidth="1" />

          {/* ── Sweep line + cone ── */}
          {/* Cone (sector) usando clip para limitar ao raio 240 */}
          <g opacity="0.9">
            {/* Linha de sweep principal */}
            <line
              x1="500" y1="250"
              x2={sweepEndX} y2={sweepEndY}
              stroke="rgba(14,165,233,0.8)" strokeWidth="1.5"
              filter="url(#glow)"
            />
            {/* Trail — cone de luz degradê seguindo a linha */}
            {[30, 25, 20, 15, 10].map((deg, i) => {
              const trailAngle = ((sweepAngle - deg - 90) * Math.PI / 180)
              const tx = 500 + 240 * Math.cos(trailAngle)
              const ty = 250 + 240 * Math.sin(trailAngle)
              return (
                <line key={i}
                  x1="500" y1="250" x2={tx} y2={ty}
                  stroke={`rgba(14,165,233,${0.04 + i * 0.02})`}
                  strokeWidth={1.5}
                />
              )
            })}
          </g>

          {/* Conflict zone markers */}
          {ZONES.map(zone => {
            const isActive  = active === zone.id
            const isBlip    = blip   === zone.id
            const isHovered = hovered === zone.id

            return (
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
                  <animate attributeName="r"       values="10;22;10" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
                </circle>

                {/* Blip flash quando o sweep passa */}
                {isBlip && (
                  <circle cx={zone.x} cy={zone.y} r="20" fill={zone.color} opacity="0.35" filter="url(#blipGlow)">
                    <animate attributeName="r"       values="8;28" dur="0.7s" fill="freeze" />
                    <animate attributeName="opacity" values="0.4;0"  dur="0.7s" fill="freeze" />
                  </circle>
                )}

                {/* Core dot */}
                <circle
                  cx={zone.x} cy={zone.y} r={isActive ? 9 : isHovered ? 8 : 6}
                  fill={isActive ? zone.color : isBlip ? 'white' : 'rgba(14,165,233,0.8)'}
                  stroke={zone.color}
                  strokeWidth={isActive ? 3 : 2}
                  filter="url(#glow)"
                  style={{ transition: 'r 0.2s, stroke-width 0.2s' }}
                />

                {/* Ring de seleção quando zona está ativa */}
                {isActive && (
                  <circle cx={zone.x} cy={zone.y} r="16" fill="none"
                    stroke={zone.color} strokeWidth="2" opacity="0.8"
                    strokeDasharray="4 3"
                  >
                    <animateTransform attributeName="transform" type="rotate"
                      from={`0 ${zone.x} ${zone.y}`} to={`360 ${zone.x} ${zone.y}`}
                      dur="4s" repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={zone.x + 12} y={zone.y - 28} width={150} height={36}
                      rx="5" fill="rgba(5,6,8,0.95)" stroke={zone.color} strokeWidth="1"
                    />
                    <text x={zone.x + 20} y={zone.y - 12} fill={zone.color}
                      fontSize="11" fontFamily="Inter, sans-serif" fontWeight="700">
                      {zone.flag} {zone.label}
                    </text>
                    <text x={zone.x + 20} y={zone.y + 2} fill="rgba(148,163,184,0.9)"
                      fontSize="9" fontFamily="Inter, sans-serif">
                      {CAT_COUNTS[zone.cat] || 0} relatórios ativos
                    </text>
                  </g>
                )}
              </g>
            )
          })}
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

          {active && (
            <button
              className="radar-legend-item"
              onClick={() => { setActive(null); if (onFilter) onFilter('Todas') }}
              aria-label="Limpar filtro de região"
              style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: '10px' }}
            >
              ✕ Limpar filtro
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
