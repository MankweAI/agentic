"use server";

import { client } from "@/lib/prisma";
import {
  extractEmailsFromString,
  extractURLfromString,
  extractPhoneNumber,
} from "@/lib/utils";
import { onRealTimeChat } from "../conversation";
import { clerkClient } from "@clerk/nextjs";
import { onMailer } from "../mailer";
import OpenAi from "openai";

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
        chatBot: {
          select: {
            id: true,
            welcomeMessage: true,
            agentName: true,
            icon: true,
            textColor: true,
            background: true,
            helpdesk: true,
          },
        },
      },
    });

    // console.log("-------CHATBOT id ", chatbot);

    if (chatbot) {
      return chatbot;
    }
  } catch (error) {
    console.log(error);
  }
};

let customerNumber: string | undefined;

export const onAiChatBotAssistant = async (
  id: string,
  chat: { role: "assistant" | "user"; content: string }[],
  author: "user",
  message: string
) => {
  // console.log("******************** ID CARD ", id);

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
      const extractedPhoneNumber = extractPhoneNumber(message);
      if (extractedPhoneNumber) {
        customerNumber = extractedPhoneNumber[0];
      }

      if (customerNumber) {
        const checkCustomer = await client.domain.findUnique({
          where: {
            id,
          },
          select: {
            User: {
              select: {
                clerkId: true,
              },
            },
            name: true,
            customer: {
              where: {
                email: {
                  startsWith: customerNumber,
                },
              },
              select: {
                id: true,
                email: true,
                questions: true,
                chatRoom: {
                  select: {
                    id: true,
                    live: true,
                    mailed: true,
                  },
                },
              },
            },
          },
        });
        if (checkCustomer && !checkCustomer.customer.length) {
          const newCustomer = await client.domain.update({
            where: {
              id,
            },
            data: {
              customer: {
                create: {
                  email: customerNumber,
                  chatRoom: {
                    create: {},
                  },
                },
              },
            },
            include: {
              customer: {
                select: {
                  id: true,
                },
              },
            },
          });
          if (newCustomer) {
            const customerId = newCustomer.customer;
            const newCustomerId = customerId[customerId.length - 1];

            const chatCompletion = await openai.chat.completions.create({
              messages: [
                {
                  role: "assistant",
                  content: `

              At this point, the customer has made a clear intention of wanting our agents to call them back and they want to proceed to request a call. Send them this link http://localhost:3000/portal/${id}/appointment/${newCustomerId}, ask them to proceed to make a call request, thank them for stopping by and ask if there is still anything else you can help them with.

              Always maintain character and stay respectfull.

              if the customer says something out of context or inapporpriate. Simply say this is beyond you and suggest that they request a callback. If they agree, send them the same link given to you above.
          `,
                },
                ...chat,
                {
                  role: "user",
                  content: message,
                },
              ],
              model: "gpt-3.5-turbo",
            });

            if (chatCompletion) {
              const generatedLink = extractURLfromString(
                chatCompletion.choices[0].message.content as string
              );

              if (generatedLink) {
                const link = generatedLink[0];
                const response = {
                  role: "assistant",
                  content: `Great! you can follow the link to proceed`,
                  link: link.slice(0, -1),
                };

                return { response };
              }

              const response = {
                role: "assistant",
                content: chatCompletion.choices[0].message.content,
              };

              return { response };
            }
          }
        }
      }
      console.log("No customer");
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "assistant",
            content: `
            [${chatBotDomain.trainingData}]
          `,
          },
          ...chat,
          {
            role: "user",
            content: message,
          },
        ],
        model: "gpt-3.5-turbo",
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
