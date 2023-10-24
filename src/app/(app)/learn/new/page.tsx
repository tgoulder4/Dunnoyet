"use client";
import React, { useState } from "react";
import NewUserQ from "@/components/Message/UserMsg/NewUserQ";
import { merriweather, ruda } from "@/app/fonts";
import Sources from "@/components/ui/Sources";
import { Minus, Plus } from "lucide-react";
import CreateASource from "@/components/ui/CreateASource";
import { getSources, setSources } from "@/app/(api)/sources";
import MySources from "@/components/ui/MySources";
type Text = {
  content: string;
  type: "New_Question" | "Question" | "Response" | "Interrogation";
  placeHolderText?: string;
};
function NewQuestion() {
  const messages: Array<Text> = [
    {
      type: "New_Question",
      content: "Who were the Bourbon Monarch?",
    },
  ];
  const [uploadClicked, setUploadClicked] = useState(false);
  const [newQuestionIsVisible, setNewQuestionIsVisible] = useState(false);
  return (
    <>
      <main
        className={`text-complementary max-w-3xl mx-auto flex flex-col gap-4 h-full w-full px-4 pt-6 pb-14`}
      >
        <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
          New Question
        </h2>
        <div
          className={`flex flex-col gap-3 ${
            uploadClicked ? "pb-24" : ""
          } outline-2 outline-gray-400`}
        >
          <div className={`relative flex flex-col gap-4 `} id="cardContainer">
            <div className="w-full bg-white flex flex-col gap-3 p-8 rounded-3xl">
              {uploadClicked ? (
                <>
                  <CreateASource setSources={setSources} />
                </>
              ) : (
                <></>
              )}
              <MySources
                setNewQuestionIsVisible={setNewQuestionIsVisible}
                setUploadClicked={setUploadClicked}
                uploadClicked={uploadClicked}
              />
            </div>
            {newQuestionIsVisible ? (
              <>
                <NewUserQ content={messages[0].content} />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default NewQuestion;
