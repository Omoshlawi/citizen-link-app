import { useMatches } from "@/hooks/use-matches";
import {
  getMatchConfidenceDisplay,
  getMatchStatusColor,
  getMatchStatusDisplay,
} from "@/lib/helpers";
import { DocumentCase } from "@/types/cases";
import Color from "color";
import React, { FC } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import Pagination from "../Pagination";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Spinner } from "../ui/spinner";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type MatchesListViewProps = {
  documentCase?: DocumentCase;
};

const MatchesListView: FC<MatchesListViewProps> = ({ documentCase }) => {
  const { matches, error, isLoading, ...pagination } = useMatches({
    documentCaseId: documentCase?.id,
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState error={error} />;
  return (
    <VStack space="md" className="flex-1">
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState message="No matches found" />}
        ItemSeparatorComponent={() => <Box className="h-2" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity activeOpacity={0.5}>
              <Card
                variant="elevated"
                className="dark:bg-background-btn rounded-lg"
              >
                <VStack>
                  <HStack className="justify-between">
                    <Heading size="sm">{`Match No: ${item.matchNumber}`}</Heading>
                    <Text
                      className="rounded-full px-2 py-1 font-bold text-center align-middle"
                      size="xs"
                      style={{
                        backgroundColor: Color(getMatchStatusColor(item.status))
                          .alpha(0.1)
                          .toString(),
                        color: getMatchStatusColor(item.status),
                      }}
                    >
                      {getMatchStatusDisplay(item.status)}
                    </Text>
                  </HStack>
                  <Text>{item.matchScore}%</Text>
                  <Text>
                    {getMatchConfidenceDisplay(item.aiAnalysis.confidence)}
                  </Text>
                  <Text>{item.aiAnalysis.recommendation}</Text>
                </VStack>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
      <Pagination {...pagination} />
    </VStack>
  );
};

export default MatchesListView;
