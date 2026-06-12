import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import ImageUploader from './ImageUploader'
import styles from './ArtworkEditor.module.css'

interface Props {
  onClose: () => void
}

const DEFAULTS = {
  title: '',
  technique: '',
  dimensions: '',
  year: new Date().getFullYear(),
  price: 0,
  available: true,
  description: '',
}

export default function NewArtworkForm({ onClose }: Props) {
  const [form, setForm] = useState(DEFAULTS)
  const [storageId, setStorageId] = useState<Id<'_storage'> | null>(null)
  const [saving, setSaving] = useState(false)
  const create = useMutation(api.artworks.create)

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? Number(value)
            : value,
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    await create({
      ...form,
      colorPalette: ['#f0ece8', '#d4c4b4', '#c8b4a0', '#b8a090'],
      storageId: storageId ?? undefined,
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Nueva obra</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.cols}>
            <div className={styles.col}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Título</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Técnica</label>
                <input
                  name="technique"
                  value={form.technique}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Dimensiones</label>
                <input
                  name="dimensions"
                  value={form.dimensions}
                  onChange={handleChange}
                  placeholder="40×50 cm"
                  required
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Año</label>
                  <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>Precio (ARS)</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  name="available"
                  checked={form.available}
                  onChange={handleChange}
                />
                Disponible para venta
              </label>
            </div>

            <div className={styles.col}>
              <p className={styles.fieldLabel}>Imagen</p>
              <ImageUploader
                currentUrl={null}
                onUploaded={(id) => setStorageId(id)}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <div />
            <div className={styles.rightActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? 'Guardando…' : 'Crear obra'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
