import Image from 'next/image'
import Link from 'next/link'
import { Article } from '@/types'
import { i18nStrings } from '@/lib/i18n'
import { formatDate, formatRelativeDate, jsonLdString } from '@/lib/utils'
import { ReadingBar } from '@/components/ui/ReadingBar'
import { RichText } from '@/components/RichText'
import AdskeeperWidget from '@/components/ads/AdskeeperWidget'
import { RelatedArticles } from '@/components/article/RelatedArticles'
import { adskeeper } from '@/lib/ads'

const dict = i18nStrings.en

/** Article layout shared by /article/[slug] and the tracked /article/[key]/[slug] route. */
export function ArticleView({ article, related }: { article: Article; related: Article[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theusnewsfeed.com'
  const heroImage = article.coverImage?.url || 'https://picsum.photos/seed/article/1400/900'
  const categoryName = article.category
    ? (dict as any)[article.category.slug] || article.category.name
    : ''
  const authorName = article.author && typeof article.author === 'object' ? article.author.name : ''

  const articleUrl = `${siteUrl}/article/${article.slug}`
  const absoluteHeroImage = heroImage.startsWith('/') ? `${siteUrl}${heroImage}` : heroImage

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
    url: articleUrl,
    headline: article.title,
    description: article.excerpt,
    image: [absoluteHeroImage],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: [{
      '@type': 'Person',
      name: authorName || 'The US News Feed Staff',
      url: `${siteUrl}/about`,
    }],
    publisher: {
      '@type': 'Organization',
      name: 'The US News Feed',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <ReadingBar />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
          <article className="min-w-0 w-full max-w-[720px] lg:mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
              <Link href="/" className="hover:text-[var(--text-primary)]">{dict.home}</Link>
              {article.category && (
                <>
                  <span aria-hidden>/</span>
                  <Link href={`/category/${article.category.slug}`} className="hover:text-[var(--text-primary)]">
                    {categoryName}
                  </Link>
                </>
              )}
              {article.isBreaking && (
                <span
                  className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.06em]"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                >
                  Breaking
                </span>
              )}
            </nav>

            <h1 className="headline" style={{ fontSize: 'clamp(30px, 4.6vw, 46px)', lineHeight: 1.08 }}>
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="rubric mt-4" style={{ fontSize: 'clamp(18px, 2.2vw, 21px)', lineHeight: 1.45 }}>
                {article.excerpt}
              </p>
            )}

            {/* Byline */}
            <p className="meta mt-5" style={{ fontSize: 13 }}>
              {authorName && <span style={{ color: 'var(--text-secondary)' }}>By {authorName} · </span>}
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, 'MMM d, yyyy')}</time>
              )}
              {article.publishedAt && article.readTime ? ' · ' : ''}
              {article.readTime ? `${article.readTime} ${dict.minRead}` : ''}
            </p>

            {/* Image and caption */}
            <figure className="mt-6 sm:mt-8">
              <div
                className="relative w-full overflow-hidden rounded-xl"
                style={{ aspectRatio: '16 / 9', background: 'var(--bg-surface)' }}
              >
                <Image
                  src={heroImage}
                  alt={article.coverImage?.alt || article.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
              {(() => {
                const alt = article.coverImage?.alt
                const caption = article.credit
                  ? `Source: ${article.credit}`
                  : alt && alt.trim() !== article.title.trim() ? alt : ''
                return caption ? <figcaption className="meta mt-2">{caption}</figcaption> : null
              })()}
            </figure>

            {/* Body */}
            <div className="article-body max-w-none mt-8 mb-10" data-article-content>
              {article.content ? (
                <RichText
                  content={article.content}
                  articleTitle={article.title}
                  analyticsId={article.slug}
                  adWidgetId={adskeeper.articleInline1}
                  adWidgetId2={adskeeper.articleInline2}
                  adWidgetId3={adskeeper.articleInline3}
                />
              ) : (
                <p className="italic" style={{ color: 'var(--text-muted)' }}>{dict.comingSoon}</p>
              )}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {article.tags.map((tag: any) => (
                  <span
                    key={tag.id || tag.name}
                    className="text-[12px] font-medium px-3 py-1 rounded-full"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Our own stories first, so readers who finish keep reading here;
                the ad feed then catches everyone who keeps scrolling. */}
            <RelatedArticles articles={related.slice(0, 3)} categoryName={categoryName} />

            {adskeeper.articleBottom && (
              // Keep this unit in normal document flow for placement compliance.
              <div className="mt-10 mb-6" data-article-end>
                <AdskeeperWidget widgetId={adskeeper.articleBottom} placement="article_bottom" className="!my-0" />
              </div>
            )}
          </article>

          {/* Right rail, desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 flex flex-col gap-8">
              {related.length > 3 && (
                <section>
                  <div className="section-head !mb-1">
                    <h2>{dict.latest}</h2>
                  </div>
                  <ol>
                    {related.slice(3, 8).map((a, i) => (
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
                        <Link href={`/article/${a.slug}`} className="group block min-w-0">
                          <span className="headline block" style={{ fontSize: 15, lineHeight: 1.3 }}>{a.title}</span>
                          {a.publishedAt && <span className="meta block mt-1.5">{formatRelativeDate(a.publishedAt)}</span>}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
              {adskeeper.articleSidebar && (
                <AdskeeperWidget
                  widgetId={adskeeper.articleSidebar}
                  placement="article_sidebar"
                  adType="sidebar"
                  onlyShowOn="desktop"
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
