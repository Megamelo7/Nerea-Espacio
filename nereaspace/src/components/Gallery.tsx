import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import ArtworkCard from './ArtworkCard'
import styles from './Gallery.module.css'

type Filter = 'all' | 'available' | 'sold'

export default function Gallery() {
  const [filter, setFilter] = useState<Filter>('all')
  const artworks = useQuery(api.artworks.list)
  const seed = useMutation(api.artworks.seed)

  useEffect(() => {
    seed()
  }, [seed])

  const filtered = (artworks ?? []).filter((a) => {
    if (filter === 'available') return a.available
    if (filter === 'sold') return !a.available
    return true
  })

  return (
    <section id="galeria" className={styles.section}>
      <p className="section-eyebrow">Obras</p>
      <h2 className="section-title">Galería</h2>
      <div className="section-line" />

      <div className={styles.header}>
        <p className={styles.intro}>
          Cada cuadro es único y viene firmado. Se envía a todo el país con
          embalaje protegido. ¿Te enamoras de alguno? Escribime.
        </p>
        <div className={styles.filters}>
          {(['all', 'available', 'sold'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todas' : f === 'available' ? 'Disponibles' : 'Vendidas'}
            </button>
          ))}
        </div>
      </div>

      {artworks === undefined ? (
        <p className={styles.empty}>Cargando obras…</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork._id} artwork={artwork} />
          ))}
        </div>
      )}

      {artworks !== undefined && filtered.length === 0 && (
        <p className={styles.empty}>No hay obras en esta categoría por ahora.</p>
      )}
    </section>
  )
}
