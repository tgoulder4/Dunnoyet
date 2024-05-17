import { changeColour, colours } from "@/lib/constants";
import { IKP } from "@/lib/validation/enforceTypes";

// get colour from kp confidence
export function getColourFromConfidence(confidence: number): string {
    switch (confidence) {
        case 2: return colours.lessonNodes.confidence2;
        case 1: return colours.lessonNodes.confidence1;
        default: return colours.complementary;
    }
}