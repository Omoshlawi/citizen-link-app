import { APIFetchResponse, constructUrl } from "@/lib/api";
import { FaqTopic, FrequentlyAskedQuestion } from "@/types/faq";
import useSWR from "swr";

export const useFrequentlyAskedQuestions = (topicId?: string) => {
  const url = constructUrl("/faq", {
    topicId: topicId !== "all" ? topicId : undefined,
  });
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{
      results: FrequentlyAskedQuestion[];
    }>
  >(url);
  return {
    questions: data?.data?.results ?? [],
    error,
    isLoading,
  };
};

export const useFaqTopics = (includeAll?: boolean) => {
  const url = constructUrl("/faq-topics");
  const { data, error, isLoading } = useSWR<
    APIFetchResponse<{
      results: FaqTopic[];
    }>
  >(url);
  return {
    topics: includeAll
      ? [{ id: "all", name: "All Topics" }, ...(data?.data?.results ?? [])]
      : data?.data?.results ?? [],
    error,
    isLoading,
  };
};
