"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { BarChart3, Inbox, Lock, LogOut, Save, Trash2 } from "lucide-react";
import { auth, db } from "@/lib/firebase/client";
import { profile as fallbackProfile, skillGroups as fallbackSkills } from "@/lib/sample-data";
import { slugify } from "@/lib/utils";
import { projectSchema } from "@/lib/validation";
import type { ContactMessage, Project, ResumeRequest, SkillGroup } from "@/types/portfolio";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { FormInput, FormTextarea } from "@/components/ui/form-input";

type Summary = {
  projects: number;
  featuredProjects: number;
  pendingResumeRequests: number;
  contactMessages: number;
};

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  if (loading) return <section className="mx-auto max-w-6xl px-4 py-16"><LoadingState label="Checking admin session" /></section>;
  if (!user) return <AdminLogin />;
  return <AdminWorkspace user={user} />;
}

function AdminLogin() {
  const [error, setError] = useState("");

  async function login(formData: FormData) {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, String(formData.get("email")), String(formData.get("password")));
    } catch {
      setError("Sign in failed. Check your Firebase Auth user and admin claim.");
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-20">
      <form action={login} className="grid gap-5 rounded-md border border-line bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Lock size={28} className="text-evergreen dark:text-teal-300" />
        <h1 className="text-2xl font-semibold">Admin sign in</h1>
        <FormInput label="Email" name="email" type="email" required />
        <FormInput label="Password" name="password" type="password" required />
        {error ? <p className="text-sm text-red-700 dark:text-red-300">{error}</p> : null}
        <Button type="submit">Sign in</Button>
      </form>
    </section>
  );
}

function AdminWorkspace({ user }: { user: User }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = ["dashboard", "projects", "profile", "skills", "resume", "contact"];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-evergreen dark:text-teal-300">Admin</p>
          <h1 className="text-3xl font-semibold tracking-tight">Portfolio management</h1>
        </div>
        <Button variant="secondary" onClick={() => signOut(auth)}><LogOut size={16} className="mr-2" /> Sign out</Button>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-md px-3 py-2 text-sm font-semibold capitalize ${tab === item ? "bg-accent text-white" : "border border-line bg-white dark:border-slate-800 dark:bg-slate-900"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {tab === "dashboard" ? <SummaryPanel /> : null}
        {tab === "projects" ? <ProjectsAdmin /> : null}
        {tab === "profile" ? <ProfileAdmin /> : null}
        {tab === "skills" ? <SkillsAdmin /> : null}
        {tab === "resume" ? <ResumeAdmin /> : null}
        {tab === "contact" ? <ContactAdmin /> : null}
      </div>
    </section>
  );
}

function SummaryPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [projects, featuredProjects, pendingResumeRequests, contactMessages] = await Promise.all([
          getCountFromServer(collection(db, "projects")),
          getCountFromServer(query(collection(db, "projects"), where("featured", "==", true))),
          getCountFromServer(query(collection(db, "resumeRequests"), where("status", "==", "Pending"))),
          getCountFromServer(query(collection(db, "contactMessages"), where("archived", "==", false)))
        ]);

        setSummary({
          projects: projects.data().count,
          featuredProjects: featuredProjects.data().count,
          pendingResumeRequests: pendingResumeRequests.data().count,
          contactMessages: contactMessages.data().count
        });
      } catch {
        setSummary({ projects: 0, featuredProjects: 0, pendingResumeRequests: 0, contactMessages: 0 });
      }
    }

    load();
  }, []);

  if (!summary) return <LoadingState label="Loading dashboard" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(summary).map(([key, value]) => (
        <div key={key} className="rounded-md border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <BarChart3 className="mb-4 text-evergreen dark:text-teal-300" size={22} />
          <p className="text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-sm capitalize text-slate-600 dark:text-slate-300">{key.replace(/([A-Z])/g, " $1")}</p>
        </div>
      ))}
    </div>
  );
}

function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    const snapshot = await getDocs(query(collection(db, "projects"), orderBy("order", "asc")));
    setProjects(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Project));
  }

  useEffect(() => {
    load().catch(() => setMessage("Unable to load projects. Confirm Firestore rules and admin claim."));
  }, []);

  async function saveProject(formData: FormData) {
    const title = String(formData.get("title"));
    const parsed = projectSchema.safeParse({
      title,
      slug: slugify(String(formData.get("slug") || title)),
      shortDescription: String(formData.get("shortDescription")),
      fullDescription: String(formData.get("fullDescription")),
      imageUrl: String(formData.get("imageUrl") || ""),
      galleryImages: [],
      technologies: String(formData.get("technologies")).split(",").map((item) => item.trim()).filter(Boolean),
      githubUrl: String(formData.get("githubUrl") || ""),
      liveUrl: String(formData.get("liveUrl") || ""),
      status: String(formData.get("status")),
      type: String(formData.get("type")),
      completionDate: String(formData.get("completionDate") || ""),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      order: Number(formData.get("order") || 0)
    });

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Project validation failed.");
      return;
    }

    await addDoc(collection(db, "projects"), { ...parsed.data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    setMessage("Project saved.");
    await load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <form action={saveProject} className="grid gap-4 rounded-md border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Create project</h2>
        <FormInput label="Title" name="title" required />
        <FormInput label="Slug" name="slug" />
        <FormInput label="Short description" name="shortDescription" required />
        <FormTextarea label="Full description" name="fullDescription" required />
        <FormInput label="Image URL" name="imageUrl" />
        <FormInput label="Technologies, comma separated" name="technologies" required />
        <FormInput label="GitHub URL" name="githubUrl" />
        <FormInput label="Live URL" name="liveUrl" />
        <select name="status" className="min-h-11 rounded-md border border-line bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
          {["Completed", "In Progress", "Academic Project", "Personal Project"].map((status) => <option key={status}>{status}</option>)}
        </select>
        <FormInput label="Project type" name="type" defaultValue="Personal Project" required />
        <FormInput label="Completion date" name="completionDate" type="date" />
        <FormInput label="Order" name="order" type="number" defaultValue="0" />
        <label className="text-sm"><input name="featured" type="checkbox" className="mr-2" /> Featured</label>
        <label className="text-sm"><input name="published" type="checkbox" className="mr-2" defaultChecked /> Published</label>
        <Button type="submit"><Save size={16} className="mr-2" /> Save project</Button>
        {message ? <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p> : null}
      </form>
      <div className="grid gap-3">
        {projects.length ? projects.map((project) => <EditableProject key={project.id} project={project} onChange={load} />) : <EmptyState title="No projects" message="Create a project to begin populating the portfolio." />}
      </div>
    </div>
  );
}

function EditableProject({ project, onChange }: { project: Project; onChange: () => Promise<void> }) {
  async function remove() {
    await deleteDoc(doc(db, "projects", project.id));
    await onChange();
  }

  async function toggleFeatured() {
    await updateDoc(doc(db, "projects", project.id), { featured: !project.featured, updatedAt: serverTimestamp() });
    await onChange();
  }

  return (
    <article className="rounded-md border border-line bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">{project.title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{project.shortDescription}</p>
        </div>
        <button type="button" onClick={remove} className="rounded-md border border-line p-2 text-red-700 dark:border-slate-700" aria-label={`Delete ${project.title}`}>
          <Trash2 size={16} />
        </button>
      </div>
      <button type="button" onClick={toggleFeatured} className="mt-3 text-sm font-semibold text-accent">{project.featured ? "Remove featured" : "Set featured"}</button>
    </article>
  );
}

function ProfileAdmin() {
  async function saveProfile(formData: FormData) {
    await setDoc(doc(db, "profile", "main"), {
      ...fallbackProfile,
      name: String(formData.get("name")),
      headline: String(formData.get("headline")),
      intro: String(formData.get("intro")),
      biography: String(formData.get("biography")),
      currentStudies: String(formData.get("currentStudies")),
      githubUrl: String(formData.get("githubUrl")),
      linkedinUrl: String(formData.get("linkedinUrl")),
      profileImageUrl: String(formData.get("profileImageUrl")),
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  return (
    <form action={saveProfile} className="grid max-w-2xl gap-4 rounded-md border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-semibold">Edit profile content</h2>
      <FormInput label="Name" name="name" defaultValue={fallbackProfile.name} />
      <FormInput label="Professional headline" name="headline" defaultValue={fallbackProfile.headline} />
      <FormTextarea label="Intro" name="intro" defaultValue={fallbackProfile.intro} />
      <FormTextarea label="Biography" name="biography" defaultValue={fallbackProfile.biography} />
      <FormTextarea label="Current studies" name="currentStudies" defaultValue={fallbackProfile.currentStudies} />
      <FormInput label="GitHub URL" name="githubUrl" defaultValue={fallbackProfile.githubUrl} />
      <FormInput label="LinkedIn URL" name="linkedinUrl" defaultValue={fallbackProfile.linkedinUrl} />
      <FormInput label="Profile image URL" name="profileImageUrl" defaultValue={fallbackProfile.profileImageUrl} />
      <Button type="submit"><Save size={16} className="mr-2" /> Save profile</Button>
    </form>
  );
}

function SkillsAdmin() {
  const [skillsText, setSkillsText] = useState(JSON.stringify(fallbackSkills, null, 2));
  async function saveSkills() {
    const groups = JSON.parse(skillsText) as SkillGroup[];
    await Promise.all(groups.map((group) => setDoc(doc(db, "skills", group.id), { ...group, updatedAt: serverTimestamp() }, { merge: true })));
  }
  return (
    <div className="grid max-w-3xl gap-4 rounded-md border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="font-semibold">Edit skills</h2>
      <textarea value={skillsText} onChange={(event) => setSkillsText(event.target.value)} className="min-h-96 rounded-md border border-line bg-white p-3 font-mono text-sm dark:border-slate-700 dark:bg-slate-950" />
      <Button onClick={saveSkills}><Save size={16} className="mr-2" /> Save skills</Button>
    </div>
  );
}

function ResumeAdmin() {
  return <CollectionManager<ResumeRequest> collectionName="resumeRequests" title="Resume requests" />;
}

function ContactAdmin() {
  return <CollectionManager<ContactMessage> collectionName="contactMessages" title="Contact messages" />;
}

function CollectionManager<T extends { id?: string; status?: string; email?: string; subject?: string; fullName?: string; name?: string; message?: string }>({ collectionName, title }: { collectionName: string; title: string }) {
  const [items, setItems] = useState<T[]>([]);
  const [message, setMessage] = useState("");

  const emptyMessage = useMemo(() => collectionName === "resumeRequests" ? "Resume requests will appear here." : "Contact messages will appear here.", [collectionName]);

  const load = useCallback(async () => {
    const snapshot = await getDocs(query(collection(db, collectionName), orderBy("createdAt", "desc")));
    setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T));
  }, [collectionName]);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function patch(id: string, body: Record<string, unknown>) {
    await updateDoc(doc(db, collectionName, id), {
      ...body,
      updatedAt: serverTimestamp()
    });
    await load();
  }

  async function approveUnavailable() {
    setMessage("Secure resume approval links require a trusted server runtime and are not available on GitHub Pages.");
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {message ? <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">{message}</p> : null}
      {items.length ? items.map((item) => (
        <article key={item.id} className="rounded-md border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold">{item.fullName ?? item.name ?? item.subject}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{item.email}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.message ?? item.status}</p>
            </div>
            <Inbox size={18} className="text-evergreen dark:text-teal-300" />
          </div>
          {collectionName === "resumeRequests" ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={approveUnavailable}>Approve</Button>
              <Button variant="secondary" onClick={() => patch(item.id!, { status: "Rejected" })}>Reject</Button>
              <Button variant="secondary" onClick={() => patch(item.id!, { status: "Expired" })}>Revoke</Button>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => patch(item.id!, { read: true })}>Mark read</Button>
              <Button variant="secondary" onClick={() => patch(item.id!, { archived: true })}>Archive</Button>
            </div>
          )}
        </article>
      )) : <EmptyState title="Nothing to review" message={emptyMessage} />}
    </div>
  );
}
