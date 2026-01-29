import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";

/**
 * Custom hook that provides URLSearchParams-like interface for Expo Router
 * Returns [searchParams, setSearchParams] similar to useState pattern
 */
export const useSearchParams = (): [
  URLSearchParams,
  (params: URLSearchParams | Record<string, string> | string) => void
] => {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Create URLSearchParams from current route params
  const searchParams = useMemo(() => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle array values
        if (Array.isArray(value)) {
          value.forEach((v) => urlParams.append(key, String(v)));
        } else {
          urlParams.set(key, String(value));
        }
      }
    });
    return urlParams;
  }, [params]);

  // Function to update search parameters
  const setSearchParams = useCallback(
    (newParams: URLSearchParams | Record<string, string> | string) => {
      let searchParamsObj: Record<string, string> = {};

      if (newParams instanceof URLSearchParams) {
        newParams.forEach((value, key) => {
          searchParamsObj[key] = value;
        });
      } else if (typeof newParams === "string") {
        const urlParams = new URLSearchParams(newParams);
        urlParams.forEach((value, key) => {
          searchParamsObj[key] = value;
        });
      } else {
        searchParamsObj = newParams;
      }

      // Navigate with new params
      router.setParams(searchParamsObj);
    },
    [router]
  );

  return [searchParams, setSearchParams];
};

/**
 * Extended version with additional utility methods
 */
export const useSearchParamsExtended = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get a specific parameter value
  const getParam = useCallback(
    (key: string, defaultValue?: string): string | null => {
      return searchParams.get(key) ?? defaultValue ?? null;
    },
    [searchParams]
  );

  // Set a single parameter
  const setParam = useCallback(
    (key: string, value: string | null) => {
      const newParams = new URLSearchParams(searchParams);
      if (value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Delete a parameter
  const deleteParam = useCallback(
    (key: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key);
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Update multiple parameters at once
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Clear all parameters
  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Get all parameters as an object
  const getParamsObject = useCallback((): Record<string, string> => {
    const paramsObj: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    return paramsObj;
  }, [searchParams]);

  return {
    searchParams,
    setSearchParams,
    getParam,
    setParam,
    deleteParam,
    updateParams,
    clearParams,
    getParamsObject,
  };
};

/**
 * Hook for typed search parameters with validation
 */
export const useTypedSearchParams = <T extends Record<string, any>>(schema: {
  [K in keyof T]: {
    parse: (value: string | null) => T[K];
    serialize: (value: T[K]) => string;
    defaultValue?: T[K];
  };
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current parameters according to schema
  const parsedParams = useMemo(() => {
    const result = {} as T;

    Object.entries(schema).forEach(([key, config]) => {
      const rawValue = searchParams.get(key);
      try {
        result[key as keyof T] = config.parse(rawValue);
      } catch {
        result[key as keyof T] = config.defaultValue as T[keyof T];
      }
    });

    return result;
  }, [searchParams, schema]);

  // Update typed parameters
  const setTypedParams = useCallback(
    (updates: Partial<T>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        const config = schema[key as keyof T];
        if (config && value !== undefined) {
          if (value === null) {
            newParams.delete(key);
          } else {
            newParams.set(key, config.serialize(value));
          }
        }
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams, schema]
  );

  // Clear parameters function with flexible input (type-safe)
  const clearTypedParams = useCallback(
    (keys?: keyof T | (keyof T)[]) => {
      const newParams = new URLSearchParams(searchParams);

      if (keys === undefined) {
        // Clear all parameters if no keys provided
        setSearchParams(new URLSearchParams());
      } else if (
        typeof keys === "string" ||
        typeof keys === "number" ||
        typeof keys === "symbol"
      ) {
        // Clear single parameter if key provided
        newParams.delete(String(keys));
        setSearchParams(newParams);
      } else if (Array.isArray(keys)) {
        // Clear multiple parameters if array provided
        keys.forEach((key) => {
          newParams.delete(String(key));
        });
        setSearchParams(newParams);
      }
    },
    [searchParams, setSearchParams]
  );

  return [parsedParams, setTypedParams, clearTypedParams] as const;
};

// Utility functions for parsing and serializing search params
export const searchParamUtils = {
  // Parse boolean from search param
  parseBoolean: (value: string | null, defaultValue = false): boolean => {
    if (value === null) return defaultValue;
    return value.toLowerCase() === "true";
  },

  // Parse number from search param
  parseNumber: (value: string | null, defaultValue = 0): number => {
    if (value === null) return defaultValue;
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  },

  // Parse array from search param (comma-separated)
  parseArray: (value: string | null, defaultValue: string[] = []): string[] => {
    if (value === null) return defaultValue;
    return value.split(",").filter(Boolean);
  },

  // Serialize array to search param
  serializeArray: (arr: string[]): string => {
    return arr.join(",");
  },

  // Parse JSON from search param
  parseJSON: <T>(value: string | null, defaultValue: T): T => {
    if (value === null) return defaultValue;
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return defaultValue;
    }
  },

  // Serialize JSON to search param
  serializeJSON: (obj: any): string => {
    return encodeURIComponent(JSON.stringify(obj));
  },
};

// Example usage:
/*
// Basic usage
const [searchParams, setSearchParams] = useSearchParams();

// Extended usage
const { getParam, setParam, updateParams } = useSearchParamsExtended();

// Typed usage
const [params, setParams, clearParams] = useTypedSearchParams({
  page: {
    parse: (v) => searchParamUtils.parseNumber(v, 1),
    serialize: (v) => String(v),
    defaultValue: 1,
  },
  filter: {
    parse: (v) => v ?? "all",
    serialize: (v) => v,
    defaultValue: "all",
  },
  tags: {
    parse: (v) => searchParamUtils.parseArray(v),
    serialize: (v) => searchParamUtils.serializeArray(v),
    defaultValue: [],
  },
});

// Update params
setParams({ page: 2, filter: "active" });

// Clear specific params
clearParams(["filter", "tags"]);

// Clear all params
clearParams();
*/
