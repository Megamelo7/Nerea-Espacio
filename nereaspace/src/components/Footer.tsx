import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <p>© {year} Nerea Espacio · Cuadros originales · Buenos Aires, Argentina</p>
      <div className={styles.socialLinks}>
        <a href="https://www.instagram.com/nerea_espacio/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <span>·</span>
        <a href="https://wa.me/5491160461919" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
      <Link to="/admin/login" className={styles.adminLink}>Admin</Link>
    </footer>
  )
}
