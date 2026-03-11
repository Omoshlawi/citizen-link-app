import { KeyboardAvoidingLayout, ScreenLayout } from "@/components/layout";
import Logo from "@/components/Logo";
import Toaster from "@/components/toaster";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { authClient } from "@/lib/auth-client";
import { changePasswordSchema } from "@/lib/schemas";
import { ChangePasswordFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const ChangePasswordScreen = () => {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      currentPassword: "",
      confirmPassword: "",
      revokeOtherSessions: true,
    },
  });
  const router = useRouter();
  const toast = useToast();
  const onSubmit: SubmitHandler<ChangePasswordFormData> = async ({
    currentPassword,
    newPassword,
    revokeOtherSessions,
  }) => {
    try {
      await authClient.changePassword(
        { currentPassword, newPassword, revokeOtherSessions },
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
                    title="Error"
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
                    title="Success"
                    description="Password changed successfully"
                    action="success"
                  />
                );
              },
            });
          },
        },
      );
      router.back();
    } catch (error: any) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description={error.message}
              action="error"
            />
          );
        },
      });
    }
  };
  return (
    <ScreenLayout title="Change Password">
      <KeyboardAvoidingLayout>
        <VStack className="justify-between h-full items-center w-full pb-12">
          <Logo className="w-80 h-80" />
          <VStack space="lg" className="w-full">
            <Controller
              control={form.control}
              name="currentPassword"
              render={({ field, fieldState }) => (
                <Input
                  variant="outline"
                  size="lg"
                  isInvalid={!!fieldState?.error?.message}
                >
                  <InputField
                    placeholder="Enter Current Password..."
                    {...field}
                    onChangeText={field.onChange}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />
            <Controller
              control={form.control}
              name="newPassword"
              render={({ field, fieldState }) => (
                <Input
                  variant="outline"
                  size="lg"
                  isInvalid={!!fieldState?.error?.message}
                >
                  <InputField
                    placeholder="Enter New Password..."
                    {...field}
                    onChangeText={field.onChange}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Input
                  variant="outline"
                  size="lg"
                  isInvalid={!!fieldState?.error?.message}
                >
                  <InputField
                    placeholder="Confirm New Password..."
                    {...field}
                    onChangeText={field.onChange}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </Input>
              )}
            />
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="rounded-full bg-background-btn"
            >
              <ButtonText size="lg" className="text-white">
                Change Password
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </KeyboardAvoidingLayout>
    </ScreenLayout>
  );
};

export default ChangePasswordScreen;
