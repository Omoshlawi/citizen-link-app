import { Button } from "@/components/button";
import { FormDatePicker, FormSelectInput } from "@/components/form-inputs";
import { ScreenLayout } from "@/components/layout";
import { FormStationPicker } from "@/components/stations";
import Toaster from "@/components/toaster";
import { useToast } from "@/components/ui/toast";
import { VStack } from "@/components/ui/vstack";
import { useAddresses } from "@/hooks/use-addresses";
import { useClaimApi } from "@/hooks/use-claims";
import { handleApiErrors } from "@/lib/api";
import { scheduleClaimHandoverSchema } from "@/lib/schemas";
import { ScheduleClaimHandoverFormData } from "@/types/claim";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const ScheduleCollection = () => {
  const { claimId } = useLocalSearchParams<{
    claimId: string;
  }>();
  const { addresses } = useAddresses();
  const toast = useToast();
  const { scheduleClaimHandover } = useClaimApi();
  const form = useForm({
    resolver: zodResolver(scheduleClaimHandoverSchema),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<ScheduleClaimHandoverFormData> = async (
    data,
  ) => {
    try {
      await scheduleClaimHandover(claimId, data);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Success"
              description="Claim successfully scheduled for handover"
              action="success"
            />
          );
        },
      });
      router.back();
    } catch (error) {
      const errors = handleApiErrors(error);
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const uniqueToastId = "toast-" + id;
          return (
            <Toaster
              uniqueToastId={uniqueToastId}
              variant="outline"
              title="Failed to schedule handover"
              description={errors?.detail}
              action="error"
            />
          );
        },
      });
    }
  };
  return (
    <ScreenLayout title="Schedule Collection">
      <VStack space="lg">
        <FormSelectInput
          controll={form.control}
          name="preferedCollectionPoint"
          label="Collection Preference"
          data={[
            {
              value: "station",
              label: "Collect at our nearest station",
            },
            { value: "address", label: "Collect at address of your choice" },
          ]}
        />
        {form.watch("preferedCollectionPoint") === "address" && (
          <FormSelectInput
            controll={form.control}
            name="addressId"
            label="Address"
            data={addresses.map((address) => ({
              value: address.id,
              label: address.label as string,
            }))}
          />
        )}
        {form.watch("preferedCollectionPoint") === "station" && (
          <FormStationPicker
            controll={form.control}
            name="pickupStationId"
            label="Pickup Station"
          />
        )}
        <FormDatePicker
          controll={form.control}
          name="preferredHandoverDate"
          label="Preferred collection Date"
        />
        <Button
          text="Schedule Collection"
          suffixIcon={ArrowRight}
          onPress={form.handleSubmit(onSubmit)}
          loading={form.formState.isSubmitting}
          className="bg-teal-500"
        />
      </VStack>
    </ScreenLayout>
  );
};

export default ScheduleCollection;
