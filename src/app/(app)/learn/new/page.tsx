import { merriweather, ruda } from "@/app/fonts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function Home() {
  return (
    <main
      className={`text-complementary max-w-3xl mx-auto flex flex-col gap-4 h-full w-full px-4 pt-6 pb-14`}
    >
      <h2 className={`font-black text-[2rem] ${merriweather.className}`}>
        New Question
      </h2>
      <div className="w-full bg-white flex flex-col gap-3 p-8 rounded-[10px]">
        <h2 className={`font-black text-[1.5rem] ${merriweather.className}`}>
          Choose an information source
        </h2>
        <div id="primaryInteractionArea">
          <div id="fileUploadSection" className={`my-2`}>
            FileUpload
          </div>
          <article className={`${ruda.className}`}>
            <h3>
              The knowledge you'll gain is the content you upload - add
              trustworthy sources! Supported formats include:
            </h3>
            <ul>
              <li>• Lectures, YouTube videos, any other videos</li>
              <li>• Any websites</li>
            </ul>
          </article>
        </div>
        <div className="divide-y-2  divide-gray-400"></div>
        <div id="faqArea">
          <h2 className={`font-black text-[1.5rem] ${merriweather.className}`}>
            FAQ
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I upload a website?</AccordionTrigger>
              <AccordionContent>
                <ol>
                  <li>1. Go to the website you want to upload</li>
                  <li>
                    2. Click{" "}
                    <code className="bg-gray-300 p-1 rounded-sm">
                      <span className="font-bold mr-1">Ctrl</span>or
                      <span className="font-bold ml-1">Cmd</span>
                    </code>{" "}
                    + <code className="bg-gray-300 p-1 rounded-sm">P</code>
                  </li>
                  <li>3. Save as PDF</li>
                  <li>4. Upload the PDF above!</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </main>
  );
}
