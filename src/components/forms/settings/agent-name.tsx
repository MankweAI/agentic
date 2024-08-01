import Section from "@/components/section-label";
import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import FormGenerator from "../form-generator";

type AgentNameProps = {
  message: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
};

const AgentName = ({ message, register, errors }: AgentNameProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Section label="Name" message="" />
      <div className="lg:w-[500px]">
        <FormGenerator
          placeholder={message}
          inputType="input"
          lines={1}
          register={register}
          errors={errors}
          name="agentName"
          type="text"
        />
      </div>
    </div>
  );
};

export default AgentName;
