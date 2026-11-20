import Link from 'next/link'
import Image from 'next/image'
import { Article, Category } from '@/types'
import { i18nStrings } from '@/lib/i18n'
import { formatDate, formatRelativeDate, truncate } from '@/lib/utils'

const dict = i18nStrings.en
const FALLBACK_IMAGE = 'https://picsum.photos/seed/asiandot/1200/800'

export const categoryLabel = (a: Article) =>
  a.category ? ((dict as any)[a.category.slug] || a.category.name) : ''

const href = (a: Article) => `/article/${a.slug}`

function Thumb({
  article,
  ratio = '3 / 2',
  sizes,
  priority = false,
}: {
  article: Article
  ratio?: string
  sizes: string
  priority?: boolean
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: ratio, background: 'var(--bg-surface)' }}
    >
      <Image
        src={article.coverImage?.url || FALLBACK_IMAGE}
        alt={article.coverImage?.alt || article.title}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  )
}

function FlyTitle({ article }: { article: Article }) {
  const label = categoryLabel(article)
  if (!label && !article.isBreaking) return null
  return (
    <span className="flytitle">
      {article.isBreaking ? `${dict.breaking.charAt(0)}${dict.breaking.slice(1).toLowerCase()}` : ''}
      {article.isBreaking && label ? ' · ' : ''}
      {label}
    </span>
  )
}

function timeAgo(a: Article) {
  return a.publishedAt ? formatRelativeDate(a.publishedAt) : ''
}

// ─── Lead story ─────────────────────────────────────────────────────────────

export function LeadStory({ article }: { article: Article }) {
  return (
    <article>
      <Link href={href(article)} className="group block">
        <Thumb
          article={article}
          ratio="16 / 9"
          priority
          sizes="(max-width: 1024px) 100vw, 820px"
        />
        <div className="mt-5">
          <FlyTitle article={article} />
          <h1 className="headline" style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', lineHeight: 1.08 }}>
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="rubric mt-3 max-w-[64ch]" style={{ fontSize: 'clamp(16px, 1.5vw, 18px)', lineHeight: 1.5 }}>
              {truncate(article.excerpt, 240)}
            </p>
          )}
          <p className="meta mt-3">
            {article.publishedAt && formatDate(article.publishedAt, 'MMM d, yyyy')}
            {article.publishedAt && article.readTime ? ' · ' : ''}
            {article.readTime ? `${article.readTime} ${dict.minRead}` : ''}
          </p>
        </div>
      </Link>
    </article>
  )
}

// ─── Feed card: image left, text right ──────────────────────────────────────

export function FeedCard({ article }: { article: Article }) {
  return (
    <article>
      <Link href={href(article)} className="group grid grid-cols-[112px_1fr] sm:grid-cols-[220px_1fr] gap-4 sm:gap-6 items-start">
        <Thumb article={article} sizes="(max-width: 640px) 112px, 220px" />
        <div className="min-w-0">
          <FlyTitle article={article} />
          <h2 className="headline" style={{ fontSize: 'clamp(17px, 1.8vw, 21px)', lineHeight: 1.25 }}>
            {article.title}
          </h2>
          {article.excerpt && (
            <p className="rubric mt-2 hidden sm:block line-clamp-2" style={{ fontSize: 15 }}>
              {article.excerpt}
            </p>
          )}
          <p className="meta mt-2">{timeAgo(article)}</p>
        </div>
      </Link>
    </article>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

function SidebarHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-head !mb-1">
      <h2>{children}</h2>
    </div>
  )
}

export function Sidebar({ top, categories }: { top: Article[]; categories: Category[] }) {
  return (
    <div className="flex flex-col gap-10">
      {top.length > 0 && (
        <section>
          <SidebarHead>Top stories</SidebarHead>
          <ol>
            {top.map((a, i) => (
              <li
                key={a.id}
                className="flex gap-4 py-4"
                style={i > 0 ? { borderTop: '1px solid var(--border-subtle)' } : undefined}
              >
                <span
                  className="flex-shrink-0 w-6 tabular-nums"
                  style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35, color: 'var(--accent)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Link href={href(a)} className="group block min-w-0">
                  <span className="headline block" style={{ fontSize: 16, lineHeight: 1.3 }}>{a.title}</span>
                  <span className="meta block mt-1.5">{timeAgo(a)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {categories.length > 0 && (
        <section>
          <SidebarHead>Topics</SidebarHead>
          <div className="flex flex-wrap gap-2 pt-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors hover:border-[var(--text-primary)]"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {(dict as any)[c.slug] || c.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
