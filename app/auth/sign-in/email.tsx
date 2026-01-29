import { Button } from "@/components/button";
import { FormPasswordInput, FormTextInput } from "@/components/form-inputs";
import { ScreenLayout } from "@/components/layout";
import Logo from "@/components/Logo";
import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { ArrowRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { emailSignInSchema } from "@/constants/schemas";
import { authClient } from "@/lib/auth-client";
import { EmailSignInFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const EmailSignInScreen = () => {
  const form = useForm({
    resolver: zodResolver(emailSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const toast = useToast();
  const onSubmit: SubmitHandler<EmailSignInFormData> = async (data) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "",
          rememberMe: true,
        },
        {
          onError(context) {
            toast.show({
              placement: "top",
              render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                  <Toaster
                    uniqueToastId={uniqueToastId}
                    variant="outline"
                    title="Login failed"
                    description={context.error.message}
                    action="error"
                  />
                );
              },
            });
          },
          onSuccess(context) {
            toast.show({
              placement: "top",
              render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                  <Toaster
                    uniqueToastId={uniqueToastId}
                    variant="outline"
                    title="Login successful"
                    description="You are now logged in"
                    action="success"
                  />
                );
              },
            });
          },
        }
      );
    } catch (error: any) {
      console.error(error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Login failed"
              description={error?.message || "An unknown error occurred"}
              action="error"
            />
          );
        },
      });
    }
  };
  return (
    <ScreenLayout title="Sign in with email">
      <VStack className="justify-between items-center w-full h-full pb-12">
        <Logo />
        <VStack space="lg" className="w-full">
          <Heading>Log In</Heading>
          <FormTextInput
            controll={form.control}
            name="email"
            label={"Email"}
            placeholder={"Enter Email..."}
            autoCapitalize="none"
            keyboardType={"email-address"}
          />

          <FormPasswordInput
            controll={form.control}
            name="password"
            label="Password"
            placeholder="********"
            autoCapitalize="none"
          />

          <Box className="flex-row items-center justify-end">
            <Link href="/auth/forgot-password" withAnchor>
              <Text className="text-sm text-typography-link">
                Forgot Password {"\u2192"}
              </Text>
            </Link>
          </Box>
          <Button
            onPress={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            text="Login"
            suffixIcon={ArrowRightIcon}
          />
        </VStack>
      </VStack>
    </ScreenLayout>
  );
};

export default EmailSignInScreen;
