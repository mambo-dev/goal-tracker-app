import Link from "next/link";
import React from "react";
import Heading from "@/components/ui/heading";
import SignUp from "../auth/sign-up";
import SignIn from "../auth/sign-in";

type Props = {};

export default function MarketingNavBar({}: Props) {
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
  ];

  return (
    <nav className="w-full flex items-center justify-between">
      <div className="w-fit">
        <Heading size="lg" className="text-slate-700 font-semibold">
          {" "}
          Goalee{" "}
        </Heading>
      </div>
      <ul className="list-none flex items-center gap-2">
        {navLinks.map((link, index) => {
          return (
            <Link key={index} href={link.link}>
              <li>{link.title}</li>
            </Link>
          );
        })}
      </ul>
      <div className="flex items-center justify-center gap-3">
        <SignUp />
        <SignIn />
      </div>
    </nav>
  );
}
