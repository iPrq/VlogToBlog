import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VtoB - Video to Blog Converter",
  description: "Transform YouTube videos into publish-ready, SEO-optimized blog posts in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-on-surface font-sans min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
