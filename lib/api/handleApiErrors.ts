import { isAxiosError } from "axios";

const flattenZodErrors = (
  obj: any,
  prefix: string = ""
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === "_errors") {
      // Handle _errors at current level
      const errors = value as string[];
      if (errors.length > 0) {
        const fieldKey = prefix || "detail";
        result[fieldKey] = errors.join(", ");
      }
    } else if (value && typeof value === "object") {
      // Determine the accessor key
      let accessor: string;
      if (prefix) {
        // Check if key is numeric (array index)
        if (/^\d+$/.test(key)) {
          accessor = `${prefix}.${key}`;
        } else {
          accessor = `${prefix}.${key}`;
        }
      } else {
        accessor = key;
      }

      // Check if this object has _errors
      if ((value as any)?._errors && Array.isArray((value as any)?._errors)) {
        result[accessor] = (value as any)?._errors.join(", ");
      }

      // Recursively flatten nested objects
      const nested = flattenZodErrors(value, accessor);
      Object.assign(result, nested);
    }
  }

  return result;
};

const handleApiErrors = <T extends Record<string, unknown>>(
  error: any
): { [field in keyof T]?: string } & { detail?: string } => {
  if (isAxiosError(error)) {
    if (error.response?.status === 400) {
      const errorData = error.response?.data ?? {};
      return flattenZodErrors(errorData?.errors);
    }
    return {
      detail:
        error?.response?.data?.detail ??
        error?.response?.data?.message ??
        error.message ??
        "Unknown error occurred",
    };
  }
  return {
    detail: error?.message ?? "Unknown error occurred",
  };
};

export default handleApiErrors;
