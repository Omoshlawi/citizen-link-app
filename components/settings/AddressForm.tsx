import { useAddressesApi, useAddressLocales } from "@/hooks/use-addresses";
import { handleApiErrors } from "@/lib/api";
import { addressSchema } from "@/lib/schemas";
import { Address, AddressFormData, AddressLevelKey } from "@/types/address";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { Button } from "../button";
import {
  CollapsibleFormSection,
  FormCheckBox,
  FormDatePicker,
  FormSelectInput,
  FormTextInput,
} from "../form-inputs";
import Toaster from "../toaster";
import { Box } from "../ui/box";
import { useToast } from "../ui/toast";
import { VStack } from "../ui/vstack";
const LEVEL_FIELDS: AddressLevelKey[] = [
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
];

type AddressFormProps = {
  address?: Address;
};
const AddressForm: FC<AddressFormProps> = ({ address }) => {
  const startDate = useMemo(() => {
    const date = dayjs(address?.startDate ?? "");
    if (date.isValid()) return date.toDate();
    return undefined;
  }, [address]);
  const endDate = useMemo(() => {
    const date = dayjs(address?.endDate ?? "");
    if (date.isValid()) return date.toDate();
    return undefined;
  }, [address]);
  const form = useForm({
    defaultValues: {
      type: address?.type ?? "OTHER",
      label: address?.label ?? "",
      address1: address?.address1 ?? "",
      address2: address?.address2 ?? "",
      landmark: address?.landmark ?? "",
      level1: address?.level1 ?? "",
      level2: address?.level2 ?? "",
      level3: address?.level3 ?? "",
      level4: address?.level4 ?? "",
      level5: address?.level5 ?? "",
      cityVillage: address?.cityVillage ?? "",
      stateProvince: address?.stateProvince ?? "",
      country: address?.country ?? "ke",
      postalCode: address?.postalCode ?? "",
      latitude: address?.latitude ?? null,
      longitude: address?.longitude ?? null,
      plusCode: address?.plusCode ?? "",
      startDate,
      endDate,
      preferred: address?.preferred ?? false,
      formatted: address?.formatted ?? "",
      localeId: address?.localeId ?? "",
    },
    resolver: zodResolver(addressSchema),
  });
  const { createAddress, updateAddress } = useAddressesApi();
  const { locales } = useAddressLocales();
  const toast = useToast();

  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    try {
      if (address) await updateAddress(address.id, data);
      else createAddress(data);
      // Extract document from the returned case
      toast.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={`toast-${id}`}
            variant="outline"
            title="Submitted"
            description="Address submitted succefully"
            action="success"
          />
        ),
      });

      router.back();
    } catch (error) {
      const e = handleApiErrors<AddressFormData>(error);
      if ("detail" in e && e.detail) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toaster
              uniqueToastId={`toast-${id}`}
              variant="outline"
              title="Failed to submit address"
              description={e.detail}
              action="success"
            />
          ),
        });
      } else {
        Object.entries(e).forEach(([key, val]) =>
          form.setError(key as keyof AddressFormData, {
            message: val as string,
          })
        );
      }
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack space="md">
        <CollapsibleFormSection title="General">
          <FormSelectInput
            label="Address Locale"
            data={locales.map((l) => ({ label: l.regionName, value: l.id }))}
            controll={form.control}
            name="localeId"
          />
          <FormSelectInput
            label="Address Category"
            data={[
              { value: "HOME", label: "Home" },
              { value: "WORK", label: "Work" },
              { value: "BILLING", label: "Billing" },
              { value: "SHIPPING", label: "Shipping" },
              { value: "OFFICE", label: "Office" },
              { value: "OTHER", label: "Other" },
            ]}
            controll={form.control}
            name="type"
          />
          <FormTextInput
            label="Address Label"
            controll={form.control}
            name="label"
            placeholder="e.g Home, Ofice"
            helperText="Friendly address name"
          />
          <FormTextInput
            label="Address 1"
            controll={form.control}
            name="address1"
            placeholder="Address 1"
            helperText="Normally apartment name e.g Qwetu homes"
          />
          <FormTextInput
            label="Address 2"
            controll={form.control}
            name="address2"
            placeholder="Address 2"
            helperText="Normally House number e.g QTU-011"
          />
          <FormTextInput
            label="Landmark"
            controll={form.control}
            name="landmark"
            placeholder="Address 2"
          />
          <Box className="mt-4">
            <FormCheckBox
              label="Mark as prefered address"
              controll={form.control}
              name="preferred"
            />
          </Box>
        </CollapsibleFormSection>
        <CollapsibleFormSection title="Administrative levels">
          {LEVEL_FIELDS?.map((level) => (
            <FormTextInput
              controll={form.control}
              name={level}
              key={level}
              label={level}
            />
          ))}
        </CollapsibleFormSection>
        <CollapsibleFormSection title="Legacy & Contact" defaultCollapsed>
          <FormTextInput
            label="City Village"
            controll={form.control}
            name="cityVillage"
            placeholder="City village"
            helperText="Legacy address"
          />
          <FormTextInput
            label="State Provice"
            controll={form.control}
            name="stateProvince"
            placeholder="State province"
            helperText="Legacy address"
          />
          <FormTextInput
            label="Country"
            controll={form.control}
            name="country"
            placeholder="State province"
            helperText="Legacy address"
          />
          <FormTextInput
            label="Postal cODE"
            controll={form.control}
            name="postalCode"
            placeholder="postal Code"
          />
          <FormTextInput
            label="Plus Code"
            controll={form.control}
            name="plusCode"
            placeholder="Plus Code"
            helperText="Google plus code"
          />
        </CollapsibleFormSection>
        <CollapsibleFormSection title="Geolocation" defaultCollapsed>
          <FormTextInput
            label="Latitude"
            controll={form.control}
            name="latitude"
            placeholder="Latitude"
          />

          <FormTextInput
            label="Latitude"
            controll={form.control}
            name="longitude"
            placeholder="Longitude"
          />
        </CollapsibleFormSection>
        <CollapsibleFormSection title="Metadata">
          <FormDatePicker
            label="Start date"
            controll={form.control}
            name="startDate"
          />
          <FormDatePicker
            label="End date"
            controll={form.control}
            name="endDate"
          />
        </CollapsibleFormSection>
        <Button
          text="Submit"
          suffixIcon={ArrowRight}
          loading={form.formState.isSubmitting}
          onPress={form.handleSubmit(onSubmit)}
        />
      </VStack>
    </ScrollView>
  );
};

export default AddressForm;
