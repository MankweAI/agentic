"use server";

import { client } from "@/lib/prisma";
import {
  extractEmailsFromString,
  extractURLfromString,
  isString,
  containsGreeting,
} from "@/lib/utils";
import { onRealTimeChat } from "../conversation";
import { clerkClient } from "@clerk/nextjs";
import { onMailer } from "../mailer";
import OpenAi from "openai";
import RealTimeMode from "@/components/chatbot/real-time";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAi({
  apiKey: process.env.OPEN_AI_KEY,
});

export const onStoreConversations = async (
  id: string,
  message: string,
  role: "assistant" | "user"
) => {
  await client.chatRoom.update({
    where: {
      id,
    },
    data: {
      message: {
        create: {
          message,
          role,
        },
      },
    },
  });
};

export const onGetCurrentChatBot = async (id: string) => {
  try {
    const chatbot = await client.domain.findUnique({
      where: {
        id,
      },
      select: {
        helpdesk: true,
        name: true,
        live: true,
        chatBot: {
          select: {
            id: true,
            welcomeMessage: true,
            icon: true,
            textColor: true,
            background: true,
            helpdesk: true,
          },
        },
      },
    });

    if (chatbot) {
      return chatbot;
    }
  } catch (error) {
    console.log(error);
  }
};


export const onAiChatBotAssistant = async (
  id: string,
  chat: { role: "assistant" | "user"; content: string }[],
  author: "user",
  message: string
) => {
  try {
const chatBotDomain = await client.domain.findUnique({
  where: {
    id,
  },
  select: {
    name: true,
    trainingData: true, 
  },
});
    if (chatBotDomain) {
      console.log("********** DOMAIN ID", id);
      
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "assistant",
            content: `
            ${chatBotDomain.trainingData}.

            If the customer agrees to book an appointment send them this link http://localhost:3000/portal/${id}/appointment/
			
            Right now you are talking to a customer for the first time. Start by giving them a warm welcome on behalf of ${chatBotDomain.name} and make them feel welcomed.

            if the customer says something out of context or inapporpriate. Simply say this is beyond you and suggest that they book a call with one of our agents.
            

            Your next task is lead the conversation naturally. Be respectful and never break character.

          `,
          },
          ...chat,
          {
            role: "user",
            content: message,
          },
        ],
        model: "gpt-4o",
      });

      if (chatCompletion) {
        const response = {
          role: "assistant",
          content: chatCompletion.choices[0].message.content,
        };

        return { response };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
