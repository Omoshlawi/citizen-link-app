import { Stack } from "expo-router";
import React from "react";

const ClaimDetailLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="cancel" />
      <Stack.Screen name="dispute" />
    </Stack>
  );
};

export default ClaimDetailLayout;
