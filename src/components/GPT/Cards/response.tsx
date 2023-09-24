"use client";
import React, { useEffect, useRef, useState } from "react";
import ResponseCard from "./responseCard";
import Image from "next/image";
import $ from "jquery";
function Thread() {
  const [margin, setMargin] = useState(0);
  const currentCard = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  //const currentCard setCurrentCard in an effort to make the image 30px below the top card.
  const threadTexts = [
    {
      prompt: "",
      response:
        "The French Revolution was a period of social and political upheaval from 1789 to 1799.",
    },
    {
      prompt: "social and political upheaval - How?",
      response:
        "The abolishment of the Bourbon monarchy and the establishment of a republic.",
    },
  ];
  useEffect(() => {
    function main() {
      setMargin((threadTexts.length - 1) * 35);
      setHeight($("#currentCard")?.height() + 80);
      if (currentCard.current == null) {
        console.log("currentCard is null");
        return;
      }
      setHeight(currentCard.current.offsetHeight + 30);
    }
    main();
  }, []);
  return (
    <>
      <div
        className={`relative`}
        style={{
          // marginBottom: margin,
          height: height + "px",
        }}
        id="cardContainer"
      >
        {threadTexts.map((elem, index) => (
          <ResponseCard
            style={{
              zIndex: index,
              top: (threadTexts.length - 1) * 50 - index * 50 + "px",
              backgroundColor:
                `hsl(0,0%,${70 + index * (30 / (threadTexts.length - 1))}%)` ||
                "white",
            }}
            id={index == threadTexts.length - 1 ? "currentCard" : ""}
            key={index}
            prompt={elem.prompt}
            response={elem.response}
          />
        ))}
      </div>
      <div className="relative h-[300px]">
        <Image
          src="/frenchRevolution.png" // do a fetch of a relavent image
          className="rounded-[30px]"
          layout="fill"
          objectFit="cover"
          alt=""
        />
      </div>
    </>
  );
}

export default Thread;
