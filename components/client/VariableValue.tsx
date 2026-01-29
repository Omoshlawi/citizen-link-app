import React from "react";
import { Text } from "react-native";
import { Box } from "../ui/box";

const VariableValue = ({
  value,
  variable,
  score,
}: {
  value: string | number;
  variable: string;
  score?: number;
}) => {
  return (
    <Box className="w-full flex flex-row  gap-4">
      <Text className="text-sm font-bold flex-1">{variable}:</Text>
      <Text className="text-sm pr-4">{value}</Text>
      {score !== undefined && score !== null && (
        <Text className="text-sm pr-4">{score}</Text>
      )}
    </Box>
  );
};

export default VariableValue;
