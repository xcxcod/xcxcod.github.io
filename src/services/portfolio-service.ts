import { adminDb } from "@/lib/firebase/admin";
import { profile as fallbackProfile, projects as fallbackProjects, skillGroups as fallbackSkills } from "@/lib/sample-data";
import type { Profile, Project, SkillGroup } from "@/types/portfolio";

function hasAdminConfig() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

function toDate(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate() as Date;
  }
  return value as Date | undefined;
}

export async function getProfile(): Promise<Profile> {
  if (!hasAdminConfig()) return fallbackProfile;

  const snapshot = await adminDb().collection("profile").doc("main").get();
  return snapshot.exists ? ({ ...fallbackProfile, ...snapshot.data() } as Profile) : fallbackProfile;
}

export async function getProjects({ featuredOnly = false } = {}): Promise<Project[]> {
  if (!hasAdminConfig()) {
    return fallbackProjects.filter((project) => project.published && (!featuredOnly || project.featured));
  }

  let query = adminDb().collection("projects").where("published", "==", true).orderBy("order", "asc");
  if (featuredOnly) query = query.where("featured", "==", true);
  const snapshot = await query.get();

  if (snapshot.empty) return fallbackProjects.filter((project) => project.published && (!featuredOnly || project.featured));

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt)
    } as Project;
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const fallback = fallbackProjects.find((project) => project.slug === slug && project.published) ?? null;
  if (!hasAdminConfig()) return fallback;

  const snapshot = await adminDb()
    .collection("projects")
    .where("slug", "==", slug)
    .where("published", "==", true)
    .limit(1)
    .get();

  if (snapshot.empty) return fallback;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Project;
}

export async function getSkills(): Promise<SkillGroup[]> {
  if (!hasAdminConfig()) return fallbackSkills;

  const snapshot = await adminDb().collection("skills").orderBy("order", "asc").get();
  return snapshot.empty ? fallbackSkills : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as SkillGroup);
}
