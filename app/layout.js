import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/Redux/Provider/Provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Light Store - Your Online Lighting Shop",
  description:
    "Shop high-quality lighting solutions at Light Store. Explore our collection of modern and classic lights for home and office.",
  keywords:
    "lighting, lamps, home lighting, office lighting, Light Store, modern lights, LED lights",
  author: "Light Store",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="viewport" content={metadata.viewport} />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/SK_Logo.png" type="image/png" />
        {/* Open Graph / Social sharing */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.lightstore.com" />
        <meta property="og:image" content="/og-image.png" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/og-image.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
