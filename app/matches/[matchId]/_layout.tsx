import { Stack } from "expo-router";
import React from "react";

const MatchLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="claim" />
    </Stack>
  );
};

export default MatchLayout;
