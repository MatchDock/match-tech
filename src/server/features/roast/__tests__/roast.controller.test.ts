import type { Request, Response } from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../roast.service", () => ({
  generateRoastStream: vi.fn(),
}));

import { postRoast } from "../roast.controller";
import { generateRoastStream } from "../roast.service";

async function* chunks(...texts: string[]) {
  for (const t of texts) yield t;
}

function mockRes() {
  const written: string[] = [];
  return {
    setHeader: vi.fn(),
    flushHeaders: vi.fn(),
    write: vi.fn((s: string) => {
      written.push(s);
    }),
    end: vi.fn(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
    _written: written,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("postRoast (SSE)", () => {
  it("sets SSE headers", async () => {
    (generateRoastStream as ReturnType<typeof vi.fn>).mockReturnValue(chunks());
    const res = mockRes();
    await postRoast(
      { body: { memberId: "u1", memberData: {} } } as Request,
      res as unknown as Response,
    );
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "text/event-stream");
    expect(res.setHeader).toHaveBeenCalledWith("Cache-Control", "no-cache");
    expect(res.setHeader).toHaveBeenCalledWith("Connection", "keep-alive");
  });

  it("writes each chunk as SSE data and ends with [DONE]", async () => {
    (generateRoastStream as ReturnType<typeof vi.fn>).mockReturnValue(chunks("Olá ", "mundo"));
    const res = mockRes();
    await postRoast(
      { body: { memberId: "u1", memberData: {} } } as Request,
      res as unknown as Response,
    );
    expect(res._written).toContain('data: {"chunk":"Olá "}\n\n');
    expect(res._written).toContain('data: {"chunk":"mundo"}\n\n');
    expect(res._written).toContain("data: [DONE]\n\n");
    expect(res.end).toHaveBeenCalled();
  });

  it("writes error event when stream throws", async () => {
    (generateRoastStream as ReturnType<typeof vi.fn>).mockReturnValue(
      (async function* () {
        throw new Error("Gemini down");
      })(),
    );
    const res = mockRes();
    await postRoast(
      { body: { memberId: "u1", memberData: {} } } as Request,
      res as unknown as Response,
    );
    expect(res._written.some((s) => s.includes('"error"'))).toBe(true);
    expect(res.end).toHaveBeenCalled();
  });

  it("returns 400 json when memberId or memberData are missing", async () => {
    const res = mockRes();
    await postRoast({ body: {} } as Request, res as unknown as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing memberId or memberData" });
  });
});
