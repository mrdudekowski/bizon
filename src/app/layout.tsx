import type { ReactNode } from "react";

import { AdminShell } from "@/admin/shell/AdminShell";
import { readDatabaseLink } from "@/admin/system/databaseLink";

import "./globals.css";

export const metadata = {
  title: "BIZON",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const databaseLink = await readDatabaseLink(process.env.BACKEND_URL);
  return (
    <html lang="ru">
      <body>
        <AdminShell databaseLink={databaseLink}>{children}</AdminShell>
      </body>
    </html>
  );
}
