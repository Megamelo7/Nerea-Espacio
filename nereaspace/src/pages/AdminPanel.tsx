import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAdminAuth } from '../context/AdminAuth'
import ArtworkEditor from '../components/admin/ArtworkEditor'
import NewArtworkForm from '../components/admin/NewArtworkForm'
import styles from './AdminPanel.module.css'
import { Doc, Id } from '../../convex/_generated/dataModel'

type Tab = 'orders' | 'artworks'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

const STATUS_NEXT: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'completed',
  completed: 'completed',
  cancelled: 'cancelled',
}

export default function AdminPanel() {
  const { isAdmin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('orders')
  const artworks = useQuery(api.artworks.list)
  const orders = useQuery(api.orders.list)
  const updateStatus = useMutation(api.orders.updateStatus)
  type ArtworkWithImages = Doc<'artworks'> & { imageUrl: string | null; imageUrls: (string | null)[] }
  const [editing, setEditing] = useState<ArtworkWithImages | null>(null)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    if (!isAdmin) navigate('/admin/login')
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  function handleLogout() {
    logout()
    navigate('/')
  }

  const pendingCount = orders?.filter((o) => o.status === 'pending').length ?? 0

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Nerea Espacio · Admin</h1>
        <div className={styles.headerActions}>
          <a href="/" className={styles.siteLink}>Ver sitio →</a>
          <button className={styles.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'orders' ? styles.tabActive : ''}`}
          onClick={() => setTab('orders')}
        >
          Pedidos
          {pendingCount > 0 && <span className={styles.badge}>{pendingCount}</span>}
        </button>
        <button
          className={`${styles.tab} ${tab === 'artworks' ? styles.tabActive : ''}`}
          onClick={() => setTab('artworks')}
        >
          Obras
        </button>
      </div>

      <main className={styles.main}>
        {tab === 'orders' && (
          <>
            <div className={styles.topBar}>
              <h2 className={styles.sectionTitle}>
                Pedidos ({orders?.length ?? 0})
              </h2>
            </div>

            {orders?.length === 0 && (
              <p className={styles.empty}>Todavía no hay pedidos registrados.</p>
            )}

            <div className={styles.ordersList}>
              {orders?.map((order) => (
                <div key={order._id} className={`${styles.orderRow} ${styles[`status_${order.status}`]}`}>
                  <div className={styles.orderNumber}>
                    #{String(order.orderNumber).padStart(4, '0')}
                  </div>
                  <div className={styles.orderArtwork}>
                    <strong>{order.artworkTitle}</strong>
                    <span>$ {order.artworkPrice.toLocaleString('es-AR')}</span>
                  </div>
                  <div className={styles.orderCustomer}>
                    <strong>{order.customerName}</strong>
                    <a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a>
                    <a href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      {order.customerPhone}
                    </a>
                    {order.message && <p className={styles.orderMessage}>"{order.message}"</p>}
                  </div>
                  <div className={styles.orderStatus}>
                    <span className={`${styles.statusBadge} ${styles[`badge_${order.status}`]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        className={styles.advanceBtn}
                        onClick={() => updateStatus({ id: order._id, status: STATUS_NEXT[order.status] as any })}
                      >
                        {order.status === 'pending' ? 'Confirmar' : 'Completar'}
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button
                        className={styles.cancelBtn}
                        onClick={() => updateStatus({ id: order._id, status: 'cancelled' })}
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'artworks' && (
          <>
            <div className={styles.topBar}>
              <h2 className={styles.sectionTitle}>Obras ({artworks?.length ?? 0})</h2>
              <button className={styles.addBtn} onClick={() => { setShowNew(true); setEditing(null) }}>
                + Nueva obra
              </button>
            </div>

            {showNew && <NewArtworkForm onClose={() => setShowNew(false)} />}
            {editing && <ArtworkEditor artwork={editing} onClose={() => setEditing(null)} />}

            <div className={styles.grid}>
              {artworks?.map((artwork) => (
                <div key={artwork._id} className={styles.card}>
                  <div className={styles.cardImg} style={{ background: artwork.colorPalette[0] }}>
                    {artwork.imageUrl && <img src={artwork.imageUrl} alt={artwork.title} />}
                    {!artwork.available && <span className={styles.soldTag}>Vendida</span>}
                  </div>
                  <div className={styles.cardInfo}>
                    <strong>{artwork.title}</strong>
                    <span>{artwork.technique} · {artwork.year}</span>
                    <span>$ {artwork.price.toLocaleString('es-AR')}</span>
                  </div>
                  <button
                    className={styles.editBtn}
                    onClick={() => { setEditing(artwork); setShowNew(false) }}
                  >
                    Editar
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
