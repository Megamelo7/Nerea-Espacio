import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { ContactFormData, FormStatus } from '../types'
import styles from './Contact.module.css'

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM)
  const [status, setStatus] = useState<FormStatus>('idle')
  const sendMessage = useMutation(api.messages.send)

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendMessage({
        name: form.name,
        email: form.email,
        subject: form.subject || 'info',
        message: form.message,
      })
      setStatus('success')
      setForm(INITIAL_FORM)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contacto" className={styles.section}>
      <p className="section-eyebrow">Hablemos</p>
      <h2 className="section-title">Contacto</h2>
      <div className="section-line" />

      <div className={styles.wrap}>
        <div className={styles.info}>
          <p className={styles.infoText}>
            ¿Te enamoraste de una obra? ¿Querés encargar algo especial?
            Escribime y te respondo a la brevedad.
          </p>

          <div className={styles.detail}>
            <strong>Instagram</strong>
            <a
              href="https://www.instagram.com/nerea_espacio/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @nerea_espacio
            </a>
          </div>
          <div className={styles.detail}>
            <strong>WhatsApp</strong>
            <a
              href="https://wa.me/5491160461919"
              target="_blank"
              rel="noopener noreferrer"
            >
              +54 9 11 6046-1919
            </a>
          </div>
          <div className={styles.detail}>
            <strong>Ubicación</strong>
            <span>Buenos Aires, Argentina</span>
          </div>
        </div>

        {status === 'success' ? (
          <div className={styles.success}>
            <p>¡Gracias por escribirme!</p>
            <p>Te respondo en menos de 48 horas. 🌿</p>
            <button
              className={styles.resetBtn}
              onClick={() => setStatus('idle')}
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="name">Tu nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="María García"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="maria@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="subject">¿En qué te puedo ayudar?</label>
              <select
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              >
                <option value="">Seleccioná una opción</option>
                <option value="compra">Comprar una obra de la galería</option>
                <option value="encargo">Encargar un cuadro personalizado</option>
                <option value="info">Consulta general</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                placeholder="Contame qué tenés en mente..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <p className={styles.note}>* Te respondo en menos de 48 horas.</p>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
            </button>

            {status === 'error' && (
              <p className={styles.errorMsg}>
                Algo salió mal. Por favor intentá de nuevo o escribime directo
                a nerea@nereaspace.com.ar
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
