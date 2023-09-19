import { merriweather } from "@/app/layout";
import { Button } from "./button";
function InterrogativeButtons() {
  let highlighted = true;
  return (
    <>
      {highlighted ? (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className={`${merriweather.className} font-[1.525rem] h-full`}
          >
            Why?
          </Button>
          <Button variant="grey">What?</Button>
          <Button variant="grey">How?</Button>
          <Button variant="grey">Other...</Button>
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
