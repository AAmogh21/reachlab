// Angles are radians. Geometry and model outputs are simulated, not hardware safety guarantees.
const TAU = 2 * Math.PI;
const wrap = a => ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;
function geometry(config = {}) {
  const links = config.links ?? [130, 100];
  const base = config.base ?? { x: 0, y: 0 };
  const obstacles = config.obstacles ?? [];
  const linkRadius = config.linkRadius ?? 5;
  if (links.length !== 2 || !links.every(x => Number.isFinite(x) && x > 0) || ![base.x, base.y, linkRadius].every(Number.isFinite) || linkRadius < 0 || !obstacles.every(o => [o.x,o.y,o.r].every(Number.isFinite) && o.r >= 0)) throw new Error('Invalid robot geometry');
  return { links, base, obstacles, linkRadius };
}
export function forwardKinematics(q1, q2, config = {}) {
  const {links:[a,b],base} = geometry(config);
  if (![q1,q2].every(Number.isFinite)) throw new Error('Joint angles must be finite');
  const elbow = {x:base.x+a*Math.cos(q1),y:base.y+a*Math.sin(q1)};
  return {base:{...base},elbow,tip:{x:elbow.x+b*Math.cos(q1+q2),y:elbow.y+b*Math.sin(q1+q2)}};
}
export function inverseKinematics(x, y, config = {}) {
  const {links:[a,b],base} = geometry(config);
  if (![x,y].every(Number.isFinite)) return [];
  x-=base.x; y-=base.y;
  const cosine=(x*x+y*y-a*a-b*b)/(2*a*b);
  if (cosine < -1-1e-12 || cosine > 1+1e-12) return [];
  const theta=Math.acos(Math.max(-1,Math.min(1,cosine)));
  return (theta<1e-10 || Math.abs(theta-Math.PI)<1e-10 ? [theta] : [theta,-theta]).map(q2=>({q1:wrap(Math.atan2(y,x)-Math.atan2(b*Math.sin(q2),a+b*Math.cos(q2))),q2:wrap(q2)}));
}
export function pointSegmentDistance(p,a,b) {
  const dx=b.x-a.x,dy=b.y-a.y,l2=dx*dx+dy*dy;
  const t=l2===0 ? 0 : Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l2));
  return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
}
export function isCollision(q1,q2,config={}) {
  const {obstacles,linkRadius}=geometry(config);
  const {base,elbow,tip}=forwardKinematics(q1,q2,config);
  return obstacles.some(o=> Math.min(pointSegmentDistance(o,base,elbow),pointSegmentDistance(o,elbow,tip)) <= o.r+linkRadius+1e-9);
}
// Conservative swept-motion check: endpoint clearance plus a displacement bound
// certifies each subinterval; uncertain intervals count as blocked.
export function edgeIsFree(a,b,config={}) {
  const {links:[l1,l2],obstacles,linkRadius}=geometry(config);
  const d1=b.q1-a.q1,d2=b.q2-a.q2;
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(d1),Math.abs(d2))/.015));
  const bound=(l1*Math.abs(d1)+l2*(Math.abs(d1)+Math.abs(d2)))/steps;
  for(let i=0;i<=steps;i++) {
    const {base,elbow,tip}=forwardKinematics(a.q1+d1*i/steps,a.q2+d2*i/steps,config);
    if(obstacles.some(o=>Math.min(pointSegmentDistance(o,base,elbow),pointSegmentDistance(o,elbow,tip)) <= o.r+linkRadius+bound/2+1e-9)) return false;
  }
  return true;
}
export function planPath(start,goal,config={},options={}) {
  const resolution=options.resolution ?? 48;
  if(!Number.isInteger(resolution)||resolution<8||resolution>160) throw new Error('Resolution must be an integer from 8 to 160');
  if(![start?.q1,start?.q2,goal?.q1,goal?.q2].every(a=>Number.isFinite(a)&&a>=-Math.PI&&a<=Math.PI)) return {path:[],expanded:0,error:'Angles outside joint limits'};
  if(isCollision(start.q1,start.q2,config)||isCollision(goal.q1,goal.q2,config)) return {path:[],expanded:0,error:'Start or goal is in collision'};
  if(edgeIsFree(start,goal,config)) return {path:[{...start},{...goal}],expanded:0,error:null};
  const n=resolution+1,step=TAU/resolution;
  const pos=id=>({q1:-Math.PI+(id%n)*step,q2:-Math.PI+Math.floor(id/n)*step});
  const closest=q=>Math.round((q.q1+Math.PI)/step)+n*Math.round((q.q2+Math.PI)/step);
  const s=closest(start),g=closest(goal), sp=pos(s),gp=pos(g);
  if(!edgeIsFree(start,sp,config)||!edgeIsFree(gp,goal,config)) return {path:[],expanded:0,error:'Endpoint grid connection blocked; increase resolution'};
  const costs=new Map([[s,0]]),parents=new Map(),open=new Set([s]),closed=new Set();
  const h=id=>Math.hypot(pos(id).q1-gp.q1,pos(id).q2-gp.q2);
  let expanded=0;
  while(open.size) {
    let current=-1,best=Infinity;
    for(const id of open) {const f=costs.get(id)+h(id);if(f<best){best=f;current=id;}}
    open.delete(current);closed.add(current);expanded++;
    if(current===g) {const path=[];for(let id=g;id!==undefined;id=parents.get(id))path.push(pos(id));path.reverse();return {path:[{...start},...path,{...goal}],expanded,error:null};}
    const x=current%n,y=Math.floor(current/n),a=pos(current);
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++) {
      if((dx===0&&dy===0)||x+dx<0||x+dx>=n||y+dy<0||y+dy>=n)continue;
      const next=x+dx+n*(y+dy);if(closed.has(next))continue;
      const cost=costs.get(current)+step*Math.hypot(dx,dy);
      if(cost >= (costs.get(next)??Infinity)||!edgeIsFree(a,pos(next),config))continue;
      costs.set(next,cost);parents.set(next,current);open.add(next);
    }
  }
  return {path:[],expanded,error:'No path found on this grid'};
}
export function seededRandom(seed=1) {let state=seed>>>0;return()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};}
export function sampleDataset(config,n,seed=1) {
  if(!Number.isInteger(n)||n<0)throw new Error('Sample count must be a nonnegative integer');
  const rand=seededRandom(seed);
  return Array.from({length:n},()=>{const q1=(rand()*2-1)*Math.PI,q2=(rand()*2-1)*Math.PI;return {q1,q2,collision:isCollision(q1,q2,config)};});
}
export function trainKNN(samples,k=5) {
  if(!samples.length||!Number.isInteger(k)||k<1||!samples.every(s=>Number.isFinite(s.q1)&&Number.isFinite(s.q2)&&typeof s.collision==='boolean'))throw new Error('Valid training samples and positive k required');
  const data=samples.map(s=>({...s}));
  return {k:Math.min(k,data.length),sampleCount:data.length,predict(q1,q2){
    if(![q1,q2].every(Number.isFinite))throw new Error('Joint angles must be finite');
    const neighbors=data.map((s,index)=>({distance:2-2*Math.cos(q1-s.q1)+2-2*Math.cos(q2-s.q2),collision:s.collision,index})).sort((a,b)=>a.distance-b.distance||a.index-b.index).slice(0,this.k);
    const collisionProbability=neighbors.filter(s=>s.collision).length/neighbors.length;
    return {collision:collisionProbability>=.5,label:collisionProbability>=.5?'collision':'free',collisionProbability};
  }};
}
export function evaluateModel(model,samples) {
  let truePositive=0,trueNegative=0,falsePositive=0,falseNegative=0;
  for(const s of samples){const p=model.predict(s.q1,s.q2).collision;if(s.collision){if(p)truePositive++;else falseNegative++;}else if(p)falsePositive++;else trueNegative++;}
  const ratio=(a,b)=>b?a/b:null;
  return {sampleCount:samples.length,confusion:{truePositive,trueNegative,falsePositive,falseNegative},accuracy:ratio(truePositive+trueNegative,samples.length),precision:ratio(truePositive,truePositive+falsePositive),recall:ratio(truePositive,truePositive+falseNegative),falseSafe:falseNegative,falseSafeRate:ratio(falseNegative,truePositive+falseNegative)};
}
