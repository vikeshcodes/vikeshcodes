import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Manrope } from "next/font/google";

import { SiteFooter } from "@/components/ui/site-footer";
import { SiteHeader } from "@/components/ui/site-header";
import { getViewer } from "@/lib/auth";

import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://vikeshcodes.in"),
  title: {
    default: "Vikesh Yadav | vikeshcodes.in",
    template: "%s | vikeshcodes.in",
  },
  description:
    "Monetized coding content, audience conversion funnels, and a client-facing portfolio built for Vikesh Yadav.",
  keywords: [
    "Vikesh Yadav",
    "vikeshcodes",
    "coding tutorials",
    "software architecture",
    "Next.js developer",
    "freelance developer setup",
    "conversion funnels",
  ],
  authors: [{ name: "Vikesh Yadav", url: "https://vikeshcodes.in" }],
  creator: "Vikesh Yadav",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vikeshcodes.in",
    siteName: "Vikesh Codes",
    title: "Vikesh Yadav | Software Architect & Creator",
    description: "Monetized coding content and client-facing portfolio built to convert.",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or add a task to create it
        width: 1200,
        height: 630,
        alt: "Vikesh Codes - Creator Business Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vikesh Yadav | vikeshcodes.in",
    description: "Monetized coding content and client-facing portfolio built to convert.",
    images: ["/og-image.png"],
    creator: "@vikeshcodes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://vikeshcodes.in",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getViewer();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vikesh Codes",
    url: "https://vikeshcodes.in",
    logo: "https://vikeshcodes.in/logo.png",
    sameAs: ["https://twitter.com/vikeshcodes", "https://instagram.com/vikeshcodes", "https://youtube.com/@vikeshcodes"],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vikesh Codes",
    url: "https://vikeshcodes.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://vikeshcodes.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full">
        <div className="site-shell min-h-screen">
          <SiteHeader viewer={viewer} />
          <main className="flex min-h-[calc(100svh-14rem)] flex-col">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
