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

// import { getMonthName } from '@/lib/utils'

export default async function Home() {
  const posts:
    | {
        id: string;
        title: string;
        image: string;
        content: string;
        createdAt: Date;
      }[]
    | undefined = await onGetBlogPosts();
  // console.log("BLOG POST ID: ", posts)

  return (
    <main>
      <NavBar />
      <div className="container mx-auto max-w-6xl p-4 md:p-6 lg:p-8 xl:p-10 bg-white shadow-2xl border-2 border-b-2 border-r-2 border-l-2 border-t-0 flex flex-col justify-center items-center gap-4">
        <section className="flex justify-center items-center flex-col gap-4 mt-8">
          <h1 className="text-6xl font-black text-center w-3/4">
            Bring the traffic,
            <br />
            <span className="text-[#C60D69]">
              We&apos;ll bring the revenue!{" "}
            </span>
          </h1>

          <div className="w-1/4 mt-8 ">
            <Link
              href={`/conversation?plan=${""}`}
              className="w-full flex justify-center"
            >
              <Button className="bg-[#C60D69] hover:bg-[#C60D69] transition duration-300 hover:scale-105 font-extrabold text-xl text-white w-full">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="w-3/4 p-3 bg-gray-700 rounded-xl mt-4">
            <VideoLoop />
          </div>
        </section>
        <section className="flex flex-row justify-between items-center w-full gap-4 mt-10">
          <div className="flex flex-col justify-between items-start w-1/2  gap-4 mt-10">
            <h1 className="text-5xl text-start font-bold">
              Sales Team Goes To Customer
            </h1>
            <p className=" text-start">
              Put your sales team or front desk in front of your customers the
              moment they need you. Turn every interaction into an opportunity
              for real-time human connection and rapid sales growth.
            </p>
          </div>
          <div className="flex justify-center items-start w-1/2 gap-4 mt-10">
            <Image
              src="/images/agentic-homepage1.png"
              width={500}
              height={200}
              alt="Logo"
              className="max-w-lg object-contain"
            />
          </div>
        </section>

        <section className="flex flex-row justify-between items-center w-full gap-4 mt-10">
          <div className="flex justify-center items-start w-1/2 gap-4 mt-10">
            <Image
              src="/images/agentic-homepage2.png"
              width={500}
              height={200}
              alt="Logo"
              className="max-w-lg object-contain"
            />
          </div>
          <div className="flex flex-col justify-between items-start w-1/2  gap-4 mt-10">
            <h1 className="text-5xl text-start font-bold">
              Unlock 10X revenue growth.
            </h1>
            <p className=" text-start">
              0nly 28% of your qualified leads will reach out on their own.
              Capture the other 72% by proactively engaging them and secure more
              sales.
            </p>
          </div>
        </section>
        <section className="md:grid-cols-3 grid-cols-1 grid gap-5 container mt-8">
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
        </section>
      </div>

      <ChatbotFrame />
    </main>
  );
}
