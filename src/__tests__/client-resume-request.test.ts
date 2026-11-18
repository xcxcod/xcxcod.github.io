import { beforeEach, expect, it, vi } from "vitest";
import { addDoc } from "firebase/firestore";
import { createClientResumeRequest } from "@/services/client-message-service";
vi.mock("@/lib/firebase/client", () => ({ db: {} }));
vi.mock("firebase/firestore", () => ({ addDoc:vi.fn(async () => ({id:"request-id"})), collection:vi.fn((_db,name) => name), serverTimestamp:vi.fn(() => "server-time") }));
const valid={fullName:"Alex Morgan",email:"alex@example.com",organisation:"Example",jobTitle:"Recruiter",reason:"Discuss a graduate development opportunity.",consent:true,linkedinUrl:"",website:""};
beforeEach(() => { vi.mocked(addDoc).mockClear(); });
it("stores valid requests as Pending with server timestamps and no access token", async () => {
  expect(await createClientResumeRequest(valid)).toBe("request-id");
  expect(addDoc).toHaveBeenCalledWith("resumeRequests",{fullName:valid.fullName,email:valid.email,organisation:valid.organisation,jobTitle:valid.jobTitle,reason:valid.reason,linkedinUrl:"",consent:true,status:"Pending",createdAt:"server-time",updatedAt:"server-time"});
});
it("does not write invalid or non-consenting requests", async () => {
  await expect(createClientResumeRequest({...valid,consent:false})).rejects.toThrow();
  await expect(createClientResumeRequest({...valid,website:"bot"})).rejects.toThrow();
  expect(addDoc).not.toHaveBeenCalled();
});
