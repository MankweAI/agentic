// import { NextApiRequest, NextApiResponse } from "next/types";
import { database } from "../../../lib/firebaseConfig";
import {
  ref,
  push,
  update,
  get,
  set,
  runTransaction,
  child,
} from "firebase/database";
import { v4 as uuidv4 } from "uuid";
// import { ref, push, update, get } from "firebase/database";

// export default async function handler(req, res) {
//   console.log("API route called!");
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const { domain, chatroom, message, role, messageId } = req.body;

//   try {

//     const chatroomRef = ref(database, `domain/${domain}/chatrooms/${chatroom}`);
//     const chatroomSnapshot = await get(chatroomRef);

//     if (!chatroomSnapshot.exists()) {
//       // If chatroom doesn't exist, create it with initial data
//       const chatroomData = {
//         starred: false,
//         id: chatroom,
//         createdAt: Date.now(),
//         seen: false,
//         messages: [],
//         status: "active",
//       };
//       await set(chatroomRef, chatroomData);
//     }

//     // Add the new message to the existing or newly created chatroom
//     const messageRef = ref(
//       database,
//       `domain/${domain}/chatrooms/${chatroom}/messages`
//     );
//     const newMessageRef = push(messageRef);
//     await set(newMessageRef, {
//       message: message,
//       createdAt: Date.now(),
//       seen: false,
//       role: role,
//       messageId: messageId,
//     });

//     return res.status(200).json({
//       message: {
//         domainId: domain,
//         chatroomId: chatroom,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to send message" });
//   }
// }

//................................................

const uniqueId = uuidv4();
export default async function handler(req, res) {
  console.log("API route called!");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { domain, chatroom, message, role, messageId } = req.body;

  try {
    const chatroomRef = ref(database, `domain/${domain}/chatrooms/${chatroom}`);

    await runTransaction(chatroomRef, (currentChatroom) => {
      if (currentChatroom === null) {
        // If chatroom doesn't exist, create it with initial data
        currentChatroom = {
          starred: false,
          status: "active",
          messages: [], // Initialize as an empty array
        };
      }

      // Add the new message to the messages list (as an object)
      currentChatroom.messages.push({
        message: message,
        createdAt: Date.now(),
        seen: false,
        role: role,
        messageId: messageId,
        chatroomId: chatroom,
      });

      return currentChatroom; // Return the updated chatroom object
    });

    return res.status(200).json({
      message: {
        domainId: domain,
        chatroomId: chatroom,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
