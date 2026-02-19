import { Stack } from "expo-router";
import React from "react";

const ClaimLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add" />
      <Stack.Screen name="[claimId]" />
    </Stack>
  );
};

export default ClaimLayout;
