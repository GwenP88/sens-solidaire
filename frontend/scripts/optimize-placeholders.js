// scripts/optimize-placeholders.js
// Convertit tous les placeholders PNG en WebP (taille plafonnée, qualité 80)
// Usage : node scripts/optimize-placeholders.js

import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const IMAGES_DIR = path.join(import.meta.dirname, '../public/images')

const walkAndConvert = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      await walkAndConvert(fullPath)
      continue
    }

    if (!entry.name.toLowerCase().endsWith('.png')) continue
    if (!entry.name.toLowerCase().includes('placeholder')) continue

    const webpPath = fullPath.replace(/\.png$/i, '.webp')
    const before = (await fs.stat(fullPath)).size

    await sharp(fullPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpPath)

    const after = (await fs.stat(webpPath)).size
    console.log(`${entry.name} → ${path.basename(webpPath)} (${(before / 1024).toFixed(0)}Ko → ${(after / 1024).toFixed(0)}Ko)`)
  }
}

walkAndConvert(IMAGES_DIR).then(() => console.log('Terminé.'))