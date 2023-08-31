import Link from "next/link";
import React from "react";
import Heading from "@/components/ui/heading";
import SignUp from "../auth/sign-up";
import SignIn from "../auth/sign-in";

type Props = {
  isLoggedIn: boolean;
};

export default function MarketingNavBar({ isLoggedIn }: Props) {
  const navLinks: {
    title: string;
    link: string;
  }[] = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Products",
      link: "#products",
    },
    {
      title: "Pricing",
      link: "/pricing",
    },
    {
      title: "About",
      link: "/about",
    },
    {
      title: "Dashboard",
      link: "/dashboard",
    },
  ];

  return (
    <nav className="w-full px-6 py-2 flex items-center text-slate-700 justify-between">
      <div className="w-fit">
        <Link href="/">
          <Heading size="sm" className="text-slate-700 font-semibold">
            Goalee
          </Heading>
        </Link>
      </div>
      <ul className="list-none flex items-center gap-8 ">
        {navLinks.map((link, index) => {
          return (
            <Link key={index} href={link.link}>
              <li
                className={`hover:underline transition-all delay-100 hover:font-medium ${
                  link.title === "Dashboard" ? !isLoggedIn && "hidden" : ""
                } `}
              >
                {link.title}
              </li>
            </Link>
          );
        })}
      </ul>
      <div className="  flex items-center justify-center gap-3">
        <SignUp />
        <SignIn />
      </div>
    </nav>
  );
}
