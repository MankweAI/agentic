import TabsMenu from "@/components/tabs/intex";
import { TabsContent } from "@/components/ui/tabs";
import { HELP_DESK_TABS_MENU } from "@/constants/menu";
import React from "react";
import HelpDesk from "./help-desk";
import AiTrainingData from "./filter-questions";

type Props = {
  id: string;
};

const BotTrainingForm = ({ id }: Props) => {
  return (
    <div className="py-5 mb-10 flex flex-col gap-5 items-start">
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-2xl">Chatbot</h2>
        <p className="text-sm font-light">
          Set FAQs and
          create your chatbot's brain.
        </p>
      </div>
      <TabsMenu triggers={HELP_DESK_TABS_MENU}>
        <TabsContent value="Help Desk" className="w-full">
          <HelpDesk id={id} />
        </TabsContent>
        <TabsContent value="AI Training">
          <AiTrainingData id={id} />
        </TabsContent>
      </TabsMenu>
    </div>
  );
};

export default BotTrainingForm;
