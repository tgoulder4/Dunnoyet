"use client";
import { merriweather, ruda } from "@/app/layout";
import { Button } from "../ui/button";
import { Input } from "../user/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";

function UserQuestionCard({ content = "" }: { content: string }) {
  const [newContent, setNewContent] = useState(content);
  const [closed, setClosed] = useState<boolean>(true);
  const [hovering, setHovering] = useState<boolean>(false);
  const questionRef = useRef<HTMLTextAreaElement>(null);
  function handleEdit() {
    setClosed(false);
    questionRef.current?.focus();
  }
  function handleAmendment() {
    setClosed(true);
  }
  return (
    <>
      <div
        className="ml-4 w-full bg-primary p-8 rounded-t-[30px] rounded-bl-[30px] flex justify-between gap-3"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {closed ? (
          <>
            <h2
              className={`max-w-[75%] w-full text-2xl p-1 text-primary-foreground ${merriweather.className} font-[400] tracking-[-0.374px]`}
            >
              {/* suggested Question goes here */}
              {newContent}
            </h2>
            {hovering ? (
              <div className="flex justify-end items-center">
                <Button
                  variant="outline"
                  icon="./pencil_dark.png"
                  onClick={handleEdit}
                />
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <Textarea
              id={`questionInput`}
              ref={questionRef}
              className={` p-1 bg-primary border-none text-white w-full max-w-[75%] text-2xl placeholder:text-[#135632] ${merriweather.className} font-[700] leading-[150%] tracking-[-0.374px]`}
              onChange={(e) => {
                setNewContent(e.target.value);
              }}
              value={newContent}
            />
            <div className="flex flex-col gap-3">
              <div className="flex justify-end w-full">
                <Button
                  variant="grey"
                  icon="./arrow_dark.png"
                  className=""
                  onClick={() => handleAmendment()}
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
