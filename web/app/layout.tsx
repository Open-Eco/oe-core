import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open Climate Transparency Platform",
  description: "An open, transparent, nonprofit climate impact platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
