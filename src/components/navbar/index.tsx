import Image from "next/image";
import * as React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

function NavBar() {
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
            className="hover:text-neutral-900 transition duration-300 ease-in-out"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/pricing"
            className="hover:text-neutral-900 transition duration-300 ease-in-out"
          >
            Pricing
          </Link>
        </li>
        <li>
          <Link
            href="/terms"
            className="hover:text-neutral-900 transition duration-300 ease-in-out"
          >
            Terms Of Use
          </Link>
        </li>
        <li>
          <Link
            href="#"
            className="hover:text-neutral-900 transition duration-300 ease-in-out"
          >
            Documentation
          </Link>
        </li>
      </ul>
      <Link
        href="/dashboard"
        className="bg-[#C60D69] px-4 py-2 rounded-sm text-white"
      >
        30 Days Free Trial
      </Link>
    </div>
  );
}

export default NavBar;
