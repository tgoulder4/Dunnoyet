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
  //const currentCard setCurrentCard in an effort to make the image 30px below the top card.
  const threadTexts: Array<Text> = [
    {
      type: "Question",
      content: "What was The French Revolution?",
    },
    {
      type: "Interrogation",
      content: "What do you know about Revolutions?",
    },
    {
      type: "Response",
      content:
        "The French Revolution was a period of social and political upheaval from 1789 to 1799. ",
    },
    // {
    //   type: "Question",
    //   content: "'Period' - What?",
    // },
    // {
    //   type: "Response",
    //   content: "A period is a length of time. ",
    // },
    // {
    //   type: "Question",
    //   content: "social and political upheaval - How?",
    // },
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
        className={`relative flex flex-col gap-4`}
        style={
          {
            // marginBottom: margin,
          }
        }
        id="cardContainer"
      >
        {threadTexts.map((elem, index) => {
          switch (elem.type) {
            case "Question":
              return <UserQuestionCard />;
            case "Response":
              return (
                <ResponseCard
                  id={index == threadTexts.length - 1 ? "currentCard" : ""}
                  key={index}
                  content={elem.content}
                />
              );
            case "Interrogation":
              return <InterrogativeCard />;
          }
        })}
        <div className="relative h-[200px] w-full">
          <Image
            src="/frenchRevolution.png" // do a fetch of a relavent image
            className="rounded-[30px]"
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
