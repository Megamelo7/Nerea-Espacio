import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import styles from './MultiImageUploader.module.css'

interface UploadedImage {
  storageId: Id<'_storage'>
  previewUrl: string
}

interface Props {
  existing: { storageId: Id<'_storage'>; url: string | null }[]
  onChange: (ids: Id<'_storage'>[]) => void
}

export default function MultiImageUploader({ existing, onChange }: Props) {
  const [newImages, setNewImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)
  const removeFile = useMutation(api.storage.removeFile)

  const allImages = [
    ...existing.map((e) => ({ storageId: e.storageId, url: e.url, isExisting: true })),
    ...newImages.map((n) => ({ storageId: n.storageId, url: n.previewUrl, isExisting: false })),
  ]

  function emitChange(imgs: typeof allImages) {
    onChange(imgs.map((i) => i.storageId))
  }

  async function handleFiles(files: FileList) {
    setUploading(true)
    try {
      const added: UploadedImage[] = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        const localUrl = URL.createObjectURL(file)
        const uploadUrl = await generateUploadUrl()
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        })
        const { storageId } = (await res.json()) as { storageId: Id<'_storage'> }
        added.push({ storageId, previewUrl: localUrl })
      }
      const updated = [...newImages, ...added]
      setNewImages(updated)
      emitChange([
        ...existing.map((e) => ({ storageId: e.storageId, url: e.url, isExisting: true })),
        ...updated.map((n) => ({ storageId: n.storageId, url: n.previewUrl, isExisting: false })),
      ])
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove(index: number) {
    const img = allImages[index]
    await removeFile({ storageId: img.storageId })
    if (img.isExisting) {
      const updated = existing.filter((_, i) => i !== index)
      emitChange([
        ...updated.map((e) => ({ storageId: e.storageId, url: e.url, isExisting: true })),
        ...newImages.map((n) => ({ storageId: n.storageId, url: n.previewUrl, isExisting: false })),
      ])
    } else {
      const ni = index - existing.length
      const updated = newImages.filter((_, i) => i !== ni)
      setNewImages(updated)
      emitChange([
        ...existing.map((e) => ({ storageId: e.storageId, url: e.url, isExisting: true })),
        ...updated.map((n) => ({ storageId: n.storageId, url: n.previewUrl, isExisting: false })),
      ])
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={styles.wrap}>
      {allImages.length > 0 && (
        <div className={styles.grid}>
          {allImages.map((img, i) => (
            <div key={img.storageId} className={styles.thumb}>
              {img.url && <img src={img.url} alt={`imagen ${i + 1}`} />}
              {i === 0 && <span className={styles.coverTag}>Portada</span>}
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => handleRemove(i)}
                aria-label="Eliminar imagen"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        className={`${styles.dropzone} ${uploading ? styles.uploading : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenInput}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <p className={styles.hint}>Subiendo…</p>
        ) : (
          <div className={styles.addContent}>
            <span className={styles.icon}>+</span>
            <p className={styles.hint}>
              {allImages.length === 0 ? 'Hacé clic para subir imágenes' : 'Agregar más imágenes'}
            </p>
            <p className={styles.sub}>Podés seleccionar varias a la vez</p>
          </div>
        )}
      </label>
    </div>
  )
}
