/**
 * Represents a parameter value that can be used in URL construction
 */
type ParamValue = string | number | boolean | null | undefined;

/**
 * Represents various ways to provide parameters for URL construction
 */
type ParamInput =
  | Record<string, ParamValue | ParamValue[]>
  | URLSearchParams
  | string
  | [string, ParamValue][]
  | Iterable<[string, ParamValue]>;

/**
 * Configuration options for URL construction behavior
 */
interface UrlConstructOptions {
  /** How to handle existing parameters when adding new ones */
  mergeStrategy?: "replace" | "append" | "preserve";
  /** Whether to include parameters with null/undefined values */
  includeNullish?: boolean;
  /** Whether to sort parameters alphabetically */
  sort?: boolean;
  /** Custom encoding function for parameter values */
  encode?: (value: string) => string;
  /** Whether to allow duplicate parameter names (creates array-like behavior) */
  allowDuplicates?: boolean;
}

/**
 * Constructs a URL with query parameters from a path and params input.
 * Supports multiple input formats and advanced parameter handling.
 *
 * @param path - The base path of the URL (e.g., "/api/resource" or "/api/resource?existing=1")
 * @param params - Parameters in various formats (object, URLSearchParams, string, array of tuples, etc.)
 * @param options - Configuration options for URL construction behavior
 * @returns The constructed URL as a string
 *
 * @example
 * // Basic usage
 * constructUrl('/api/users', { id: 123, active: true })
 * // → '/api/users?id=123&active=true'
 *
 * @example
 * // Array values
 * constructUrl('/api/search', { tags: ['javascript', 'typescript'], limit: 10 })
 * // → '/api/search?tags=javascript&tags=typescript&limit=10'
 *
 * @example
 * // Using URLSearchParams
 * const params = new URLSearchParams();
 * params.append('category', 'tech');
 * params.append('category', 'programming');
 * constructUrl('/api/articles', params)
 * // → '/api/articles?category=tech&category=programming'
 *
 * @example
 * // With merge strategy
 * constructUrl('/api/data?sort=name', { sort: 'date', limit: 5 }, { mergeStrategy: 'preserve' })
 * // → '/api/data?sort=name&limit=5' (preserves existing 'sort')
 */
export function constructUrl(
  path: string,
  params: ParamInput = {},
  options: UrlConstructOptions = {}
): string {
  const {
    mergeStrategy = "replace",
    includeNullish = false,
    sort = false,
    encode,
    allowDuplicates = false,
  } = options;

  // Split path into base and existing query
  const [basePath, existingQuery] = path.split("?");
  const existingParams = new URLSearchParams(existingQuery || "");

  // Convert input params to URLSearchParams
  const newParams = normalizeParams(params, {
    includeNullish,
    encode,
    allowDuplicates,
  });

  // Merge parameters based on strategy
  const mergedParams = mergeParameters(
    existingParams,
    newParams,
    mergeStrategy
  );

  // Sort if requested
  if (sort) {
    mergedParams.sort();
  }

  const queryString = mergedParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Normalizes various parameter input formats into URLSearchParams
 */
function normalizeParams(
  params: ParamInput,
  options: {
    includeNullish: boolean;
    encode?: (value: string) => string;
    allowDuplicates: boolean;
  }
): URLSearchParams {
  const { includeNullish, encode, allowDuplicates } = options;
  const result = new URLSearchParams();

  if (!params) {
    return result;
  }

  // Handle different input types
  if (params instanceof URLSearchParams) {
    // Clone existing URLSearchParams
    params.forEach((value, key) => {
      const processedValue = encode ? encode(value) : value;
      result.append(key, processedValue);
    });
  } else if (typeof params === "string") {
    // Parse query string
    const parsed = new URLSearchParams(params);
    parsed.forEach((value, key) => {
      const processedValue = encode ? encode(value) : value;
      result.append(key, processedValue);
    });
  } else if (Array.isArray(params)) {
    // Handle array of tuples
    params.forEach(([key, value]) => {
      if (shouldIncludeParam(value, includeNullish)) {
        const processedValue = encode ? encode(String(value)) : String(value);
        result.append(key, processedValue);
      }
    });
  } else if (params && typeof params === "object") {
    // Handle object or other iterable
    const entries =
      "entries" in params && typeof params.entries === "function"
        ? Array.from(
            (params as any).entries() as Iterable<[string, ParamValue]>
          )
        : Object.entries(params as Record<string, ParamValue | ParamValue[]>);

    entries.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values
        value.forEach((item) => {
          if (shouldIncludeParam(item, includeNullish)) {
            const processedValue = encode ? encode(String(item)) : String(item);
            if (allowDuplicates) {
              result.append(key, processedValue);
            } else {
              // For non-duplicate mode, join array values with comma
              const existing = result.get(key);
              result.set(
                key,
                existing ? `${existing},${processedValue}` : processedValue
              );
            }
          }
        });
      } else {
        if (shouldIncludeParam(value, includeNullish)) {
          const processedValue = encode ? encode(String(value)) : String(value);
          result.set(key, processedValue);
        }
      }
    });
  }

  return result;
}

/**
 * Merges existing and new parameters based on the specified strategy
 */
function mergeParameters(
  existing: URLSearchParams,
  newParams: URLSearchParams,
  strategy: "replace" | "append" | "preserve"
): URLSearchParams {
  const result = new URLSearchParams();

  // Always start with existing parameters
  existing.forEach((value, key) => {
    result.append(key, value);
  });

  // Apply new parameters based on strategy
  newParams.forEach((value, key) => {
    switch (strategy) {
      case "replace":
        // Replace existing values
        result.delete(key);
        result.append(key, value);
        break;
      case "append":
        // Add to existing values
        result.append(key, value);
        break;
      case "preserve":
        // Only add if key doesn't exist
        if (!result.has(key)) {
          result.append(key, value);
        }
        break;
    }
  });

  return result;
}

/**
 * Determines whether a parameter value should be included based on its type and options
 */
function shouldIncludeParam(
  value: ParamValue,
  includeNullish: boolean
): boolean {
  if (value === null || value === undefined) {
    return includeNullish;
  }
  return true;
}

/**
 * Utility function to create URL-safe parameter objects with fluent interface
 */
export class UrlBuilder {
  private path: string;
  private searchParams: URLSearchParams;
  private options: UrlConstructOptions;

  constructor(path: string, options: UrlConstructOptions = {}) {
    this.path = path;
    this.searchParams = new URLSearchParams();
    this.options = options;
  }

  /**
   * Add a single parameter
   */
  param(key: string, value: ParamValue | ParamValue[]): this {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (shouldIncludeParam(v, this.options.includeNullish || false)) {
          this.searchParams.append(key, String(v));
        }
      });
    } else {
      if (shouldIncludeParam(value, this.options.includeNullish || false)) {
        this.searchParams.set(key, String(value));
      }
    }
    return this;
  }

  /**
   * Add multiple parameters from an object
   */
  params(params: Record<string, ParamValue | ParamValue[]>): this {
    Object.entries(params).forEach(([key, value]) => {
      this.param(key, value);
    });
    return this;
  }

  /**
   * Conditionally add a parameter
   */
  paramIf(
    condition: boolean,
    key: string,
    value: ParamValue | ParamValue[]
  ): this {
    if (condition) {
      this.param(key, value);
    }
    return this;
  }

  /**
   * Remove a parameter
   */
  remove(key: string): this {
    this.searchParams.delete(key);
    return this;
  }

  /**
   * Clear all parameters
   */
  clear(): this {
    this.searchParams = new URLSearchParams();
    return this;
  }

  /**
   * Build the final URL
   */
  build(): string {
    return constructUrl(this.path, this.searchParams, this.options);
  }

  /**
   * Get the current parameters as URLSearchParams
   */
  getParams(): URLSearchParams {
    return new URLSearchParams(this.searchParams);
  }

  /**
   * Convert to string (same as build())
   */
  toString(): string {
    return this.build();
  }
}
