import React, { useState } from "react";
import ResponseCard from "./Message/GPTMsg/Answer/AnswerMsg";
import InterrogativeCard from "./Message/GPTMsg/Interrogative/InterrogativeMsg";
import UserQuestionCard from "./Message/UserMsg/UserQ";
import Image from "next/image";
type Text = {
  content: string;
  type: "New_Question" | "Question" | "Response" | "Interrogation";
  placeHolderText?: string;
};
function Thread({ setTitle }: { setTitle: Function }) {
  const [messages, setMessages] = useState<Array<Text>>([
    {
      type: "New_Question",
      // content: "",
      content: "",
      placeHolderText: "a",
    },
    // {
    //   type: "Response",
    //   content:
    //     "The Bourbon Monarch were the rulers of France before the French Revolution.",
    // },
  ]);
  function addMessage(message: Text) {
    setMessages([...messages, message]);
  }
  return (
    <>
      <div
        className={`relative flex flex-col gap-4 divide-x-4`}
        id="cardContainer"
      >
        {messages.map((elem, index) => {
          switch (elem.type) {
            case "Question":
              return (
                <UserQuestionCard
                  addMessage={addMessage}
                  content={elem.content}
                  key={index}
                />
              );
            case "New_Question":
              return (
                <>
                  <UserQuestionCard
                    setTitle={setTitle}
                    addMessage={addMessage}
                    placeHolderText={elem.placeHolderText}
                    content={elem.content}
                    initialQuestion={true}
                    _closed={elem.content ? true : false}
                    className="min-h-[18rem]"
                    setMessages={setMessages}
                    key={index}
                  />
                </>
              );
            case "Response":
              return (
                <>
                  {index == 1 ? (
                    <>
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
                  <ResponseCard
                    key={index}
                    content={elem.content}
                    firstAnswer={index == 1 ? true : false}
                    addMessage={addMessage}
                  />
                </>
              );
            case "Interrogation":
              return (
                <InterrogativeCard
                  content={elem.content}
                  addMessage={addMessage}
                  key={index}
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
