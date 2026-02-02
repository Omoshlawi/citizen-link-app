import { Stack } from "expo-router";
import React from "react";

const CaseLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
    </Stack>
  );
};

export default CaseLayout;
