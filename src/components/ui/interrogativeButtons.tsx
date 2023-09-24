import { merriweather } from "@/app/layout";
import { Button } from "./button";
import { useState } from "react";
import { Term } from "@/components/cards/ResponseCard";
import { interrogativeTerms } from "@/components/cards/ResponseCard";
function InterrogativeButtons({
  activeTerm,
  handleTermSelect,
  highlightedText,
}: {
  activeTerm: Term;
  handleTermSelect: Function;
  highlightedText: boolean;
}) {
  // --accentOrange: 0 45% 88%; /* #f0c4c4 */
  // --accentTeal: 165 45% 88%; /* #c4f0eb */
  // --accentYellow: 54 45% 88%; /* #f0e9c4 */
  // --accentPurple: 255 45% 88%; /* #d5c4f0 */
  // --accentBlue: 215 45% 88%; /* #c4dbf0 */
  return (
    <>
      {highlightedText ? (
        <div className="flex gap-2 justify-between">
          {interrogativeTerms.map((interrogativeTerm) => (
            <Button
              variant="outline"
              className={`${merriweather.className} focus:bg-${interrogativeTerm.colour} text-xl`}
              key={interrogativeTerm.term}
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
