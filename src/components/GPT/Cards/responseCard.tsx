import { useState } from "react";
import { Button } from "../../ui/button";
import { merriweather, montserrat } from "@/app/layout";
import InterrogativeButtons from "../../ui/interrogativeButtons";
import { Input } from "@/components/user/ui/input";
export type Term = {
  term: string;
  colour: string;
  followUpQuestion: string;
};
export const interrogativeTerms = [
  {
    term: "What?",
    colour: "accentOrange",
    followUpQuestion: "What would you guess this means?",
  },
  {
    term: "Why?",
    colour: "accentTeal",
    followUpQuestion: "Why would you guess this might be the case?",
  },
  {
    term: "How?",
    colour: "accentYellow",
    followUpQuestion: "How would you guess this happens?",
  },
  {
    term: "Other...",
    colour: "accentPurple",
    followUpQuestion: "What are your thoughts?",
  },
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
    followUpQuestion: "",
  });
  const [highlightedText, setHighlightedText] = useState<string>("");
  function handleTermSelect(interrogativeTerm: Term) {
    console.log(
      `Elaboration called with interrogative term: ${interrogativeTerm}`
    );
    setActiveTerm(interrogativeTerm);
  }
  function handleHighlight() {
    if (window.getSelection() == null) return;
    // setHighlightedText(window.getSelection().toString());
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
                  {/* onHighlight={handleHighlight} */}"{prompt}"
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
                  className="w-full border-2 border-[hsl(0_0_25%)] bg-none p-4 rounded-[6px] flex flex-col justify-between gap-3 active:border-complementary"
                  placeholder={activeTerm.followUpQuestion}
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
