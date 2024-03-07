import { UMAP } from 'umap-js';
export function getTwoDCoOrdinatesOfEmbeddings(ems: number[][]) {
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
    return TwoDCoOrds;
}