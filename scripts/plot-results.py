from pathlib import Path
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
root=Path(__file__).resolve().parents[1]
data=json.loads((root/'research/results/extended-benchmark.json').read_text())
scenes=[s['name'] for s in data['design']['scenes']]
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'axes.spines.top':False,'axes.spines.right':False})
colors=['#176c60','#396b9e','#a95732']
fig,axes=plt.subplots(1,2,figsize=(9,3.6),layout='constrained')
for scene,color in zip(scenes,colors):
 rows=[r for r in data['summaries'] if r['scene']==scene]
 for ax,metric in zip(axes,['accuracy','recall']):
  ax.errorbar([r['trainingCount'] for r in rows],[100*r[metric]['mean'] for r in rows],yerr=[100*r[metric]['sd'] for r in rows],fmt='o-',color=color,label=scene,capsize=3)
for ax,title in zip(axes,['Overall accuracy','Collision recall']):
 ax.set(title=title,xlabel='Training configurations',ylabel='Percent',ylim=(0,105))
 ax.set_xticks([100,500,1500]);ax.grid(axis='y',alpha=.2)
axes[1].legend(loc='lower right',frameon=False,fontsize=8)
fig.savefig(root/'research/figures/learning-curves.png',dpi=220)
plt.close(fig)
fig,ax=plt.subplots(figsize=(8.5,3.5),layout='constrained')
rows=[r for r in data['summaries'] if r['trainingCount']==1500]
x=list(range(3))
for offset,metric,label,color in [(-.18,'recall','All colliding examples','#176c60'),(.18,'boundaryRecall','Colliding examples near boundary','#a95732')]:
 ax.bar([v+offset for v in x],[100*r[metric]['mean'] for r in rows],width=.32,yerr=[100*r[metric]['sd'] for r in rows],label=label,color=color,capsize=4)
ax.set_xticks(x,scenes);ax.set(ylabel='Collision recall (%)',ylim=(0,110));ax.grid(axis='y',alpha=.2);ax.set_axisbelow(True)
ax.legend(frameon=False,loc='upper center',bbox_to_anchor=(.5,1.18),ncol=2,fontsize=9)
fig.savefig(root/'research/figures/boundary-recall.png',dpi=220)
plt.close(fig)
print('Saved two figures from actual benchmark JSON.')
