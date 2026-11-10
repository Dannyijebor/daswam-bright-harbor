import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

// We define the base URL so Next.js can generate absolute URLs for images
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dawsam-bright-habor.name.ng';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "DASWAM BRIGHT HARBOR",
  description: "Pharmaceuticals and Provisions delivered fast.",
  openGraph: {
    title: "DASWAM BRIGHT HARBOR",
    description: "Pharmaceuticals and Provisions delivered fast.",
    url: baseUrl,
    siteName: "DASWAM BRIGHT HARBOR",
    images: [
      {
        // This is the image that will show on WhatsApp. 
        // You can replace this URL with one of your own Supabase images later!
        url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop', 
        width: 1200,
        height: 630,
        alt: 'DASWAM BRIGHT HARBOR - Pharmacy and Provisions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DASWAM BRIGHT HARBOR",
    description: "Pharmaceuticals and Provisions delivered fast.",
    images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
