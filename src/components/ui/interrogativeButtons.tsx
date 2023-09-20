import { merriweather } from "@/app/layout";
import { Button } from "./button";
function InterrogativeButtons() {
  let highlighted = true;
  const interrogativeButtons = ["What?", "Why?", "How?", "Other..."];
  return (
    <>
      {highlighted ? (
        <div className="flex gap-2 justify-between">
          {interrogativeButtons.map((button) => (
            <Button
              variant="outline"
              className={`${merriweather.className} text-xl`}
              key={button}
              size={"tighter"}
            >
              {button}
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
