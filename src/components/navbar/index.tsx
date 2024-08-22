"use client"
import Image from "next/image";
import * as React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-5 justify-between items-center px-7 py-1 font-bold border-b border-solid border-zinc-100 leading-[154.5%] max-md:flex-wrap max-md:px-5">
      <div className="flex  justify-center items-center self-stretch  tracking-tighter text-neutral-700">
        <Image
          src="/images/agentic-ai-logo.svg"
          alt="LOGO"
          style={{
            width: "50px",
            height: "auto",
          }}
          width={0}
          height={0}
        />
        <h4 className="text-2xl text-center">agentic</h4>
      </div>
      <ul className="gap-5 justify-between self-stretch my-auto text-sm leading-5 text-neutral-700 max-md:flex-wrap max-md:max-w-full font-normal hidden md:flex">
        <li>
          <Link
            href="/"
            className={`hover:text-neutral-900 transition duration-300 ease-in-out ${
              pathname === "/" ? "active" : ""
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/pricing"
            className={`hover:text-neutral-900 transition duration-300 ease-in-out ${
              pathname === "/pricing" ? "active" : ""
            }`}
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            href="/terms"
            className={`hover:text-neutral-900 transition duration-300 ease-in-out ${
              pathname === "/terms" ? "active" : ""
            }`}
          >
            Terms Of Use
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className={`hover:text-neutral-900 transition duration-300 ease-in-out ${
              pathname === "/documentation" ? "active" : ""
            }`}
          >
            Documentation
          </Link>
        </li>
      </ul>
      <button
        className="bg-[#C60D69] px-4 py-2 rounded-sm text-white"
        onClick={() => router.push(`/conversation?plan=${""}`)}
      >
        30 Days Free Trial
      </button>
    </div>
  );
}

export default NavBar;
