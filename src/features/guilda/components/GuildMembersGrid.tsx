import type { User } from "firebase/auth";
import { GuildMemberCard } from "./GuildMemberCard";
import type { GuildMember, RoastStep } from "../model/guilda.types";

interface GuildMembersGridProps {
  members: GuildMember[];
  user: User;
  roastActiveMember: string | null;
  roastStep: RoastStep;
  roastLogs: string[];
  onOpenRoastSelection: (memberId: string) => void;
  onExecuteRoast: (member: GuildMember, persona: "brutal" | "mild") => void;
}

export function GuildMembersGrid({
  members,
  user,
  roastActiveMember,
  roastStep,
  roastLogs,
  onOpenRoastSelection,
  onExecuteRoast,
}: GuildMembersGridProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
      {members.map((member, index) => (
        <GuildMemberCard
          key={member.id}
          member={member}
          colorIndex={index}
          user={user}
          roastActiveMember={roastActiveMember}
          roastStep={roastStep}
          roastLogs={roastLogs}
          onOpenRoastSelection={onOpenRoastSelection}
          onExecuteRoast={onExecuteRoast}
        />
      ))}
    </div>
  );
}
