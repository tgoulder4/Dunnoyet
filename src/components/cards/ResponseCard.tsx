import { useEffect, useState } from "react";
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
  content = "",
  firstResponseShown = true,
  addMessage,
  ...props
}: {
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
  const [submitting, setSubmitting] = useState(false);
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
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
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
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <div
      className={`animate-in ${
        loading ? `slide-in-from-top-4 w-fit` : `slide-in-from-bottom-4 w-full`
      } mr-4 bg-white p-8 rounded-t-[30px] rounded-br-[30px] flex flex-col justify-between gap-4`}
      {...props}
      onMouseUp={() => handleHighlight()}
      onClick={() => handleHighlight()}
    >
      {loading ? (
        <Loader2 className="animate-spin" color="#000000" />
      ) : (
        <>
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
                isLoading={submitting}
                icon={
                  activeTerm.term == "" ? "./tick_dark.png" : "./arrow_dark.png"
                }
              ></Button>

              {/* if highlighted, be arrow_right */}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}

export default ResponseCard;
