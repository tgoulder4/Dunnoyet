import { Button } from "./ui/button";
function Carousel() {
  return (
    <>
      <h2 className="font-bold primary text-3xl">The French Revolution</h2>
      <section className="bg-white rounded-3xl flex-1 w-full text-center flex flex-col items-center justify-between p-10">
        <article className="flex flex-col gap-4 flex-1 w-full">
          <h3>'social and political upheaval' - What?</h3>
          <div className="textContainer flex-1 overflow-y-auto">
            <h1 className="text-8xl primary font-bold text-center whitespace-normal flex-1">
              The French revolution in 1789 to 1799 sparked major political and
              social changes.
            </h1>
          </div>
          {/* 'What is .? I understand -> goes back to enquired sentence which is now amended in terms of this explanation'  */}
        </article>
        <div id="actionArea" className="w-full h-14 flex justify-end">
          <Button variant="default" className="w-20 h-full px-5">
            <img src="./tick_white.png" alt="" />
          </Button>
        </div>
      </section>
    </>
  );
}

export default Carousel;
