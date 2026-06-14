import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { QueryCtx } from './_generated/server'
import { Id } from './_generated/dataModel'

async function withImages(
  ctx: QueryCtx,
  artwork: { storageIds?: Id<'_storage'>[]; imageUrl?: string } & Record<string, unknown>,
) {
  let imageUrls: (string | null)[] = []

  if (artwork.storageIds && artwork.storageIds.length > 0) {
    imageUrls = await Promise.all(artwork.storageIds.map((id) => ctx.storage.getUrl(id)))
  } else if (artwork.imageUrl) {
    imageUrls = [artwork.imageUrl]
  }

  const imageUrl = imageUrls[0] ?? null
  return { ...artwork, imageUrl, imageUrls }
}

// ── Queries ────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    const artworks = await ctx.db.query('artworks').order('asc').take(200)
    return await Promise.all(artworks.map((a) => withImages(ctx, a)))
  },
})

export const get = query({
  args: { id: v.id('artworks') },
  handler: async (ctx, { id }) => {
    const artwork = await ctx.db.get(id)
    if (!artwork) return null
    return await withImages(ctx, artwork)
  },
})

// ── Mutations ──────────────────────────────────────────────────────────────

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('artworks').first()
    if (existing) return 'already seeded'

    const items = [
      {
        title: 'Luz de tarde',
        technique: 'Acrílico sobre tela',
        dimensions: '40×50 cm',
        year: 2024,
        price: 35000,
        available: true,
        description: 'La calidez de la tarde filtrada entre hojas.',
        colorPalette: ['#e8ddd3', '#c4a882', '#d4b896', '#b09080'],
        order: 1,
      },
      {
        title: 'El jardín quieto',
        technique: 'Óleo sobre tela',
        dimensions: '50×60 cm',
        year: 2024,
        price: 48000,
        available: true,
        description: 'Un jardín en reposo, respirando verde y luz.',
        colorPalette: ['#dce8d8', '#8a9e85', '#6a8a65', '#f0e8c0'],
        order: 2,
      },
      {
        title: 'Horizonte dorado',
        technique: 'Acrílico sobre tela',
        dimensions: '60×40 cm',
        year: 2023,
        price: 42000,
        available: true,
        description: 'El cielo que se funde con la tierra al atardecer.',
        colorPalette: ['#f0e8d8', '#d4b880', '#e8c490', '#c8a060'],
        order: 3,
      },
      {
        title: 'Rosa silvestre',
        technique: 'Óleo sobre lienzo',
        dimensions: '30×40 cm',
        year: 2024,
        price: 28000,
        available: true,
        description: 'Flores que crecen libres, sin pedir permiso.',
        colorPalette: ['#ede0d4', '#d4a090', '#e0b0a0', '#f0c8b8'],
        order: 4,
      },
      {
        title: 'Laguna en calma',
        technique: 'Acrílico sobre tela',
        dimensions: '50×70 cm',
        year: 2023,
        price: 55000,
        available: false,
        description: 'Agua quieta que refleja el cielo de la mañana.',
        colorPalette: ['#d8e4e0', '#a0b8b4', '#c4d8e0', '#88a8a4'],
        order: 5,
      },
      {
        title: 'Formas y luz',
        technique: 'Técnica mixta',
        dimensions: '40×50 cm',
        year: 2024,
        price: 38000,
        available: true,
        description: 'Geometría orgánica bañada en luz cálida.',
        colorPalette: ['#f4ede0', '#d4b870', '#e8c870', '#c8a460'],
        order: 6,
      },
    ]

    for (const item of items) {
      await ctx.db.insert('artworks', item)
    }

    return 'seeded'
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    technique: v.string(),
    dimensions: v.string(),
    year: v.number(),
    price: v.number(),
    available: v.boolean(),
    description: v.string(),
    colorPalette: v.array(v.string()),
    storageIds: v.optional(v.array(v.id('_storage'))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('artworks', { ...args, order: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id('artworks'),
    title: v.optional(v.string()),
    technique: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    year: v.optional(v.number()),
    price: v.optional(v.number()),
    available: v.optional(v.boolean()),
    description: v.optional(v.string()),
    colorPalette: v.optional(v.array(v.string())),
    storageIds: v.optional(v.array(v.id('_storage'))),
    order: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const artwork = await ctx.db.get(id)
    if (!artwork) throw new Error('Obra no encontrada')
    await ctx.db.patch(id, fields)
  },
})

export const remove = mutation({
  args: { id: v.id('artworks') },
  handler: async (ctx, { id }) => {
    const artwork = await ctx.db.get(id)
    if (!artwork) throw new Error('Obra no encontrada')
    if (artwork.storageIds) {
      await Promise.all(artwork.storageIds.map((sid) => ctx.storage.delete(sid)))
    }
    await ctx.db.delete(id)
  },
})

export const toggleAvailable = mutation({
  args: { id: v.id('artworks') },
  handler: async (ctx, { id }) => {
    const artwork = await ctx.db.get(id)
    if (!artwork) throw new Error('Obra no encontrada')
    await ctx.db.patch(id, { available: !artwork.available })
  },
})
