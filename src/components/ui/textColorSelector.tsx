import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";

interface TextColorSelectorProps {
  onSelectColor: (color: "white" | "black") => void;
}

const TextColorSelector: React.FC<TextColorSelectorProps> = ({
  onSelectColor,
}) => {
  const [selectedColor, setSelectedColor] = useState<"white" | "black">(
    "white"
  );

  const handleSelectColor = (value: string) => {
    const color = value as "white" | "black";
    setSelectedColor(color);
    onSelectColor(color);
  };

  return (
    <div className="w-[200px]">
      <Tabs.Root value={selectedColor} onValueChange={handleSelectColor}>
        <h1>Select Text Color</h1>
        <Tabs.List className="flex bg-gray-200 shadow-xl rounded-lg border-b border-gray-300">
          <Tabs.Trigger
            className={`flex-1 px-4 py-2 text-center cursor-pointer font-semibold transition-all duration-300 ease-in-out relative ${
              selectedColor === "white" ? "text-black" : "text-gray-600"
            }`}
            value="white"
          >
            <span
              className={`relative inline-block ${
                selectedColor === "white"
                  ? "bg-white px-4 py-2 rounded-lg "
                  : "bg-transparent"
              }`}
            >
              White
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger
            className={`flex-1 px-4 py-2 text-center cursor-pointer font-semibold transition-all duration-300 ease-in-out relative ${
              selectedColor === "black" ? "text-black" : "text-gray-600"
            }`}
            value="black"
          >
            <span
              className={`relative inline-block ${
                selectedColor === "black"
                  ? "bg-white px-4 py-2 rounded-lg"
                  : "bg-transparent"
              }`}
            >
              Black
            </span>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};

export default TextColorSelector;
