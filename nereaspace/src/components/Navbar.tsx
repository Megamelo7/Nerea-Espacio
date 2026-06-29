import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../data/artworks'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)

      const sections = document.querySelectorAll<HTMLElement>('section[id]')
      let current = ''
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id
      })
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <a href="#" className={styles.logo}>
        Nerea <span>Espacio</span>
      </a>
      <ul className={styles.links}>
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={activeSection === item.href.slice(1) ? styles.active : ''}
            >
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <Link to="/admin/login" className={styles.adminBtn}>Admin</Link>
        </li>
      </ul>
    </nav>
  )
}
