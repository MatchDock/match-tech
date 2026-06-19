import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/server/shared/lib/gemini.server", () => ({
  getGeminiClient: vi.fn(),
}));

vi.mock("../roast.repository", () => ({
  saveProfileRoast: vi.fn().mockResolvedValue(undefined),
}));

import { saveProfileRoast } from "../roast.repository";
import { generateRoastStream } from "../roast.service";
import type { RoastRequestBody } from "../roast.types";

import { getGeminiClient } from "@/server/shared/lib/gemini.server";

const mockBody: RoastRequestBody = {
  memberId: "user-1",
  memberData: { name: "Ada", primaryRole: "Frontend" },
  persona: "brutal",
};

function makeAsyncIterable(chunks: { text: string }[]) {
  return {
    [Symbol.asyncIterator]() {
      let i = 0;
      return {
        async next() {
          if (i >= chunks.length) return { done: true, value: undefined };
          return { done: false, value: chunks[i++] };
        },
      };
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  (getGeminiClient as ReturnType<typeof vi.fn>).mockReturnValue({
    models: {
      generateContentStream: vi
        .fn()
        .mockResolvedValue(makeAsyncIterable([{ text: "Você é " }, { text: "terrível." }])),
    },
  });
});

describe("generateRoastStream", () => {
  it("yields text chunks from the Gemini stream", async () => {
    const chunks: string[] = [];
    for await (const chunk of generateRoastStream(mockBody)) {
      chunks.push(chunk);
    }
    expect(chunks).toEqual(["Você é ", "terrível."]);
  });

  it("calls saveProfileRoast with the full accumulated text after streaming", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _ of generateRoastStream(mockBody)) {
      /* drain */
    }
    expect(saveProfileRoast).toHaveBeenCalledWith("user-1", "Você é terrível.", "brutal");
  });

  it("passes thinkingBudget: 0 in the Gemini config", async () => {
    const mockClient = (getGeminiClient as ReturnType<typeof vi.fn>)();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _ of generateRoastStream(mockBody)) {
      /* drain */
    }
    expect(mockClient.models.generateContentStream).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({
          thinkingConfig: { thinkingBudget: 0 },
        }),
      }),
    );
  });

  it("skips empty chunks", async () => {
    (getGeminiClient as ReturnType<typeof vi.fn>).mockReturnValue({
      models: {
        generateContentStream: vi
          .fn()
          .mockResolvedValue(
            makeAsyncIterable([{ text: "hello" }, { text: "" }, { text: " world" }]),
          ),
      },
    });
    const chunks: string[] = [];
    for await (const chunk of generateRoastStream(mockBody)) {
      chunks.push(chunk);
    }
    expect(chunks).toEqual(["hello", " world"]);
  });
});
