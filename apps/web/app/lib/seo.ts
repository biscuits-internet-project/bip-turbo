import type { Setlist, Song, Venue } from "@bip/domain";

// SEO configuration
export const SEO_CONFIG = {
  siteName: "Biscuits Internet Project",
  bandName: "The Disco Biscuits",
  description: "The ultimate resource for Disco Biscuits fans - shows, setlists, songs, venues, and more.",
  url: "https://discobiscuits.net",
  image: "https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/images/bip.png", // Default Open Graph image
  twitter: "", // No Twitter handle
  keywords: [
    "Disco Biscuits",
    "The Disco Biscuits",
    "jam band",
    "setlists",
    "live music",
    "concert recordings",
    "phish",
    "grateful dead",
    "trey anastasio",
    "electronic music",
    "improvisation",
  ],
};

// Base meta tags that should be on every page
export function getBaseMeta() {
  return [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "robots", content: "index, follow" },
    { name: "author", content: SEO_CONFIG.siteName },
    { name: "keywords", content: SEO_CONFIG.keywords.join(", ") },

    // Open Graph
    { property: "og:site_name", content: SEO_CONFIG.siteName },
    { property: "og:type", content: "website" },
    { property: "og:image", content: `${SEO_CONFIG.url}${SEO_CONFIG.image}` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: `${SEO_CONFIG.bandName} - ${SEO_CONFIG.siteName}` },

    // Twitter Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: `${SEO_CONFIG.url}${SEO_CONFIG.image}` },

    // Additional SEO
    { name: "theme-color", content: "#6366f1" }, // Brand primary color
    { name: "msapplication-TileColor", content: "#6366f1" },
  ];
}

// Generate meta tags for the homepage
export function getHomeMeta() {
  const title = `${SEO_CONFIG.siteName} - Disco Biscuits Shows, Setlists & More`;
  const description = `${SEO_CONFIG.description} Browse setlists, discover shows, read reviews, and connect with the community.`;
  const url = SEO_CONFIG.url;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate meta tags for a show page
export function getShowMeta(setlist: Setlist) {
  const show = setlist.show;
  const date = new Date(show.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const venue = show.venue?.name || "Unknown Venue";
  const location = show.venue ? `${show.venue.city}, ${show.venue.state}` : "";

  const title = `${date} - ${venue} ${location ? `- ${location}` : ""} | ${SEO_CONFIG.siteName}`;
  const description = `View setlist, reviews, and recordings from ${SEO_CONFIG.bandName} show at ${venue}${location ? ` in ${location}` : ""} on ${date}. ${setlist.sets?.length || 0} sets.`;
  const url = `${SEO_CONFIG.url}/shows/${show.slug}`;

  // Generate keywords based on venue and location
  const songNames: string[] = [];
  const keywords = [
    ...SEO_CONFIG.keywords,
    venue,
    show.venue?.city || "",
    date,
    ...songNames.slice(0, 10), // Include first 10 songs as keywords
  ].filter(Boolean);

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate meta tags for shows listing page
export function getShowsMeta(year?: number, searchQuery?: string) {
  let title: string;
  let description: string;
  let url: string;

  if (searchQuery) {
    title = `Search Results for "${searchQuery}" | ${SEO_CONFIG.siteName}`;
    description = `Search results for ${SEO_CONFIG.bandName} shows matching "${searchQuery}". Find setlists, recordings, and reviews.`;
    url = `${SEO_CONFIG.url}/shows?q=${encodeURIComponent(searchQuery)}`;
  } else if (year) {
    title = `${year} Shows | ${SEO_CONFIG.siteName}`;
    description = `Browse all ${SEO_CONFIG.bandName} shows from ${year}. View setlists, recordings, reviews and ratings from every show.`;
    url = `${SEO_CONFIG.url}/shows/year/${year}`;
  } else {
    title = `Shows | ${SEO_CONFIG.siteName}`;
    description = `Browse and discover ${SEO_CONFIG.bandName} shows, including setlists, recordings, and ratings. Complete show database from 1995 to present.`;
    url = `${SEO_CONFIG.url}/shows`;
  }

  const keywords = [
    ...SEO_CONFIG.keywords,
    year?.toString() || "",
    "show database",
    "concert history",
    "tour dates",
  ].filter(Boolean);

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate meta tags for songs listing page
export function getSongsMeta() {
  const title = `Songs | ${SEO_CONFIG.siteName}`;
  const description = `Explore ${SEO_CONFIG.bandName} complete song database. View play counts, debut dates, last played, trending songs, and complete performance statistics.`;
  const url = `${SEO_CONFIG.url}/songs`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate meta tags for a song detail page
export function getSongMeta(song: Song & { timesPlayed?: number; debutDate?: string }) {
  const title = `${song.title} by ${SEO_CONFIG.bandName} | ${SEO_CONFIG.siteName}`;
  const debutYear = song.debutDate ? new Date(song.debutDate).getFullYear() : "";
  const description = `View performance history, lyrics, tabs, and statistics for "${song.title}" by ${SEO_CONFIG.bandName}.${song.timesPlayed ? ` Played ${song.timesPlayed} times` : ""}${debutYear ? ` since ${debutYear}` : ""}.`;
  const url = `${SEO_CONFIG.url}/songs/${song.slug}`;

  const keywords = [
    ...SEO_CONFIG.keywords,
    song.title,
    "lyrics",
    "tabs",
    "performance history",
    debutYear?.toString() || "",
  ].filter(Boolean);

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate meta tags for venues listing page
export function getVenuesMeta() {
  const title = `Venues | ${SEO_CONFIG.siteName}`;
  const description = `Browse venues where ${SEO_CONFIG.bandName} have performed. Explore show history, locations, and performance statistics by venue.`;
  const url = `${SEO_CONFIG.url}/venues`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate meta tags for a venue detail page
export function getVenueMeta(venue: Venue & { showCount?: number; firstShowYear?: number; lastShowYear?: number }) {
  const location = `${venue.city}, ${venue.state}`;
  const title = `${venue.name} - ${location} | ${SEO_CONFIG.siteName}`;
  const showHistory =
    venue.showCount && venue.firstShowYear && venue.lastShowYear
      ? `${venue.showCount} shows from ${venue.firstShowYear} to ${venue.lastShowYear}`
      : "";
  const description = `View all ${SEO_CONFIG.bandName} shows at ${venue.name} in ${location}.${showHistory ? ` ${showHistory} with complete setlists and reviews.` : " Complete show history with setlists and reviews."}`;
  const url = `${SEO_CONFIG.url}/venues/${venue.slug}`;

  const keywords = [
    ...SEO_CONFIG.keywords,
    venue.name,
    venue.city,
    venue.state,
    "venue",
    "show history",
    venue.firstShowYear?.toString() || "",
    venue.lastShowYear?.toString() || "",
  ].filter(Boolean);

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate meta tags for blog listing page
export function getBlogsMeta() {
  const title = `Blog | ${SEO_CONFIG.siteName}`;
  const description = `Read the latest news, stories, reviews, and updates from the Disco Biscuits community. Stay connected with band news and fan insights.`;
  const url = `${SEO_CONFIG.url}/blog`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate meta tags for a blog post page
export function getBlogMeta(blogPost: { title: string; blurb?: string; slug: string; publishedAt?: string }) {
  const title = `${blogPost.title} | ${SEO_CONFIG.siteName}`;
  const description = blogPost.blurb || `Read ${blogPost.title} on ${SEO_CONFIG.siteName}`;
  const url = `${SEO_CONFIG.url}/blog/${blogPost.slug}`;

  const keywords = [
    ...SEO_CONFIG.keywords,
    "blog",
    "news",
    "community",
    blogPost.publishedAt ? new Date(blogPost.publishedAt).getFullYear().toString() : "",
  ].filter(Boolean);

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords.join(", ") },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "article" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { link: { rel: "canonical", href: url } },
  ];
}

// Generate JSON-LD structured data for a show
export function getShowStructuredData(setlist: Setlist) {
  const show = setlist.show;
  const venue = show.venue;

  const musicEvent = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${SEO_CONFIG.bandName} Live at ${venue?.name || "Unknown Venue"}`,
    startDate: show.date,
    performer: {
      "@type": "MusicGroup",
      name: SEO_CONFIG.bandName,
      genre: ["Jam Band", "Electronic", "Rock", "Improvisation"],
    },
    location: venue
      ? {
          "@type": "Place",
          name: venue.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: venue.city,
            addressRegion: venue.state,
            addressCountry: "US",
          },
        }
      : undefined,
    url: `${SEO_CONFIG.url}/shows/${show.slug}`,
    description: `Live performance by ${SEO_CONFIG.bandName}${venue ? ` at ${venue.name}` : ""} on ${new Date(show.date).toLocaleDateString()}`,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/OutOfStock",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return JSON.stringify(musicEvent);
}

// Generate JSON-LD structured data for venue
export function getVenueStructuredData(venue: Venue) {
  const venueData = {
    "@context": "https://schema.org",
    "@type": "MusicVenue",
    name: venue.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: venue.city,
      addressRegion: venue.state,
      addressCountry: "US",
    },
    url: `${SEO_CONFIG.url}/venues/${venue.slug}`,
    description: `${venue.name} - Music venue in ${venue.city}, ${venue.state}`,
  };

  return JSON.stringify(venueData);
}

// Generate JSON-LD structured data for song
export function getSongStructuredData(song: Song & { timesPlayed?: number }) {
  const songData = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    byArtist: {
      "@type": "MusicGroup",
      name: SEO_CONFIG.bandName,
    },
    genre: ["Jam Band", "Electronic", "Rock"],
    url: `${SEO_CONFIG.url}/songs/${song.slug}`,
    description: `${song.title} by ${SEO_CONFIG.bandName}${song.timesPlayed ? ` - Played ${song.timesPlayed} times` : ""}`,
  };

  return JSON.stringify(songData);
}

// Generate JSON-LD structured data for blog post
export function getBlogStructuredData(blogPost: {
  title: string;
  blurb?: string;
  slug: string;
  publishedAt?: string;
  authorName?: string;
}) {
  const blogData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogPost.title,
    description: blogPost.blurb || `${blogPost.title} on ${SEO_CONFIG.siteName}`,
    url: `${SEO_CONFIG.url}/blog/${blogPost.slug}`,
    datePublished: blogPost.publishedAt,
    author: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SEO_CONFIG.url}/blog/${blogPost.slug}`,
    },
  };

  return JSON.stringify(blogData);
}

// Generate JSON-LD breadcrumb structured data
export function getBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return JSON.stringify(breadcrumbData);
}

// Generate canonical URL
export function getCanonicalUrl(path: string) {
  return `${SEO_CONFIG.url}${path}`;
}

// Generate sitemap entry for a page
export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export function generateSitemapEntry(
  path: string,
  options: {
    lastmod?: Date;
    changefreq?: SitemapEntry["changefreq"];
    priority?: number;
  } = {},
): SitemapEntry {
  return {
    url: getCanonicalUrl(path),
    lastmod: options.lastmod?.toISOString(),
    changefreq: options.changefreq || "weekly",
    priority: options.priority || 0.5,
  };
}
