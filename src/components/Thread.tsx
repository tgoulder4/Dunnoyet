"use client";
import React, { useEffect, useRef, useState } from "react";
import ResponseCard from "./cards/ResponseCard";
import InterrogativeCard from "./cards/InterrogativeCard";
import UserQuestionCard from "./cards/UserQuestionCard";
import Image from "next/image";
import $ from "jquery";
type Text = {
  content: string;
  type: "Question" | "Response" | "Interrogation";
};
function Thread() {
  const [margin, setMargin] = useState(0);
  const currentCard = useRef<HTMLDivElement>(null);
  let firstResponseShown = false;
  //const currentCard setCurrentCard in an effort to make the image 30px below the top card.
  const threadTexts: Array<Text> = [
    {
      type: "Question",
      content: "What was The French Revolution?",
    },
    {
      type: "Interrogation",
      content: "What is a monarchy, and how does it differ from a republic?",
    },
    {
      type: "Response",
      content:
        "The French Revolution was a major historical event that took place in France during the late 18th century.",
    },
    {
      type: "Question",
      content: "I understand!",
    },
    {
      type: "Response",
      content:
        "It began in 1789 and lasted for about a decade, fundamentally reshaping French society and politics.",
    },
    {
      type: "Question",
      content: "'fundamentally reshaping French society and politics.' - How?",
    },
    {
      type: "Response",
      content:
        "It transformed France by replacing the monarchy with a republic, where leaders were no longer kings or queens but elected by the people.",
    },
    {
      type: "Question",
      content: "I understand!",
    },

    {
      type: "Response",
      content:
        "Next, The French Revolution brought about significant social changes, like ending feudal privileges and promoting the idea of equality among citizens.",
    },
  ];
  useEffect(() => {
    function main() {
      setMargin((threadTexts.length - 1) * 35);
    }
    main();
  }, []);
  return (
    <>
      <div
        className={`relative flex flex-col gap-4 divide-x-4`}
        style={
          {
            // marginBottom: margin,
          }
        }
        id="cardContainer"
      >
        <div className="relative h-[200px] w-full">
          <Image
            src="/frenchRevolution.png" // do a fetch of a relavent image
            className="rounded-[10px]"
            layout="fill"
            objectFit="cover"
            alt=""
          />
        </div>
        <hr className="h-[2px] bg-[hsl(0,0%,75%)]" />
        {threadTexts.map((elem, index) => {
          switch (elem.type) {
            case "Question":
              return <UserQuestionCard content={elem.content} />;
            case "Response":
              return (
                <ResponseCard
                  id={index == threadTexts.length - 1 ? "currentCard" : ""}
                  key={index}
                  content={elem.content}
                  firstResponseShown={firstResponseShown}
                />
              );
              firstResponseShown = true;
            case "Interrogation":
              return <InterrogativeCard content={elem.content} />;
          }
        })}
        <hr className="h-[2px] bg-[hsl(0,0%,75%)]" />
        <div className="relative h-[200px] w-full">
          <Image
            src="/frenchRevolution.png" // do a fetch of a relavent image
            className="rounded-[10px]"
            layout="fill"
            objectFit="cover"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

export default Thread;
