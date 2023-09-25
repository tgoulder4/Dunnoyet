"use client";
import { merriweather, ruda } from "@/app/layout";
import { Button } from "../ui/button";
import { Input } from "../user/ui/input";
import { useState } from "react";

function UserQuestionCard({ content = "" }: { content: string }) {
  const [newContent, setNewContent] = useState(content);
  const [closed, setClosed] = useState<boolean>(false);
  function handleEdit() {
    setClosed(false);
    setNewContent(content);
  }
  return (
    <>
      <div className="ml-4 w-full bg-primary p-8 rounded-t-[30px] rounded-bl-[30px] flex justify-between gap-3">
        {closed || content ? (
          <>
            <article className="max-w-[80%] w-full">
              <h2
                className={`text-2xl p-1 text-primary-foreground ${merriweather.className} font-[400] tracking-[-0.374px]`}
              >
                {/* suggested Question goes here */}
                {content}
              </h2>
            </article>
            <div className="flex justify-end items-center">
              <Button
                variant="outline"
                icon="./pencil_dark.png"
                onClick={handleEdit}
              />
            </div>
          </>
        ) : (
          <>
            <article className="max-w-[80%] w-full">
              <Input
                className={` p-1 border-none text-white text-2xl placeholder:text-[#135632] ${merriweather.className} font-[700] leading-[150%] tracking-[-0.374px]`}
                onChange={(e) => {
                  setNewContent(e.target.value);
                }}
                placeholder={content}
              />
            </article>
            <div className="flex flex-col gap-3">
              <div className="flex justify-end w-full">
                <Button
                  variant="grey"
                  icon="./arrow_dark.png"
                  className=""
                  onClick={() => setClosed(true)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default UserQuestionCard;
