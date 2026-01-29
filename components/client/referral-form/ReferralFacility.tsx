import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import { EmptyState, ErrorState } from "@/components/state-full-widgets";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon, Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  useHealthFacilities,
  useSearchHealthFacility,
} from "@/hooks/useHealthFacilities";
import { useScreening } from "@/hooks/useScreenings";
import { ReferralFormData } from "@/types/screening";
import { Hospital, Info, MapPin } from "lucide-react-native";
import React, { FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TouchableOpacity } from "react-native";

type ReferralFacilityProps = {
  facilitySearchAsync: ReturnType<typeof useSearchHealthFacility>;
};

const ReferralFacility: FC<ReferralFacilityProps> = ({
  facilitySearchAsync,
}) => {
  const [search, setSearch] = useState<string>("");
  const form = useFormContext<ReferralFormData>();
  const screeningId = form.watch("screeningId");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { screening: _ } = useScreening(screeningId);
  const {
    healthFacilities: nearbyHealthFacilities,
    error: nearbyError,
    isLoading: nearbyIsLoading,
  } = useHealthFacilities({ search });

  // useNearbyHealthFacilities({
  //   lat: /*screening?.coordinates?.latitude ??*/ -1.2921,
  //   lng: /*screening?.coordinates?.longitude ??*/ 36.8219,
  // });
  return (
    <Controller
      control={form.control}
      name="healthFacilityId"
      render={({ field, fieldState: { invalid, error } }) => (
        <ActionSheetWrapper
          loading={nearbyIsLoading}
          renderTrigger={({ onPress }) => (
            <FormControl
              isInvalid={invalid}
              size="md"
              isReadOnly
              className="w-full"
            >
              <FormControlLabel>
                <FormControlLabelText>Referral Facility</FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1" size="md">
                <InputField
                  placeholder="Referral Facility"
                  {...field}
                  value={
                    field.value
                      ? nearbyHealthFacilities.find(
                          (facility) => facility.id === field.value
                        )?.name
                      : ""
                  }
                  onChangeText={field.onChange}
                  onPress={onPress}
                />
              </Input>

              {error && (
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {error.message}
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          )}
          data={nearbyHealthFacilities}
          renderItem={({ item, close }) => (
            <TouchableOpacity
              onPress={() => {
                close();
                field.onChange(item.id);
              }}
            >
              <Card size="md" variant="elevated">
                <HStack className="items-center" space="sm">
                  {item.logo ? (
                    <Image
                      source={{
                        uri: item.logo,
                      }}
                      alt="Logo"
                      size="lg"
                      className="aspect-1 rounded-sm"
                    />
                  ) : (
                    <Icon
                      as={Hospital}
                      className="aspect-1 rounded-sm color-background-200"
                      size={60 as any}
                    />
                  )}
                  <VStack space="md" className="flex-1">
                    <HStack className="items-center justify-between" space="sm">
                      <Heading size="xs">{item.name}</Heading>
                      <Text
                        size="2xs"
                        className="bg-teal-100 px-2 py-1 rounded-full text-teal-500 absolute right-2 top-1"
                      >
                        {item.type.name}
                      </Text>
                    </HStack>
                    <HStack className="items-center" space="sm">
                      <Icon
                        as={MapPin}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text size="xs">
                        {`${item.ward ? item.ward + ", " : ""} ${
                          item.subcounty
                        }, ${item.county}`}
                      </Text>
                    </HStack>
                    <HStack className="items-center" space="sm">
                      <Icon
                        as={Info}
                        size="sm"
                        className="text-typography-500"
                      />
                      <Text size="xs">{`MFL: ${item.kmflCode} | Owner: ${
                        item.owner ?? "N/A"
                      }`}</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
            </TouchableOpacity>
          )}
          renderEmptyState={() => {
            if (error || nearbyError) {
              console.log(error, nearbyError);

              return (
                <ErrorState error={(error as any) || (nearbyError as any)} />
              );
            }
            return <EmptyState message="No nearby facilities found" />;
          }}
          searchable
          searchText={search}
          onSearchTextChange={setSearch}
        />
      )}
    />
  );
};

export default ReferralFacility;
