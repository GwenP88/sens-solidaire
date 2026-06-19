// mediaPostService.js
// Logique métier — médias & actualités

import prisma from '../config/db.js'

export const getAllMediaPosts = async () => {
  return await prisma.mediaPost.findMany({
    where: { is_active: true },
    orderBy: { date: 'desc' },
  })
}

export const getMediaPostBySlug = async (slug) => {
  const post = await prisma.mediaPost.findUnique({
    where: { slug },
  })

  if (!post) return null

  // Médias attachés via table Media polymorphe
  const media = await prisma.media.findMany({
    where: { entity_type: 'media_post', entity_id: post.id },
    orderBy: { display_order: 'asc' },
  })

  return { ...post, media }
}