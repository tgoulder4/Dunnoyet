"use client";
import { merriweather, ruda } from "@/app/fonts";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";

function UserQuestionCard({
  addMessage,
  content = "",
}: {
  addMessage: Function;
  content: string;
}) {
  const [newContent, setNewContent] = useState(content);
  const [closed, setClosed] = useState<boolean>(true);
  const [hovering, setHovering] = useState<boolean>(false);
  const questionRef = useRef<HTMLTextAreaElement>(null);
  function handleEdit() {
    setClosed(false);
  }
  useEffect(() => {
    //submit msg to api
    setTimeout(() => {
      addMessage({
        type: "Response",
        content: "Test content.",
      });
    }, 2000);
  }, []);
  function handleAmendment() {
    setClosed(true);
  }
  return (
    <>
      <div
        className="animate-in slide-in-from-bottom-4 w-full bg-primary p-8 rounded-t-[30px] rounded-bl-[30px] flex justify-between gap-3"
        // onMouseEnter={() => setHovering(true)}
        // onMouseLeave={() => setHovering(false)}
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
              <div className="flex items-end h-full">
                <Button
                  variant="outline"
                  icon="./pencil_dark.png"
                  onClick={handleEdit}
                  tooltip="Edit text"
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
              className={` p-1 bg-primary border-primary/80 ring-0 text-white w-full max-w-[75%] text-2xl placeholder:text-[#135632] ${merriweather.className} font-[400]  tracking-[-0.374px]`}
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
                  tooltip="Submit change"
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
