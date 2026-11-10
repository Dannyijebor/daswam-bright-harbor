import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dawsam-bright-habor.name.ng';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "DASWAM BRIGHT HARBOR | Pharmacy, Provisions & More",
  description: "Your one-stop destination for genuine medications, daily provisions, cosmetics, and wellness essentials. Delivered fast.",
  openGraph: {
    title: "DASWAM BRIGHT HARBOR | Your Daily Store",
    description: "Medications, Provisions, Cosmetics & More. Delivered fast to your doorstep.",
    url: baseUrl,
    siteName: "DASWAM BRIGHT HARBOR",
    images: [
      {
        // A beautiful, neutral, modern store aisle image
        url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop', 
        width: 1200,
        height: 630,
        alt: 'DASWAM BRIGHT HARBOR - Your One-Stop Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DASWAM BRIGHT HARBOR | Your Daily Store",
    description: "Medications, Provisions, Cosmetics & More. Delivered fast to your doorstep.",
    images: ['https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1200&auto=format&fit=crop'],
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
