import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectShowcase } from "@/components/projects/project-showcase";
import { projects } from "@/lib/sample-data";

describe("ProjectShowcase", () => {
  it("renders a project row with a large case-study preview", () => {
    render(<ProjectShowcase projects={projects} />);

    expect(screen.getByRole("link", { name: /view case study/i })).toHaveAttribute("href", "/projects/portfolio-website");
    expect(screen.getAllByText("01").length).toBeGreaterThan(0);
    expect(screen.getByText(/A professional portfolio platform/i)).toBeInTheDocument();
  });

  it("renders clickable project rows without relying on hover only", () => {
    render(<ProjectShowcase projects={projects} />);

    expect(screen.getByRole("link", { name: /portfolio website/i })).toHaveAttribute("href", "/projects/portfolio-website");
    expect(screen.getByRole("link", { name: /academic systems project/i })).toHaveAttribute("href", "/projects/academic-systems-project");
  });
});
