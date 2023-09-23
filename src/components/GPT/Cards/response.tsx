"use client";
import React, { useEffect, useRef, useState } from "react";
import ResponseCard from "./elaborationCard";
function Conversation() {
  const [margin, setMargin] = useState(0);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [totalChildren, setTotalChildren] = useState(0);
  useEffect(() => {
    function main() {
      const cardContainer = cardContainerRef.current;
      console.log(`CardContainer:` + cardContainerRef.current);
      if (cardContainer) {
        setTotalChildren(cardContainer.childElementCount);
        setMargin(cardContainer.childElementCount * 35);
      }
    }
    main();
  }, []);

  return (
    <>
      <div
        className={`relative`}
        style={{ marginTop: margin }}
        ref={cardContainerRef}
        id="cardContainer"
      >
        {Array.from({ length: totalChildren }).map((_, index) => (
          <ResponseCard
            offset={`-top-[${90 - index * 45}px]`}
            style={{ zIndex: totalChildren - index }}
            key={index}
          />
        ))}
      </div>
    </>
  );
}

export default Conversation;
