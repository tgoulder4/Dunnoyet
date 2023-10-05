import { merriweather } from "@/app/fonts";
import { Button } from "../../../../ui/button";
import { Term } from "@/components/Message/GPTMsg/Answer/AnswerMsg";
import { Input } from "@/components/ui/input2";
import { ruda } from "@/app/fonts";
import { useEffect } from "react";
const interrogativeTerms = [
  {
    term: "Elaborate!",
    followUpQuestion: "What did you expect? Why?",
  },
  {
    term: "How?",
    followUpQuestion: "How would you expect? Why?",
  },
  {
    term: "What?",
    followUpQuestion: "What would you expect? Why?",
  },
  {
    term: "Why?",
    followUpQuestion: "Why would you expect?",
  },
  {
    term: "...",
    followUpQuestion: "",
  },
];
const additionalTerms = [
  {
    term: "Unexpected",
    followUpQuestion: "",
  },
  {
    term: "Confused",
    followUpQuestion: "What don't you understand? Why?",
  },
];
const hueStart = 145; // teal
const hueEnd = 245; // blue
const hueDiff = hueEnd - hueStart;
function InterrogativeButtons({
  activeTerm,
  hasHighlighted,
  passDownFunctions,
}: {
  activeTerm: Term;
  hasHighlighted: boolean;
  //passDownFunctions is of type object which contains functions.
  passDownFunctions: {
    handleTermSelect: Function;
    setElaborationQuery: Function;
    submitElaboration: Function;
    handleUnderstood: Function;
  };
}) {
  // --accentOrange: 0 45% 88%; /* #f0c4c4 */
  // --accentTeal: 165 45% 88%; /* #c4f0eb */
  // --accentYellow: 54 45% 88%; /* #f0e9c4 */
  // --accentPurple: 255 45% 88%; /* #d5c4f0 */
  // --accentBlue: 215 45% 88%; /* #c4dbf0 */
  useEffect(() => {
    function focusInput() {
      const input = document.getElementById("followUpQuestion");
      input?.focus();
    }
    if (activeTerm.followUpQuestion) {
      focusInput();
    }
  });
  return (
    <>
      {hasHighlighted ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-between">
            {interrogativeTerms.map((interrogativeTerm, index) => {
              const hueForButton =
                hueStart + hueDiff * (index / (interrogativeTerms.length - 1));
              return (
                <Button
                  variant={
                    index == interrogativeTerms.length - 1 ? "ghost" : "outline"
                  }
                  className={`${merriweather.className}  text-xl`}
                  key={interrogativeTerm.term}
                  tooltip="false"
                  size={"tighter"}
                  onClick={() => {
                    index == interrogativeTerms.length - 1 ? (
                      <div className="flex flex-col gap-2">
                        {additionalTerms.map((additionalTerm) => (
                          <Button
                            variant="outline"
                            className={`w-full text-xl ${merriweather.className}`}
                            onClick={() =>
                              passDownFunctions.handleTermSelect(additionalTerm)
                            }
                          >
                            {additionalTerm.term}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      passDownFunctions.handleTermSelect(interrogativeTerm)
                    );
                  }}
                  style={{
                    backgroundColor:
                      activeTerm.term === interrogativeTerm.term
                        ? `hsl(${hueForButton}, 45%, 88%)`
                        : "transparent",
                  }}
                >
                  {interrogativeTerm.term}
                </Button>
              );
            })}
          </div>

          {activeTerm.followUpQuestion ? (
            <>
              <Input
                className={`${ruda.className} text-xl  w-full border-2 border-[hsl(0_0_25%)] bg-background p-4 rounded-[6px] flex flex-col justify-between gap-3 active:border-complementary`}
                placeholder={activeTerm.followUpQuestion}
                id="followUpQuestion"
                onChange={(e) =>
                  passDownFunctions.setElaborationQuery(e.target.value)
                }
              />
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <h3
          className={`${merriweather.className} select-none text-complementary_lighter text-xl`}
        >
          Highlight content to ask further questions.
        </h3>
      )}
    </>
  );
}

export default InterrogativeButtons;
