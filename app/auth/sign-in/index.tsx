import { Button } from "@/components/button";
import Logo from "@/components/Logo";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { MailIcon, PhoneIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { ArrowRight, User } from "lucide-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const SignInScreen = () => {
  return (
    <Box className="w-full h-full flex-1 flex-col justify-between items-center px-4 py-20 bg-background-app">
      <Logo />
      <VStack className="w-full" space="lg">
        <Heading className="text-center">Sign In to continue</Heading>
        <Button
          size="xl"
          onPress={() => router.push("/auth/sign-in/email")}
          text="Email Sign in"
          prefixIcon={MailIcon}
          suffixIcon={ArrowRight}
        />
        <Button
          size="xl"
          onPress={() => router.push("/auth/sign-in/phone-number")}
          text="Phone Sign in"
          prefixIcon={PhoneIcon}
          suffixIcon={ArrowRight}
        />

        <Button
          size="xl"
          onPress={() => router.push("/auth/sign-in/username")}
          text="Username Sign in"
          prefixIcon={User}
          suffixIcon={ArrowRight}
        />

        <TouchableOpacity
          className="w-full flex-row justify-end"
          onPress={() => router.push("/auth/sign-up")}
        >
          <Text
            className="text-lg text-typography-link text-center w-full "
            style={{ textDecorationLine: "underline" }}
          >
            Need an account ?
          </Text>
        </TouchableOpacity>
      </VStack>
    </Box>
  );
};

export default SignInScreen;
