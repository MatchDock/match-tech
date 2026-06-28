import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../../shared/lib/firebase/firebase.client";
import { firestoreLog } from "../../../shared/lib/logger/logger";
import type { OnboardingForm, OnboardingSkills, TagSentiment } from "../types";

import { SkillService } from "@/application/services/SkillService";
import { FirebaseSkillRepository } from "@/infrastructure/firebase/skillRepository";

type ProfileData = {
  userId: string;
  name: string;
  photoURL: string | null;
  github: string;
  linkedin: string;
  bio: string;
  primaryRole: string;
  secondaryRoles: string[];
  skills: OnboardingSkills;
  extraTagsByCategory: Record<string, string[]>;
  canvas: { loves: string[]; comfort: string[]; veto: string[] };
  status: string;
  eventId: string;
  updatedAt: ReturnType<typeof serverTimestamp>;
  createdAt?: ReturnType<typeof serverTimestamp>;
  visibility?: string;
};

// eslint-disable-next-line
export function useOnboardingForm(user: any) {
  const navigate = useNavigate();

  // ─────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Extra tags added by users per category key, merged into the category tag list
  const [extraTagsByCategory, setExtraTagsByCategory] = useState<Record<string, string[]>>({});

  const [skills, setSkills] = useState<OnboardingSkills>({
    frontend: 7,
    backend: 4,
    ux_ui: 8,
    dados: 2,
    hardware_android: 5,
    vibe_coding: 9,
  });

  const [form, setForm] = useState<OnboardingForm>({
    name: user?.displayName || "",
    github: "",
    linkedin: "",
    bio: "",
    loves: [],
    comfort: [],
    veto: [],
    primaryRole: "",
    secondaryRoles: [],
    status: "looking",
    createdAt: "",
  });

  const skillRepository = useMemo(() => new FirebaseSkillRepository(), []);
  const skillService = useMemo(() => new SkillService(skillRepository), [skillRepository]);

  // ─────────────────────────────────────────────
  // FIRESTORE LOAD
  // ─────────────────────────────────────────────
  const fetchMemberData = async () => {
    if (!user) {
      setInitializing(false);
      return;
    }

    try {
      await user.getIdToken();
    } catch {
      setInitializing(false);
      return;
    }

    try {
      const profileRef = doc(db, "profiles", user.uid);
      let docSnap = await getDoc(profileRef);
      let fromMembersFallback = false;

      if (!docSnap.exists()) {
        const memberRef = doc(db, "members", user.uid);
        docSnap = await getDoc(memberRef);
        if (docSnap.exists()) fromMembersFallback = true;
      }

      if (docSnap.exists()) {
        const data = docSnap.data();

        setForm({
          name: data.name || user.displayName || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          bio: data.bio || "",
          loves: data.loves || data.canvas?.loves || [],
          comfort: data.comfort || data.canvas?.comfort || [],
          veto: data.veto || data.canvas?.veto || [],
          primaryRole: data.primaryRole || "",
          secondaryRoles: data.secondaryRoles || [],
          status: data.status || "looking",
          createdAt: fromMembersFallback ? null : data.createdAt || null,
        });

        if (data.skills) setSkills(data.skills);

        if (data.extraTagsByCategory) {
          setExtraTagsByCategory(data.extraTagsByCategory);
        }
      } else {
        setForm((prev) => ({
          ...prev,
          name: prev.name || user.displayName || "",
        }));
      }
    } catch (error) {
      firestoreLog.error("Erro ao buscar dados do membro:", error);
    } finally {
      setInitializing(false);
    }
  };

  // ─────────────────────────────────────────────
  // SKILL CREATION PER CATEGORY
  // useCallback so it can be safely listed as a
  // useEffect dependency without infinite loops.
  // ─────────────────────────────────────────────
  const handleCreateSkillInCategory = useCallback(
    async (rawName: string, categoryKey: string): Promise<void> => {
      const trimmed = rawName.trim();
      if (!trimmed) return;

      try {
        await skillService.createOrGetSkill(trimmed, categoryKey);

        setExtraTagsByCategory((prev) => {
          const existing = prev[categoryKey] ?? [];
          if (existing.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
            return prev;
          }
          return { ...prev, [categoryKey]: [...existing, trimmed] };
        });
      } catch (error) {
        firestoreLog.error("Erro ao criar skill:", error);
      }
    },
    [skillService],
  );

  // ─────────────────────────────────────────────
  // RADAR
  // ─────────────────────────────────────────────
  const radarData = useMemo(
    () => [
      { subject: "Frontend", A: skills.frontend, fullMark: 10 },
      { subject: "Backend", A: skills.backend, fullMark: 10 },
      { subject: "UX/UI", A: skills.ux_ui, fullMark: 10 },
      { subject: "Dados", A: skills.dados, fullMark: 10 },
      { subject: "Hardware", A: skills.hardware_android, fullMark: 10 },
      { subject: "Vibe AI", A: skills.vibe_coding, fullMark: 10 },
    ],
    [skills],
  );

  // ─────────────────────────────────────────────
  // HANDLERS FORM
  // ─────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, bio: e.target.value.slice(0, 280) }));
  };

  const handleSkillChange = (key: string, value: number) => {
    setSkills((prev) => ({ ...prev, [key]: value }));
  };

  const toggleRole = (role: string) => {
    setForm((prev) => {
      if (prev.primaryRole === role) return { ...prev, primaryRole: "" };

      if (prev.secondaryRoles.includes(role))
        return { ...prev, secondaryRoles: prev.secondaryRoles.filter((r) => r !== role) };

      if (!prev.primaryRole) return { ...prev, primaryRole: role };

      if (prev.secondaryRoles.length < 2)
        return { ...prev, secondaryRoles: [...prev.secondaryRoles, role] };

      return prev;
    });
  };

  const setTagSentiment = (tag: string, sentiment: TagSentiment) => {
    setForm((prev) => {
      const newLoves = prev.loves.filter((t) => t !== tag);
      const newComfort = prev.comfort.filter((t) => t !== tag);
      const newVeto = prev.veto.filter((t) => t !== tag);

      if (sentiment === "loves") newLoves.push(tag);
      if (sentiment === "comfort") newComfort.push(tag);
      if (sentiment === "veto") newVeto.push(tag);

      return { ...prev, loves: newLoves, comfort: newComfort, veto: newVeto };
    });
  };

  // ─────────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────────
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const cleanGithub = (form.github || "")
        .trim()
        .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, "")
        .replace(/\/$/, "")
        .replace(/^@/, "");

      const cleanLinkedin = (form.linkedin || "")
        .trim()
        .replace(/^(?:https?:\/\/)?(?:[\w-]+\.)?linkedin\.com\/(?:in|profile)\//i, "")
        .replace(/\/$/, "")
        .replace(/^@/, "");

      const profileData: ProfileData = {
        userId: user.uid,
        name: form.name.trim(),
        photoURL: user.photoURL || null,
        github: cleanGithub,
        linkedin: cleanLinkedin,
        bio: form.bio.trim(),
        primaryRole: form.primaryRole,
        secondaryRoles: form.secondaryRoles,
        skills,
        extraTagsByCategory,
        canvas: {
          loves: form.loves,
          comfort: form.comfort,
          veto: form.veto,
        },
        status: form.status,
        eventId: "tech_floripa_2026",
        updatedAt: serverTimestamp(),
      };

      if (!form.createdAt) {
        profileData.createdAt = serverTimestamp();
        profileData.visibility = "public";
      }

      await setDoc(doc(db, "profiles", user.uid), profileData, { merge: true });

      navigate("/discover");
    } catch (err) {
      firestoreLog.error("Erro ao registrar perfil:", err);
      setSubmitError("Erro ao salvar perfil. Verifique sua conexão e tente novamente.");
      setTimeout(() => setSubmitError(null), 6000);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────
  return {
    form,
    setForm,
    skills,
    loading,
    initializing,
    submitError,
    radarData,
    fetchMemberData,
    extraTagsByCategory,

    handlers: {
      change: handleChange,
      bioChange: handleBioChange,
      skillChange: handleSkillChange,
      toggleRole,
      setTagSentiment,
      submit: handleSubmit,
      createSkillInCategory: handleCreateSkillInCategory,
    },
  };
}
