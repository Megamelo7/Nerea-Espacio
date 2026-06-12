import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Cuadros originales · Buenos Aires</p>
      <h1 className={styles.title}>
        Cada trazo guarda{' '}
        <em>un momento</em>{' '}
        que el tiempo no puede borrar
      </h1>
      <p className={styles.sub}>
        Pinturas en acrílico y óleo que nacen de la calma,
        para llenar tus espacios de calidez y presencia.
      </p>
      <a href="#galeria" className={styles.btn}>
        Ver la galería
      </a>
      <div className={styles.scrollHint}>
        <span>Explorar</span>
      </div>
    </section>
  )
}
