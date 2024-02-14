"use client";
import React, { useState, useEffect } from "react";
import ResponseCard from "./Message/GPTMsg/Answer/ResponseCard";
import InterrogativeCard from "./Message/GPTMsg/Interrogative/InterrogativeMsg";
import UserQuestionCard from "./Message/UserMsg/UserQ";
import Image from "next/legacy/image";
import NewUserQ from "./Message/UserMsg/NewUserQ";
import { toast } from "sonner";
import { ruda } from "@/app/fonts";
import {
  IMessage,
} from "@/lib/validation/enforceTypes";
type Props = {
  //find messages via threadID or treat as static and pass messages in.
  _messages: IMessage[];
};
const Thread = (props: Props) => {
  const { _messages } = props;
  const [messages, setMessages] = useState<Array<IMessage>>(
    _messages
  );
  if (messages === null) {
    console.error("Couldn't render thread.tsx as messages is null")
    return <></>;
  }
  useEffect(() => {
    toast.success("Lesson entered: The Bourbon Monarch", {
      className: `${ruda.className} p-8`,
    });
  }, []);
  function addMessage(message: IMessage) {
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
                  <NewUserQ content={elem.content} key={index} _closed={true} />
                </>
              );
            case "Response":
              return (
                <>
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
      </div>
    </>
  );
}

export default Thread;
