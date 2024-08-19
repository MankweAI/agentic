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

let customerEmail: string | undefined;
let customerNumber: string | undefined

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
        filterQuestions: {
          where: {
            answered: null,
          },
          select: {
            question: true,
          },
        },
      },
    });
    if (chatBotDomain) {
      const extractedPhoneNumber = extractPhoneNumber(message);
      if (extractedPhoneNumber) {
        customerNumber = extractedPhoneNumber[0]
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
                  questions: {
                    create: chatBotDomain.filterQuestions,
                  },
                  chatRoom: {
                    create: {},
                  },
                },
              },
            },
          });
          if (newCustomer) {
            console.log("new customer made");
            const response = {
              role: "assistant",
              content: `Welcome aboard! I'm glad to connect with you. Is there anything you need help with?`,
            };
            return { response };
          }
        }

        await onStoreConversations(
          checkCustomer?.customer[0].chatRoom[0].id!,
          message,
          author
        );

        const chatCompletion = await openai.chat.completions.create({
          messages: [
            {
              role: "assistant",
              content: `

              At this point, the customer has made a clear intention of wanting our agents to call them back and they want to proceed to request a call. Send them this link http://localhost:3000/portal/${id}/appointment/${checkCustomer?.customer[0].id}, ask them to proceed to make a call request, thank them for stopping by and ask if there is still anything else you can help them with.

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

        if (chatCompletion.choices[0].message.content?.includes("(realtime)")) {
          const realtime = await client.chatRoom.update({
            where: {
              id: checkCustomer?.customer[0].chatRoom[0].id,
            },
            data: {
              live: true,
            },
          });

          if (realtime) {
            const response = {
              role: "assistant",
              content: chatCompletion.choices[0].message.content.replace(
                "(realtime)",
                ""
              ),
            };

            await onStoreConversations(
              checkCustomer?.customer[0].chatRoom[0].id!,
              response.content,
              "assistant"
            );

            return { response };
          }
        }
        if (chat[chat.length - 1].content.includes("(complete)")) {
          const firstUnansweredQuestion =
            await client.customerResponses.findFirst({
              where: {
                customerId: checkCustomer?.customer[0].id,
                answered: null,
              },
              select: {
                id: true,
              },
              orderBy: {
                question: "asc",
              },
            });
          if (firstUnansweredQuestion) {
            await client.customerResponses.update({
              where: {
                id: firstUnansweredQuestion.id,
              },
              data: {
                answered: message,
              },
            });
          }
        }

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

            await onStoreConversations(
              checkCustomer?.customer[0].chatRoom[0].id!,
              `${response.content} ${response.link}`,
              "assistant"
            );

            return { response };
          }

          const response = {
            role: "assistant",
            content: chatCompletion.choices[0].message.content,
          };

          await onStoreConversations(
            checkCustomer?.customer[0].chatRoom[0].id!,
            `${response.content}`,
            "assistant"
          );

          return { response };
        }
      }
      console.log("No customer");
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "assistant",
            content: `

            [${chatBotDomain.trainingData}]
            You are a highly knowledgeable and experienced sales representative for a ${chatBotDomain.name} that offers a valuable product or service. Your goal is to have a natural, human-like conversation with the customer in order to understand their needs, provide relevant information, and ultimately guide them towards making a purchase or redirect them to a link if they havent provided all relevant information.
            Right now you are talking to a customer for the first time. Start by giving them a warm welcome on behalf of ${chatBotDomain.name} and make them feel welcomed.

            Your next task is lead the conversation naturally to get the customers name and contact number. Address them by their name. Be respectful and never break character

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
