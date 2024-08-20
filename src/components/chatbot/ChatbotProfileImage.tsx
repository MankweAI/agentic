import React from "react";
import Image from "next/image";


interface GradientBorderImageProps {
  src: string;

}


const ChatbotProfileImage: React.FC<GradientBorderImageProps> = ({
  src
}) => {
  return (
    <div
      className="relative inline-block rounded-full p-0.5 bg-clip-border"
      style={{
        backgroundImage: "linear-gradient(to right,  #FF007F, #AD00FF)",
        borderRadius: "50%",
      }}
    >
      <Image
        src={src}
        alt={"Profile Image"}
        height={60}
        width={60}
        className="rounded-full"
      />
    </div>
  );
};

export default ChatbotProfileImage;
