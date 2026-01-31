import { Stack } from "expo-router";
import React from "react";

const DocumentCaseLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-found" />
      <Stack.Screen name="add-lost" />
    </Stack>
  );
};

export default DocumentCaseLayout;
