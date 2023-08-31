import "@/app/globals.css";
import MarketingNavBar from "@/components/marketing/marketing-nav-bar";
import { userExistsAndAuthorized } from "@/lib/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Goalee",
  description: "Track your goals and progress",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await userExistsAndAuthorized();
  const isLoggedIn = user ? true : false;
  return (
    <html lang="en">
      <body className={inter.className}>
        <MarketingNavBar isLoggedIn={isLoggedIn} />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
