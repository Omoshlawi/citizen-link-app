import {
  ContactInformation,
  IdentificationAndStatus,
  PersonalInformation,
  SuccessSubmussion,
} from "@/components/client/form";
import { ScreenLayout } from "@/components/layout";
import Toaster from "@/components/toaster";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { clientSchema } from "@/constants/schemas";
import { useClientApi } from "@/hooks/useClients";
import { handleApiErrors } from "@/lib/api";
import { Client, ClientFormData } from "@/types/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, IdCard, Phone, UserCircle } from "lucide-react-native";
import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

const steps: (keyof ClientFormData)[][] = [
  ["firstName", "lastName", "dateOfBirth"],
  ["phoneNumber", "county", "subcounty", "ward"],
  ["nationalId", "maritalStatus"],
];

const AddClientScreen = () => {
  const [step, setStep] = useState(1);
  const [cli, setCli] = useState<Client>();
  const toast = useToast();
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      county: "",
      subcounty: "",
      ward: "",
      nationalId: "",
    },
  });
  const { createClient } = useClientApi();
  const onSubmit: SubmitHandler<ClientFormData> = async (data) => {
    try {
      const _client = await createClient(data);
      if (_client) {
        setStep(4);
        setCli(_client);
        toast.show({
          placement: "top",
          render: ({ id }) => {
            const uniqueToastId = "toast-" + id;
            return (
              <Toaster
                uniqueToastId={uniqueToastId}
                variant="outline"
                title="Success"
                description="Client successfully registered"
                action="success"
              />
            );
          },
        });
      }
    } catch (error) {
      const errors = handleApiErrors<ClientFormData>(error);
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
      } else {
        console.info("Error registering client:", errors);

        // for (let i = 1; i <= steps.length; i++) {
        //   for (const stepField of steps[i]) {
        //     if (stepField in (errors ?? {})) {
        //       setStep(i);
        //       return;
        //     }
        //   }
        // }
        Object.entries(errors ?? {}).forEach(([field, error]) => {
          form.setError(field as keyof ClientFormData, { message: error });
        });

      }
    }
  };
  return (
    <ScreenLayout title="Add New Client">
      <FormProvider {...form}>
        <VStack space="lg" className="flex-1">
          <Card size="md" variant="elevated">
            <HStack className="justify-between items-center">
              <Icon
                as={UserCircle}
                size="sm"
                className={
                  step <= 1
                    ? "bg-teal-500 text-white rounded-full p-4"
                    : "bg-gray-200 text-gray-500 p-4 rounded-full"
                }
              />
              <Icon
                as={Phone}
                size="sm"
                className={
                  step === 2
                    ? "bg-teal-500 text-white rounded-full p-4"
                    : "bg-gray-200 text-gray-500 p-4 rounded-full"
                }
              />
              <Icon
                as={IdCard}
                size="sm"
                className={
                  step === 3
                    ? "bg-teal-500 text-white rounded-full p-4"
                    : "bg-gray-200 text-gray-500 p-4 rounded-full"
                }
              />
              <Icon
                as={CheckCircle}
                size="sm"
                className={
                  step === 4
                    ? "bg-teal-500 text-white rounded-full p-4"
                    : "bg-gray-200 text-gray-500 p-4 rounded-full"
                }
              />
            </HStack>
            <Heading size="sm" className="text-center mt-4">
              {step === 1 && "Personal Information"}
              {step === 2 && "Contact Information"}
              {step === 3 && "Identification and Status"}
              {step === 4 && "Success"}
            </Heading>
          </Card>
          <Card size="md" variant="elevated" className="flex-1">
            {step === 1 && <PersonalInformation onNext={() => setStep(2)} />}
            {step === 2 && (
              <ContactInformation
                onNext={() => setStep(3)}
                onPrevious={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <IdentificationAndStatus
                onNext={form.handleSubmit(onSubmit)}
                onPrevious={() => setStep(2)}
              />
            )}
            {step === 4 && cli && <SuccessSubmussion client={cli} />}
          </Card>
        </VStack>
      </FormProvider>
    </ScreenLayout>
  );
};

export default AddClientScreen;
