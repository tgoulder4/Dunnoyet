"use client";
import React, { useEffect, useRef, useState } from "react";
import ResponseCard from "./cards/ResponseCard";
import InterrogativeCard from "./cards/InterrogativeCard";
import UserQuestionCard from "./cards/UserQuestionCard";
import Image from "next/image";
type Text = {
  content: string;
  type: "Question" | "Response" | "Interrogation";
};
function Thread() {
  const currentCard = useRef<HTMLDivElement>(null);
  let firstResponseShown = false;
  //const currentCard setCurrentCard in an effort to make the image 30px below the top card.
  const [messages, setMessages] = useState<Array<Text>>([
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
  ]);
  function addMessage(message: Text) {
    setMessages([...messages, message]);
  }
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
        {messages.map((elem, index) => {
          switch (elem.type) {
            case "Question":
              return (
                <UserQuestionCard
                  addMessage={addMessage}
                  content={elem.content}
                />
              );
            case "Response":
              if (firstResponseShown == false) {
                firstResponseShown = true;
                return (
                  <ResponseCard
                    key={index}
                    content={elem.content}
                    firstResponseShown={false}
                    addMessage={addMessage}
                  />
                );
              } else {
                return (
                  <ResponseCard
                    key={index}
                    content={elem.content}
                    firstResponseShown={true}
                    addMessage={addMessage}
                  />
                );
              }
            case "Interrogation":
              return (
                <InterrogativeCard
                  content={elem.content}
                  addMessage={addMessage}
                />
              );
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
