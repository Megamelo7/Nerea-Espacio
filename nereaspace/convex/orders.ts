import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { MutationCtx } from './_generated/server'

async function nextOrderNumber(ctx: MutationCtx): Promise<number> {
  const counter = await ctx.db
    .query('counters')
    .withIndex('by_name', (q) => q.eq('name', 'orders'))
    .unique()

  if (!counter) {
    await ctx.db.insert('counters', { name: 'orders', value: 1 })
    return 1
  }

  const next = counter.value + 1
  await ctx.db.patch(counter._id, { value: next })
  return next
}

// ── Queries ────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('orders').order('desc').take(200)
  },
})

export const get = query({
  args: { id: v.id('orders') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

export const getByNumber = query({
  args: { orderNumber: v.number() },
  handler: async (ctx, { orderNumber }) => {
    return await ctx.db
      .query('orders')
      .withIndex('by_orderNumber', (q) => q.eq('orderNumber', orderNumber))
      .unique()
  },
})

export const listByStatus = query({
  args: {
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('completed'),
      v.literal('cancelled'),
    ),
  },
  handler: async (ctx, { status }) => {
    return await ctx.db
      .query('orders')
      .withIndex('by_status', (q) => q.eq('status', status))
      .order('desc')
      .take(200)
  },
})

// ── Mutations ──────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    artworkId: v.id('artworks'),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.artworkId)
    if (!artwork) throw new Error('Obra no encontrada')

    const orderNumber = await nextOrderNumber(ctx)

    const id = await ctx.db.insert('orders', {
      orderNumber,
      artworkId: args.artworkId,
      artworkTitle: artwork.title,
      artworkPrice: artwork.price,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      message: args.message,
      status: 'pending',
    })

    return { orderNumber, id }
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('orders'),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('completed'),
      v.literal('cancelled'),
    ),
  },
  handler: async (ctx, { id, status }) => {
    const order = await ctx.db.get(id)
    if (!order) throw new Error('Pedido no encontrado')
    await ctx.db.patch(id, { status })
  },
})

export const remove = mutation({
  args: { id: v.id('orders') },
  handler: async (ctx, { id }) => {
    const order = await ctx.db.get(id)
    if (!order) throw new Error('Pedido no encontrado')
    await ctx.db.delete(id)
  },
})
