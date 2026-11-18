import userEvent from "@testing-library/user-event";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResumeRequestForm } from "@/components/forms/resume-request-form";
import { createClientResumeRequest } from "@/services/client-message-service";
vi.mock("@/services/client-message-service", () => ({ createClientResumeRequest: vi.fn() }));
const request = vi.mocked(createClientResumeRequest);
afterEach(async () => { await act(async () => { cleanup(); }); });
beforeEach(() => { request.mockReset(); });
function completeForm() {
  for (const [label,value] of [["Full name","Alex Morgan"],["Professional email address","alex@example.com"],["Company or organisation","Example Studio"],["Job title","Hiring manager"],["Reason for requesting the resume","I would like to discuss a graduate developer opportunity."]]) {
    fireEvent.change(screen.getByLabelText(new RegExp(label)),{target:{value}});
  }
  fireEvent.click(screen.getByRole("checkbox"));
}
describe("resume request experience", () => {
  it("explains invalid fields, focuses the first one and does not submit", () => {
    render(<ResumeRequestForm />);
    fireEvent.click(screen.getByRole("button", { name: "Request resume access" }));
    expect(screen.getByText("Full name is required")).toBeVisible();
    expect(screen.getByLabelText(/Full name/)).toHaveFocus();
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid","true");
    expect(request).not.toHaveBeenCalled();
  });
  it("holds loading until completion, prevents duplicates and announces success", async () => {
    let resolve!: (value:string) => void;
    request.mockImplementation(() => new Promise(r => {resolve=r;}));
    render(<ResumeRequestForm />); completeForm();
    fireEvent.click(screen.getByRole("button",{name:"Request resume access"}));
    expect(screen.getByRole("button",{name:/Submitting request/})).toBeDisabled();
    for (const field of screen.getAllByRole("textbox")) expect(field).toBeEnabled();
    fireEvent.change(screen.getByLabelText(/Job title/), {target:{value:"Graduate recruiter"}});
    expect(screen.getByLabelText(/Job title/)).toHaveValue("Graduate recruiter");
    fireEvent.submit(document.querySelector("form")!);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).toMatchObject({consent:true,linkedinUrl:"",website:"",fullName:"Alex Morgan"});
    await act(async () => resolve("request-id"));
    expect(screen.getByRole("status")).toHaveFocus();
    expect(screen.getByText(/Your resume access request has been submitted/)).toBeVisible();
    expect(screen.queryByRole("button",{name:/Request resume access/})).not.toBeInTheDocument();
  });
  it("keeps entered details after failure and allows a retry", async () => {
    request.mockRejectedValueOnce(new Error("internal credentials must not be displayed"));
    request.mockResolvedValueOnce("retry-id");
    render(<ResumeRequestForm />); completeForm();
    await userEvent.click(screen.getByRole("button",{name:"Request resume access"}));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("couldn’t be submitted"));
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Alex Morgan");
    expect(screen.queryByText(/internal credentials/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button",{name:"Request resume access"}));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("submitted for review"));
  });
  it("rejects an invalid optional URL and a filled honeypot", () => {
    render(<ResumeRequestForm />); completeForm();
    fireEvent.change(screen.getByLabelText(/LinkedIn URL/),{target:{value:"not-a-url"}});
    fireEvent.click(screen.getByRole("button",{name:"Request resume access"}));
    expect(screen.getByText("Enter a valid URL")).toBeVisible();
    fireEvent.change(screen.getByLabelText(/LinkedIn URL/),{target:{value:""}});
    fireEvent.change(document.querySelector('[name="website"]')!,{target:{value:"spam"}});
    fireEvent.click(screen.getByRole("button",{name:"Request resume access"}));
    expect(request).not.toHaveBeenCalled();
  });
});
