import { Button } from "@/components/button";
import { FormPasswordInput, FormTextInput } from "@/components/form-inputs";
import { ScreenLayout } from "@/components/layout";
import Logo from "@/components/Logo";
import Toaster from "@/components/toaster";
import { Heading } from "@/components/ui/heading";
import { ArrowRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { authClient } from "@/lib/auth-client";
import { registerSchema } from "@/lib/schemas";
import { RegisterFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity } from "react-native";

const SignUpScreen = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
  });
  const toast = useToast();
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          phoneNumber: data.phoneNumber,
          username: data.username,
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
    <ScreenLayout title="Create account">
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="justify-between items-center w-full pb-12">
          <Logo className="w-full" mode="name" />
          <VStack space="lg" className="w-full mt-4">
            <Heading>Create Account</Heading>
            <FormTextInput
              controll={form.control}
              name="name"
              label={"Name"}
              placeholder={"e.g John Doe"}
              autoCapitalize="none"
              keyboardType={"email-address"}
            />
            <FormTextInput
              controll={form.control}
              name="phoneNumber"
              label={"Phone number"}
              placeholder={"e.g 254712345678"}
              autoCapitalize="none"
              keyboardType={"phone-pad"}
            />
            <FormTextInput
              controll={form.control}
              name="username"
              label={"Username"}
              placeholder={"e.g johny"}
              autoCapitalize="none"
              keyboardType={"default"}
            />
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
            <FormPasswordInput
              controll={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="********"
              autoCapitalize="none"
            />
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              text="Register"
              suffixIcon={ArrowRightIcon}
            />
            <TouchableOpacity
              className="w-full flex-row justify-end"
              onPress={() => router.back()}
            >
              <Text
                className="text-lg text-typography-link text-center w-full "
                style={{ textDecorationLine: "underline" }}
              >
                Already have an account ?
              </Text>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </ScrollView>
    </ScreenLayout>
  );
};

export default SignUpScreen;
