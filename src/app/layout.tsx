import type { Metadata } from "next";
import Providers from "./providers";
import AppShell from "@/global/components/Layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lingora — Teman Ngobrol AI",
  description: "Teman ngobrol AI yang ramah untuk melatih bahasamu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
