import { ref, push, update, get, set } from "firebase/database";
import { database } from "../../../lib/firebaseConfig";


export default async function handler(req, res) {
  //   console.log("API route called!");

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { domain, chatroom } = req.query;

  try {
    const chatroomRef = ref(database, `domain/${domain}/chatrooms/${chatroom}`);
    const chatroomSnapshot = await get(chatroomRef);

    if (!chatroomSnapshot.exists()) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    const messages = chatroomSnapshot.val();

    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve messages" });
  }
}
