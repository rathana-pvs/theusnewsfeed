import Link from 'next/link'
import { i18nStrings } from '@/lib/i18n'
import { Locale } from '@/i18n-config'
import { Category } from '@/types'

const SOCIAL = [
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61570774830775' },
  { name: 'X', href: '#' },
  { name: 'YouTube', href: '#' },
  { name: 'Telegram', href: '#' },
]

export function Footer({
  locale = 'en',
  categories = [],
}: {
  locale?: string
  categories?: Category[]
}) {
  const dict = i18nStrings[locale as Locale] || i18nStrings.en
  const linkClass = 'text-[14px] hover:text-white transition-colors'
  const headClass = 'text-[12px] font-semibold uppercase tracking-[0.08em] mb-4 pb-2 text-[#71717a]'

  return (
    <footer className="mt-16" style={{ background: 'var(--bg-footer)', color: '#d4d4d8' }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="pb-8 mb-8" style={{ borderBottom: '1px solid #27272a' }}>
          <Link href="/" aria-label="The US News Feed home" className="inline-flex items-center gap-[9px]">
            <span aria-hidden style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />
            <span style={{ color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 800, letterSpacing: '-0.04em', fontSize: 21, lineHeight: 1 }}>
              The US News<span style={{ color: '#f87171' }}> Feed</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed" style={{ color: '#a1a1aa' }}>
            {dict.footerTagline}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className={headClass} style={{ borderBottom: '1px solid #27272a' }}>{dict.category}</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className={linkClass}>
                    {(dict as any)[cat.slug] || cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headClass} style={{ borderBottom: '1px solid #27272a' }}>{dict.organization || 'The US News Feed'}</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/about" className={linkClass}>{dict.aboutUs}</Link></li>
              <li><Link href="/contact" className={linkClass}>{dict.contactUs}</Link></li>
              <li><Link href="/privacy" className={linkClass}>{dict.privacyPolicy || 'Privacy Policy'}</Link></li>
              <li><Link href="/search" className={linkClass}>{dict.search}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={headClass} style={{ borderBottom: '1px solid #27272a' }}>{dict.followUs}</h3>
            <ul className="flex flex-col gap-2">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target={s.href !== '#' ? '_blank' : undefined}
                    rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                    className={linkClass}
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col md:flex-row justify-between gap-3 text-[12px]"
          style={{ borderTop: '1px solid #27272a', color: '#71717a' }}
        >
          <span>© {new Date().getFullYear()} The US News Feed. {dict.copyright}</span>
          <span className="flex gap-5">
            <Link href="/privacy" className="hover:underline">{dict.privacyPolicy || 'Privacy'}</Link>
            <Link href="/contact" className="hover:underline">{dict.contactUs}</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
