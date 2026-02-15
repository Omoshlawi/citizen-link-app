import { useMatches } from "@/hooks/use-matches";
import { DocumentCase } from "@/types/cases";
import { router, useLocalSearchParams } from "expo-router";
import React, { FC } from "react";
import { FlatList } from "react-native";
import { Pagination, Search } from "../common";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Divider } from "../ui/divider";
import { Spinner } from "../ui/spinner";
import { VStack } from "../ui/vstack";
import MatchImagePreview from "./MatchImagePreview";

type ListMatchesProps = {
  documentCase?: DocumentCase;
};

const ListMatches: FC<ListMatchesProps> = ({ documentCase }) => {
  const params = useLocalSearchParams<Record<string, any>>();
  const { matches, error, isLoading, ...pagination } = useMatches({
    documentCaseId: documentCase?.id,
  });
  if (isLoading) return <Spinner />;
  if (error) return <ErrorState error={error} />;
  return (
    <VStack space="sm" className="flex-1  w-full h-full ">
      <Search
        defaultsearch={params.search}
        onSearchChange={(search) => router.setParams({ search })}
        count={pagination.totalCount}
      />
      <VStack space="md" className="flex-1">
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<EmptyState message="No matches found" />}
          ItemSeparatorComponent={() => (
            // <Box className="h-4 bg-background-0 dark:bg-background-btn " />
            <Divider className="mt-4" />
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <MatchImagePreview match={item} />;
          }}
        />
        <Pagination {...pagination} />
      </VStack>
    </VStack>
  );
};

export default ListMatches;
