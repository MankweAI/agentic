// import { NextApiRequest, NextApiResponse } from "next/types";
import { database } from "../../../lib/firebaseConfig";
import { ref, push, update, get, set } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
// import { ref, push, update, get } from "firebase/database";

export default async function handler(req, res) {
  console.log("API route called!");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { domain, chatroom, message, role, messageId } = req.body;

  try {
    const chatroomRef = ref(database, `domain/${domain}/chatrooms/${chatroom}`);
    const chatroomSnapshot = await get(chatroomRef);

    if (!chatroomSnapshot.exists()) {
      // If chatroom doesn't exist, create it with initial data
      const chatroomData = {
        starred: false,
        id: chatroom,
        createdAt: Date.now(),
        seen: false,
        message: [],
      };
      await set(chatroomRef, chatroomData);
    }

    // Add the new message to the existing or newly created chatroom
    const messageRef = ref(
      database,
      `domain/${domain}/chatrooms/${chatroom}/message`
    );
    const newMessageRef = push(messageRef);
    await set(newMessageRef, {
      message: message,
      createdAt: Date.now(),
      seen: false,
      role: role,
      messageId: messageId,
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
