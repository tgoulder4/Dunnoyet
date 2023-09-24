import { merriweather, montserrat } from "@/app/layout";
import { Button } from "../ui/button";
import { Input } from "./ui/input";
function AdditionalInputRequested() {
  return (
    <>
      <div className="w-full bg-complementary p-8 rounded-[30px] flex flex-col justify-between gap-3">
        <article>
          <h2
            className={`max-w-[80%] text-2xl p-1 text-primary-foreground ${merriweather.className} font-[400] tracking-[-0.374px]`}
          >
            How much do you know about revolutions?
          </h2>
          <Input
            className={`max-w-[1000px] mr-1/5 p-1 border-none text-white text-2xl placeholder:text-primary-foreground ${merriweather.className} font-[700] leading-[150%] tracking-[-0.374px]`}
            placeholder="I know that they can cause some conflict but I don't know much else."
          />
        </article>
      </div>
    </>
  );
}

export default AdditionalInputRequested;
