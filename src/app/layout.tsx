import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartContext";
import JsonLd from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jettea.ng"),
  title: {
    default: "JETTEA® Green Tea | FOR HEALTHY LIVING | Official Store Nigeria",
    template: "%s | JETTEA® Nigeria",
  },
  description:
    "Discover authentic JETTEA® Green Tea by J.C. Bonjour Concerns Limited (JCBC). 100% botanical antioxidant infusion for healthy living, vitality, and daily wellness. Buy sachets, packets, and cartons online.",
  keywords: [
    "JETTEA",
    "JETTEA Green Tea",
    "JETTEA Nigeria",
    "JETTEA For Healthy Living",
    "J.C. Bonjour Concerns Limited",
    "JCBC",
    "Green Tea Nigeria",
    "Healthy Living Green Tea",
    "Buy Green Tea Lagos",
    "Wholesale Green Tea Nigeria",
  ],
  authors: [{ name: "J.C. Bonjour Concerns Limited" }],
  creator: "J.C. Bonjour Concerns Limited",
  publisher: "J.C. Bonjour Concerns Limited",
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
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://jettea.ng",
    siteName: "JETTEA® Official Store",
    title: "JETTEA® Green Tea | FOR HEALTHY LIVING",
    description:
      "Authentic JETTEA® Green Tea by J.C. Bonjour Concerns Limited. Formulated with rich natural antioxidants for daily healthy living. Nationwide delivery across Nigeria.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "JETTEA® Green Tea - FOR HEALTHY LIVING",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JETTEA® Green Tea | FOR HEALTHY LIVING",
    description:
      "100% authentic botanical green tea blend by J.C. Bonjour Concerns Limited. Refreshment, antioxidant power, and daily vitality.",
    images: ["https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "J.C. Bonjour Concerns Limited",
    alternateName: "JCBC",
    url: "https://jettea.ng",
    logo: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    brand: {
      "@type": "Brand",
      name: "JETTEA®",
      slogan: "FOR HEALTHY LIVING",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+234-800-000-0000",
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: "en",
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JETTEA® Official Store",
    url: "https://jettea.ng",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://jettea.ng/shop?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={webSiteSchema} />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-gold-500 selection:text-forest-deep">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
