import { AlertCircle, Check, Clock } from "lucide-react-native";
import React, { FC } from "react";
import { Badge, BadgeText } from "../ui/badge";
import { Box } from "../ui/box";
import { Icon } from "../ui/icon";
import { Spinner } from "../ui/spinner";

export type Status = "pending" | "loading" | "completed" | "error";

export const StatusIcon: FC<{ status: Status }> = ({ status }) => {
  if (status === "completed") {
    return (
      <Box className="rounded-full p-2 bg-green-500">
        <Icon as={Check} size={20 as any} className="text-white" />
      </Box>
    );
  }
  if (status === "loading") {
    return (
      <Box className="rounded-full p-2 bg-blue-500">
        <Spinner size={20 as any} className="text-white" />
      </Box>
    );
  }
  if (status === "error") {
    return (
      <Box className="rounded-full p-2 bg-red-500">
        <Icon as={AlertCircle} size={20 as any} className="text-white" />
      </Box>
    );
  }
  return (
    <Box className="rounded-full p-2 bg-gray-500">
      <Icon as={Clock} size={20 as any} className="text-white" />
    </Box>
  );
};

export const StatusBadge: FC<{ status: Status }> = ({ status }) => {
  if (status === "completed") {
    return (
      <Badge
        variant="solid"
        className="bg-green-500 rounded-full absolute top-0 right-0"
      >
        <BadgeText className="text-white">Completed</BadgeText>
      </Badge>
    );
  }
  if (status === "loading") {
    return (
      <Badge
        variant="solid"
        className="bg-blue-500 rounded-full absolute top-0 right-0"
      >
        <BadgeText className="text-white">Processing</BadgeText>
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge
        variant="solid"
        className="bg-red-500 rounded-full absolute top-0 right-0"
      >
        <BadgeText className="text-white">Error</BadgeText>
      </Badge>
    );
  }
  return (
    <Badge
      variant="solid"
      className="bg-gray-500 rounded-full absolute top-0 right-0"
    >
      <BadgeText className="text-white">Pending</BadgeText>
    </Badge>
  );
};
