import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Doc } from '../../convex/_generated/dataModel'
import styles from './OrderModal.module.css'

type ArtworkWithImages = Doc<'artworks'> & { imageUrl: string | null; imageUrls: (string | null)[] }

interface Props {
  artwork: ArtworkWithImages
  onClose: () => void
}

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

const EMPTY: FormData = { name: '', email: '', phone: '', message: '' }

export default function OrderModal({ artwork, onClose }: Props) {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const createOrder = useMutation(api.orders.create)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await createOrder({
        artworkId: artwork._id,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        message: form.message || undefined,
      })
      setOrderNumber(res.orderNumber)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al registrar el pedido. Intentá de nuevo.')
      setStatus('error')
    }
  }

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(artwork.price)

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>

        {status === 'done' && orderNumber !== null ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>¡Pedido registrado!</h2>
            <div className={styles.orderBadge}>
              Pedido <strong>#{String(orderNumber).padStart(4, '0')}</strong>
            </div>
            <p className={styles.successText}>
              Recibí tu consulta por <em>{artwork.title}</em>.<br />
              Te contacto a la brevedad por email o WhatsApp.
            </p>
            <div className={styles.successDetails}>
              <span>{form.name}</span>
              <span>{form.email}</span>
              <span>{form.phone}</span>
            </div>
            <button className={styles.doneBtn} onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            <div className={styles.artworkInfo}>
              {artwork.imageUrl ? (
                <img src={artwork.imageUrl} alt={artwork.title} className={styles.artworkImg} />
              ) : (
                <div className={styles.artworkColor} style={{ background: artwork.colorPalette[0] }} />
              )}
              <div>
                <h3 className={styles.artworkTitle}>{artwork.title}</h3>
                <p className={styles.artworkMeta}>{artwork.technique} · {artwork.dimensions}</p>
                <p className={styles.artworkPrice}>{formattedPrice}</p>
              </div>
            </div>

            <h2 className={styles.formTitle}>Datos de contacto</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="order-name">Nombre y apellido</label>
                <input
                  id="order-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="María García"
                  required
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="order-email">Email</label>
                  <input
                    id="order-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="maria@email.com"
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="order-phone">Teléfono / WhatsApp</label>
                  <input
                    id="order-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+54 9 11 1234-5678"
                    required
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="order-message">Mensaje (opcional)</label>
                <textarea
                  id="order-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="¿Alguna consulta sobre la obra, envío o pago?"
                  rows={3}
                />
              </div>
              {status === 'error' && (
                <p style={{ color: '#b94040', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{errorMsg}</p>
              )}
              <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                {status === 'sending' ? 'Registrando pedido…' : 'Confirmar pedido'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
