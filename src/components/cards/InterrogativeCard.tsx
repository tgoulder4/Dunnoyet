import { merriweather, montserrat } from "@/app/layout";
import { Button } from "../ui/button";
import { Input } from "../user/ui/input";
import { useState } from "react";
import InterrogationQuestion from "./InterrogationQuestion";
function InterrogativeCard({ content }: { content: string }) {
  //do a fetch for general repsonse to content via gpt api
  return (
    <>
      <article className="bg-card p-8 relative right-3 rounded-t-[30px] rounded-br-[30px] flex flex-col justify-between gap-4">
        <div
          className={`${montserrat.className} w-fit  select-none inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-900 rounded -mb-2`}
        >
          LEARNING HOW YOU THINK
        </div>
        <InterrogationQuestion content="What is a monarchy, and how does it differ from a republic?" />
        <InterrogationQuestion content="Can you explain the process of how members are elected in a republic and who has the authority to vote in such elections?" />
      </article>
    </>
  );
}

export default InterrogativeCard;
