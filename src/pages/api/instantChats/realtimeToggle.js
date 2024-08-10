// import { NextApiRequest, NextApiResponse } from "next/types";
import { database } from "../../../lib/firebaseConfig";
import { ref, set, onValue, get } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  // console.log("API route called!");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { domainId, liveStatus } = req.body;

  // Section A
  try {
    const domainRef = ref(database, `domain`);
    const liveStatusRef = ref(database, `domain/${domainId}/liveStatus`);

    // Check if the domain already exists
    const domainSnapshot = await get(domainRef);

    if (!domainSnapshot.exists()) {
      // If the domain does not exist, create it
      await set(domainRef, {
        id: domainId, // Set the domain's ID
        createdAt: Date.now(), // Set a creation timestamp or any other initial data
        liveStatus: liveStatus, // Initialize liveStatus
      });
    } else {
      // If the domain exists, just update the liveStatus
      await set(liveStatusRef, liveStatus);
    }

    // Section B

    // Return a success response with the new status value
    return res.status(200).json({
      message: "Live status updated successfully",
      liveStatus: liveStatus,
    });
  } catch (error) {
    // Return an error response
    console.error(error);
    return res.status(500).json({ message: "Error updating live status" });
  }
}

// Used for chatbot online status
function listenForStatusChanges(domainId, callback) {
  const statusRef = ref(database, `domain/${domainId}/liveStatus`);

  onValue(statusRef, (snapshot) => {
    const liveStatus = snapshot.val();
    callback(liveStatus);
  });
}
export { listenForStatusChanges };

// Should the above function be exported?
