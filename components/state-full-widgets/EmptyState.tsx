import * as React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import EmptyStateSvg from "./EmptyStateSvg";

type EmptyStateProps = {
  message?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data available",
}) => {
  return (
    <Box className="flex-1 flex-col gap-m justify-center items-center">
      <EmptyStateSvg width={"80%"} style={{ aspectRatio: 1 }} />
      <Text className="text-outline text-bodyMedium">{message}</Text>
    </Box>
  );
};

export default EmptyState;
