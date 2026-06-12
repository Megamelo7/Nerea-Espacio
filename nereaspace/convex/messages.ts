import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

// ── Queries ────────────────────────────────────────────────────────────────

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('messages').order('desc').take(200)
  },
})

export const listUnread = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_read', (q) => q.eq('read', false))
      .order('desc')
      .take(100)
  },
})

export const get = query({
  args: { id: v.id('messages') },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id)
  },
})

// ── Mutations ──────────────────────────────────────────────────────────────

export const send = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('messages', { ...args, read: false })
  },
})

export const markRead = mutation({
  args: { id: v.id('messages') },
  handler: async (ctx, { id }) => {
    const msg = await ctx.db.get(id)
    if (!msg) throw new Error('Mensaje no encontrado')
    await ctx.db.patch(id, { read: true })
  },
})

export const markAllRead = mutation({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db
      .query('messages')
      .withIndex('by_read', (q) => q.eq('read', false))
      .take(100)
    await Promise.all(unread.map((m) => ctx.db.patch(m._id, { read: true })))
  },
})

export const remove = mutation({
  args: { id: v.id('messages') },
  handler: async (ctx, { id }) => {
    const msg = await ctx.db.get(id)
    if (!msg) throw new Error('Mensaje no encontrado')
    await ctx.db.delete(id)
  },
})
