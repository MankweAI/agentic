import { Button } from "@/components/ui/button";
import Link from "next/link";
import NavBar from "@/components/navbar";
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

export default async function Pricing() {
  return (
    <div className="h-auto w-full">
      <NavBar />
      <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8 xl:p-10 bg-white rounded-lg shadow-lg">
        <div className="m-8 w-full flex flex-col items-center justify-center">
          <h1 className="text-2xl   font-bold text-[#C60D69]">Price Plans</h1>
          <p className="text-muted-foreground text-center max-w-lg">
            We recommend starting with our free 30-day trial to ensure our
            solution meets your business needs.
          </p>
        </div>
        <div className="flex  justify-center gap-4 flex-wrap m-12">
          {pricingCards.map((card) => (
            <Card
              key={card.title}
              className={clsx("w-[300px] flex flex-col justify-between", {
                "border-2 border-primary": card.title === "Unlimited",
              })}
            >
              <CardHeader>
                <CardTitle className="text-[#C60D69]">{card.title}</CardTitle>
                <CardDescription>
                  {
                    pricingCards.find((c) => c.title === card.title)
                      ?.description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">{card.price}</span>
                <span className="text-muted-foreground">
                  <span>/ {card.duration}</span>
                </span>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feature) => (
                    <div key={feature} className="flex gap-2">
                      <Check />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/`}
                  className="bg-[#ffd7ec] border-[#C60D69] border-2 p-2 w-full text-center font-bold rounded-md"
                >
                  Get In Touch
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
