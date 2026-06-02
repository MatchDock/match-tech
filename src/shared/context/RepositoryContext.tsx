/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, ReactNode } from "react";

import type { IProfileRepository } from "@/domain/ports/IProfileRepository";
import type { ISquadRepository } from "@/domain/ports/ISquadRepository";
import { profileRepository } from "@/infrastructure/firebase/profileRepository";
import { squadRepository } from "@/infrastructure/firebase/squadRepository";

/**
 * Repository context for dependency injection
 * Allows swapping implementations for testing or different backends
 */
interface RepositoryContextValue {
  profileRepo: IProfileRepository;
  squadRepo: ISquadRepository;
}

export const RepositoryContext = createContext<RepositoryContextValue | undefined>(undefined);

interface RepositoryProviderProps {
  children: ReactNode;
  profileRepo?: IProfileRepository;
  squadRepo?: ISquadRepository;
}

/**
 * Provider component for repository services
 * Defaults to Firebase implementations but allows injection of alternatives
 */
export function RepositoryProvider({
  children,
  profileRepo = profileRepository,
  squadRepo = squadRepository,
}: RepositoryProviderProps): ReactNode {
  const value: RepositoryContextValue = {
    profileRepo,
    squadRepo,
  };

  return <RepositoryContext.Provider value={value}>{children}</RepositoryContext.Provider>;
}

/**
 * Hook to access repository services
 * Must be used inside RepositoryProvider
 */
export function useRepositories(): RepositoryContextValue {
  const context = useContext(RepositoryContext);

  if (!context) {
    throw new Error("useRepositories must be used inside RepositoryProvider");
  }

  return context;
}
