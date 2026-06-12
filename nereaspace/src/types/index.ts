export interface Artwork {
  id: number
  title: string
  technique: string
  dimensions: string
  year: number
  price: number
  available: boolean
  description: string
  colorPalette: string[] // colores SVG placeholder
}

export interface ContactFormData {
  name: string
  email: string
  subject: 'compra' | 'encargo' | 'info' | ''
  message: string
}

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export interface NavItem {
  label: string
  href: string
}
