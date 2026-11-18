import type { Project, SkillGroup } from "@/types/portfolio";

export type Point3 = [number,number,number];
export type SkillNode = {id:string;name:string;category:string;groupId:string;position:Point3;scattered:Point3;index:number};
export type SkillCluster = {id:string;name:string;position:Point3;nodes:SkillNode[]};
export type SkillConnection = {from:string;to:string;kind:"category"|"project";projectTitles:string[]};
export const normaliseSkill = (name:string) => name.trim().toLowerCase();
export function documentedProjects(projects:Project[],skill:string) {
  return projects.filter(project => project.published && !/placeholder|YOUR_/i.test(`${project.title} ${project.shortDescription} ${project.fullDescription}`) && project.technologies.some(tech => normaliseSkill(tech) === normaliseSkill(skill)));
}
export function buildConstellation(groups:SkillGroup[],projects:Project[]) {
  const centres:Point3[] = [[-8.6,2.6,0],[0,2.6,.4],[8.6,2.6,-.4],[-4.3,-6,0],[4.3,-6,.4]];
  const clusters:SkillCluster[] = groups.map((group,g) => {
    const centre = centres[g] ?? [(g%3-1)*8.6,-8-Math.floor((g-5)/3)*5.6,0];
    return {id:group.id,name:group.category,position:[centre[0],centre[1]+3.2,centre[2]],nodes:group.skills.map((name,i) => {
      const columns = Math.min(3,group.skills.length), column = i%columns, row = Math.floor(i/columns);
      const x = centre[0]+(column-(columns-1)/2)*2.8;
      const arc = column === 1 ? (row%2 ? -.7 : .7) : 0;
      const y = centre[1]+.35-row*3.05+arc;
      const z = centre[2]+Math.sin(i*1.8)*.55;
      return {id:`${group.id}:${name}`,name,category:group.category,groupId:group.id,index:i,position:[x,y,z],scattered:[x*1.5+Math.sin(i+g)*3,y*1.55+Math.cos(i*2+g)*3,-4-Math.cos(i+g)*3]};
    })};
  });
  const nodes = clusters.flatMap(cluster => cluster.nodes);
  const connections:SkillConnection[] = nodes.map(node => ({from:`hub:${node.groupId}`,to:node.id,kind:"category",projectTitles:[]}));
  for (let a=0;a<nodes.length;a++) for (let b=a+1;b<nodes.length;b++) {
    const common = documentedProjects(projects,nodes[a].name).filter(project => project.technologies.some(tech => normaliseSkill(tech) === normaliseSkill(nodes[b].name)));
    if (common.length) connections.push({from:nodes[a].id,to:nodes[b].id,kind:"project",projectTitles:common.map(project => project.title)});
  }
  return {clusters,nodes,connections};
}
