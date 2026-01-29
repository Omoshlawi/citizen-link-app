import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { changePasswordSchema } from "@/constants/schemas";
import { authClient } from "@/lib/auth-client";
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
        }
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
    <ScreenLayout title="">
      <Box className="flex-1 items-center justify-center p-4 bg-background-100">
        <FormControl className="p-4 border border-outline-200 rounded-lg w-full bg-background-50">
          <VStack space="lg">
            <Text className="text-2xl font-bold text-center mb-8">
              Change Password
            </Text>
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
            >
              <ButtonText size="lg" className="text-background-100">
                Change Password
              </ButtonText>
            </Button>
          </VStack>
        </FormControl>
      </Box>
    </ScreenLayout>
  );
};

export default ChangePasswordScreen;
