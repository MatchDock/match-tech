import React from "react";
import { motion } from "motion/react";
import { Terminal } from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";

// Constants
import { TAG_CATEGORIES } from "../constants/tagCategories";
import { ROLES_LIST } from "../constants/roles";

// Hook
import { useOnboardingForm } from "../hooks/useOnboardingForm";

// Components
import { AuthGate } from "../components/AuthGate/AuthGate";
import { IdentityCard } from "../components/IdentityCard";
import { ClassSelector } from "../components/ClassSelector";
import { ArsenalCalibration } from "../components/ArsenalCalibration";
import { TagCategoryCard } from "../components/TagCategoryCard";
import { SkillSliders } from "../components/SkillSliders";
import { GuildPassport } from "../components/GuildPassport";

export default function Onboarding() {
  const {
    user,
    signIn,
    sendMagicLink,
    magicLinkSent,
    magicLinkEmail,
    completingMagicLink,
    resetMagicLinkState,
    pendingMagicLinkUrl,
    confirmMagicLinkEmail,
  } = useAuth();

  const {
    form,
    skills,
    loading,
    initializing,
    submitError,
    radarData,
    fetchMemberData,
    handlers,
  } = useOnboardingForm(user);

  // Fetch profile data once user is authenticated
  React.useEffect(() => {
    fetchMemberData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Terminal className="w-12 h-12 text-neo-cyan mx-auto animate-pulse" />
          <p className="font-heading text-xl uppercase animate-pulse">Sincronizando Dados...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthGate
        signIn={signIn}
        sendMagicLink={sendMagicLink}
        magicLinkSent={magicLinkSent}
        magicLinkEmail={magicLinkEmail ?? ''}
        completingMagicLink={completingMagicLink}
        pendingMagicLinkUrl={pendingMagicLinkUrl}
        resetMagicLinkState={resetMagicLinkState}
        confirmMagicLinkEmail={confirmMagicLinkEmail}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-neo-bg relative overflow-hidden"
    >
      {/* Background decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
        className="absolute -top-60 -right-40 w-120 h-120 bg-neo-lime border-4 border-neo-black opacity-10 hidden lg:block"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 100, ease: "linear" }}
        className="absolute -bottom-60 -left-40 w-140 h-140 bg-neo-cyan rounded-full border-4 border-neo-black opacity-10 hidden lg:block"
      />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_2px,transparent_2px)] bg-size-[32px_32px]" />

      <div className="max-w-7xl mx-auto py-12 px-6 relative z-10">
        {/* Page header */}
        <div className="mb-12 border-b-8 border-neo-black pb-8 flex flex-col md:flex-row justify-between items-end gap-6 bg-white/40 p-8 neo-border backdrop-blur-md shadow-[12px_12px_0_0_#000]">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-9xl font-heading mb-2 tracking-tighter text-neo-black drop-shadow-sm">
              MAPEAR MEMBRO_
            </h1>
            <div className="flex flex-wrap gap-2">
              <p className="text-xl font-bold uppercase bg-neo-black text-white px-3 py-1 inline-block">
                Protocolo Floripa 2026
              </p>
              <p className="text-xl font-bold uppercase bg-neo-lime text-neo-black px-3 py-1 neo-border inline-block">
                Nível 01: Identificação
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlers.submit} className="gap-8 grid grid-cols-1 lg:grid-cols-12">

          {/* ── Left column ── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Identity + Class side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <IdentityCard
                form={form}
                onChange={handlers.change}
                onBioChange={handlers.bioChange}
              />
              <ClassSelector
                roles={ROLES_LIST}
                form={form}
                onToggleRole={handlers.toggleRole}
              />
            </div>

            {/* Arsenal section */}
            <div className="space-y-10">
              <ArsenalCalibration form={form} />

              <div className="border-l-12 border-neo-black pl-6 py-2">
                <h2 className="text-5xl font-heading uppercase text-neo-black tracking-tighter">
                  ARSENAL_DE_SKILLS
                </h2>
                <p className="font-black text-sm uppercase opacity-50 tracking-widest mt-1">
                  Defina seu arsenal: [ ❤️ MEU_FOCO | ✅ OPERO_BEM | 🚫 NEM_FUDENDO ]
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {TAG_CATEGORIES.map(category => (
                  <TagCategoryCard
                    key={category.name}
                    category={category}
                    form={form}
                    onSetSentiment={handlers.setTagSentiment}
                  />
                ))}
              </div>
            </div>

            {/* Skill sliders */}
            <SkillSliders skills={skills} onSkillChange={handlers.skillChange} />
          </div>

          {/* ── Right column — sticky passport ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 h-max">
            <GuildPassport
              form={form}
              skills={skills}
              user={user}
              radarData={radarData}
              loading={loading}
              submitError={submitError}
              onSubmit={handlers.submit}
            />
          </div>

        </form>
      </div>
    </motion.div>
  );
}
