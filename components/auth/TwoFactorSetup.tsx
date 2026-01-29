import Toaster from "@/components/toaster";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { authClient } from "@/lib/auth-client";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface TwoFactorSetupProps {
  visible: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export default function TwoFactorSetup({
  visible,
  onComplete,
  onCancel,
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<"password" | "send" | "verify">("password");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const colorScheme = useColorScheme();
  const toast = useToast();

  const handleEnable = async () => {
    if (!password) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description="Please enter your password"
              action="error"
            />
          );
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      // First, enable 2FA with password
      const enableResult = await authClient.twoFactor.enable({
        password,
      });

      if (enableResult.error) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Error"
                description={
                  enableResult.error.message ||
                  "Failed to enable two-factor authentication"
                }
                action="error"
              />
            );
          },
        });
        setIsLoading(false);
        return;
      }

      // If enable succeeds, move to send OTP step
      setStep("send");
    } catch (error: any) {
      console.error("2FA enable error:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description={
                error?.message || "An error occurred. Please try again."
              }
              action="error"
            />
          );
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
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
                title="Error"
                description={
                  result.error.message ||
                  "Failed to send OTP. Please try again."
                }
                action="error"
              />
            );
          },
        });
        setIsSendingOTP(false);
        return;
      }

      // OTP sent successfully
      setOtpSent(true);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="OTP Sent"
              description="Please check your email/SMS for the verification code"
              action="success"
            />
          );
        },
      });
      setStep("verify");
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
              title="Error"
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

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
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
        code: verificationCode,
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
        setVerificationCode("");
        setIsLoading(false);
        return;
      }

      // Successfully verified
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Two-factor authentication has been enabled"
              action="success"
            />
          );
        },
      });
      onComplete();
    } catch (error: any) {
      console.error("2FA verify error:", error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Error"
              description={
                error?.message || "An error occurred. Please try again."
              }
              action="error"
            />
          );
        },
      });
      setVerificationCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setStep("password");
    setPassword("");
    setVerificationCode("");
    setOtpSent(false);
    onCancel();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      <Pressable style={StyleSheet.absoluteFill} onPress={handleCancel}>
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(0, 0, 0, 0.6)",
            },
          ]}
        />
      </Pressable>
      <Box
        className="absolute bottom-0 left-0 right-0 bg-background-0 rounded-t-3xl p-6"
        style={{ maxHeight: "90%" }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="xl">
            {/* Header */}
            <HStack className="items-center justify-between mb-4">
              <Text className="text-xl font-bold">
                {step === "password"
                  ? "Enable Two-Factor Authentication"
                  : step === "send"
                  ? "Send Verification Code"
                  : "Verify Code"}
              </Text>
              <TouchableOpacity onPress={handleCancel}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colorScheme === "dark" ? "white" : "black"}
                />
              </TouchableOpacity>
            </HStack>

            {step === "password" && (
              <VStack space="lg">
                <Text className="text-sm text-typography-500">
                  Enter your password to enable two-factor authentication
                </Text>
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </Input>
                <Button
                  onPress={handleEnable}
                  disabled={isLoading || !password}
                  className="w-full"
                >
                  <ButtonText size="lg" className="text-background-100">
                    {isLoading ? "Enabling..." : "Continue"}
                  </ButtonText>
                </Button>
              </VStack>
            )}

            {step === "send" && (
              <VStack space="lg">
                <Text className="text-sm text-typography-500">
                  We&apos;ll send a verification code to your registered email
                  or phone number. Click the button below to receive your code.
                </Text>
                <Box className="items-center p-4">
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={64}
                    color={colorScheme === "dark" ? "#fff" : "#000"}
                  />
                </Box>
                <Button
                  onPress={handleSendOTP}
                  disabled={isSendingOTP}
                  className="w-full"
                >
                  <ButtonText size="lg" className="text-background-100">
                    {isSendingOTP ? "Sending..." : "Send Verification Code"}
                  </ButtonText>
                </Button>
              </VStack>
            )}

            {step === "verify" && (
              <VStack space="lg">
                <Text className="text-sm text-typography-500">
                  Enter the 6-digit verification code sent to your email or
                  phone number.
                </Text>
                {otpSent && (
                  <Button
                    variant="outline"
                    onPress={handleSendOTP}
                    disabled={isSendingOTP}
                    className="w-full"
                  >
                    <ButtonText>
                      {isSendingOTP ? "Resending..." : "Resend Code"}
                    </ButtonText>
                  </Button>
                )}
                <Input variant="outline" size="lg">
                  <InputField
                    placeholder="000000"
                    value={verificationCode}
                    onChangeText={(text) => {
                      const numericText = text
                        .replace(/[^0-9]/g, "")
                        .slice(0, 6);
                      setVerificationCode(numericText);
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
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full"
                >
                  <ButtonText size="lg" className="text-background-100">
                    {isLoading ? "Verifying..." : "Verify & Enable"}
                  </ButtonText>
                </Button>
              </VStack>
            )}
          </VStack>
        </ScrollView>
      </Box>
    </Modal>
  );
}
