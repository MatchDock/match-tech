export type RoastPersona = "brutal" | "mild";

export interface RoastRequestPayload {
  memberId: string;
  memberData: unknown;
  persona: RoastPersona;
}

export interface RoastApiResponse {
  roast?: string;
  error?: string;
}

export async function requestRoast(payload: RoastRequestPayload): Promise<RoastApiResponse> {
  const response = await fetch("/api/roast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as RoastApiResponse;

  if (!response.ok) {
    throw new Error(data.error || "Erro ao gerar roast.");
  }

  return data;
}
