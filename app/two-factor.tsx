import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { ArrowRightIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { authClient } from "@/lib/auth-client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const TwoFactorScreen = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const toast = useToast();
  const colorScheme = useColorScheme();
  const cooldownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-send OTP when component mounts
  useEffect(() => {
    sendOTP();

    // Cleanup interval on unmount
    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, []);

  // Handle countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      cooldownIntervalRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownIntervalRef.current) {
              clearInterval(cooldownIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
        cooldownIntervalRef.current = null;
      }
    }

    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [resendCooldown]);

  const sendOTP = async () => {
    setIsSendingOTP(true);
    try {
      const result = await authClient.twoFactor.sendOtp();

      if (result.error) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Failed to Send OTP"
                description={
                  result.error.message ||
                  "Failed to send verification code. Please try again."
                }
                action="error"
              />
            );
          },
        });
      } else {
        setOtpSent(true);
        setResendCooldown(60); // 60 seconds cooldown
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="OTP Sent"
                description="Please check your email or SMS for the verification code"
                action="success"
              />
            );
          },
        });
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Failed to Send OTP"
              description={
                error?.message || "An error occurred. Please try again."
              }
              action="error"
            />
          );
        },
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await sendOTP();
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Invalid Code"
              description="Please enter a 6-digit code"
              action="error"
            />
          );
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await authClient.twoFactor.verifyOtp({
        code,
        trustDevice: true,
      });

      if (result.error) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Verification Failed"
                description={
                  result.error.message || "Invalid code. Please try again."
                }
                action="error"
              />
            );
          },
        });
        setCode("");
      } else {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Verification Successful"
                description="You are now logged in"
                action="success"
              />
            );
          },
        });
        // Redirect to home after successful verification
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("2FA verification error:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Verification Failed"
              description={
                error?.message || "An error occurred. Please try again."
              }
              action="error"
            />
          );
        },
      });
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Box className="flex-1 items-center justify-center p-4">
        <FormControl className="p-6 border border-outline-200 rounded-lg w-full bg-background-50 max-w-md">
          <VStack space="xl" className="items-center">
            <Box className="items-center mb-4">
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={64}
                color={colorScheme === "dark" ? "#fff" : "#000"}
              />
            </Box>
            <VStack space="md" className="items-center">
              <Text className="text-2xl font-bold text-center">
                Two-Factor Authentication
              </Text>
              <Text className="text-sm text-center text-typography-500">
                {isSendingOTP
                  ? "Sending verification code..."
                  : otpSent
                  ? "Enter the 6-digit code sent to your email or phone number"
                  : "Enter the 6-digit code sent to your email or phone number"}
              </Text>
            </VStack>
            <Input variant="outline" size="lg" className="w-full">
              <InputField
                placeholder="000000"
                value={code}
                onChangeText={(text) => {
                  // Only allow numbers and limit to 6 digits
                  const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
                  setCode(numericText);
                  // Auto-submit when 6 digits are entered
                  if (numericText.length === 6 && !isLoading) {
                    handleVerify();
                  }
                }}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
                textAlign="center"
                style={{
                  fontSize: 24,
                  letterSpacing: 8,
                  fontWeight: "bold",
                }}
              />
            </Input>
            <Button
              onPress={handleVerify}
              disabled={isLoading || code.length !== 6}
              className="w-full bg-teal-500 justify-between rounded-none"
            >
              <ButtonText size="lg" className="text-background-100">
                {isLoading ? "Verifying..." : "Verify Code"}
              </ButtonText>
              <ButtonIcon as={ArrowRightIcon} />
            </Button>
            <VStack space="sm" className="w-full">
              <Button
                variant="solid"
                action="secondary"
                onPress={handleResend}
                disabled={isSendingOTP || resendCooldown > 0}
                className="w-full"
              >
                <ButtonText size="md">
                  {isSendingOTP
                    ? "Sending..."
                    : resendCooldown > 0
                    ? `Resend Code (${resendCooldown}s)`
                    : "Resend Code"}
                </ButtonText>
              </Button>
              <Button
                variant="outline"
                onPress={() => router.back()}
                className="w-full"
              >
                <ButtonText size="md">Cancel</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </FormControl>
      </Box>
    </SafeAreaView>
  );
};

export default TwoFactorScreen;
