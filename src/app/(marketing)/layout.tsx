import "@/app/globals.css";
import MarketingNavBar from "@/components/marketing/marketing-nav-bar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Goalee",
  description: "Track your goals and progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MarketingNavBar />
        {children}
      </body>
    </html>
  );
}
