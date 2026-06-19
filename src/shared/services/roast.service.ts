import type { RoastPersona } from "@/domain/entities/Shared";

export interface RoastRequestPayload {
  memberId: string;
  memberData: unknown;
  persona: RoastPersona;
}

export interface RoastApiResponse {
  roast?: string;
  error?: string;
}

export async function requestRoast(
  payload: RoastRequestPayload,
  onChunk?: (text: string) => void,
): Promise<RoastApiResponse> {
  const response = await fetch("/api/roast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const data = (await response.json()) as RoastApiResponse;
    throw new Error(data.error || "Erro ao gerar roast.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      if (!part.startsWith("data: ")) continue;
      const raw = part.slice(6).trim();

      if (raw === "[DONE]") return { roast: fullText };

      let parsed: { chunk?: string; error?: string };
      try {
        parsed = JSON.parse(raw) as { chunk?: string; error?: string };
      } catch {
        continue;
      }

      if (parsed.error) throw new Error(parsed.error);

      if (parsed.chunk) {
        fullText += parsed.chunk;
        onChunk?.(parsed.chunk);
      }
    }
  }

  return { roast: fullText };
}

export async function deleteRoast(memberId: string, persona?: RoastPersona): Promise<void> {
  const url = persona ? `/api/roast/${memberId}?persona=${persona}` : `/api/roast/${memberId}`;
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Erro ao apagar roast.");
  }
}
