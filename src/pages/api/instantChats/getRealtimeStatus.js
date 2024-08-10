import { ref, push, update, get } from "firebase/database";
import { database } from "../../../lib/firebaseConfig";


export default async function handler(req, res) {
  console.log("API route called!");
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { domainId } = req.query;

  // Check if domainId is provided
  if (!domainId) {
    return res.status(400).json({ message: "Domain ID is required" });
  }

  try {

    const liveStatusRef = ref(database, `domain/${domainId}/liveStatus`);

    // Get the live status from the database
      const liveStatus = await get(liveStatusRef);
      

    // Return a success response with the live status value
    return res.status(200).json({
      message: "Live status retrieved successfully",
      liveStatus: liveStatus.val(),
    });
  } catch (error) {
    // Return an error response

    console.error(error);
    return res.status(500).json({ message: "Error retrieving live status" });
  }
}
