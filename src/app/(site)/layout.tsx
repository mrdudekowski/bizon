import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { getMainMenuItems } from "@/lib/cms/getMenuItems";
import { SHOP_BURGER_MENU_ITEMS } from "@/constants/shopBurgerMenu";
import { createPageMetadata } from "@/lib/seo/metadata";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  ...createPageMetadata(),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/favicon.svg", color: "#222222" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/** ponytail: ISR baseline — admin publishes appear within ~60s even without on-demand revalidate */
export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mainMenuItems = await getMainMenuItems();

  return (
    <html lang="ru" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <SiteShell mainMenuItems={mainMenuItems} shopMenuItems={SHOP_BURGER_MENU_ITEMS}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
