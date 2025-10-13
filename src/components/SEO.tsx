import { Helmet } from "react-helmet-async";
import { memo } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = memo(({
  title = "Mini Groups Studio - Creating Amazing Roblox Experiences",
  description = "Discover incredible Roblox games from Mini Groups Studio. Play Mini City RP, Make A BrainRot, and more with millions of players worldwide.",
  keywords = "roblox, games, mini groups, mini city rp, roleplay, gaming studio, multiplayer",
  image = "https://tr.rbxcdn.com/180DAY-da22381a0b46d712493261e84153ff85/256/256/Image/Webp/noFilter",
  url = "https://minigroups.com",
  type = "website",
}: SEOProps) => {
  const fullTitle = title.includes("Mini Groups") ? title : `${title} | Mini Groups Studio`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Mini Groups Studio" />
    </Helmet>
  );
});

SEO.displayName = "SEO";

export default SEO;
