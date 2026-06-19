import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { requestRoast } from "../roast.service";

function sseStream(...events: string[]) {
  const data = events.map((e) => `data: ${e}\n\n`).join("");
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("requestRoast (SSE client)", () => {
  it("resolves with full roast text when [DONE] is received", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      body: sseStream('{"chunk":"Olá "}', '{"chunk":"mundo"}', "[DONE]"),
    });
    const result = await requestRoast({ memberId: "u1", memberData: {}, persona: "brutal" });
    expect(result.roast).toBe("Olá mundo");
  });

  it("calls onChunk for each received chunk in order", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      body: sseStream('{"chunk":"A"}', '{"chunk":"B"}', "[DONE]"),
    });
    const calls: string[] = [];
    await requestRoast({ memberId: "u1", memberData: {}, persona: "brutal" }, (t) => calls.push(t));
    expect(calls).toEqual(["A", "B"]);
  });

  it("throws when the stream contains an error event", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      body: sseStream('{"error":"Gemini down"}'),
    });
    await expect(
      requestRoast({ memberId: "u1", memberData: {}, persona: "brutal" }),
    ).rejects.toThrow("Gemini down");
  });

  it("throws when response is not ok", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      body: null,
      json: async () => ({ error: "Rate limit" }),
    });
    await expect(
      requestRoast({ memberId: "u1", memberData: {}, persona: "brutal" }),
    ).rejects.toThrow("Rate limit");
  });
});

import { deleteRoast } from "../roast.service";

describe("deleteRoast", () => {
  it("calls DELETE /api/roast/:memberId?persona=brutal", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    await deleteRoast("u1", "brutal");
    expect(mockFetch).toHaveBeenCalledWith("/api/roast/u1?persona=brutal", { method: "DELETE" });
  });

  it("calls DELETE /api/roast/:memberId without persona query when persona is omitted", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    await deleteRoast("u1");
    expect(mockFetch).toHaveBeenCalledWith("/api/roast/u1", { method: "DELETE" });
  });

  it("throws with server error message when response is not ok", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({ error: "Not found" }) });
    await expect(deleteRoast("u1", "brutal")).rejects.toThrow("Not found");
  });
});
