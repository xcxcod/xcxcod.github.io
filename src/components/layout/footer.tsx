import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import type { Profile } from "@/types/portfolio";
import { footerSocialLinks } from "@/lib/footer-links";
import { FooterBackToTop } from "./footer-back-to-top";

const socialIcons = { github: FaGithub, linkedin: FaLinkedinIn, instagram: FaInstagram, x: FaXTwitter, email: Mail };
const navigation = [["Work", "/projects"], ["About", "/about"], ["Toolkit", "/skills"], ["Contact", "/contact"]] as const;

export function Footer({ profile }: { profile: Profile }) {
  const links = footerSocialLinks(profile);
  return (
    <footer className="studio-footer">
      <div className="footer-opening">
        <p className="eyebrow">The next connection starts here</p>
        <nav className="footer-socials" aria-label="Social and contact links">
          {links.map(({platform,label,href}) => {
            const Icon = socialIcons[platform];
            return <a key={platform} href={href} className="footer-social" aria-label={label} title={label}>
              <Icon size={23} aria-hidden="true" focusable="false" />
              <span className="footer-social-caption" aria-hidden="true">{label}</span>
            </a>;
          })}
        </nav>
      </div>
      <Link href="/contact" className="studio-contact-title">Good things<br />start with hello.<ArrowUpRight aria-hidden="true" /></Link>
      <div className="footer-conversation">
        <p className="footer-invitation">Open to internships, graduate roles and entry-level IT opportunities.<br /><span>Have something in mind? I’d love to hear from you.</span></p>
        <Link href="/resume" className="footer-resume-link">Request my resume <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
      <div className="studio-footer-bottom">
        <div className="footer-signature"><span>{profile.name}</span><span>{profile.location}</span></div>
        <nav className="footer-navigation" aria-label="Footer navigation">{navigation.map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <FooterBackToTop />
      </div>
      <div className="footer-colophon"><span>Personal portfolio / Learning through building</span><span>© {new Date().getFullYear()} {profile.name}</span></div>
    </footer>
  );
}
