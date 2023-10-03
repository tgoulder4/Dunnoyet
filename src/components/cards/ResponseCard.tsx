import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Loader2, Quote, ShieldCheck } from "lucide-react";
import { merriweather, ruda } from "@/app/fonts";
import InterrogativeButtons from "../ui/interrogativeButtons";
//future feature?
import Animation from "./AnimationFrame";

import SeeSourcesDialog from "../ui/seeSourcesDialog";

export type Term = {
  term: string;
  colour: string;
  followUpQuestion: string;
};
function ResponseCard({
  content = "",
  firstAnswer = false,
  addMessage,
  ...props
}: {
  content: string;
  firstAnswer: boolean;
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

  function handleTermSelect(interrogativeTerm: Term) {
    setActiveTerm(interrogativeTerm);
  }
  function handleHighlight() {
    const highlightedText = window.getSelection()?.toString().trim();
    if (!highlightedText) {
      setHighlighted({
        hasHighlighted: false,
        value: "",
      });
      setActiveTerm({
        term: "",
        colour: "",
        followUpQuestion: "",
      });
      return;
    }
    setHighlighted({
      hasHighlighted: true,
      value: highlightedText,
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
          : activeTerm.term == "Unexpected"
          ? "Unexpected: " + elaborationQuery
          : activeTerm.term
      }`,
    });
    // setShowControls(false);
  }
  function handleUnderstood() {
    // send to backend
    addMessage({
      type: "Question",
      content: "I understand!",
    });
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
      onClick={(e) => {
        e.preventDefault();
        handleHighlight();
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
            {firstAnswer ? (
              <div
                className={`${ruda.className} w-fit  select-none inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-900 rounded mb-2`}
              >
                ANSWER
              </div>
            ) : (
              <></>
            )}
            <div className="flex items-start w-full mb-40 justify-between">
              <h2
                className={`text-2xl max-w-[1000px] w-[80%] ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
              >
                {content}
              </h2>

              <Button
                variant="ghost"
                tooltip="This content is 100% correct based on the sources you provided."
              >
                <SeeSourcesDialog />
              </Button>
            </div>
            {/* <Animation /> */}
          </article>
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
                activeTerm.term ? "Submit question" : "I fully understand this!"
              }
              onClick={activeTerm.term ? submitElaboration : handleUnderstood}
              icon={
                activeTerm.term == "" ? "./tick_dark.png" : "./arrow_dark.png"
              }
            ></Button>

            {/* if highlighted, be arrow_right */}
          </div>
        </>
      )}
    </div>
  );
}

export default ResponseCard;
