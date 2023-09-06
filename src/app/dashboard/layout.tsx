import "@/app/globals.css";
import DashboardMainNav from "@/components/dashboard/dashboard-nav";
import { userExistsAndAuthorized } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Goalee | Dashboard",
  description: "Every day is goal achieving day",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await userExistsAndAuthorized();

  if (!user) {
    redirect("/?signin=true");
  }

  return (
    <html lang="en">
      <body>
        <div className="w-full min-h-screen bg-white/95 flex-1 flex flex-col">
          <DashboardMainNav user={user} />
          <main className="container">{children}</main>
        </div>
      </body>
    </html>
  );
}
