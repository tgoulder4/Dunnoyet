import { merriweather, ruda } from "@/app/fonts";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import useRedirectAfterSomeSeconds from "@/app/customHooks";

type Props = {
  question: string;
  subject: string;
  date: string;
};

const Conversation = ({ question, subject, date }: Props) => {
  const [selected, setSelected] = useState(false);
  function toggleSelected() {
    setSelected(!selected);
  }
  return (
    <div
      onClick={toggleSelected}
      className={`${merriweather.className} ${
        !selected ? "hover:bg-[#f4f4ff]" : ""
      } ${
        selected ? "bg-[#ECEEFF]" : "bg-[#FFFFFF]"
      } outline-gray-300 outline outline-2 w-full px-4 py-4 rounded-lg flex flex-col`}
    >
      <div className="flex justify-between items-center">
        {question}

        <Button
          variant={selected ? "primary" : "grey"}
          tooltip="Go to lesson"
          onClick={() => {
            useRedirectAfterSomeSeconds("/learn/The+French+Revolution", 2);
          }}
        >
          <ArrowRight className="h-6 w-6 stroke-2" />
        </Button>
      </div>
      {selected ? (
        <div className="flex flex-col gap-4">
          <p className={`${ruda.className}`}>
            What they said they explicitly understood during the conversation,
            summarised into bullet points like so:
          </p>
          <p className={`${ruda.className}`}>So far, you understand:</p>
          <ul>
            <li>• It was a time of social and political upheaval</li>
            <li>
              • The Bourbon Monarch was the ruling family of France at the time
            </li>
          </ul>
          Keep learning!
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Conversation;
