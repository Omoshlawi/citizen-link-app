import { useDocumentCases } from "@/hooks/use-document-cases";
import { useMatches } from "@/hooks/use-matches";
import cn from "classnames";
import { Link, router } from "expo-router";
import { Cable, File, LucideIcon, Users } from "lucide-react-native";
import React, { useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { Box } from "../ui/box";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
const SummaryCards = () => {
  const { totalCount: lostCount } = useDocumentCases({
    caseType: "LOST",
    limit: 1,
  });
  const { totalCount: foundCount } = useDocumentCases({
    caseType: "FOUND",
    limit: 1,
  });
  const { totalCount: matchesCount } = useMatches({ limit: 1 });
  const cards = useMemo<
    {
      title: string;
      value: number;
      icon: LucideIcon;
      iconClassName: string;
      navigateTo?: React.ComponentProps<typeof Link>["href"];
      className?: string;
    }[]
  >(() => {
    return [
      {
        title: "My Lost Cases",
        value: lostCount,
        icon: File,
        iconClassName: "text-red-500 dark:text-red-800",
        className: "border-l-4 border-l-red-600",
        navigateTo: { pathname: "/cases", params: { caseType: "LOST" } },
      },
      {
        title: "My Found Cases",
        value: foundCount,
        icon: File,
        iconClassName: "text-green-500 dark:text-green-800",
        className: "border-l-4 border-l-green-600",
        navigateTo: { pathname: "/cases", params: { caseType: "FOUND" } },
      },
      {
        title: "Document Matches",
        value: matchesCount,
        icon: Cable,
        iconClassName: "text-yellow-500 dark:text-yellow-800",
        className: "border-l-4 border-l-yellow-600",
        navigateTo: { pathname: "/matches", params: {} },
      },
      {
        title: "My Points",
        value: 0,
        icon: Users,
        iconClassName: "text-blue-500 dark:text-blue-800",
        className: "border-l-4 border-l-blue-600",
      },
    ];
  }, [foundCount, lostCount, matchesCount]);
  return (
    <Box className="w-full flex flex-row flex-wrap gap-2 mt-4">
      {cards.map((card, index) => (
        <TouchableOpacity
          key={index}
          className={cn(
            "flex-1 min-w-[48%] rounded-3xl bg-background-0 dark:bg-background-btn w-[48%] p-3 gap-3",
            card.className,
          )}
          disabled={!card.navigateTo}
          onPress={() => router.push(card.navigateTo!)}
        >
          <Box className="flex-row items-center gap-2 justify-between">
            <Text className={cn("font-bold text-2xl", card.iconClassName)}>
              {card.value}
            </Text>
            <Icon
              as={card.icon}
              size="lg"
              className={cn(card.iconClassName, "font-bold")}
            />
          </Box>
          <Text className="" size="sm">
            {card.title}
          </Text>
        </TouchableOpacity>
      ))}
    </Box>
  );
};

export default SummaryCards;
