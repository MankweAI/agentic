"use client";

import { onGetBlogPosts } from "@/actions/landing";
import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { pricingCards } from "@/constants/landing-page";
import clsx from "clsx";
import { ArrowRightCircleIcon, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import { getMonthName } from "@/lib/utils";
import ChatbotFrame from "@/components/iframe-react-code";
import VideoLoop from "@/components/VideoLoop";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";


// import { getMonthName } from '@/lib/utils'

export default function Home() {
  // const posts:
  //   | {
  //       id: string;
  //       title: string;
  //       image: string;
  //       content: string;
  //       createdAt: Date;
  //     }[]
  //   | undefined = await onGetBlogPosts();
  // console.log("BLOG POST ID: ", posts)
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    // Listen for the window load event
    const handleLoad = () => {
      console.log("****** LOADED");

      setIsPageLoaded(true);
    };

    // Check if the page is already loaded
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

    const router = useRouter();
    const pathname = usePathname();

  return (
    <div className="xl:container  w-full flex flex-col justify-center items-center">
      <NavBar />
      <div className="w-full h-auto shadow-2xl border-b-2 flex flex-col justify-center items-center gap-0">
        <section className="flex justify-center items-center flex-col gap-4 mt-8 p-2 sm:p-4 md:p-6 lg:p-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center w-full">
            SEO generates traffic,
            <br className="" />
            <span className="text-[#C60D69]">We generate revenue</span>
          </h1>

          <div className="sm:w-1/2 lg:w-1/4 w-3/4 mt-8">
            <Link
              href={`/conversation?plan=${""}`}
              className="w-full flex justify-center"
            >
              <Button className="bg-[#C60D69] hover:bg-[#C60D69] transition duration-300 hover:scale-105 font-extrabold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white w-full py-1 sm:py-2 md:py-3 lg:py-4 xl:py-5 2xl:py-6">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-3/4 xl:w-2/3 2xl:w-3/4 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 bg-gray-700 rounded-xl mt-2 sm:mt-3 md:mt-4 lg:mt-5 xl:mt-6 2xl:mt-7">
            <VideoLoop />
          </div>
        </section>
        <section className="flex flex-col sm:flex-row justify-between bg-gradient-to-b from-[#EDEAFF] to-[#EDEAFF] p-2 sm:p-4 md:p-6 lg:p-8 items-center w-full gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 mt-5 sm:mt-7 md:mt-10 lg:mt-12">
          <div className="flex flex-col justify-between items-start sm:w-full md:w-1/2 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 mt-5 sm:mt-7 md:mt-10 lg:mt-12 xl:mt-15">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl text-start font-bold">
              Leads Slipping Away?
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-start">
              Empower your sales team to engage your website visitors in
              real-time, and never let leads slip away again
            </p>
          </div>
          <div className="flex justify-center items-start w-full md:w-1/2 gap-4 mt-10">
            <Image
              src="/images/agentic-homepage1.png"
              width={500}
              height={200}
              alt="Logo"
              className="w-full object-contain"
            />
          </div>
        </section>

        <section className="flex  flex-col-reverse sm:flex-row justify-between bg-gradient-to-b from-[#EDEAFF] to-[#FFFFFF] p-2 sm:p-4 md:p-6 lg:p-8 items-center w-full gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 pt-5 sm:pt-7 md:pt-10 lg:pt-12">
          <div className="flex justify-center items-start w-full md:w-1/2 gap-4 mt-10">
            <Image
              src="/images/agentic-homepage2.png"
              width={500}
              height={200}
              alt="Logo"
              className="w-full object-contain"
            />
          </div>
          <div className="flex flex-col justify-between items-start sm:w-full md:w-1/2 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 mt-5 sm:mt-7 md:mt-10 lg:mt-12 xl:mt-15">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl text-start font-bold">
              Unlock 10X Revenue Growth.
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-start">
              Just a handful of your leads will reach out on their own. But you
              can go to them and 10X your revenue
            </p>
          </div>
        </section>
        {/* <section className="md:grid-cols-3 grid-cols-1 grid gap-5 container mt-8">
          {posts &&
            posts.map((post) => (
              <Link href={`/blogs/${post.id}`} key={post.id}>
                <Card className="flex flex-col gap-2 rounded-xl overflow-hidden h-full hover:bg-gray-100">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={`${process.env.CLOUDWAYS_UPLOADS_URL}${post.image}`}
                      alt="post featured image"
                      fill
                    />
                  </div>
                  <div className="py-5 px-10 flex flex-col gap-5">
                    <CardDescription>
                      {getMonthName(post.createdAt.getMonth())}{" "}
                      {post.createdAt.getDate()} {post.createdAt.getFullYear()}
                    </CardDescription>
                    <CardTitle>{post.title}</CardTitle>
                    {parse(post.content.slice(4, 100))}...
                  </div>
                </Card>
              </Link>
            ))}
        </section> */}

        <section className="flex flex-col sm:flex-row justify-between bg-gradient-to-b p-2 sm:p-4 md:p-6 lg:p-8 items-center w-full gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 mt-5 sm:mt-7 md:mt-10 lg:mt-12">
          <div className="flex flex-col justify-between items-start sm:w-full md:w-1/2 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 mt-5 sm:mt-7 md:mt-10 lg:mt-12 xl:mt-15">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-6xl text-start font-bold">
              24/7 Availability
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-start">
              Maintain 24/7 availability with our AI bot, which gives support on
              your services and also makes bookings for call-back requests.
            </p>
          </div>
          <div className="flex justify-center items-start w-full md:w-1/2 gap-4 mt-10">
            <Image
              src="/images/chatbot-homepage.png"
              width={500}
              height={200}
              alt="Logo"
              className="w-full object-contain"
            />
          </div>
        </section>

        <section className="flex justify-center items-center w-full h-[16rem] sm:h-[20rem] md:h-[24rem] lg:h-[28rem] mt-8 sm:mt-10 md:mt-13 lg:mt-[8rem]">
          <div className="relative flex flex-col w-full items-center justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bold">
              Ready to give us try?
            </h1>
            <div className="sm:w-1/2 lg:w-1/4 w-3/4 mt-8">
              <Link
                href={`/conversation?plan=${""}`}
                className="w-full flex justify-center"
              >
                <Button className="bg-[#C60D69] hover:bg-[#C60D69] transition duration-300 hover:scale-105 font-extrabold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-white w-full py-1 sm:py-2 md:py-3 lg:py-4 xl:py-5 2xl:py-6">
                  Get Free Trial
                </Button>
              </Link>
            </div>
            <div className="absolute inset-0 z-[-1] ">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[250px] h-[150px] sm:w-[300px] sm:h-[200px] md:w-[700px] md:h-[250px] lg:w-[800px] lg:h-[300px] bg-sky-100  from-white to-transparent rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[100px] sm:w-[200px] sm:h-[150px] md:w-[250px] md:h-[200px] lg:w-[300px] lg:h-[250px] bg-gradient-conic from-sky-200 via-blue-200 to-transparent blur-xl"></div>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-2 bg-sky-100 justify-center items-center w-full h-[16rem] sm:h-[20rem] md:h-[24rem] lg:h-[28rem] mt-8 sm:mt-10 md:mt-13 lg:mt-[8rem]">
          <div className="w-full h-full  flex justify-center items-center">
            <div className="flex justify-center items-center tracking-tighter text-neutral-700">
              <Image
                src="/images/agentic-ai-logo.svg"
                alt="LOGO"
                width={30} // This width and height are required for the Image component but will be overridden by the className styles.
                height={30}
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-15 lg:h-15"
              />
              <h1 className="text-xl md:text-2xl lg:text-3xl text-center font-bold">
                Agentic
              </h1>
            </div>
          </div>
          <div className="w-full h-full  flex justify-start items-center">
            <ul className="flex flex-col gap-5 justify-between text-sm leading-5 text-neutral-700 font-normal">
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
          </div>
        </section>

        {isPageLoaded && <ChatbotFrame />}
      </div>
    </div>
  );
}
