"use client";
import { merriweather, montserrat } from "@/app/layout";
import { Button } from "../ui/button";
import { Input } from "../user/ui/input";
import { useState } from "react";

function UserQuestionCard() {
  const [closed, setClosed] = useState(false);
  function toggleClosed() {
    setClosed(!closed);
  }
  return (
    <>
      <div className="relative left-3 w-full bg-primary p-8 rounded-t-[30px] rounded-bl-[30px] flex justify-between gap-3">
        {closed ? (
          <>
            <article className=" max-w-[80%]">
              <h2
                className={`text-2xl p-1 text-primary-foreground ${merriweather.className} font-[400] tracking-[-0.374px]`}
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
          </>
        ) : (
          <>
            <article>
              <Input
                className={`max-w-[1000px] mr-1/5 p-1 border-none text-white text-2xl placeholder:text-[#135632] ${merriweather.className} font-[700] leading-[150%] tracking-[-0.374px]`}
                placeholder="What was the French Revolution?"
              />
            </article>
            <div className="flex flex-col gap-3">
              <div className="flex justify-end w-full">
                <Button
                  variant="grey"
                  icon="./arrow_dark.png"
                  className=""
                  onClick={toggleClosed}
                ></Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default UserQuestionCard;
