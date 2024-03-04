import { UMAP } from 'umap-js';
const umap = new UMAP({
    nComponents: 2,
    nEpochs: 400,
    nNeighbors: 1,
});
export function getTwoDCoOrdinatesOfEmbeddings(ems: number[][]) {
    if (ems.length == 1) ems.push([0, 0])
    const TwoDCoOrds = umap.fit(ems);
    console.log("TwoDCoOrds: ", TwoDCoOrds)
    return TwoDCoOrds;
}