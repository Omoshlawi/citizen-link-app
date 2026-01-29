import {
  ClientSearch,
  ContraceptiveUse,
  DiagnosisHistory,
  FamilyHistory,
  ObstetricHostory,
  ReviewAndSubmit,
  ScreeningHistory,
  ScreeningResults,
  SexualHealthHistory,
  SmokingHistory,
} from "@/components/client/screening-form";
import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { screenClientSchema } from "@/constants/schemas";
import { useSearchClients } from "@/hooks/useClients";
import { useLocation } from "@/hooks/useLocation";
import { useScreeningsApi } from "@/hooks/useScreenings";
import { handleApiErrors } from "@/lib/api";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import { ScreenClientFormData, Screening } from "@/types/screening";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ActivityIndicator } from "react-native";

const ScreenClientScreen = () => {
  const [step, setStep] = useState(1);
  const { client, search, followUpId } = useLocalSearchParams<{
    client: string;
    search: string;
    followUpId?: string;
  }>();
  const form = useForm({
    resolver: zodResolver(screenClientSchema),
    defaultValues: {
      clientId: client ?? "",
      lifeTimePatners: 0,
      firstIntercourseAge: 0,
      everDiagnosedWithHIV: "NOT_SURE",
      everDiagnosedWithHPV: "NOT_SURE",
      everDiagnosedWithSTI: "NOT_SURE",
      totalBirths: 0,
      everScreenedForCervicalCancer: "NOT_SURE",
      usedOralContraceptivesForMoreThan5Years: "NOT_SURE",
      smoking: "NEVER",
      familyMemberDiagnosedWithCervicalCancer: "NO",
      coordinates: undefined as any,
      followUpId,
    },
  });
  const { createScreening } = useScreeningsApi();
  const seachClientAsync = useSearchClients(search);
  const toast = useToast();
  const [screening, setScreening] = useState<Screening>();
  const {
    coordinates,
    isLoading: isCapturingLocation,
    error: locationError,
    retry: retryLocationCapture,
  } = useLocation();
  const hasLocation = Boolean(coordinates);

  useEffect(() => {
    if (coordinates) {
      form.setValue("coordinates", coordinates, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      });
    }
  }, [coordinates, form]);

  const onSubmit: SubmitHandler<ScreenClientFormData> = async (data) => {
    try {
      const screening = await createScreening(data);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Screening successfully created"
              action="success"
            />
          );
        },
      });
      setStep(10);
      setScreening(screening);
    } catch (error) {
      const errors = handleApiErrors(error);
      if (errors.detail) {
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Error"
                description={errors.detail}
                action="error"
              />
            );
          },
        });
      }

      Object.entries(errors ?? {}).forEach(([field, error]) => {
        form.setError(field as any, { message: error as string });
      });
    }
  };
  return (
    <ScreenLayout
      title={followUpId ? "Screen & complete followup" : "Screen Client"}
    >
      <FormProvider {...form}>
        <VStack space="lg" className="flex-1">
          <Card size="md" variant="elevated">
            <VStack space="md">
              <Text size="sm">{`Step ${step} of ${SCREENING_FORM_STEPS.length}`}</Text>
              <Progress
                value={(step / SCREENING_FORM_STEPS.length) * 100}
                size="md"
                orientation="horizontal"
              >
                <ProgressFilledTrack className="bg-teal-500" />
              </Progress>
              <Text size="sm">{SCREENING_FORM_STEPS[step - 1]}</Text>
            </VStack>
          </Card>
          <Card size="md" variant="elevated" className="flex-1">
            {!hasLocation ? (
              <LocationCaptureBlock
                isLoading={isCapturingLocation}
                error={locationError}
                onRetry={retryLocationCapture}
              />
            ) : (
              <>
                {step === 1 && (
                  <ClientSearch
                    onNext={() => setStep(2)}
                    searchClientAsync={seachClientAsync}
                  />
                )}
                {step === 2 && (
                  <SexualHealthHistory
                    onNext={() => setStep(3)}
                    onPrevious={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <DiagnosisHistory
                    onNext={() => setStep(4)}
                    onPrevious={() => setStep(2)}
                  />
                )}
                {step === 4 && (
                  <ObstetricHostory
                    onNext={() => setStep(5)}
                    onPrevious={() => setStep(3)}
                  />
                )}
                {step === 5 && (
                  <ScreeningHistory
                    onNext={() => setStep(6)}
                    onPrevious={() => setStep(4)}
                  />
                )}
                {step === 6 && (
                  <ContraceptiveUse
                    onNext={() => setStep(7)}
                    onPrevious={() => setStep(5)}
                  />
                )}
                {step === 7 && (
                  <SmokingHistory
                    onNext={() => setStep(8)}
                    onPrevious={() => setStep(6)}
                  />
                )}
                {step === 8 && (
                  <FamilyHistory
                    onNext={() => setStep(9)}
                    onPrevious={() => setStep(7)}
                  />
                )}
                {step === 9 && (
                  <ReviewAndSubmit
                    onNext={form.handleSubmit(onSubmit)}
                    onPrevious={() => setStep(8)}
                    clients={seachClientAsync.clients}
                  />
                )}

                {step === 10 && screening && (
                  <ScreeningResults screening={screening} />
                )}
              </>
            )}
          </Card>
        </VStack>
      </FormProvider>
    </ScreenLayout>
  );
};

export default ScreenClientScreen;

const LocationCaptureBlock = ({
  isLoading,
  error,
  onRetry,
}: {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}) => {
  return (
    <VStack
      space="lg"
      className="flex-1 items-center justify-center px-6 text-center"
    >
      <Text size="md" className="text-center font-semibold">
        {isLoading ? "Capturing current location" : "Location required"}
      </Text>
      <Text size="sm" className="text-center text-typography-500">
        We need your current GPS coordinates before you can start screening.
        Please allow location access to continue.
      </Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0f766e" />
      ) : (
        <>
          {error && (
            <Text size="sm" className="text-center text-red-500">
              {error}
            </Text>
          )}
          <Button
            action="primary"
            size="sm"
            className="bg-teal-500 rounded-none w-full"
            onPress={onRetry}
          >
            <ButtonText>Try Again</ButtonText>
          </Button>
        </>
      )}
    </VStack>
  );
};
