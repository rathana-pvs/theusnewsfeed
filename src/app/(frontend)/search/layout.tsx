import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Articles',
  description: 'Search articles, investigative reports, and political analysis from The US News Feed.',
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Search Articles — The US News Feed',
    description: 'Search articles, investigative reports, and political analysis from The US News Feed.',
    url: '/search',
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
    title: 'Search Articles — The US News Feed',
    description: 'Search articles, investigative reports, and political analysis from The US News Feed.',
    images: ['/logo.png'],
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
