import { Button } from "../../ui/button";
import { merriweather } from "@/app/layout";
import InterrogativeButtons from "../../ui/interrogativeButtons";
import { useState } from "react";
function ResponseCard({ offset = "-top-0", showControls = true, ...props }) {
  return (
    <div
      className={`${
        offset != "-top-0" ? `absolute ${offset}` : ""
      } w-full bg-white p-8 rounded-[30px] flex flex-col justify-between gap-3`}
      {...props}
    >
      {showControls ? (
        <>
          <style>
            {`
            ::selection {
              background: #cccccc; 
            }
          `}
          </style>
          <article>
            <h2
              className={`text-2xl max-w-[1000px] mb-10 mr-1/5 ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
            >
              The French revolution in 1789 to 1799 involved the overthrowing of
              the absolute monarchy, establishing a republic, fundamentally
              shifting the power structure in France.
            </h2>
          </article>
          <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center min-h-8">
            <Button variant="grey">
              <img src="./speaker_dark.png" alt="Read aloud" />
            </Button>
            <InterrogativeButtons />
            <Button variant="grey">
              <img src="./tick_dark.png" alt="Understood" />
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ResponseCard;
