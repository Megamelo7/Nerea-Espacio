import styles from './About.module.css'

const tags = ['Acrílico', 'Óleo', 'Técnica mixta', 'Encargos', 'Envíos a todo el país']

export default function About() {
  return (
    <section id="historia" className={styles.section}>
      <div className={styles.imgCol}>
        <div className={styles.imgPlaceholder} aria-hidden="true">
          {/* Reemplazá con: <img src="/foto-nerea.jpg" alt="Nerea en su taller" /> */}
          <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="#ddd0c4" />
            <ellipse cx="200" cy="180" rx="90" ry="100" fill="#c4b0a0" opacity="0.6" />
            <ellipse cx="200" cy="340" rx="130" ry="90" fill="#b8a090" opacity="0.4" />
            <circle cx="200" cy="160" r="55" fill="#e0c8b4" opacity="0.7" />
          </svg>
        </div>
        <blockquote className={styles.quote}>
          "Pinto para recordar que la belleza ya está aquí, en lo cotidiano y sencillo."
        </blockquote>
      </div>

      <div className={styles.textCol}>
        <p className="section-eyebrow">La artista</p>
        <h2 className="section-title">Mi historia</h2>
        <div className="section-line" />

        <p>
          Soy Nerea, artista plástica nacida y criada en Buenos Aires.
          Desde chica el color fue mi idioma: mientras otros escribían en sus
          diarios, yo dibujaba lo que sentía.
        </p>
        <p>
          Me inspiran los momentos simples: la tarde que entra por la ventana,
          el jardín después de la lluvia, la quietud de un lago al amanecer.
          Busco que cada cuadro traiga esa misma paz al espacio donde viva.
        </p>
        <p>
          Cada obra es única, pintada a mano y firmada. Hago envíos a todo el
          país y también acepto encargos personalizados.
        </p>

        <div className={styles.tags}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
