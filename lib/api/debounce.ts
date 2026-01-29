import { useEffect, useState } from "react";

/**
 * Creates a debounced version of a function that delays its execution until after a specified time has elapsed
 * since the last time it was invoked.
 *
 * @template T - The type of the function to be debounced
 * @param {T} func - The function to debounce
 * @param {number} delay - The number of milliseconds to delay execution
 *
 * @returns {T & { cancel: () => void; flush: () => void }} A debounced version of the input function with additional methods:
 * - cancel: Cancels any pending execution
 * - flush: Immediately executes any pending invocation
 *
 * @example
 * ```typescript
 * const debouncedScroll = debounce(() => {
 *   // handle scroll event
 * }, 100);
 *
 * window.addEventListener('scroll', debouncedScroll);
 *
 * // Cancel pending execution
 * debouncedScroll.cancel();
 *
 * // Immediately execute pending call
 * debouncedScroll.flush();
 * ```
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void; flush: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T>;

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T & { cancel: () => void; flush: () => void };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  debounced.flush = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      func(...lastArgs);
    }
  };

  return debounced;
}

// For async functions (still lightweight)
/**
 * Creates a debounced version of an async function that delays its execution until after a specified time has elapsed
 * since the last time it was invoked.
 *
 * @template T - The type of the async function to debounce
 * @param {T} func - The async function to debounce
 * @param {number} delay - The number of milliseconds to delay execution
 *
 * @returns {((...args: Parameters<T>) => Promise<ReturnType<T>>) & {
 *   cancel: () => void;
 *   flush: () => Promise<ReturnType<T> | undefined>;
 * }} A debounced version of the input function with additional cancel and flush methods
 *
 * @property {() => void} cancel - Cancels any pending execution and rejects the pending promise
 * @property {() => Promise<ReturnType<T> | undefined>} flush - Immediately executes any pending invocation
 *
 * @example
 * const debouncedFetch = debounceAsync(async (url: string) => {
 *   const response = await fetch(url);
 *   return response.json();
 * }, 1000);
 *
 * // Will only make one API call after 1 second
 * debouncedFetch('api/data');
 * debouncedFetch('api/data');
 * debouncedFetch('api/data');
 *
 * // Cancel pending execution
 * debouncedFetch.cancel();
 *
 * // Immediately execute pending call
 * await debouncedFetch.flush();
 */
function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) & {
  cancel: () => void;
  flush: () => Promise<ReturnType<T> | undefined>;
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T>;
  let pendingPromise:
    | {
        resolve: (value: ReturnType<T>) => void;
        reject: (reason: any) => void;
      }
    | undefined;

  const debounced = ((...args: Parameters<T>): Promise<ReturnType<T>> => {
    lastArgs = args;
    clearTimeout(timeoutId);

    return new Promise<ReturnType<T>>((resolve, reject) => {
      pendingPromise = { resolve, reject };
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          pendingPromise?.resolve(result);
        } catch (error) {
          pendingPromise?.reject(error);
        }
        pendingPromise = undefined;
      }, delay);
    });
  }) as ((...args: Parameters<T>) => Promise<ReturnType<T>>) & {
    cancel: () => void;
    flush: () => Promise<ReturnType<T> | undefined>;
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
    pendingPromise?.reject(new Error("Debounced function cancelled"));
    pendingPromise = undefined;
  };

  debounced.flush = async (): Promise<ReturnType<T> | undefined> => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      try {
        const result = await func(...lastArgs);
        pendingPromise?.resolve(result);
        return result;
      } catch (error) {
        pendingPromise?.reject(error);
        throw error;
      } finally {
        pendingPromise = undefined;
      }
    }
    return undefined;
  };

  return debounced;
}

// React hook optimized for bundle size

/**
 * A custom hook that creates a debounced value from a given value with a specified delay.
 *
 * @template T - The type of the value being debounced
 * @param value - The value to be debounced
 * @param delay - The delay time in milliseconds before the value updates
 * @returns The debounced value of type T
 *
 * @example
 * ```tsx
 * const searchTerm = "hello";
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * ```
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export { debounce, debounceAsync, useDebounce };
