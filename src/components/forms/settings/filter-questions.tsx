"use client";
import Section from "@/components/section-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  useTrainingDataHook,
  useHelpDesk,
} from "@/hooks/settings/use-settings";
import React from "react";
import FormGenerator from "../form-generator";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";

type Props = {
  id: string;
};

const AiTrainingData = ({ id }: Props) => {
  const { register, errors, onAddTrainingData, trainingData, loading } =
    useTrainingDataHook(id);

  return (
    <Card className="w-full grid grid-cols-1 lg:grid-cols-2">
      <CardContent className="p-6 border-r-[1px]">
        <form onSubmit={onAddTrainingData} className="flex flex-col gap-6 mt-">
          <div className="flex flex-col gap-3">
            <Section label="AI Training Data" message="" />
            <FormGenerator
              inputType="textarea"
              register={register}
              errors={errors}
              form="filter-questions-form"
              name="question"
              placeholder="Insert training data for your AI"
              type="text"
              lines={5}
            />
          </div>
          <Button
            type="submit"
            className="bg-[#C60D69] hover:bg-[#C60D69] hover:opacity-70 transition duration-150 ease-in-out text-white font-semibold"
          >
            Create
          </Button>
        </form>
      </CardContent>
      <CardContent className="p-6 overflow-y-auto chat-window">
        <Loader loading={loading}>
          {trainingData?.length ? (
            <p className="font-bold">{trainingData}</p>
          ) : (
            <CardDescription>No Questions</CardDescription>
          )}
        </Loader>
      </CardContent>
    </Card>
  );
};

export default AiTrainingData;
