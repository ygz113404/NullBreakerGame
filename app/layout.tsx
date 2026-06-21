import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Null Breaker — Aetheria'nın Kalbini Kır",
  description: "Kardeşini kurtarmak için kusursuz bir şehri feda eder misin? Terminal tabanlı cyberpunk aksiyon oyunu.",
  applicationName: "Null Breaker",
  keywords: ["Null Breaker", "web game", "typing game", "cyberpunk", "terminal combat"],
  category: "game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
