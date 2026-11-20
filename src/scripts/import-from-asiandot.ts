/**
 * Copy the latest published articles from the old site (asiandot.com) into
 * this site's database, re-uploading every cover and inline image.
 *
 * Usage:
 *   npx tsx --env-file=.env.local src/scripts/import-from-asiandot.ts [--limit=40] [--source=https://asiandot.com]
 *
 * Safe to re-run: articles whose slug already exists here are skipped.
 */
import { getPayload, type Payload } from 'payload'
import config from '../../payload.config'

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split('=')[1]
const SOURCE = (arg('source') || 'https://asiandot.com').replace(/\/$/, '')
const LIMIT = Number(arg('limit') || 40)

type SourceMedia = { id: number; url: string; filename: string; mimeType: string; alt?: string; caption?: string }

const mediaCache = new Map<number, number>()

async function copyMedia(payload: Payload, src: SourceMedia, fallbackAlt: string): Promise<number> {
  const cached = mediaCache.get(src.id)
  if (cached) return cached

  const url = src.url.startsWith('http') ? src.url : `${SOURCE}${src.url}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image download failed (${res.status}): ${url}`)
  const data = Buffer.from(await res.arrayBuffer())

  // Old default alt text was the old brand name; use the article title instead.
  const alt = src.alt && !/^asian dot$/i.test(src.alt.trim()) ? src.alt : fallbackAlt

  const created = await payload.create({
    collection: 'media',
    data: { alt, caption: src.caption || undefined, source: 'local' },
    file: { data, mimetype: src.mimeType, name: src.filename, size: data.length },
  })
  mediaCache.set(src.id, created.id as number)
  return created.id as number
}

// Replace inline upload nodes' source media with freshly uploaded local copies.
async function remapContent(payload: Payload, node: any, title: string): Promise<any> {
  if (!node || typeof node !== 'object') return node
  if (node.root) return { ...node, root: await remapContent(payload, node.root, title) }
  if (node.type === 'upload' && node.value && typeof node.value === 'object') {
    const id = await copyMedia(payload, node.value, title)
    return { ...node, value: id }
  }
  if (Array.isArray(node.children)) {
    const children = []
    for (const child of node.children) children.push(await remapContent(payload, child, title))
    return { ...node, children }
  }
  return node
}

async function main() {
  const payload = await getPayload({ config })

  const listUrl = `${SOURCE}/api/articles?limit=${LIMIT}&depth=1&sort=-publishedAt&where[status][equals]=published`
  const res = await fetch(listUrl)
  if (!res.ok) throw new Error(`Source API failed (${res.status}): ${listUrl}`)
  const { docs } = (await res.json()) as { docs: any[] }
  console.log(`Fetched ${docs.length} articles from ${SOURCE}`)

  const categories = await payload.find({ collection: 'categories', limit: 200, depth: 0 })
  const categoryBySlug = new Map(categories.docs.map((c: any) => [c.slug, c.id]))

  let imported = 0
  let skipped = 0
  const failed: string[] = []

  // Oldest first, so creation order matches publish order.
  for (const doc of [...docs].reverse()) {
    const exists = await payload.find({
      collection: 'articles',
      where: { slug: { equals: doc.slug } },
      limit: 1,
      depth: 0,
    })
    if (exists.docs.length) {
      // Repair inline images that still point at the old site's media.
      const existing: any = exists.docs[0]
      const hasForeignUpload = JSON.stringify(existing.content || {}).includes(`${SOURCE}/api/media/`)
      if (hasForeignUpload) {
        const content = await remapContent(payload, doc.content, doc.title)
        await payload.update({ collection: 'articles', id: existing.id, data: { content } as any })
        console.log(`↻ fixed inline images: ${doc.slug}`)
      } else {
        console.log(`↷ skip (exists): ${doc.slug}`)
      }
      skipped++
      continue
    }

    try {
      if (!doc.coverImage || typeof doc.coverImage !== 'object') throw new Error('no cover image')
      const coverImage = await copyMedia(payload, doc.coverImage, doc.title)
      const content = await remapContent(payload, doc.content, doc.title)

      await payload.create({
        collection: 'articles',
        data: {
          title: doc.title,
          slug: doc.slug,
          excerpt: String(doc.excerpt || '').slice(0, 160),
          content,
          coverImage,
          credit: doc.credit || undefined,
          category: (doc.category?.slug && categoryBySlug.get(doc.category.slug)) || undefined,
          tags: (doc.tags || []).map((t: any) => ({ tag: t.tag })),
          status: 'published',
          isBreaking: !!doc.isBreaking,
          isFeatured: !!doc.isFeatured,
          publishedAt: doc.publishedAt,
          og: { metaTitle: doc.og?.metaTitle, metaDescription: doc.og?.metaDescription },
          meta: { title: doc.meta?.title, description: doc.meta?.description },
        } as any,
      })
      imported++
      console.log(`✓ ${doc.slug}`)
    } catch (err: any) {
      failed.push(doc.slug)
      console.error(`✗ ${doc.slug}: ${err.message}`)
    }
  }

  console.log(`\nDone: ${imported} imported, ${skipped} skipped, ${failed.length} failed.`)
  if (failed.length) console.log('Failed:', failed.join(', '))
  process.exit(failed.length ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
