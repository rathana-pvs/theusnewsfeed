import * as website_studio from './20261104_website_studio';
import * as article_created_by from './20261108_article_created_by';
import * as rebrand_media_alt_default from './20261120_rebrand_media_alt_default';
import * as migration_20260709_194304_add_share_links_collection from './20260709_194304_add_share_links_collection';

export const migrations = [
  {
    up: migration_20260709_194304_add_share_links_collection.up,
    down: migration_20260709_194304_add_share_links_collection.down,
    name: '20260709_194304_add_share_links_collection'
  },
  { up: website_studio.up, down: website_studio.down, name: '20261104_website_studio' },
  { up: article_created_by.up, down: article_created_by.down, name: '20261108_article_created_by' },
  { up: rebrand_media_alt_default.up, down: rebrand_media_alt_default.down, name: '20261120_rebrand_media_alt_default' },
];
