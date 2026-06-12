# Nerea Space 🎨

Sitio web personal para venta de cuadros originales.
Construido con **Vite + React + TypeScript**.

## Estructura del proyecto

```
nereaspace/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx          ← punto de entrada
│   ├── App.tsx           ← componente raíz
│   ├── types/index.ts    ← tipos TypeScript
│   ├── data/artworks.ts  ← datos de las obras (editá acá)
│   ├── styles/global.css ← variables CSS y reset
│   └── components/
│       ├── Navbar.tsx / .module.css
│       ├── Hero.tsx / .module.css
│       ├── Gallery.tsx / .module.css
│       ├── ArtworkCard.tsx / .module.css
│       ├── About.tsx / .module.css
│       ├── Contact.tsx / .module.css
│       └── Footer.tsx / .module.css
```

## Primeros pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor local
npm run dev
# → abre http://localhost:5173

# 3. Construir para producción
npm run build
```

## Personalizar el contenido

### Cambiar las obras
Editá `src/data/artworks.ts` — cada objeto `Artwork` tiene:
- `title`, `technique`, `dimensions`, `year`, `price`
- `available`: `true` / `false`
- `colorPalette`: 4 colores para el placeholder SVG

### Agregar fotos reales
1. Guardá tus fotos en `public/images/`
2. En `ArtworkCard.tsx`, reemplazá el componente `<ArtworkPlaceholder>` por:
   ```tsx
   <img src={`/images/${artwork.id}.jpg`} alt={artwork.title} />
   ```

### Activar el formulario de contacto
1. Registrate en [formspree.io](https://formspree.io)
2. Creá un form y copiá tu endpoint
3. En `Contact.tsx`, descomentá el bloque `fetch` y reemplazá `TU_ID`

## Deploy en GitHub Pages

```bash
npm run build
```
Subí la carpeta `dist/` a la rama `gh-pages`, o usá la acción de GitHub Actions.
El archivo `vite.config.ts` ya tiene `base: '/nereaspace/'` configurado.
