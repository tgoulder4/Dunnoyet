import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../user/ui/input";
import { merriweather, ruda } from "@/app/layout";

function InterrogationQuestion({ content = "" }: { content: string }) {
  const [text, setText] = useState<string>();
  return (
    <>
      <section className="flex flex-col gap-4">
        <h2
          className={`max-w-[80%] text-2xl p-1 text-card-foreground  ${merriweather.className} font-[400] tracking-[-0.374px]`}
        >
          {content}
        </h2>
        <div className="flex">
          <Input
            className={`max-w-[1000px] mr-[3%] p-2  border-none ${ruda.className} font-[700] leading-[150%] tracking-[-0.374px]`}
            placeholder=""
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
          />
          <Button
            variant="outline"
            icon="./shrug_dark.png"
            alt="I don't know"
          />
          <Button variant="grey" icon="./arrow_dark.png" />
        </div>
      </section>
    </>
  );
}

export default InterrogationQuestion;
