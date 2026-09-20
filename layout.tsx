import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apolo Genética",
  description: "Planejamento genético e simulação de acasalamentos do Criadouro Apolo.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/logo-criadouro-apolo.png",
    shortcut: "/logo-criadouro-apolo.png",
    apple: "/logo-criadouro-apolo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
