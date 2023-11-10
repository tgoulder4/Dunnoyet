import { merriweather, ruda } from "@/app/fonts";
import React from "react";

type Props = {
  type: "questions" | "concepts";
};

const Stat = (props: Props) => {
  let number = 29;
  let descriptor = "Concepts Learnt";
  switch (props.type) {
  }
  return (
    <div
      className={`rounded-lg flex flex-col bg-white hover:bg-gray-50 items-start py-4  px-8 justify-center h-full ${merriweather.className}`}
    >
      <h1 className={`${merriweather.className} text-9xl font-bold`}>
        {number}
      </h1>
      <p className={`${ruda.className}`}>{descriptor}</p>
    </div>
  );
};

export default Stat;
