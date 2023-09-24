import { useState } from "react";
import { Button } from "../ui/button";
import { merriweather, montserrat } from "@/app/layout";
import InterrogativeButtons from "../ui/interrogativeButtons";
import { Input } from "@/components/user/ui/input";
import Image from "next/image";
export type Term = {
  term: string;
  colour: string;
  followUpQuestion: string;
};
export const interrogativeTerms = [
  {
    term: "What?",
    colour: "accentOrange",
    followUpQuestion: "",
  },
  {
    term: "Why?",
    colour: "accentTeal",
    followUpQuestion: "",
  },
  {
    term: "How?",
    colour: "accentYellow",
    followUpQuestion: "",
  },
  {
    term: "Unexpected",
    colour: "accentPurple",
    followUpQuestion: "What were you expecting? Why?",
  },
  {
    term: "+",
    colour: "accentPurple",
    followUpQuestion: "What are your thoughts? Why?",
  },
];
function ResponseCard({
  baseCard = false,
  showControls = true,
  content = "",
  ...props
}) {
  const [activeTerm, setActiveTerm] = useState<Term>({
    term: "",
    colour: "",
    followUpQuestion: "",
  });
  const [highlightedText, setHighlightedText] = useState<boolean>(false);
  function handleTermSelect(interrogativeTerm: Term) {
    console.log(
      `Elaboration called with interrogative term: ${interrogativeTerm.term}`
    );
    setActiveTerm(interrogativeTerm);
  }
  function handleHighlight() {
    if (window.getSelection() == null) return;
    // setHighlightedText(window.getSelection().toString());
  }
  return (
    <div
      className={`relative right-3 bg-white w-full p-8 rounded-t-[30px] rounded-br-[30px] flex flex-col justify-between gap-3`}
      {...props}
    >
      {showControls ? (
        <div className="flex flex-col gap-4">
          <div className="">
            <article>
              <h2
                onClick={() => setHighlightedText(!highlightedText)}
                className={`text-2xl max-w-[1000px] mb-10 mr-[3%] ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
              >
                {content}
              </h2>
            </article>
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center min-h-8">
              <Button variant="grey">
                <img src="./speaker_dark.png" alt="Read aloud" />
              </Button>
              <InterrogativeButtons
                activeTerm={activeTerm}
                handleTermSelect={handleTermSelect}
                highlightedText={highlightedText}
              />
              {!activeTerm.term ? (
                <>
                  <Button variant="grey">
                    <img src="./tick_dark.png" alt="Understood" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="grey">
                    <img src="./send_dark.png" alt="Understood" />
                  </Button>
                </>
              )}

              {/* if highlighted, be arrow_right */}
            </div>
          </div>
          {activeTerm.followUpQuestion ? (
            <>
              <Input
                className={`${montserrat.className} font-bold w-full border-2 border-[hsl(0_0_25%)] bg-background p-4 rounded-[6px] flex flex-col justify-between gap-3 active:border-complementary`}
                placeholder={activeTerm.followUpQuestion}
              />
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
