import { constructUrl } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import useSWR from "swr";

export const useSessions = () => {
  const url = constructUrl(`/auth/list-sessions`);
  const { data, error, isLoading, mutate } = useSWR(url, async (_: string) => {
    const { data, error } = await authClient.listSessions();
    if (error) {
      throw error;
    }
    return data;
  });
  return {
    sessions: data,
    error,
    isLoading,
    mutate,
  };
};
