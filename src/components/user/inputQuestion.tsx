"use client";
import { merriweather } from "@/app/layout";
import { Button } from "../ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

function UserQuestionInput() {
  const [closed, setClosed] = useState(false);
  function toggleClosed() {
    setClosed(!closed);
  }
  return (
    <>
      {closed ? (
        <div className="w-full bg-primary p-8 rounded-[30px] flex justify-between">
          <article className=" max-w-[80%]">
            <h2
              className={`text-2xl text-primary-foreground ${merriweather.className} font-[400] tracking-[-0.374px]`}
            >
              What was the French Revolution?
            </h2>
          </article>
          <div className="flex justify-end items-center">
            <Button variant="outline" onClick={toggleClosed}>
              <img
                src="./pencil_dark.png"
                className="h-full object-scale-down"
                alt="Understood"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-primary p-8 rounded-[30px] flex flex-col justify-between gap-3">
          <article>
            <Input
              className={`max-w-[1000px] mr-1/5 p-1 border-none text-white text-2xl placeholder:text-[#135632] ${merriweather.className} font-[700] leading-[150%] tracking-[-0.374px]`}
              placeholder="What was the French Revolution?"
            />
          </article>
          <div className="flex justify-end w-full">
            <Button
              variant="grey"
              icon="./arrow_dark.png"
              className=""
              onClick={toggleClosed}
            ></Button>
          </div>
        </div>
      )}
    </>
  );
}

export default UserQuestionInput;
