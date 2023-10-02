import { useState } from "react";
import { merriweather } from "@/app/fonts";
function MainTitle() {
  const [title, setTitle] = useState("New Source");
  return (
    <>
      <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
        {title}
      </h2>
    </>
  );
}

export default MainTitle;
