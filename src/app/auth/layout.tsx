import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
  const user = await currentUser();

  if (user) redirect("/");

  return (
    <div className="h-screen flex w-full justify-center">
      <div className="w-[600px] ld:w-full flex flex-col items-center p-6">
        <Image
          src="/images/agentic-ai-logo.svg"
          alt="LOGO"
        
          style={{
            width: "40%",
            height: "20%",
          }}
          width={40}
          height={40}
        />
        {children}
      </div>
      <div className="hidden lg:flex flex-1 w-full max-h-full max-w-4000px overflow-hidden relative bg-cream  flex-col pt-10 pl-24 gap-3">
        <h2 className="text-gravel md:text-4xl font-bold">
          Touch your customers with Agentic!
        </h2>
        <p className="text-muted-foreground max-w-lg">
          Agentic is a customer relationship management system that helps you
          reach out to your customers with ease.
        </p>
        <Image
          src="/images/app-ui.png"
          alt="app image"
          loading="lazy"
          sizes="30"
          className="absolute shrink-0 !w-[1300px] top-40"
          width={0}
          height={0}
        />
      </div>
    </div>
  );
};

export default Layout;
