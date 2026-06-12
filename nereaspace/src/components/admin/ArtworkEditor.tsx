import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Doc, Id } from '../../../convex/_generated/dataModel'
import ImageUploader from './ImageUploader'
import styles from './ArtworkEditor.module.css'

interface Props {
  artwork: Doc<'artworks'> & { imageUrl: string | null }
  onClose: () => void
}

export default function ArtworkEditor({ artwork, onClose }: Props) {
  const [form, setForm] = useState({
    title: artwork.title,
    technique: artwork.technique,
    dimensions: artwork.dimensions,
    year: artwork.year,
    price: artwork.price,
    available: artwork.available,
    description: artwork.description,
  })
  const [storageId, setStorageId] = useState<Id<'_storage'> | null>(
    artwork.storageId ?? null,
  )
  const [saving, setSaving] = useState(false)
  const update = useMutation(api.artworks.update)
  const remove = useMutation(api.artworks.remove)

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
    await update({
      id: artwork._id,
      ...form,
      storageId: storageId ?? undefined,
    })
    setSaving(false)
    onClose()
  }

  async function handleDelete() {
    if (
      !confirm(
        `¿Eliminar "${artwork.title}"? Esta acción no se puede deshacer.`,
      )
    )
      return
    await remove({ id: artwork._id })
    onClose()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Editar obra</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.cols}>
            <div className={styles.col}>
              <Field label="Título">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field label="Técnica">
                <input
                  name="technique"
                  value={form.technique}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field label="Dimensiones">
                <input
                  name="dimensions"
                  value={form.dimensions}
                  onChange={handleChange}
                  required
                />
              </Field>
              <div className={styles.row}>
                <Field label="Año">
                  <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field label="Precio (ARS)">
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </Field>
              </div>
              <Field label="Descripción">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </Field>
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
                currentUrl={artwork.imageUrl}
                onUploaded={(id) => setStorageId(id)}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={handleDelete}
            >
              Eliminar obra
            </button>
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
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}
