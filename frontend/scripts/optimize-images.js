// scripts/optimize-images.js
// Optimise les images statiques du site (tâche 131) : photos → WebP redimensionnées, logos partenaires recompressés sur place.
// Usage (dans Docker, sharp n'est installé que dans le conteneur) :
//   docker compose exec --user "$(id -u):$(id -g)" frontend node scripts/optimize-images.js
// --user : les fichiers créés appartiennent à Gwen et non à root (sinon `chown` obligatoire ensuite).
// Relançable sans risque : une image déjà convertie et plus récente que l'originale est ignorée.

import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const PUBLIC_DIR = path.join(import.meta.dirname, '../public')
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images')

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} Ko`
const isPhoto = (name) => /\.(jpe?g|png)$/i.test(name)

// ── Liste récursive des fichiers d'un dossier
const listFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(e => {
    const full = path.join(dir, e.name)
    return e.isDirectory() ? listFiles(full) : [full]
  }))
  return files.flat()
}

// ── Conversion en WebP à côté de l'original (l'original est conservé)
const toWebp = async (file, maxWidth, quality = 78) => {
  const target = file.replace(/\.(jpe?g|png)$/i, '.webp')
  const [src, dst] = await Promise.all([fs.stat(file), fs.stat(target).catch(() => null)])
  if (dst && dst.mtimeMs > src.mtimeMs) return // déjà fait

  await sharp(file)
    .rotate()                                            // respecte l'orientation des photos de téléphone (EXIF)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality, alphaQuality: 90 })                 // la transparence (dessins, logo) est conservée
    .toFile(target)

  const after = (await fs.stat(target)).size
  console.log(`${path.relative(PUBLIC_DIR, file)} → .webp (${kb(src.size)} → ${kb(after)})`)
}

// ── Recompression SUR PLACE (même nom, même format) : pour les fichiers dont l'adresse est enregistrée
// en base de données (logos des partenaires). Remplacé seulement si le gain dépasse 10 %.
const recompressInPlace = async (file, maxWidth) => {
  const before = (await fs.stat(file)).size
  const pipeline = sharp(file).rotate().resize({ width: maxWidth, withoutEnlargement: true })
  const buffer = /\.png$/i.test(file)
    ? await pipeline.png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
    : await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer()

  if (buffer.length > before * 0.9) return
  await fs.writeFile(file, buffer)
  console.log(`${path.relative(PUBLIC_DIR, file)} recompressé (${kb(before)} → ${kb(buffer.length)})`)
}

const run = async () => {
  const files = (await listFiles(IMAGES_DIR)).filter(f => isPhoto(path.basename(f)))

  for (const file of files) {
    const rel = path.relative(IMAGES_DIR, file).split(path.sep).join('/')

    if (rel.startsWith('logo-partners/')) await recompressInPlace(file, 400)   // affichés en petit, adresse en base
    else if (rel.startsWith('design/hero/')) await toWebp(file, 1920, 75)       // grandes images du haut des pages
    else if (rel.startsWith('design/ui/')) await toWebp(file, 900, 85)          // dessins décoratifs transparents
    else if (rel.includes('placeholder')) await toWebp(file, 1600, 80)         // images par défaut (ancien script)
    else await toWebp(file, 1200, 78)                                          // photos de section
  }

  // ── Logo : affiché en 48-56 px (160 px couvre les écrans haute densité)
  await toWebp(path.join(PUBLIC_DIR, 'logo.png'), 160, 90)

  // ── Image d'aperçu réseaux sociaux : JPEG 1200 × 630 (format recommandé, tous les réseaux ne lisent pas le WebP)
  const ogTarget = path.join(IMAGES_DIR, 'design/og-default.jpg')
  if (!(await fs.stat(ogTarget).catch(() => null))) {
    await sharp(path.join(IMAGES_DIR, 'design/hero/hero-home.jpg'))
      .rotate().resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile(ogTarget)
    console.log(`images/design/og-default.jpg créée (${kb((await fs.stat(ogTarget)).size)})`)
  }
}

run().then(() => console.log('Terminé.'))
