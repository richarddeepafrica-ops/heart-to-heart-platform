import type { Metadata } from "next";
import { AdminReturnButton } from "@/components/AdminReturnButton";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl),
  title: "Heart to Heart Foundation",
  description: "Supporting prevention, control, and treatment of heart disease in children in Kenya.",
  openGraph: {
    title: "Heart to Heart Foundation",
    description: "Supporting prevention, control, and treatment of heart disease in children in Kenya.",
    siteName: "Heart to Heart Foundation",
    type: "website"
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <AdminReturnButton />
        <SiteFooter />
      </body>
    </html>
  );
}
