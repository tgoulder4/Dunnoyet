import "../globals.css";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar/navbar";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { merriweather, ruda } from "../fonts";
import { DunnoyetLogo, colours, sizing } from "@/lib/constants";
import DisplacingButton from "@/components/ui/displacingButton";
import { spacing } from "../../../lib/constants";
import LessonItem from "./Components/LessonItem";
export const metadata: Metadata = {
  title: "Learn - dunnoyet",
  description: "Serious in depth learning.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const helperName = "Helper";
  const lessonItems = [
    {
      topic: 'Wave-Particle Duality',
      currentInformationIntakeSummary: 'How did the diffraction property of electrons influence the wave-particle duality theory?',
      threadID: 'AEHDB',
    },

    {
      topic: 'Quantum Mechanics',
      currentInformationIntakeSummary: 'What are the fundamental principles of quantum mechanics?',
      threadID: 'ANJ32S',
    },
    {
      topic: 'General Relativity',
      currentInformationIntakeSummary: 'How does general relativity explain the force of gravity?',
      threadID: 'AENJ32',
    },
    {
      topic: 'Artificial Intelligence',
      currentInformationIntakeSummary: 'What are the different types of artificial intelligence?',
      threadID: 'A9GDIJ23',
    },
    {
      topic: 'Machine Learning',
      currentInformationIntakeSummary: 'How does machine learning work?',
      threadID: 'GD92J3',
    },
    {
      topic: 'Blockchain Technology',
      currentInformationIntakeSummary: 'What is blockchain and how does it work?',
      threadID: 'GDIJ32',
    },
  ]
  return (
    <html lang="en">
      <body className={` flex flex-col`} style={{ fontFamily: ruda.style.fontFamily, fontSize: sizing.globalFontSize }}>
        <Navbar
          brandSide={[
            {
              content: {
                alt: "dunnoyet",
                variant: "link",
                url: "/",
                jsx: DunnoyetLogo({ colour: 'white' }),
              },
              rightDivider: true,
            },
            {
              content: {
                url: "/",
                text: {
                  text: helperName,
                  color: "primary-header",
                },
                alt: "Home",
                variant: "link",
                tooltip: "My Helper",
              },
              rightDivider: true,
            },
            {
              content: {
                url: "/",
                text: {
                  text: "Mind",
                  color: "primary-header",
                },
                alt: "Mind",
                variant: "link",
                tooltip: "Go to Mind",
              },
            },
          ]}
          middle={[]}
          userSide={[
            {
              jsx: <DisplacingButton><Plus className="h-full" color={colours.light.textColour} /><p>New Question</p></DisplacingButton>,
              tooltip: "New Question",
              content: {
                alt: "New Question",
                variant: "link",
                url: "/learn/AEHDB",
              },
            },
          ]}
          alignment="between"
        />
        {children}
        <Toaster />
        <main className="px-32 max-w-6xl flex flex-col" style={{ rowGap: spacing.gaps.separateElement }}>
          <div className="flex flex-col" style={{ rowGap: spacing.gaps.groupedElement }}>
            <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largestFontSize, fontWeight: 300 }}>Welcome back, Tye!</h1>
            <DisplacingButton>
              <Plus className="h-full" color={colours.light.textColour} />
              <p>Learn something new</p>
            </DisplacingButton>
          </div>
          <div className="flex flex-col">
            <h1 style={{ fontFamily: merriweather.style.fontFamily, fontSize: sizing.largerFontSize, fontWeight: 300 }}>Recent Lessons</h1>
            <div className="flex flex-row" style={{ columnGap: spacing.gaps.groupedElement }}></div>
            {
              lessonItems.map((lessonItem) => {
                return <LessonItem key={lessonItem.threadID} threadID={lessonItem.threadID} topic={lessonItem.topic} currentInformationIntakeSummary={lessonItem.currentInformationIntakeSummary} />
              })
            }
          </div>
        </main>
      </body>
    </html>
  );
}
