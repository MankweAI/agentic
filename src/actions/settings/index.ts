"use server";
import { client } from "@/lib/prisma";
import { clerkClient, currentUser } from "@clerk/nextjs";

export const onIntegrateDomain = async (domain: string, icon: string) => {
  const user = await currentUser();
  if (!user) return;
  try {
    const subscription = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        _count: {
          select: {
            domains: true,
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    const domainExists = await client.user.findFirst({
      where: {
        clerkId: user.id,
        domains: {
          some: {
            name: domain,
          },
        },
      },
    });

    if (!domainExists) {
      if (
        (subscription?.subscription?.plan == "STANDARD" &&
          subscription._count.domains < 1) ||
        (subscription?.subscription?.plan == "PRO" &&
          subscription._count.domains < 5) ||
        (subscription?.subscription?.plan == "ULTIMATE" &&
          subscription._count.domains < 10)
      ) {
        const newDomain = await client.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            domains: {
              create: {
                name: domain,
                icon,
                chatBot: {
                  create: {
                    welcomeMessage: "Hey there, have  a question? Text us here",
                  },
                },
              },
            },
          },
        });

        if (newDomain) {
          return { status: 200, message: "Domain successfully added" };
        }
      }
      return {
        status: 400,
        message:
          "You've reached the maximum number of domains, upgrade your plan",
      };
    }
    return {
      status: 400,
      message: "Domain already exists",
    };
  } catch (error) {
    console.log(error);
  }
};

export const onGetSubscriptionPlan = async () => {
  try {
    const user = await currentUser();
    if (!user) return;
    const plan = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (plan) {
      return plan.subscription?.plan;
    }
  } catch (error) {
    console.log(error);
  }
};

export const onGetAllAccountDomains = async () => {
  const user = await currentUser();
  if (!user) return;
  try {
    const domains = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        domains: {
          select: {
            name: true,
            icon: true,
            id: true,
            customer: {
              select: {
                chatRoom: {
                  select: {
                    id: true,
                    live: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return { ...domains };
  } catch (error) {
    console.log(error);
  }
};
export const onUpdatePassword = async (password: string) => {
  try {
    const user = await currentUser();

    if (!user) return null;
    const update = await clerkClient.users.updateUser(user.id, { password });
    if (update) {
      return { status: 200, message: "Password updated" };
    }
  } catch (error) {
    console.log(error);
  }
};

export const onGetCurrentDomainInfo = async (domain: string) => {
  const user = await currentUser();
  if (!user) return;
  try {
  console.log("------------DOMAIN 0", user);

    const userDomain = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        domains: {
          where: {
            name: {
              contains: domain,
            },
          },
          select: {
            id: true,
            name: true,
            icon: true,
            userId: true,
            products: true,
            chatBot: {
              select: {
                id: true,
                welcomeMessage: true,
                welcomeMessageOutside: true,
                agentName: true,
                icon: true,
              },
            },
          },
        },
      },
    });
    if (userDomain) {
  console.log("------------DOMAIN 1", userDomain);

      return userDomain;
    }
  } catch (error) {
  console.log("------------DOMAIN 2", error);

    console.log(error);
  }
};

export const onUpdateDomain = async (id: string, name: string) => {
  try {
    //check if domain with name exists
    const domainExists = await client.domain.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    });

    if (!domainExists) {
      const domain = await client.domain.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      if (domain) {
        return {
          status: 200,
          message: "Domain updated",
        };
      }

      return {
        status: 400,
        message: "Oops something went wrong!",
      };
    }

    return {
      status: 400,
      message: "Domain with this name already exists",
    };
  } catch (error) {
    console.log(error);
  }
};

export const onChatBotImageUpdate = async (id: string, icon: string) => {
  const user = await currentUser();

  if (!user) return;

  try {
    const domain = await client.domain.findUnique({
      where: {
        id,
      },
      include: {
        chatBot: true,
      },
    });

    if (domain?.chatBot) {
      await client.chatBot.update({
        where: {
          id: domain.chatBot.id,
        },
        data: {
          icon,
        },
      });
    }

    return {
      status: 200,
      message: "ChatBot icon updated",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Oops something went wrong!",
    };
  }
};

export const onUpdateWelcomeMessage = async (
  message: string,
  domainId: string
) => {
  try {
    const domain = await client.domain.findUnique({
      where: {
        id: domainId,
      },
      include: {
        chatBot: true,
      },
    });

    if (domain?.chatBot) {
      await client.chatBot.update({
        where: {
          id: domain.chatBot.id,
        },
        data: {
          welcomeMessage: message,
        },
      });
    }

    return {
      status: 200,
      message: "Welcome message updated",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Oops something went wrong!",
    };
  }
};

export const onUpdateWelcomeMessageOutside = async (
  message: string,
  domainId: string
) => {
  try {
    const domain = await client.domain.findUnique({
      where: {
        id: domainId,
      },
      include: {
        chatBot: true,
      },
    });

    if (domain?.chatBot) {
      await client.chatBot.update({
        where: {
          id: domain.chatBot.id,
        },
        data: {
          welcomeMessageOutside: message,
        },
      });
    }

    return {
      status: 200,
      message: "Welcome message updated",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Oops something went wrong!",
    };
  }
};

export const onUpdateAgentName = async (message: string, domainId: string) => {
  try {
    const domain = await client.domain.findUnique({
      where: {
        id: domainId,
      },
      include: {
        chatBot: true,
      },
    });

    if (domain?.chatBot) {
      await client.chatBot.update({
        where: {
          id: domain.chatBot.id,
        },
        data: {
          agentName: message,
        },
      });
    }

    return {
      status: 200,
      message: "Welcome message updated",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Oops something went wrong!",
    };
  }
};

export const onUpdateBackroundColorAndText = async (
  background: string | undefined,
  textColor: string | undefined,
  domainId: string
) => {
  console.log(`Selected color is now: ${textColor}`);

  try {
    const domain = await client.domain.findUnique({
      where: {
        id: domainId,
      },
      include: {
        chatBot: true,
      },
    });

    if (domain?.chatBot) {
      const dataToUpdate: { background?: string; textColor?: string } = {};

      if (background !== undefined && background !== null) {
        dataToUpdate.background = background;
      }

      if (textColor !== undefined && textColor !== null) {
        dataToUpdate.textColor = textColor;
      }

      await client.chatBot.update({
        where: {
          id: domain.chatBot.id,
        },
        data: dataToUpdate,
      });
    }

    return {
      status: 200,
      message: "GOT IT SO RIGHT!!!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      message: "Oops something went wrong!",
    };
  }
};

export const onDeleteUserDomain = async (id: string) => {
  const user = await currentUser();

  if (!user) return;

  try {
    //first verify that domain belongs to user
    const validUser = await client.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
      },
    });

    if (validUser) {
      // Check that domain belongs to this user and delete
      const deletedDomain = await client.domain.delete({
        where: {
          id: id,
        },
        select: {
          name: true,
        },
      });

      if (deletedDomain) {
        return {
          status: 200,
          message: `${deletedDomain.name} was deleted successfully`,
        };
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const onCreateHelpDeskQuestion = async (
  id: string,
  question: string,
  answer: string
) => {
  try {
    const helpDeskQuestion = await client.domain.update({
      where: {
        id,
      },
      data: {
        helpdesk: {
          create: {
            question,
            answer,
          },
        },
      },
      include: {
        helpdesk: {
          select: {
            id: true,
            question: true,
            answer: true,
          },
        },
      },
    });

    if (helpDeskQuestion) {
      return {
        status: 200,
        message: "New help desk question added",
        questions: helpDeskQuestion.helpdesk,
      };
    }

    return {
      status: 400,
      message: "Oops! something went wrong",
    };
  } catch (error) {
    console.log(error);
  }
};

export const onGetAllHelpDeskQuestions = async (id: string) => {
  try {
    const questions = await client.helpDesk.findMany({
      where: {
        domainId: id,
      },
      select: {
        question: true,
        answer: true,
        id: true,
      },
    });

    return {
      status: 200,
      message: "New help desk question added",
      questions: questions,
    };
  } catch (error) {
    console.log(error);
  }
};

export const onCreateTrainingData = async (
  id: string,
  trainingData: string
) => {
  try {
    const updatedDomain = await client.domain.update({
      where: {
        id,
      },
      data: {
        trainingData,
      },
    });

    if (updatedDomain) {
      return {
        status: 200,
        message: "Filter question added",
        trainingData: updatedDomain.trainingData,
      };
    }
    return {
      status: 400,
      message: "Oops! something went wrong",
    };
  } catch (error) {
    console.log(error);
  }
};

export const onGetTrainingData = async (id: string) => {
  try {
    const domain = await client.domain.findUnique({
      where: {
        id,
      },
      select: {
        trainingData: true,
      },
    });

    if (domain) {
      return {
        status: 200,
        message: "Training data retrieved",
        trainingData: domain.trainingData,
      };
    } else {
      return {
        status: 404,
        message: "Domain not found",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

export const onGetPaymentConnected = async () => {
  try {
    const user = await currentUser();
    if (user) {
      const connected = await client.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          stripeId: true,
        },
      });
      if (connected) {
        return connected.stripeId;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const onCreateNewDomainProduct = async (
  id: string,
  name: string,
  image: string,
  price: string
) => {
  try {
    const product = await client.domain.update({
      where: {
        id,
      },
      data: {
        products: {
          create: {
            name,
            image,
            price: parseInt(price),
          },
        },
      },
    });

    if (product) {
      return {
        status: 200,
        message: "Product successfully created",
      };
    }
  } catch (error) {
    console.log(error);
  }
};
