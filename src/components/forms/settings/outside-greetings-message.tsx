import Section from "@/components/section-label";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import FormGenerator from "../form-generator";

type GreetingMessageProps = {
  message: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
};

const GreetingsMessageOutside = ({
  message,
  register,
  errors,
}: GreetingMessageProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Section
        label="Greeting message 1"
        message="The welcome message seen before the chatbot is opened"
      />
      <div className="lg:w-[500px]">
        <FormGenerator
          placeholder={message}
          inputType="textarea"
          lines={2}
          register={register}
          errors={errors}
          name="welcomeMessageOutside"
          type="text"
        />
      </div>
    </div>
  );
};

export default GreetingsMessageOutside;
