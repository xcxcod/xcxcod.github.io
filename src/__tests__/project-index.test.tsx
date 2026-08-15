import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectIndex } from "@/components/projects/project-index";
import { projects } from "@/lib/sample-data";

describe("ProjectIndex", () => {
  it("renders project rows from existing project data", () => {
    render(<ProjectIndex projects={projects} />);

    expect(screen.getByRole("link", { name: /portfolio website/i })).toHaveAttribute("href", "/projects/portfolio-website");
    expect(screen.getByText(/PROJECT_01/)).toBeInTheDocument();
    expect(screen.getByText(/Next\.js \/ TypeScript \/ Tailwind CSS \/ Firebase/i)).toBeInTheDocument();
  });

  it("keeps project image information available without hover", () => {
    render(<ProjectIndex projects={projects} />);

    expect(screen.getAllByText("YOUR_PROJECT_IMAGE").length).toBeGreaterThan(0);
  });
});
