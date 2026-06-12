import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  artworks: defineTable({
    title: v.string(),
    technique: v.string(),
    dimensions: v.string(),
    year: v.number(),
    price: v.number(),
    available: v.boolean(),
    description: v.string(),
    colorPalette: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    storageId: v.optional(v.id('_storage')),
    order: v.optional(v.number()),
  })
    .index('by_available', ['available'])
    .index('by_order', ['order']),

  orders: defineTable({
    orderNumber: v.number(),
    artworkId: v.id('artworks'),
    artworkTitle: v.string(),
    artworkPrice: v.number(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    message: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('confirmed'),
      v.literal('completed'),
      v.literal('cancelled'),
    ),
  })
    .index('by_orderNumber', ['orderNumber'])
    .index('by_status', ['status'])
    .index('by_artworkId', ['artworkId']),

  counters: defineTable({
    name: v.string(),
    value: v.number(),
  }).index('by_name', ['name']),

  messages: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    read: v.boolean(),
  }).index('by_read', ['read']),
})
