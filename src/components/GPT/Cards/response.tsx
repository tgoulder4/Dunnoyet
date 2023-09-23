"use client";
import React, { useEffect, useRef, useState } from "react";
import ResponseCard from "./responseCard";
import Image from "next/image";
function Conversation() {
  const [margin, setMargin] = useState(0);
  const currentCard = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  //const currentCard setCurrentCard in an effort to make the image 30px below the top card.
  const responses = [
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
      setMargin((responses.length - 1) * 35);
      // setHeight(currentCard'sHeight + 30);
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
        {responses.map((elem, index) => (
          <ResponseCard
            style={{
              zIndex: index,
              top: (responses.length - 1) * 50 - index * 50 + "px",
              backgroundColor:
                `hsl(0,0%,${70 + index * (30 / (responses.length - 1))}%)` ||
                "white",
            }}
            ref={index == responses.length - 1 ? currentCard : null}
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

export default Conversation;
