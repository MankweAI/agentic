"use client";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/hooks/settings/use-settings";
import React from "react";
import { DomainUpdate } from "./domain-update";
import CodeSnippet from "./code-snippet";
import PremiumBadge from "@/icons/premium-badge";
import EditChatbotIcon from "./edit-chatbot-icon";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import  ColorPicker  from "@/components/ui/color-picker";
import { Loader } from "@/components/loader";
import { useState } from "react";
import TextColorSelector from "../../ui/textColorSelector";



const AgentName = dynamic(
  () => import("./agent-name").then((props) => props.default),
  {
    ssr: false,
  }
);

const WelcomeMessageOutside = dynamic(
  () => import("./outside-greetings-message").then((props) => props.default),
  {
    ssr: false,
  }
);

const WelcomeMessage = dynamic(
  () => import("./greetings-message").then((props) => props.default),
  {
    ssr: false,
  }
);



type Props = {
  id: string;
  name: string;
  plan: "STANDARD" | "PRO" | "ULTIMATE";
  chatBot: {
    id: string;
    icon: string | null;
    welcomeMessage: string | null;
    agentName: string | null;
    welcomeMessageOutside: string | null;
  } | null;
};

interface Color {
  r: string;
  g: string;
  b: string;
  a: string;
}

const SettingsForm = ({ id, name, chatBot, plan }: Props) => {
  const [color, setColor] = useState<Color>({
    r: "241",
    g: "112",
    b: "19",
    a: "1",
  });

  const [selectedColor, setSelectedColor] = useState<"white" | "black">(
    "white"
  );
  

  // Function to create a JSON object from the color
  const createColorJson = ({ r, g, b, a }: Color) => {
    return {
      color: {
        r: parseInt(r),
        g: parseInt(g),
        b: parseInt(b),
        a: parseFloat(a),
      },
    };
  };

  const colorJson = createColorJson(color);


  const {
    register,
    onUpdateSettings,
    errors,
    onDeleteDomain,
    onClickSaveButton,
    deleting,
    loading,
  } = useSettings(id);

    const handleClick = () => {
      onClickSaveButton(id, colorJson.color, selectedColor);
  };
  
    const handleColorChange = (color: "white" | "black") => {
      setSelectedColor(color);
      // Handle the color change, e.g., update global state, make API calls, etc.
    };

  return (
    <form className="flex flex-col gap-8 pb-10" onSubmit={onUpdateSettings}>
      <div className="flex flex-col gap-3 mt-5">
        <div className="flex gap-4 items-center">
          <h2 className="font-bold text-2xl">Chatbot Settings</h2>
          {/* <div className="flex gap-1 bg-black rounded-full px-3 py-1 text-xs items-center font-bold">
            <PremiumBadge />
            Premium
          </div> */}
        </div>
        <Separator orientation="horizontal" />
        <h4 className="font-bold text-md">Agent On Duty</h4>

        <div className="grid md:grid-cols-2">
          <div className="col-span-1 flex flex-col gap-5 order-last md:order-first">
            <AgentName
              message={chatBot?.agentName!}
              register={register}
              errors={errors}
            />

            <WelcomeMessageOutside
              message={chatBot?.welcomeMessageOutside!}
              register={register}
              errors={errors}
            />

            <WelcomeMessage
              message={chatBot?.welcomeMessage!}
              register={register}
              errors={errors}
            />

            <EditChatbotIcon
              chatBot={chatBot}
              register={register}
              errors={errors}
            />

            <Separator orientation="horizontal" />
            <h4 className="font-bold text-md">Chatbot Theme</h4>

            <ColorPicker color={color} setColor={setColor} />

            <div className="w-[200px]">
              <TextColorSelector onSelectColor={handleColorChange} />
            </div>
          </div>
          <div className="col-span-1 relative ">
            <Image
              src="/images/bot-ui.png"
              className="sticky top-0"
              alt="bot-ui"
              width={530}
              height={769}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-5 justify-center">
        <Button
          onClick={handleClick}
          type="submit"
          className="w-[400px] h-[50px]"
        >
          <Loader loading={loading}>Save</Loader>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-2xl">Domain Settings</h2>
        <Separator orientation="horizontal" />
        <DomainUpdate name={name} register={register} errors={errors} />
        <CodeSnippet id={id} />
      </div>
    </form>
  );
};

export default SettingsForm;
