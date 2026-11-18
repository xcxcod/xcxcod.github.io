import { ArrowUpRight, FileText } from "lucide-react";
import { ResumeRequestForm } from "@/components/forms/resume-request-form";

export default function ResumePage() {
  return (
    <section className="resume-request-page" aria-labelledby="resume-title">
      <div className="resume-page-caption"><span>Resume / A professional introduction</span><FileText size={18} aria-hidden="true" /></div>
      <div className="resume-composition">
        <div className="resume-introduction">
          <p className="resume-eyebrow"><span /> Let’s explore an opportunity</p>
          <h1 id="resume-title">Request<br />my resume<span>.</span></h1>
          <p className="resume-lede">A little context makes a better introduction. Tell me about yourself and the opportunity you have in mind.</p>
          <div className="resume-process">
            <h2>What happens next</h2>
            <ol>
              <li><span>01</span><div><h3>Share the context</h3><p>Your role, organisation and reason for reaching out.</p></div></li>
              <li><span>02</span><div><h3>Reviewed personally</h3><p>Your request is submitted for review. Resume access requires approval.</p></div></li>
            </ol>
          </div>
          <p className="resume-private-note">My resume isn’t available as a public download. The details you provide are collected to review your access request.</p>
          <a className="resume-work-link" href="/projects/">Explore my work in the meantime <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="resume-sheet"><ResumeRequestForm /></div>
      </div>
    </section>
  );
}
