import { merriweather } from "@/app/layout";
import { Button } from "../ui/button";

function UserQuestionInput({ open }: { open: boolean }) {
  return (
    <>
      {open ? (
        <div className="w-full bg-primary p-8 rounded-[30px] flex flex-col justify-between gap-3">
          <article>
            <h2
              className={`text-2xl text-primary-foreground max-w-[1000px] mb-10 mr-1/5 ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
            >
              What was the French Revolution?
            </h2>
          </article>
          <div className="flex justify-end items-center min-h-8">
            <Button variant="grey">
              <img
                src="./arrow_dark.png"
                className="h-full object-scale-down"
                alt="Understood"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full bg-primary p-8 rounded-[30px] flex flex-col justify-between gap-3">
          <article>
            <h2
              className={`text-2xl text-primary-foreground max-w-[1000px] mr-1/5 ${merriweather.className} font-[400] leading-[150%] tracking-[-0.374px]`}
            >
              What was the French Revolution?
            </h2>
          </article>
        </div>
      )}
    </>
  );
}

export default UserQuestionInput;
