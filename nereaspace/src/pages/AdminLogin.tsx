import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useAdminAuth } from '../context/AdminAuth'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const loginAction = useAction(api.auth.login)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginAction({ password })
      if (res.ok) {
        login()
        navigate('/admin')
      } else {
        setError('Contraseña incorrecta.')
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Panel de administración</h1>
        <div className={styles.field}>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.btn} disabled={loading}>
          {loading ? 'Verificando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
