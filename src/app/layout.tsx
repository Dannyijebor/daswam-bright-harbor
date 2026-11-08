import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "DASWAM BRIGHT HARBOR",
  description: "Pharmaceuticals and Provisions delivered fast.",
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
