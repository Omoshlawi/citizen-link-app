import { Stack } from "expo-router";
import React from "react";

const SignInLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="email" options={{ headerShown: false }} />
      <Stack.Screen name="username" options={{ headerShown: false }} />
      <Stack.Screen name="phone-number" options={{ headerShown: false }} />
    </Stack>
  );
};

export default SignInLayout;
