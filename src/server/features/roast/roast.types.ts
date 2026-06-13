export type RoastPersona = "brutal" | "mild";

export interface RoastMemberData {
  id?: string;
  name?: string;
  bio?: string;
  github?: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  roast?: string;
  roastBrutal?: string;
  roastMild?: string;
  canvas?: {
    loves?: string[];
    comfort?: string[];
    vetoes?: string[];
  };
  [key: string]: unknown;
}

export interface RoastRequestBody {
  memberId: string;
  memberData: RoastMemberData;
  persona?: RoastPersona;
}

export interface RoastResponseDto {
  roast: string;
}