import { merriweather } from "@/app/layout";
import { Button } from "./button";
import { Term } from "@/components/cards/ResponseCard";
import { Input } from "@/components/user/ui/input";
import { ruda } from "@/app/layout";
const interrogativeTerms = [
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
    term: "When?",
    colour: "accentPurple",
    followUpQuestion: "What don't you understand? Why?",
  },
  {
    term: "...",
    colour: "accentPurple",
    followUpQuestion: "What are your thoughts? Why?",
  },
];
const additionalTerms = [
  {
    term: "Unexpected",
    colour: "accentBlue",
    followUpQuestion: "",
  },
  {
    term: "Confused",
    colour: "accentPurple",
    followUpQuestion: "What don't you understand? Why?",
  },
];
function InterrogativeButtons({
  activeTerm,
  handleTermSelect,
  hasHighlighted,
  setElaborationQuery,
}: {
  activeTerm: Term;
  handleTermSelect: Function;
  hasHighlighted: boolean;
  setElaborationQuery: Function;
}) {
  // --accentOrange: 0 45% 88%; /* #f0c4c4 */
  // --accentTeal: 165 45% 88%; /* #c4f0eb */
  // --accentYellow: 54 45% 88%; /* #f0e9c4 */
  // --accentPurple: 255 45% 88%; /* #d5c4f0 */
  // --accentBlue: 215 45% 88%; /* #c4dbf0 */
  return (
    <>
      {hasHighlighted ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 justify-between">
            {interrogativeTerms.map((interrogativeTerm, index) => (
              <Button
                variant={
                  index == interrogativeTerms.length - 1 ? "ghost" : "outline"
                }
                className={`${merriweather.className} focus:bg-${interrogativeTerm.colour} text-xl`}
                key={interrogativeTerm.term}
                tooltip={
                  index == interrogativeTerms.length - 1
                    ? additionalTerms.map((additionalTerm) => (
                        <Button
                          variant="outline"
                          className={`w-full text-xl ${merriweather.className}`}
                        >
                          {additionalTerm.term}
                        </Button>
                      ))
                    : "false"
                }
                size={"tighter"}
                onClick={() => handleTermSelect(interrogativeTerm)}
                style={{
                  backgroundColor:
                    activeTerm.term === interrogativeTerm.term
                      ? `hsl(var(--${interrogativeTerm.colour}))`
                      : "transparent",
                }}
              >
                {interrogativeTerm.term}
              </Button>
            ))}
          </div>

          {activeTerm.followUpQuestion ? (
            <>
              <Input
                className={`${ruda.className} font-bold w-full border-2 border-[hsl(0_0_25%)] bg-background p-4 rounded-[6px] flex flex-col justify-between gap-3 active:border-complementary`}
                placeholder={activeTerm.followUpQuestion}
                onChange={(e) => setElaborationQuery(e.target.value)}
              />
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <h3
          className={`${merriweather.className} text-complementary_lighter text-xl`}
        >
          Highlight content to ask further questions.
        </h3>
      )}
    </>
  );
}

export default InterrogativeButtons;
