import { Stack } from "expo-router";
import React from "react";

const SifnUpLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="phone-number" />
    </Stack>
  );
};

export default SifnUpLayout;
