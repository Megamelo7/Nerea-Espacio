import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import styles from './ImageUploader.module.css'

interface Props {
  currentUrl: string | null
  onUploaded: (storageId: Id<'_storage'>) => void
}

export default function ImageUploader({ currentUrl, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      const { storageId } = (await res.json()) as { storageId: Id<'_storage'> }
      onUploaded(storageId)
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleFile(file)
  }

  return (
    <label
      className={`${styles.dropzone} ${uploading ? styles.uploading : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {uploading ? (
        <p className={styles.hint}>Subiendo imagen…</p>
      ) : currentUrl ? (
        <div className={styles.preview}>
          <img src={currentUrl} alt="preview" />
          <span className={styles.change}>Clic para cambiar la imagen</span>
        </div>
      ) : (
        <div className={styles.empty}>
          <span className={styles.icon}>↑</span>
          <p className={styles.hint}>Hacé clic para seleccionar una imagen</p>
          <p className={styles.sub}>o arrastrá el archivo aquí · JPG, PNG, WEBP</p>
        </div>
      )}
    </label>
  )
}
