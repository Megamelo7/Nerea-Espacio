"use node";
import { action } from './_generated/server'
import { v } from 'convex/values'

export const login = action({
  args: { password: v.string() },
  handler: async (_ctx, { password }) => {
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) throw new Error('ADMIN_PASSWORD no configurada')
    if (password !== adminPassword) return { ok: false }
    return { ok: true }
  },
})
