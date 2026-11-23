/**
 * Adskeeper placement registry.
 *
 * Every page-level placement has its own environment variable so reporting is
 * not blended across routes. A blank variable means that slot renders nothing.
 */
/**
 * Master switch. Ads are hidden everywhere (no script, no slots, no reserved
 * space) unless NEXT_PUBLIC_ADS_ENABLED=true. Flip it on once real units exist.
 */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true'

const adskeeperConfig = {
  scriptUrl: process.env.NEXT_PUBLIC_ADS_KEEPER_SCRIPT_URL,

  homeFeed: process.env.NEXT_PUBLIC_ADS_KEEPER_HOME_FEED,
  homeBottom: process.env.NEXT_PUBLIC_ADS_KEEPER_HOME_BOTTOM,
  categoryFeed: process.env.NEXT_PUBLIC_ADS_KEEPER_CATEGORY_FEED,
  categoryBottom: process.env.NEXT_PUBLIC_ADS_KEEPER_CATEGORY_BOTTOM,
  searchFeed: process.env.NEXT_PUBLIC_ADS_KEEPER_SEARCH_FEED,

  articleInline1: process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1,
  articleInline2: process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2,
  articleInline3: process.env.NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_3,
  articleBottom: process.env.NEXT_PUBLIC_ADS_KEEPER_ARTICLE_BOTTOM,
  articleSidebar: process.env.NEXT_PUBLIC_ADS_KEEPER_ARTICLE_SIDEBAR,

  mobileToaster: process.env.NEXT_PUBLIC_ADS_KEEPER_MOBILE_TOASTER,
  exitFeed: process.env.NEXT_PUBLIC_ADS_KEEPER_EXIT_FEED,
} as const

type AdskeeperConfig = { [K in keyof typeof adskeeperConfig]: string | undefined }

export const adskeeper: AdskeeperConfig = ADS_ENABLED
  ? adskeeperConfig
  : (Object.fromEntries(Object.keys(adskeeperConfig).map((k) => [k, undefined])) as AdskeeperConfig)
