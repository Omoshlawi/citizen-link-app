import React from "react";
import useApi from "./useApi";
import { APIFetchResponse } from "./types";
import { useSWRConfig } from "swr";

const TestApi = () => {
  const { data, error, isLoading } = useApi<
    APIFetchResponse<{
      userId: number;
      id: number;
      title: string;
      completed: boolean;
    }>
  >("/todos/1");

  const CONFIG = useSWRConfig();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (data || CONFIG) {
    return (
      <div>
        TestApi
        <pre>{JSON.stringify({ DATA: data?.data, CONFIG }, null, 2)}</pre>
      </div>
    );
  }
};

export default TestApi;
