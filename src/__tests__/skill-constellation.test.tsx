import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SkillConstellation } from "@/components/skills/skill-constellation";
import { buildConstellation, documentedProjects } from "@/lib/skill-constellation";
import { projects, skillGroups } from "@/lib/sample-data";

vi.mock("next/dynamic",() => ({default:() => () => null}));

describe("constellation evidence and topology",() => {
  it("preserves all 23 technologies and their original categories",() => {
    const graph = buildConstellation(skillGroups,projects);
    expect(graph.nodes).toHaveLength(23);
    expect(graph.clusters).toHaveLength(5);
    for (const group of skillGroups) expect(graph.nodes.filter(node => node.groupId === group.id).map(node => node.name)).toEqual(group.skills);
    expect(new Set(graph.nodes.map(node => node.id)).size).toBe(23);
  });
  it("only connects technologies with genuine documented project evidence",() => {
    const graph = buildConstellation(skillGroups,projects);
    expect(documentedProjects(projects,"Python")).toHaveLength(0);
    expect(documentedProjects(projects,"TypeScript").map(project => project.id)).toEqual(["student-portfolio"]);
    expect(graph.connections.filter(edge => edge.kind === "project")).toHaveLength(6);
    expect(graph.connections.some(edge => edge.projectTitles.includes("Academic Systems Project"))).toBe(false);
  });
  it("connects every technology to its correct category hub",() => {
    const graph = buildConstellation(skillGroups,projects);
    for (const node of graph.nodes) expect(graph.connections).toContainEqual({from:`hub:${node.groupId}`,to:node.id,kind:"category",projectTitles:[]});
  });
});

describe("accessible constellation controls",() => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia",() => ({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}));
    vi.stubGlobal("IntersectionObserver",class {observe(){}disconnect(){}});
    vi.stubGlobal("ResizeObserver",class {observe(){}disconnect(){}});
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {cleanup();vi.unstubAllGlobals();});
  it("opens truthful details and exposes the documented portfolio project",() => {
    render(<SkillConstellation groups={skillGroups} projects={projects}/>);
    fireEvent.click(screen.getByRole("button",{name:"Python"}));
    expect(within(screen.getByRole("complementary")).getByText(/No documented project association/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Next.js"}));
    expect(within(screen.getByRole("complementary")).getByRole("link",{name:/Portfolio Website/})).toHaveAttribute("href","/projects/portfolio-website");
    fireEvent.click(screen.getByRole("button",{name:"Close technology details"}));
    expect(screen.getByRole("heading",{name:"Every tool has a context."})).toBeInTheDocument();
  });
  it("filters by category and restores the complete list with reset",() => {
    render(<SkillConstellation groups={skillGroups} projects={projects}/>);
    fireEvent.click(screen.getByRole("button",{name:"Databases"}));
    expect(screen.queryByRole("button",{name:"Python"})).not.toBeInTheDocument();
    expect(screen.getByRole("button",{name:"MySQL"})).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Accessible list"}));
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button",{name:"Reset view"}));
    expect(screen.getAllByRole("listitem")).toHaveLength(23);
  });
  it("starts fully assembled for reduced motion and retains all technologies",() => {
    vi.stubGlobal("matchMedia",(query:string) => ({matches:query.includes("reduced-motion"),addEventListener:vi.fn(),removeEventListener:vi.fn()}));
    const {container} = render(<SkillConstellation groups={skillGroups} projects={projects}/>);
    expect(container.querySelector(".constellation-chapter")).toHaveAttribute("data-assembly","1.000");
    fireEvent.click(screen.getByRole("button",{name:"Accessible list"}));
    expect(screen.getAllByRole("listitem")).toHaveLength(23);
  });
  it("motion off completes assembly so interaction never depends on animation",() => {
    const {container} = render(<SkillConstellation groups={skillGroups} projects={projects}/>);
    fireEvent.click(screen.getByRole("button",{name:"Motion on"}));
    expect(screen.getByRole("button",{name:"Motion off"})).toHaveAttribute("aria-pressed","true");
    expect(container.querySelector(".constellation-chapter")).toHaveAttribute("data-assembly","1.000");
  });
});
