import { jsonLdString } from '@/lib/utils'
import type { Metadata } from 'next'
import { LeadStory, Sidebar } from '@/components/home/HomeBlocks'
import { FeedList } from '@/components/home/FeedList'
import { getArticles, getCategories, getFeatured } from '@/lib/api-server'
import { Article, Category } from '@/types'
import { adskeeper } from '@/lib/ads'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'The US News Feed — Independent Political Reporting',
  description: 'Breaking US political news, Congress and White House coverage, elections, and deep investigations from The US News Feed.',
  openGraph: {
    title: 'The US News Feed — Independent Political Reporting',
    description: 'Breaking US political news, Congress and White House coverage, elections, and deep investigations from The US News Feed.',
    url: '/',
    siteName: 'The US News Feed',
    images: [
      {
        url: '/logo.png',
        width: 1024,
        height: 1024,
        alt: 'The US News Feed Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The US News Feed — Independent Political Reporting',
    description: 'Breaking US political news, Congress and White House coverage, elections, and deep investigations from The US News Feed.',
    images: ['/logo.png'],
  },
}



export default async function HomePage() {
  const locale = 'en'

  const [{ hero, secondary }, allArticles, categories] = await Promise.all([
    getFeatured(locale),
    getArticles({ limit: 60, locale }),
    getCategories(locale),
  ])

  const articles = allArticles.docs as Article[]
  const cats = categories as Category[]

  const lead = hero || articles[0]
  const feed = articles.filter((a) => a.id !== lead?.id)

  // Sidebar highlights: editor-featured first, then breaking, then newest.
  const seen = new Set<Article['id']>([lead?.id])
  const top: Article[] = []
  for (const a of [...secondary, ...articles.filter((x) => x.isFeatured), ...articles.filter((x) => x.isBreaking), ...articles]) {
    if (top.length >= 5) break
    if (!a || seen.has(a.id)) continue
    seen.add(a.id)
    top.push(a)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theusnewsfeed.com'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'The US News Feed',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      'https://www.facebook.com/profile.php?id=61570774830775',
    ],
    publishingPrinciples: `${siteUrl}/about`,
    ethicsPolicy: `${siteUrl}/about`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-8 min-w-0">
            {lead && (
              <div className="pb-8">
                <LeadStory article={lead} />
              </div>
            )}
            <FeedList articles={feed} feedAdId={adskeeper.homeFeed} bottomAdId={adskeeper.homeBottom} />
          </div>
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Sidebar top={top} categories={cats} />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
