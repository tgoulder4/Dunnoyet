import { useState } from "react";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input2";
import { merriweather, ruda } from "@/app/fonts";

function InterrogationQuestion({ content = "" }: { content: string }) {
  const [text, setText] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <section className="flex flex-col gap-4">
        <h2
          className={`max-w-[80%] text-2xl p-1 text-card-foreground  ${merriweather.className} font-[400] tracking-[-0.374px]`}
        >
          {content}
        </h2>
        <div className="flex min-h-8 gap-4">
          <Input
            className={`w-full max-w-[1000px] p-2  border-none ${ruda.className} font-[700] leading-[150%] tracking-[-0.374px]`}
            placeholder=""
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
          />
          <div className="flex">
            <Button
              variant="outline"
              icon="/shrug_dark.png"
              alt="I don't know"
            />
            <Button
              variant="grey"
              icon="/arrow_dark.png"
              loading={loading}
              onClick={() => {
                setLoading(true);
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default InterrogationQuestion;
