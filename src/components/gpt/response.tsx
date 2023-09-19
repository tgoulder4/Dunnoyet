import { Button } from "../ui/button";
import { merriweather } from "@/app/layout";
import InterrogativeButtons from "../ui/interrogativeButtons";
function GPTResponse() {
  return (
    <>
      <div className="w-full min-h-[510px] bg-white p-8 rounded-[30px] flex flex-col justify-between gap-3">
        <style>
          {`
            ::selection {
              background: #cccccc; 
            }
          `}
        </style>
        <article>
          <h2
            className={`text-[2.125rem] max-w-[1000px] mr-1/5 ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
          >
            The French revolution in 1789 to 1799 involved the overthrowing of
            the absolute monarchy, establishing a republic, fundamentally
            shifting the power structure in France.
          </h2>
        </article>
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center min-h-8 outline-red-700 outline-4 ">
          <Button variant="grey">
            <img src="./speaker_dark.png" alt="Read aloud" />
          </Button>
          <InterrogativeButtons />
          <Button variant="grey">
            <img src="./tick_dark.png" alt="Understood" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default GPTResponse;
