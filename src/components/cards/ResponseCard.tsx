import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { merriweather, ruda } from "@/app/layout";
import InterrogativeButtons from "../ui/interrogativeButtons";
export type Term = {
  term: string;
  colour: string;
  followUpQuestion: string;
};

function ResponseCard({
  baseCard = false,
  content = "",
  firstResponseShown = true,
  addMessage,
  ...props
}: {
  baseCard?: boolean;
  content: string;
  firstResponseShown: boolean;
  addMessage: Function;
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
  const [loading, setLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
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
  async function submitElaboration() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleanedContent = highlighted.value
        .trim()
        .replace(/^[^\w]+|[^\w]+$/g, "");
      addMessage({
        type: "Question",
        content: `'${cleanedContent}' - ${
          activeTerm.term == "Unexpected" ? "Unexpected." : activeTerm.term
        } ${
          activeTerm.term == "Unexpected"
            ? "I expected " + activeTerm.followUpQuestion
            : activeTerm.followUpQuestion
        }`,
      });
      // setShowControls(false);
    }, 2000);
  }
  function handleUnderstood() {
    // send to backend
  }
  return (
    <div
      className={`mr-4 bg-white w-full p-8 rounded-t-[30px] rounded-br-[30px] flex flex-col justify-between gap-3`}
      {...props}
      onMouseUp={() => handleHighlight()}
      onClick={() => handleHighlight()}
    >
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
              className={`text-2xl max-w-[1000px] mb-20 w-[80%] ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
            >
              {content}
            </h2>
          </article>
          {showControls ? (
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start min-h-8">
              <Button variant="grey">
                <img src="./speaker_dark.png" alt="Read aloud" />
              </Button>
              <InterrogativeButtons
                activeTerm={activeTerm}
                handleTermSelect={handleTermSelect}
                hasHighlighted={highlighted.hasHighlighted}
              />
              <Button
                variant="grey"
                onClick={activeTerm.term ? submitElaboration : handleUnderstood}
              >
                {loading ? (
                  <Loader2 className="animate-spin" color="#000000" />
                ) : activeTerm.term ? (
                  <img src="./send_dark.png" alt="Send" />
                ) : (
                  <img src="./tick_dark.png" alt="Understood" />
                )}
              </Button>

              {/* if highlighted, be arrow_right */}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResponseCard;
