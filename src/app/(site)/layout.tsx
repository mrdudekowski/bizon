import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { SiteShell } from "@/components/layout/SiteShell";
import { getMainDualPaneMenu, getShopDualPaneMenu } from "@/lib/cms/getDualPaneMenu";
import { createPageMetadata } from "@/lib/seo/metadata";
import "../globals.css";

const bounded = localFont({
  src: "../../../public/Fonts/Bounded-Variable.ttf",
  variable: "--font-bounded",
  weight: "200 900",
  display: "swap",
});

const manrope = localFont({
  src: "../../../public/Fonts/Manrope.ttf",
  variable: "--font-manrope",
  weight: "200 800",
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
  const [mainMenu, shopMenu] = await Promise.all([
    getMainDualPaneMenu(),
    getShopDualPaneMenu(),
  ]);

  return (
    <html lang="ru" className={`${bounded.variable} ${manrope.variable}`} data-scroll-behavior="smooth">
      <body>
        <YandexMetrika />
        <SiteShell mainMenu={mainMenu} shopMenu={shopMenu}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
