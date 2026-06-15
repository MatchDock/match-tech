import { collection, query, onSnapshot, QueryConstraint } from "firebase/firestore";
import { useEffect, useState } from "react";

import { AppError } from "@/shared/lib/AppError";
import { db } from "@/shared/lib/firebase/firebase.client";

interface UseFirestoreSubscriptionOptions<T> {
  collectionName: string;
  constraints?: QueryConstraint[];
  sortFn?: (a: T, b: T) => number;
}

interface UseFirestoreSubscriptionReturn<T> {
  data: T[];
  loading: boolean;
  error: AppError | null;
}

/**
 * Generic hook for subscribing to Firestore collection with real-time updates
 * Eliminates duplication of subscription logic across features
 *
 * @template T - Type of documents in the collection
 * @param options - Configuration for the subscription
 * @returns Object with data, loading state, and error
 *
 * @example
 * const { data: profiles, loading, error } = useFirestoreSubscription<Member>({
 *   collectionName: "members",
 *   sortFn: (a, b) => a.displayName.localeCompare(b.displayName),
 * });
 */
export function useFirestoreSubscription<T>({
  collectionName,
  constraints = [],
  sortFn,
}: UseFirestoreSubscriptionOptions<T>): UseFirestoreSubscriptionReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    setLoading(true);

    setError(null);

    try {
      const q = query(collection(db, collectionName), ...constraints);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          try {
            const docs = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data() as object),
            } as T));
            const sorted = sortFn ? docs.sort(sortFn) : docs;
            setData(sorted);
            setError(null);
            setLoading(false);
          } catch {
            setError(new AppError("FIRESTORE_UNAVAILABLE", "Failed to parse documents"));
            setLoading(false);
          }
        },
        (err) => {
          setError(new AppError("FIRESTORE_UNAVAILABLE", err.message));
          setLoading(false);
        },
      );

      return unsubscribe;
    } catch {
      // Error will be handled by onSnapshot error callback
      return undefined;
    }
  }, [collectionName, constraints, sortFn]);

  return { data, loading, error };
}
