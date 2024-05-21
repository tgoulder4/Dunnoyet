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

//split into server function which gets embeddings as number[][]
import { UMAP } from 'umap-js';
export async function getTwoDCoOrdinatesOfKPInSolitude(ems: number[][]) {
    const umap = new UMAP({
        nComponents: 2,
        nEpochs: 400,
        nNeighbors: 1,
    });
    if (ems.length == 1) ems.push([0, 0])
    console.log("fitting umap to: ", ems)
    const TwoDCoOrds = umap.fit(ems);
    //multiply both by 10
    TwoDCoOrds.forEach((point) => {
        point[0] = point[0] * 10;
        point[1] = point[1] * 10;
    });
    console.log("TwoDCoOrds generated: ", TwoDCoOrds)
    return TwoDCoOrds[1];
}