"use client"
import Image from "next/image";
import * as React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
// import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { useState } from "react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex justify-between items-center px-2 py-2 sm:py-3 md:py-3 font-bold border-b border-solid border-zinc-100 leading-[154.5%] w-full">
      <div className="flex justify-center items-center tracking-tighter text-neutral-700">
        <Image
          src="/images/agentic-ai-logo.svg"
          alt="LOGO"
          width={30} // This width and height are required for the Image component but will be overridden by the className styles.
          height={30}
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-15 lg:h-15"
        />
        <h4 className="text-sm sm:text-lg md:text-xl lg:text-2xl text-center ml-2">
          agentic
        </h4>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-5 justify-between text-sm leading-5 text-neutral-700 font-normal">
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

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu} aria-label="Toggle Menu">
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6 text-neutral-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-neutral-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="absolute top-12 left-0 w-full bg-white border-t border-solid border-zinc-100 flex flex-col gap-3 px-4 py-3 text-sm leading-5 text-neutral-700 font-normal md:hidden items-center justify-center">
          <li>
            <Link
              href="/"
              className={`hover:text-neutral-900 transition duration-300 ease-in-out ${
                pathname === "/" ? "active" : ""
              }`}
              onClick={toggleMenu}
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
              onClick={toggleMenu}
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
              onClick={toggleMenu}
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
              onClick={toggleMenu}
            >
              Documentation
            </Link>
          </li>
        </ul>
      )}

      <button
        className="bg-[#C60D69] px-2 py-1 text-xs rounded-sm text-white sm:px-3 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-4 lg:text-lg"
        onClick={() => router.push(`/conversation?plan=${""}`)}
      >
        30 Days Free Trial
      </button>
    </div>
  );
}

export default NavBar;

