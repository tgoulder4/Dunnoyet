import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { merriweather } from "@/app/fonts";

type Props = {};

const Faq = (props: Props) => {
  return (
    <>
      <hr className="divide-y-2 divide-gray-400"></hr>
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
                  <span className="font-bold mr-1">Ctrl</span>
                  or
                  <span className="font-bold ml-1">Cmd</span>
                </code>{" "}
                + <code className="bg-gray-300 p-1 rounded-sm">P</code>
              </li>
              <li>3. Save as PDF</li>
              <li>4. Upload the PDF above!</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default Faq;
