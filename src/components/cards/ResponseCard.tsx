import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Quote } from "lucide-react";
import { merriweather, ruda } from "@/app/fonts";
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
  const [elaborationQuery, setElaborationQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  function handleTermSelect(interrogativeTerm: Term) {
    setActiveTerm(interrogativeTerm);
  }
  function handleHighlight() {
    const selectedText = window.getSelection()?.toString().trim();
    const highlitedString = String(window.getSelection()).toString();
    setHighlighted({
      hasHighlighted: true,
      value: highlitedString,
    });

    // setHighlightedText(window.getSelection().toString());
  }
  async function submitElaboration() {
    const cleanedContent = highlighted.value
      .trim()
      .replace(/^[^\w]+|[^\w]+$/g, "");
    addMessage({
      type: "Question",
      content: `'${cleanedContent}' - ${
        activeTerm.term == "Confused"
          ? "Confused: " + elaborationQuery
          : activeTerm.term
      }`,
    });
    // setShowControls(false);
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
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      {loading ? (
        <div className={`flex gap-4 ${ruda.className}`}>
          Thinking...
          <Loader2 className="animate-spin" color="#000000" />
        </div>
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
            <div className="flex items-start w-full justify-between">
              <h2
                className={`text-2xl max-w-[1000px] mb-20 w-[80%] ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
              >
                {content}
              </h2>
              <Button variant="ghost" tooltip="View source">
                <Quote className="bg-text-complementary_lighter" />
              </Button>
            </div>
          </article>
          {showControls ? (
            <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start min-h-8">
              <Button variant="grey" tooltip="Read aloud">
                <img src="./speaker_dark.png" alt="Read aloud" />
              </Button>
              <InterrogativeButtons
                activeTerm={activeTerm}
                handleTermSelect={handleTermSelect}
                hasHighlighted={highlighted.hasHighlighted}
                setElaborationQuery={setElaborationQuery}
              />
              <Button
                variant="grey"
                tooltip={
                  activeTerm.term
                    ? "Submit question"
                    : "I fully understand this!"
                }
                onClick={activeTerm.term ? submitElaboration : handleUnderstood}
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
