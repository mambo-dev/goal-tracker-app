import "@/app/globals.css";
import AccountNavBar from "@/components/accounts/account-nav-bar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Goalee | account",
  description: "Track your goals and progress",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AccountNavBar />
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          {children}
        </main>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
