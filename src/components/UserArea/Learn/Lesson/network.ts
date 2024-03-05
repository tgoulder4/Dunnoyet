import { UMAP } from 'umap-js';
const umap = new UMAP({
    nComponents: 2,
    nEpochs: 400,
    nNeighbors: 1,
});
export function getTwoDCoOrdinatesOfEmbeddings(ems: number[][]) {
    if (ems.length == 1) ems.push([0, 0])
    const TwoDCoOrds = umap.fit(ems);
    //multiply both by 10
    TwoDCoOrds.forEach((point) => {
        point[0] = point[0] * 10;
        point[1] = point[1] * 10;
    });
    console.log("TwoDCoOrds: ", TwoDCoOrds)
    return TwoDCoOrds;
}