import { Footer } from "@/components/Footer";
import { Header } from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import {
  constructMetadata,
  generateOrganizationSchema,
  generateWebApplicationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const webApplicationSchema = generateWebApplicationSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="kShk8qX1hFxuY6ZPXpgWPz7r-MdG_w_VA32ZJoEoL00"
        />
        <meta name="msvalidate.01" content="117FCF20377F6D1208898A5975FB202C" />
        <meta name="yandex-verification" content="ef9cdf83c927c158" />
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header>
            <nav>
              <Header />
            </nav>
          </header>
          <main>{children}</main>
          <footer>
            <Footer />
          </footer>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
