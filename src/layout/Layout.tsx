import React from "react";
import Header from "./Header.tsx";
// import Footer from "./Footer.tsx";

import { Helmet } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  type?: string;
  url?: string;
  image?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Play the Ultimate Cricket Card Game Online!",
  description = "Compete with friends, collect cards, and dominate the cricket pitch in this exciting multiplayer game. Join the Cricket Card Game today!",
  keywords = "cricket card game, online cricket game, cricket multiplayer, cricket stats, cricket cards",
  author = "Sudhanshu",
  type = "website",
  url = "https://cricketcard.live",
  image = "https://www.cricketcardgame.site/assets/cricket_card_game.jpg",
}) => {
  return (
    <div className="layout">
      <Helmet>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content="Sudhanshine" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sudhanshukushwaha" />
        <meta name="twitter:creator" content={author} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            url: url,
            name: title,
            author: {
              "@type": "Person",
              name: author,
            },
            description: description,
            image: image,
          })}
        </script>
      </Helmet>
      <Header />
      <main>
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
