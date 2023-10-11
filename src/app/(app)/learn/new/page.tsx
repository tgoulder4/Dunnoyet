import React, { useState } from "react";
import Image from "next/image";
import NewUserQ from "@/components/Message/UserMsg/NewUserQ";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { merriweather, ruda } from "@/app/fonts";
import Faq from "./Faq";
import FileUpload from "./FileUpload";
type Text = {
  content: string;
  type: "New_Question" | "Question" | "Response" | "Interrogation";
  placeHolderText?: string;
};
function Thread({ setTitle }: { setTitle: Function }) {
  const messages: Array<Text> = [
    {
      type: "New_Question",
      content: "a",
    },
  ];
  return (
    <>
      <main
        className={`text-complementary max-w-3xl mx-auto flex flex-col gap-4 h-full w-full px-4 pt-6 pb-14`}
      >
        <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
          New Question
        </h2>
        <div className="flex flex-col gap-3 pb-16">
          <div
            className={`relative flex flex-col gap-4 divide-x-4`}
            id="cardContainer"
          >
            <NewUserQ content={messages[0].content} />

            <>
              <div className="w-full bg-white flex flex-col gap-3 p-8 rounded-[10px]">
                <h2
                  className={`font-black text-[1.5rem] ${merriweather.className}`}
                >
                  Choose an information source
                </h2>
                <div id="primaryInteractionArea">
                  <FileUpload />
                  <article className={`${ruda.className}`}>
                    <h3>
                      The knowledge you'll gain is the content you upload - add
                      trustworthy sources! Supported formats include:
                    </h3>
                    <ul>
                      <li>• Lectures, YouTube videos, any other videos</li>
                      <li>• Any websites</li>
                    </ul>
                  </article>
                </div>
                <div className="divide-y-2  divide-gray-400"></div>
                <Faq />
              </div>
            </>
          </div>
        </div>
      </main>
    </>
  );
}

export default Thread;
