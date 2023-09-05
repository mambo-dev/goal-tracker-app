import "@/app/globals.css";
import DashboardMainNav from "@/components/dashboard/dashboard-nav";
import SideBarNav from "@/components/dashboard/sidebar-nav";
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
    redirect("/#signin");
  }

  return (
    <html lang="en">
      <body>
        <div className="flex items-center w-full ">
          <SideBarNav />
          <div className="min-h-screen bg-white flex-1 flex flex-col">
            <DashboardMainNav />
            <main className="container ">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
