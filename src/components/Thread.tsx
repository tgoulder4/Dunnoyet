"use client";
import React, { useEffect, useState } from "react";
import ResponseCard from "./cards/ResponseCard";
import InterrogativeCard from "./cards/InterrogativeCard";
import UserQuestionCard from "./cards/UserQuestionCard";
import Image from "next/image";
type Text = {
  content: string;
  type: "New_Question" | "Question" | "Response" | "Interrogation";
  placeHolderText?: string;
};
function Thread({ initialise }: { initialise: Function }) {
  let firstResponseShown = false;
  //const currentCard setCurrentCard in an effort to make the image 30px below the top card.
  const [messages, setMessages] = useState<Array<Text>>([
    {
      type: "New_Question",
      content: "",
      placeHolderText: "Who were the Bourbon Monarch?",
    },
  ]);
  function addMessage(message: Text) {
    if (message.type == "New_Question") {
      initialise(message.content);
    }
    setMessages([...messages, message]);
  }
  return (
    <>
      <div
        className={`relative flex flex-col gap-4 divide-x-4`}
        id="cardContainer"
      >
        {messages.length > 1 ? (
          <>
            <div className="relative h-[200px] w-full animate-in slide-in-from-bottom-4">
              <Image
                src="/frenchRevolution.png" // do a fetch of a relavent image
                className="rounded-[10px]"
                layout="fill"
                objectFit="cover"
                alt=""
              />
            </div>
            <hr className="h-[2px] bg-[hsl(0,0%,75%)]" />
          </>
        ) : (
          <></>
        )}

        {messages.map((elem, index) => {
          switch (elem.type) {
            case "Question":
              return (
                <UserQuestionCard
                  addMessage={addMessage}
                  content={elem.content}
                />
              );
            case "New_Question":
              return (
                <UserQuestionCard
                  addMessage={addMessage}
                  placeHolderText={elem.placeHolderText}
                  initialQuestion={true}
                  initialise={initialise}
                  _closed={false}
                  className="h-96"
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
        {messages.length > 5 ? (
          <>
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
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Thread;
