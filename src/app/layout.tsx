import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DASWAM BRIGHT HARBOR",
  description: "Pharmaceuticals and Provisions delivered fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
