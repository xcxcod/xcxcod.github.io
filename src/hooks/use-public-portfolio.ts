"use client";

import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { profile as fallbackProfile, projects as fallbackProjects, skillGroups as fallbackSkills } from "@/lib/sample-data";
import type { Profile, Project, SkillGroup } from "@/types/portfolio";

type PortfolioState = {
  profile: Profile;
  projects: Project[];
  skills: SkillGroup[];
  loading: boolean;
};

export function usePublicPortfolio(): PortfolioState {
  const [state, setState] = useState<PortfolioState>({
    profile: fallbackProfile,
    projects: fallbackProjects.filter((project) => project.published),
    skills: fallbackSkills,
    loading: true
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [profileSnapshot, projectsSnapshot, skillsSnapshot] = await Promise.all([
          getDoc(doc(db, "profile", "main")),
          getDocs(query(collection(db, "projects"), where("published", "==", true))),
          getDocs(query(collection(db, "skills"), orderBy("order", "asc")))
        ]);

        if (!mounted) return;

        const profileData = profileSnapshot.exists() ? ({ ...fallbackProfile, ...profileSnapshot.data() } as Profile) : fallbackProfile;
        const resolvedProfile = {
          ...profileData,
          location: profileData.location?.trim() || fallbackProfile.location,
          university: profileData.university?.trim() || fallbackProfile.university,
          study: profileData.study?.trim() || fallbackProfile.study,
          profileImageUrl: profileData.profileImageUrl?.trim() || fallbackProfile.profileImageUrl
        };

        setState({
          profile: resolvedProfile,
          projects: projectsSnapshot.empty
            ? fallbackProjects.filter((project) => project.published)
            : projectsSnapshot.docs
                .map((item) => ({ id: item.id, ...item.data() }) as Project)
                .sort((a, b) => a.order - b.order),
          skills: skillsSnapshot.empty
            ? fallbackSkills
            : skillsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as SkillGroup),
          loading: false
        });
      } catch {
        if (mounted) setState((current) => ({ ...current, loading: false }));
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

export function usePublicProject(slug: string) {
  const portfolio = usePublicPortfolio();
  return {
    ...portfolio,
    project: portfolio.projects.find((project) => project.slug === slug) ?? null
  };
}
