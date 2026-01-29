import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { ArrowRightIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { forgotPasswordSchema } from "@/constants/schemas";
import { ForgotPasswordFormData } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const ForgotPasswordScreen = () => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    console.log(data);
  };
  return (
    <Box className="flex-1 items-center justify-center p-4 bg-background-100">
      <FormControl className="p-4 border border-outline-200 rounded-lg w-full bg-background-50">
        <VStack space="lg">
          <Text className="text-2xl font-bold text-center mb-8">
            Forgot Password
          </Text>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Input
                variant="outline"
                size="lg"
                isInvalid={!!fieldState?.error?.message}
              >
                <InputField
                  placeholder="Enter Email..."
                  {...field}
                  onChangeText={field.onChange}
                  autoCapitalize="none"
                />
              </Input>
            )}
          />
          <Button
            onPress={form.handleSubmit(onSubmit)}
            className="w-full bg-teal-500 justify-between rounded-none"
          >
            <ButtonText size="lg" className="text-background-100">
              Reset Password
            </ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        </VStack>
      </FormControl>
    </Box>
  );
};

export default ForgotPasswordScreen;
