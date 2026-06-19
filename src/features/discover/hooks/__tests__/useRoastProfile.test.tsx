/**
 * @vitest-environment jsdom
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, act, waitFor } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/shared/services/roast.service", () => ({
  requestRoast: vi.fn(),
  deleteRoast: vi.fn(),
}));

vi.mock("../../services/discover.repository", () => ({
  updateProfile: vi.fn(),
}));

import type { Profile } from "../../model/discover.types";
import { updateProfile } from "../../services/discover.repository";
import { useRoastProfile } from "../useRoastProfile";

import { requestRoast, deleteRoast } from "@/shared/services/roast.service";

const mockProfile: Profile = {
  id: "p1",
  name: "Ada",
  primaryRole: "Frontend",
  skills: { frontend: 8, backend: 3, design: 5, data: 2, devops: 1, soft: 6 },
  canvas: { loves: [], comfort: [], veto: [] },
  status: "looking",
} as unknown as Profile;

const showToast = vi.fn();

const createWrapper = () => {
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useRoastProfile streaming", () => {
  it("accumulates streamingText as onChunk is called", async () => {
    (requestRoast as ReturnType<typeof vi.fn>).mockImplementation(
      async (_payload: unknown, onChunk?: (t: string) => void) => {
        onChunk?.("Parte 1 ");
        onChunk?.("Parte 2");
        return { roast: "Parte 1 Parte 2" };
      },
    );

    const { result } = renderHook(() => useRoastProfile({ showToast }), {
      wrapper: createWrapper(),
    });

    act(() => result.current.openProfile(mockProfile));
    act(() => result.current.executeRoast(mockProfile, "brutal"));

    await waitFor(() => expect(result.current.isGenerating).toBe(false));

    // streamingText cleared after success
    expect(result.current.streamingText).toBe("");
  });

  it("does NOT call updateProfile after roast succeeds", async () => {
    (requestRoast as ReturnType<typeof vi.fn>).mockResolvedValue({ roast: "Roast text" });

    const { result } = renderHook(() => useRoastProfile({ showToast }), {
      wrapper: createWrapper(),
    });

    act(() => result.current.openProfile(mockProfile));
    act(() => result.current.executeRoast(mockProfile, "brutal"));

    await waitFor(() => expect(result.current.isGenerating).toBe(false));

    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("clears streamingText and shows toast on error", async () => {
    (requestRoast as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("IA offline"));

    const { result } = renderHook(() => useRoastProfile({ showToast }), {
      wrapper: createWrapper(),
    });

    act(() => result.current.openProfile(mockProfile));
    act(() => result.current.executeRoast(mockProfile, "brutal"));

    await waitFor(() => expect(result.current.isGenerating).toBe(false));

    expect(result.current.streamingText).toBe("");
    expect(showToast).toHaveBeenCalled();
  });
});

describe("useRoastProfile - executeDeleteRoast", () => {
  const profileWithBrutal: Profile = {
    ...mockProfile,
    roastBrutal: "Você é terrível!",
  } as unknown as Profile;

  it("clears roastBrutal from selectedProfile on successful delete", async () => {
    (deleteRoast as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    const { result } = renderHook(() => useRoastProfile({ showToast }), {
      wrapper: createWrapper(),
    });

    act(() => result.current.openProfile(profileWithBrutal));
    act(() => result.current.executeDeleteRoast("brutal"));

    await waitFor(() => expect(result.current.isDeleting).toBe(false));

    expect(result.current.selectedProfile?.roastBrutal).toBeUndefined();
  });

  it("shows toast on delete error", async () => {
    (deleteRoast as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Server error"));

    const { result } = renderHook(() => useRoastProfile({ showToast }), {
      wrapper: createWrapper(),
    });

    act(() => result.current.openProfile(mockProfile));
    act(() => result.current.executeDeleteRoast("brutal"));

    await waitFor(() => expect(result.current.isDeleting).toBe(false));

    expect(showToast).toHaveBeenCalledWith("Erro ao apagar veredito. Tente novamente.");
  });

  it("calls onDeleteSuccess callback after successful delete", async () => {
    (deleteRoast as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const onDeleteSuccess = vi.fn();

    const { result } = renderHook(() => useRoastProfile({ showToast, onDeleteSuccess }), {
      wrapper: createWrapper(),
    });

    act(() => result.current.openProfile(profileWithBrutal));
    act(() => result.current.executeDeleteRoast("brutal"));

    await waitFor(() => expect(result.current.isDeleting).toBe(false));

    expect(onDeleteSuccess).toHaveBeenCalledOnce();
  });
});
