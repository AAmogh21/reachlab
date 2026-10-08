import test from 'node:test';
import assert from 'node:assert/strict';
import {forwardKinematics,inverseKinematics,isCollision,edgeIsFree,planPath,sampleDataset,trainKNN,evaluateModel,pointSegmentDistance} from '../src/robotics.js';
const config={links:[130,100],base:{x:0,y:0},linkRadius:5,obstacles:[]};
test('kinematics round trips both inverse branches and rejects unreachable points',()=>{
  const tip=forwardKinematics(.7,-1.2,config).tip;
  const solutions=inverseKinematics(tip.x,tip.y,config);assert.equal(solutions.length,2);
  for(const q of solutions){const p=forwardKinematics(q.q1,q.q2,config).tip;assert.ok(Math.hypot(p.x-tip.x,p.y-tip.y)<1e-8);}
  assert.deepEqual(inverseKinematics(231,0,config),[]);assert.deepEqual(inverseKinematics(0,0,config),[]);
});
test('capsule checks tangent contact, endpoint disks and second link',()=>{
  assert.equal(isCollision(0,0,{...config,obstacles:[{x:60,y:15,r:10}]}),true);
  assert.equal(isCollision(0,0,{...config,obstacles:[{x:60,y:15.01,r:10}]}),false);
  assert.equal(isCollision(0,0,{...config,obstacles:[{x:239,y:0,r:4}]}),true);
  assert.equal(isCollision(0,Math.PI/2,{...config,obstacles:[{x:130,y:80,r:3}]}),true);
  assert.equal(pointSegmentDistance({x:3,y:4},{x:0,y:0},{x:0,y:0}),5);
});
test('edge detects obstacle swept between safe endpoints',()=>{
  const c={...config,obstacles:[{x:90,y:0,r:6}]};
  const a={q1:-.5,q2:0},b={q1:.5,q2:0};
  assert.equal(isCollision(a.q1,a.q2,c),false);assert.equal(isCollision(b.q1,b.q2,c),false);
  assert.equal(edgeIsFree(a,b,c),false);
});
test('planner returns collision-free detour and rejects colliding goal',()=>{
  const c={...config,obstacles:[{x:180,y:0,r:12}]};
  const result=planPath({q1:-.6,q2:0},{q1:.6,q2:0},c,{resolution:32});
  assert.equal(result.error,null);assert.ok(result.expanded>0);assert.ok(result.path.length>2);
  for(let i=1;i<result.path.length;i++)assert.ok(edgeIsFree(result.path[i-1],result.path[i],c));
  assert.match(planPath({q1:-.6,q2:0},{q1:0,q2:0},c).error,/collision/);
});
test('sampling is reproducible, periodic model features match, and training is copied',()=>{
  assert.deepEqual(sampleDataset(config,10,42),sampleDataset(config,10,42));
  const samples=[{q1:Math.PI-.01,q2:0,collision:true},{q1:0,q2:0,collision:false}];
  const model=trainKNN(samples,1);samples[0].collision=false;
  assert.equal(model.predict(-Math.PI+.01,0).collision,true);
  assert.deepEqual(model.predict(.4,.2),model.predict(.4+2*Math.PI,.2+2*Math.PI));
});
test('evaluation counts false-safe predictions explicitly and handles empty denominators',()=>{
  const model={predict:()=>({collision:false})};
  const metrics=evaluateModel(model,[{q1:0,q2:0,collision:true},{q1:1,q2:1,collision:false}]);
  assert.equal(metrics.falseSafe,1);assert.equal(metrics.recall,0);assert.equal(metrics.accuracy,.5);assert.equal(metrics.precision,null);
  assert.equal(evaluateModel(model,[]).accuracy,null);
});
test('invalid geometry and malformed training data fail clearly',()=>{
  assert.throws(()=>forwardKinematics(0,0,{...config,links:[0,100]}),/geometry/);
  assert.throws(()=>isCollision(0,0,{...config,obstacles:[{x:1,y:2,r:-1}]}),/geometry/);
  assert.throws(()=>trainKNN([],5),/training/);
  assert.throws(()=>trainKNN([{q1:0,q2:NaN,collision:true}],5),/training/);
  assert.throws(()=>trainKNN([{q1:0,q2:0,collision:true}],0),/training/);
  assert.match(planPath({q1:Math.PI+.01,q2:0},{q1:0,q2:0},config).error,/limits/);
});
test('equal-length folded singularity still reaches the base',()=>{
  const c={...config,links:[100,100]};const solutions=inverseKinematics(0,0,c);
  assert.ok(solutions.length>0);
  for(const q of solutions){const p=forwardKinematics(q.q1,q.q2,c).tip;assert.ok(Math.hypot(p.x,p.y)<1e-8);}
});
test('default proposed scene has a certified route to target',()=>{
  const c={...config,obstacles:[{x:180,y:0,r:12},{x:-150,y:-60,r:18}]};
  const start={q1:-.6,q2:0};
  const candidates=inverseKinematics(185,125,c).filter(q=>!isCollision(q.q1,q.q2,c));
  const result=candidates.map(goal=>planPath(start,goal,c)).find(r=>!r.error);
  assert.ok(result,'At least one IK branch must have a route');
  for(let i=1;i<result.path.length;i++)assert.ok(edgeIsFree(result.path[i-1],result.path[i],c));
  const end=result.path.at(-1),tip=forwardKinematics(end.q1,end.q2,c).tip;
  assert.ok(Math.hypot(tip.x-185,tip.y-125)<1e-8);
});
