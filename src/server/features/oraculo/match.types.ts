export interface MatchMember {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface MatchRequestBody {
  challengeDesc: string;
  members: MatchMember[];
}

export interface MatchStrategy {
  title: string;
  match: number;
  reason: string;
  allocation: string;
  viability: string;
  risk: string;
  banca: string;
}

export interface MatchResponseDto {
  seguro: MatchStrategy;
  inovacao: MatchStrategy;
  surpresa: MatchStrategy;
}