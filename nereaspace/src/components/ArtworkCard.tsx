import { useState } from 'react'
import { Doc } from '../../convex/_generated/dataModel'
import OrderModal from './OrderModal'
import styles from './ArtworkCard.module.css'

type ArtworkWithUrl = Doc<'artworks'> & { imageUrl: string | null }

interface Props {
  artwork: ArtworkWithUrl
}

function ArtworkPlaceholder({ colors, seed }: { colors: string[]; seed: number }) {
  const [c1, c2, c3, c4] = colors
  const s = seed * 137

  return (
    <svg viewBox="0 0 320 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="320" height="400" fill={c1} />
      <ellipse cx={100 + (s % 80)} cy={180 + (s % 60)} rx={80 + (s % 30)} ry={100 + (s % 40)} fill={c2} opacity="0.55" />
      <ellipse cx={200 - (s % 60)} cy={230 + (s % 50)} rx={70 + (s % 25)} ry={85 + (s % 35)} fill={c3} opacity="0.45" />
      <circle cx={160 + (s % 40) - 20} cy={140 + (s % 50)} r={45 + (s % 20)} fill={c4} opacity="0.6" />
      <rect x="0" y="340" width="320" height="60" fill={c2} opacity="0.2" />
    </svg>
  )
}

export default function ArtworkCard({ artwork }: Props) {
  const [showOrder, setShowOrder] = useState(false)

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(artwork.price)

  const numericSeed = parseInt(artwork._id.slice(-4), 16)

  return (
    <>
      <article className={styles.card}>
        <div className={styles.imgWrap}>
          {artwork.imageUrl ? (
            <img src={artwork.imageUrl} alt={artwork.title} className={styles.img} />
          ) : (
            <ArtworkPlaceholder colors={artwork.colorPalette} seed={numericSeed} />
          )}
          {!artwork.available && <div className={styles.soldBadge}>Vendida</div>}
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{artwork.title}</h3>
          <p className={styles.meta}>
            {artwork.technique} · {artwork.dimensions} · {artwork.year}
          </p>
          <p className={styles.description}>{artwork.description}</p>
          <div className={styles.footer}>
            <span className={`${styles.price} ${!artwork.available ? styles.priceUnavailable : ''}`}>
              {artwork.available ? formattedPrice : 'Vendida'}
            </span>
            {artwork.available && (
              <button className={styles.inquireBtn} onClick={() => setShowOrder(true)}>
                Consultar
              </button>
            )}
          </div>
        </div>
      </article>

      {showOrder && (
        <OrderModal artwork={artwork} onClose={() => setShowOrder(false)} />
      )}
    </>
  )
}
