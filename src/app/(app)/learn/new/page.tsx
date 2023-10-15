import React from "react";
import NewUserQ from "@/components/Message/UserMsg/NewUserQ";
import { merriweather, ruda } from "@/app/fonts";
import Sources from "@/components/ui/Sources";
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
        <div className="flex flex-col gap-3 pb-24 outline-2 outline-gray-400">
          <div className={`relative flex flex-col gap-4 `} id="cardContainer">
            <>
              <div className="w-full bg-white flex flex-col gap-3 p-8 rounded-3xl">
                <h2
                  className={`font-black text-[1.5rem] ${merriweather.className}`}
                >
                  Choose an information source
                </h2>
                <div
                  id="primaryInteractionArea"
                  className="flex flex-col gap-4 mb-8"
                >
                  <Sources />
                </div>
              </div>
            </>
            <NewUserQ content={messages[0].content} />
          </div>
        </div>
      </main>
    </>
  );
}

export default Thread;
