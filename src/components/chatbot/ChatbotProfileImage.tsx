import React from "react";
import Image from "next/image";


type ChatPopupProps = {
  theme: string | null | undefined;
};

interface GradientBorderImageProps extends ChatPopupProps {
  src: string;
}


const ChatbotProfileImage: React.FC<GradientBorderImageProps> = ({
  src,
  theme,
}) => {
  const colorObject = theme ? JSON.parse(theme) : null;
  const toRgbaString = (color: any) => {
    if (!color) return "rgba(255, 255, 255, 1)"; // Default to white if color is null or undefined
    if (color === "white") return "rgba(255, 255, 255, 1)"; // Return white
    if (color === "black") return "rgba(0, 0, 0, 1)"; // Return black
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  };

  const borderColor = toRgbaString(colorObject);

  return (
    <div
      className="relative inline-block rounded-full p-0.5 bg-clip-border"
      style={{
        border: `0.2px solid ${borderColor}`,
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
