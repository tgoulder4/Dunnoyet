import { Button } from "../ui/button";
import { merriweather } from "@/app/layout";
function GPTResponse() {
    return ( <>
      <div className="w-full h-full bg-white p-8 rounded-[30px] flex flex-col gap-3">
        <article>
            <h2 className={`text-[2.125rem] ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}>
            The French revolution in 1789 to 1799 involved the overthrowing of the absolute monarchy, establishing a republic, fundamentally shifting the power structure in France.
            </h2>

        </article>
        <div className="flex justify-between h-8">
          <Button>
            {" "}
            <img src="./speaker_dark.png" alt="Read aloud" />
          </Button>
          <Button>
            {" "}
            <img src="./tick_dark.png" alt="Understood" />
          </Button>
        </div>

    </div>
    </> );
}

export default GPTResponse;