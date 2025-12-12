import { useCallback, useState } from "react";

export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean
) {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? stored === "true" : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setAndStore = useCallback(
    (next: boolean) => {
      setValue(next);
      try {
        localStorage.setItem(key, String(next));
      } catch {
      }
    },
    [key]
  );

  return [value, setAndStore] as const;
}
