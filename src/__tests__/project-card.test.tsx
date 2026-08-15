import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "@/components/projects/project-card";
import { projects } from "@/lib/sample-data";

describe("ProjectCard", () => {
  it("renders project title, status, and technologies", () => {
    render(<ProjectCard project={projects[0]} />);

    expect(screen.getByText("Portfolio Website")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });
});
