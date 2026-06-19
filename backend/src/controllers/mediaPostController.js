// mediaPostController.js
// Contrôleur — médias & actualités

import { getAllMediaPosts, getMediaPostBySlug } from '../services/mediaPostService.js'

export const getMediaPosts = async (req, res) => {
  try {
    const posts = await getAllMediaPosts()
    res.json(posts)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

export const getMediaPostBySlugController = async (req, res) => {
  try {
    const post = await getMediaPostBySlug(req.params.slug)
    if (!post) return res.status(404).json({ error: 'Article introuvable' })
    res.json(post)
  } catch (err) {
    console.error('[ERROR]', err.message)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}