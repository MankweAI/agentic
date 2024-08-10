// import { NextApiRequest, NextApiResponse } from "next/types";
import { database } from "../../../lib/firebaseConfig";
import { ref, push, update, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  console.log("API route called!");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { domain, chatroom, message, role } = req.body;

  // Section A
  try {
    const messageRef = ref(
      database,
      `domain/${domain}/chatrooms/${chatroom}/messages`
    );

    const newMessageRef = push(messageRef);

await update(newMessageRef, {
  id: uuidv4(),
  message,
  role,
  createdAt: new Date(),
  seen: false,
});

    // Section B
    const newMessageSnapshot = await get(newMessageRef);
    const newMessageData = newMessageSnapshot.val();

    // Section C
    if (newMessageData) {
      const message = Object.values(newMessageData);
      const createdAtDate = new Date(newMessageData.createdAt);
      // console.log(Object.prototype.toString.call(createdAtDate.getDate()));
      // console.log(createdAtDate.getDate());

      return res.status(200).json({
        message: {
          id: newMessageData.id,
          role: newMessageData.role,
          message: newMessageData.message.message,
          createdAt: createdAtDate,
          seen: newMessageData.seen,
        },
      });
    } else {
      return res.status(404).json({ error: "No messages found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
