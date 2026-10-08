import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {sampleDataset,trainKNN,evaluateModel} from '../src/robotics.js';
const config={links:[130,100],base:{x:0,y:0},linkRadius:5,obstacles:[{x:145,y:35,r:22},{x:65,y:-110,r:24},{x:-105,y:75,r:18}]};
const heldoutSeed=90210,trainingSeed=314159,heldoutCount=3000,k=5;
const heldout=sampleDataset(config,heldoutCount,heldoutSeed);
const rows=[];
for(const trainingCount of [100,500,1500]){
  const model=trainKNN(sampleDataset(config,trainingCount,trainingSeed),k);
  const metrics=evaluateModel(model,heldout);
  rows.push({trainingCount,k,...metrics});
}
const result={title:'ReachLab synthetic collision surrogate benchmark',scope:'Seeded simulated planar geometry only. No physical robot, human participants, hardware trials, or real-world safety validation. Predictions never replace exact collision checks.',method:'Uniform independent joint angles over [-pi,pi]^2; nested training sets from one seed; independent heldout seed. Labels use exact segment-to-circle distance including link radius. kNN uses periodic cosine distance. Positive class is collision; false-safe means collision mislabeled free.',config,trainingSeed,heldoutSeed,heldoutCount,rows};
const dir=fileURLToPath(new URL('../research/results/',import.meta.url));
await mkdir(dir,{recursive:true});
await writeFile(dir+'benchmark.json',JSON.stringify(result,null,2)+'\n');
const columns=['trainingCount','k','sampleCount','accuracy','precision','recall','falseSafe','falseSafeRate','truePositive','trueNegative','falsePositive','falseNegative'];
await writeFile(dir+'benchmark.csv',columns.join(',')+'\n'+rows.map(r=>columns.map(c=>r[c]??r.confusion[c]).join(',')).join('\n')+'\n');
console.log(JSON.stringify(rows,null,2));
