import { database } from "../../../lib/firebaseConfig";
import { ref, get } from "firebase/database";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ message: "Domain is required" });
  }

  try {
    const chatroomsRef = ref(database, `domain/${domain}/chatrooms`);
    const snapshot = await get(chatroomsRef);

    if (!snapshot.exists()) {
      return res
        .status(404)
        .json({ message: "No chatrooms found for this domain" });
    }

    const chatrooms = [];
    snapshot.forEach((chatroomSnapshot) => {
      const chatroomData = chatroomSnapshot.val();

      // Extract the latest message if it exists
      let latestMessage = null;

      Object.values(chatroomData.message).forEach((innerObject) => {

        //   console.log(innerObject.message);
          latestMessage = innerObject.message
      });

      if (chatroomData.message && chatroomData.message.length > 0) {
        latestMessage = chatroomData.message.reduce((latest, current) => {
          return new Date(current.createdAt) > new Date(latest.createdAt)
            ? current
            : latest;
        });
      }

      // Include only the necessary chatroom data along with the latest message
      chatrooms.push({
        id: chatroomSnapshot.key, // Chatroom ID
        starred: chatroomData.starred,
        createdAt: chatroomData.createdAt,
        latestMessage, // Include only the latest message
      });
    });

        // console.log("..................... 101", chatrooms);
      
    res.status(200).json(chatrooms);
  } catch (error) {
    console.error("Error retrieving chatrooms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
