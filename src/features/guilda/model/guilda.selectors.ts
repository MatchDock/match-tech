import { GUILD_CARD_PALETTES } from "../constants/guilda.constants";

import type { GuildMember, MemberSkills, RadarDatum } from "./guilda.types";

import { sortByCurrentUserAndName } from "@/shared/lib/utils/entity";

export function sortMembers(members: GuildMember[], currentUserId: string) {
  return sortByCurrentUserAndName(members, currentUserId);
}

export function getCardPalette(index: number) {
  return GUILD_CARD_PALETTES[index % GUILD_CARD_PALETTES.length];
}

export function getRadarData(skills?: MemberSkills): RadarDatum[] {
  if (!skills) return [];

  return [
    { subject: "Front", A: skills.frontend || 0, fullMark: 10 },
    { subject: "Back", A: skills.backend || 0, fullMark: 10 },
    { subject: "UX", A: skills.ux_ui || 0, fullMark: 10 },
    { subject: "Dados", A: skills.dados || 0, fullMark: 10 },
    { subject: "Hard", A: skills.hardware_android || 0, fullMark: 10 },
    { subject: "AI", A: skills.vibe_coding || 0, fullMark: 10 },
  ];
}
