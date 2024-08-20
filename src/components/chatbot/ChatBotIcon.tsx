import React from "react";
import { Bot } from "lucide-react"; // Import the icon you want to use

interface IconWrapperProps {
  icon: React.ReactNode;
  size?: number;
  color?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({
  icon,
  size = 22,
  color = "black",
}) => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {React.cloneElement(icon as React.ReactElement, { size, color })}
    </div>
  );
};

// Usage
const ChatBotIcon: React.FC = () => {
  return <IconWrapper icon={<Bot />} size={38} color="white" />;
};

export default ChatBotIcon;
