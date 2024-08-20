import React from "react";
import Image from "next/image";

type ChatPopupProps = Record<"icon", string | null | undefined>;

const ChatPopup = ({ icon }: ChatPopupProps) => {
  return (
    <div className="flex items-center min-w-[200px] w-auto h-auto bg-muted rounded-full shadow-md px-3 py-1">
      {/* Child A: Profile Picture */}
      <div className="relative flex items-center justify-center w-15 h-14 rounded-full border-2  shadow-md">
        <Image
          src={`https://ucarecdn.com/${icon}/`}
          alt="bot"
          height={50}
          width={50}
          className="rounded-full"
        />
        {/* Green Dot */}

        <div
          className="absolute w-3 h-3 bg-muted rounded-full border-2.5 "
          style={{ bottom: "2px", right: "2px" }}
        >
          {" "}
          <div
            className="absolute w-3 h-3 bg-green-500 rounded-full border-2.5 border-white animate-ping "
            style={{ bottom: "2px", right: "2px" }}
          ></div>
        </div>
      </div>

      {/* Child B: Text Section */}
      <div className="ml-3">
        <h2 className="text-md font-semibold">Ask Mankwe </h2>
        <p className="text-xs text-gray-500">online</p>
      </div>
    </div>
  );
};

export default ChatPopup;
