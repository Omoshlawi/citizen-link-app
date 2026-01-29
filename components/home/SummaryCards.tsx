import { cn } from "@gluestack-ui/utils/nativewind-utils";
import { AlertCircle, File, LucideIcon, Users } from "lucide-react-native";
import React, { useMemo } from "react";
import { Box } from "../ui/box";
import { Card } from "../ui/card";
import { Icon } from "../ui/icon";
import { Text } from "../ui/text";
const SummaryCards = () => {
  const cards = useMemo<
    {
      title: string;
      value: number;
      icon: LucideIcon;
      iconClassName: string;
    }[]
  >(() => {
    return [
      {
        title: "My Lost Cases",
        value: 0,
        icon: File,
        iconClassName: "text-red-500 dark:text-red-800",
      },
      {
        title: "My Found Cases",
        value: 0,
        icon: File,
        iconClassName: "text-green-500 dark:text-green-800",
      },
      {
        title: "Pending Matches",
        value: 0,
        icon: AlertCircle,
        iconClassName: "text-yellow-500 dark:text-yellow-800",
      },
      {
        title: "My Points",
        value: 0,
        icon: Users,
        iconClassName: "text-blue-500 dark:text-blue-800",
      },
    ];
  }, []);
  return (
    <Box className="w-full flex flex-row flex-wrap gap-2 mt-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          size="lg"
          className="flex-1 min-w-[48%] rounded-3xl bg-background-btn w-[48%] p-3 gap-3"
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
          <Text className="text-white">{card.title}</Text>
        </Card>
      ))}
    </Box>
  );
};

export default SummaryCards;
