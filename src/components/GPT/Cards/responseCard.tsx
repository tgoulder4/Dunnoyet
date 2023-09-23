import { useState } from "react";
import { Button } from "../../ui/button";
import { merriweather, montserrat } from "@/app/layout";
import InterrogativeButtons from "../../ui/interrogativeButtons";
import { Input } from "@/components/user/ui/input";
export type Term = {
  term: string;
  colour: string;
};
export const interrogativeTerms = [
  { term: "What?", colour: "accentOrange" },
  { term: "Why?", colour: "accentTeal" },
  { term: "How?", colour: "accentYellow" },
  { term: "Other...", colour: "accentPurple" },
];
function ResponseCard({
  baseCard = false,
  showControls = true,
  response = "",
  prompt = "",
  ...props
}) {
  const [activeTerm, setActiveTerm] = useState<Term>({
    term: "",
    colour: "",
  });
  function handleTermSelect(interrogativeTerm: Term) {
    console.log(
      `Elaboration called with interrogative term: ${interrogativeTerm}`
    );
    setActiveTerm(interrogativeTerm);
  }
  return (
    <div
      className={`${
        !baseCard ? `absolute` : ""
      } w-full p-8 rounded-[30px] flex flex-col justify-between gap-3`}
      {...props}
    >
      {showControls ? (
        <div className="flex flex-col">
          <div className="py-2">
            <article>
              {prompt !== "" ? (
                <h1
                  className={`text-sm mb-4 font-[700] ${montserrat.className}`}
                >
                  "{prompt}"
                </h1>
              ) : (
                <></>
              )}
              <h2
                className={`text-2xl max-w-[1000px] mb-10 mr-1/5 ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
              >
                {response}
              </h2>
            </article>
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center min-h-8">
              <Button variant="grey">
                <img src="./speaker_dark.png" alt="Read aloud" />
              </Button>
              <InterrogativeButtons
                activeTerm={activeTerm}
                handleTermSelect={handleTermSelect}
              />
              {!activeTerm.term ? (
                <>
                  <Button variant="grey" onClick={handleTermSelect}>
                    <img src="./arrow_dark.png" alt="Understood" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-[80px] h-[40px]"></div>
                </>
              )}

              {/* if highlighted, be arrow_right */}
            </div>
          </div>
          {activeTerm.term ? (
            <>
              <div id="interpretationMenu" className="flex gap-8 py-2">
                <Input
                  className="w-full border-2 border-[hsl(0_0_25%)] bg-none p-4 rounded-[6px] flex flex-col justify-between gap-3"
                  placeholder="Add your interpretation here..."
                />
                <Button variant="grey">
                  <img src="./tick_dark.png" alt="Understood" />
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ResponseCard;
