import React from 'react'

export default function SocialShare({ article }) {
  if (!article) return null

  const text = encodeURIComponent(`🛡️ HORIZON INTEL | ${article.title}`)
  const url  = encodeURIComponent(window.location.href)

  const links = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: '💬',
      href: `https://wa.me/?text=${text}%20${url}`,
      color: '#25d366',
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: '✈️',
      href: `https://t.me/share/url?url=${url}&text=${text}`,
      color: '#2aabee',
    },
    {
      id: 'twitter',
      label: 'X / Twitter',
      icon: '✖',
      href: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      color: '#e7e9ea',
    },
  ]

  return (
    <div className="social-share" role="group" aria-label="Compartilhar notícia">
      <span className="social-share-label">📤 COMPARTILHAR:</span>
      <div className="social-share-buttons">
        {links.map(link => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-btn"
            style={{ '--social-color': link.color }}
            aria-label={`Compartilhar no ${link.label}`}
          >
            {link.icon} {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
