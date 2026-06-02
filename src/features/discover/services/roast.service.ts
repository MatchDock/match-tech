import type { Profile, RoastPersona } from "../model/discover.types";
import { requestRoast as requestSharedRoast } from "../../../shared/services/roast.service";

export async function requestRoast(profile: Profile, persona: RoastPersona) {
  return requestSharedRoast({
    memberId: profile.id,
    memberData: profile,
    persona,
  });
}