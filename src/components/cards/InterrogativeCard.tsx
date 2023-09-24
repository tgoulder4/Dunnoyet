import { merriweather, montserrat } from "@/app/layout";
import { Button } from "../ui/button";
import { Input } from "../user/ui/input";
function InterrogativeCard() {
  return (
    <>
      <div className="w-full bg-card p-8 rounded-[30px] flex flex-col justify-between gap-3">
        <div className="flex-none inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-complementary rounded">
          LEANING HOW YOU THINK
        </div>
        <article>
          <h2
            className={`max-w-[80%] text-2xl p-1 text-primary-foreground ${merriweather.className} font-[400] tracking-[-0.374px]`}
          >
            What do you already know about Revolutions?
          </h2>
          <Input
            className={`max-w-[1000px] mr-1/5 p-1 border-none ${montserrat.className} font-[700] leading-[150%] tracking-[-0.374px]`}
            placeholder="I know that they can cause some conflict but I don't know much else."
          />
        </article>
      </div>
    </>
  );
}

export default InterrogativeCard;
