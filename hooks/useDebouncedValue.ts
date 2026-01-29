import { useEffect, useState } from "react";

/**
 * Debounces the given value by the specified delay in ms.
 * Returns a tuple: [debouncedValue, setValue] (setValue is just for compatibility with useState).
 *
 * Example:
 *   const [value, setValue] = useState("");
 *   const [debouncedValue] = useDebouncedValue(value, 500);
 */
export function useDebouncedValue<T>(
  value: T,
  delay: number = 300
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return [debouncedValue, setDebouncedValue];
}
