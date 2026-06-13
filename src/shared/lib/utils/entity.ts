interface EntityWithIdentity {
  id: string;
  name?: string;
}

export function sortByCurrentUserAndName<T extends EntityWithIdentity>(
  items: T[],
  currentUserId?: string,
): T[] {
  return [...items].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });
}
