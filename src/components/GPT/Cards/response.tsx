"use client";
import React, { useEffect, useRef, useState } from "react";
import ResponseCard from "./elaborationCard";
function Conversation() {
  const [margin, setMargin] = useState(0);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function findHeight() {
      const cardContainer = cardContainerRef.current;
      console.log(`CardContainer:` + cardContainerRef.current);
      if (cardContainer) {
        const childElementCount = cardContainer.childElementCount;
        console.log(childElementCount);
        const newMargin = childElementCount * 35;
        setMargin(newMargin);
      }
    }
    findHeight();
  });

  return (
    <>
      <div
        className={`relative`}
        style={{ marginTop: margin }}
        ref={cardContainerRef}
        id="cardContainer"
      >
        <ResponseCard offset="-top-[90px]" />
        <ResponseCard offset="-top-[45px]" />
        <ResponseCard offset="-top-0" />
      </div>
    </>
  );
}

export default Conversation;
