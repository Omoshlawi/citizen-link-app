import { useCallback, useState } from "react";
import { useSearchParamsExtended } from "./useSearchParams";

type UsePaginationOptions = {
  defaultLimit?: number;
  defaultPage?: number;
  context?: "router" | "state";
};

export const usePagination = (options?: UsePaginationOptions) => {
  const {
    defaultLimit = 10,
    defaultPage = 1,
    context = "router",
  } = options ?? {};
  const { searchParams: params, updateParams } = useSearchParamsExtended();
  const [paginationParams, setPaginationParam] = useState<URLSearchParams>(
    new URLSearchParams()
  );
  const searchParams = context === "router" ? params : paginationParams;
  const limit = searchParams?.get("limit") ?? `${defaultLimit}`;
  const page = searchParams?.get("page") ?? `${defaultPage}`;

  const showPagination = useCallback(
    (totalCount: number = 0) => {
      const _limit = Number(limit);
      return totalCount >= _limit;
    },
    [limit]
  );

  const onPageChange = useCallback(
    (page: number) => {
      if (context === "router") updateParams({ page: `${page}` });
      else
        setPaginationParam((state) => {
          state.set("page", `${page}`);
          return new URLSearchParams(state);
        });
    },
    [updateParams, context, setPaginationParam]
  );
  return {
    limit,
    page,
    onPageChange,
    showPagination,
  };
};

export const useMergePaginationInfo = (
  params: Record<string, string> = {},
  options?: UsePaginationOptions
) => {
  const { limit, onPageChange, page, showPagination } = usePagination(options);
  const mergedParams = { ...params, limit: String(limit), page: String(page) };

  return {
    mergedSearchParams: mergedParams as Record<string, string>,
    onPageChange,
    showPagination,
  };
};
