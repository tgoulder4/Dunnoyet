import { useState } from "react";
import { Button } from "../ui/button";
import { merriweather, ruda } from "@/app/layout";
import InterrogativeButtons from "../ui/interrogativeButtons";
export type Term = {
  term: string;
  colour: string;
  followUpQuestion: string;
};

function ResponseCard({
  baseCard = false,
  showControls = true,
  content = "",
  firstResponseShown = true,
  ...props
}) {
  const [activeTerm, setActiveTerm] = useState<Term>({
    term: "",
    colour: "",
    followUpQuestion: "",
  });
  const [highlighted, setHighlighted] = useState({
    hasHighlighted: false,
    value: "",
  });
  function handleTermSelect(interrogativeTerm: Term) {
    console.log(
      `Elaboration called with interrogative term: ${interrogativeTerm.term}`
    );
    setActiveTerm(interrogativeTerm);
  }
  function handleHighlight() {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText === "") {
      setHighlighted({
        hasHighlighted: false,
        value: "",
      });
      setActiveTerm({
        term: "",
        colour: "",
        followUpQuestion: "",
      });
    } else {
      const highlitedString = String(window.getSelection()).toString();
      console.log(`Highlighted string: ${highlitedString}`);
      setHighlighted({
        hasHighlighted: true,
        value: highlitedString,
      });
    }
    // setHighlightedText(window.getSelection().toString());
  }
  return (
    <div
      className={`mr-4 bg-white w-full p-8 rounded-t-[30px] rounded-br-[30px] flex flex-col justify-between gap-3`}
      {...props}
      onMouseUp={() => handleHighlight()}
    >
      {showControls ? (
        <div className="flex flex-col gap-4">
          <div className="">
            <article>
              {!firstResponseShown ? (
                <div
                  className={`${ruda.className} w-fit  select-none inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-900 rounded mb-2`}
                >
                  ANSWER
                </div>
              ) : (
                <></>
              )}
              <h2
                onMouseUp={() => handleHighlight()}
                className={`text-2xl max-w-[1000px] mb-10 mr-[3%] ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
              >
                {content}
              </h2>
            </article>
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start min-h-8">
              <Button variant="grey">
                <img src="./speaker_dark.png" alt="Read aloud" />
              </Button>
              <InterrogativeButtons
                activeTerm={activeTerm}
                handleTermSelect={handleTermSelect}
                hasHighlighted={highlighted.hasHighlighted}
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
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ResponseCard;
