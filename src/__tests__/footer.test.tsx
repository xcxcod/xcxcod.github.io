import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Footer } from "@/components/layout/footer";
import { FooterBackToTop } from "@/components/layout/footer-back-to-top";
import { footerSocialLinks } from "@/lib/footer-links";
import { profile } from "@/lib/sample-data";
const empty = {github:"",linkedin:"",instagram:"",x:"",email:""};
afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe("footer destinations", () => {
  it("hides missing and unsafe destinations instead of rendering placeholder links", () => {
    expect(footerSocialLinks(profile,empty)).toEqual([]);
    expect(footerSocialLinks({...profile,githubUrl:"javascript:alert(1)",instagramUrl:"https://user:secret@example.com",email:"not an email"},empty)).toEqual([]);
  });
  it("supports all configured platforms and preserves profile overrides", () => {
    const links=footerSocialLinks({...profile,githubUrl:"https://github.com/existing"},{github:"https://github.com/default",linkedin:"https://linkedin.com/in/example",instagram:"https://instagram.com/example",x:"https://x.com/example",email:"hello@example.com"});
    expect(links.map(link=>link.platform)).toEqual(["github","linkedin","instagram","x","email"]);
    expect(links[0].href).toBe("https://github.com/existing");
    expect(links[4].href).toBe("mailto:hello@example.com");
  });
  it("uses SVG icons, keeps contact and resume destinations, and exposes footer navigation", () => {
    render(<Footer profile={{...profile,githubUrl:"https://github.com/example",linkedinUrl:"https://linkedin.com/in/example",instagramUrl:"https://instagram.com/example",twitterUrl:"https://x.com/example",email:"hello@example.com"}}/>);
    const socials=within(screen.getByRole("navigation",{name:"Social and contact links"}));
    expect(socials.getAllByRole("link")).toHaveLength(5);
    for(const link of socials.getAllByRole("link")) expect(link.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByRole("link",{name:/Good things/})).toHaveAttribute("href","/contact");
    expect(screen.getByRole("link",{name:/Request my resume/})).toHaveAttribute("href","/resume");
    expect(within(screen.getByRole("navigation",{name:"Footer navigation"})).getAllByRole("link")).toHaveLength(4);
  });
  it.each([false,true])("returns keyboard focus to main and respects reduced motion %s", reduced => {
    vi.spyOn(window,"matchMedia").mockReturnValue({matches:reduced} as MediaQueryList);
    const scroll=vi.spyOn(window,"scrollTo").mockImplementation(()=>{});
    render(<><main id="portfolio-main" tabIndex={-1}/><FooterBackToTop/></>);
    fireEvent.click(screen.getByRole("button",{name:"Back to top"}));
    expect(document.getElementById("portfolio-main")).toHaveFocus();
    expect(scroll).toHaveBeenCalledWith({top:0,behavior:reduced?"instant":"smooth"});
  });
});
