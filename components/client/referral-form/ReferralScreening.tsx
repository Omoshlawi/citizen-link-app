import ActionSheetWrapper from "@/components/actions-sheet-wrapper";
import ListTile from "@/components/list-tile";
import { EmptyState, ErrorState } from "@/components/state-full-widgets";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useScreenings } from "@/hooks/useScreenings";
import { getRiskColor, getRiskInterpretation } from "@/lib/helpers";
import { Client } from "@/types/client";
import { ReferralFormData } from "@/types/screening";
import Color from "color";
import dayjs from "dayjs";
import { Calendar } from "lucide-react-native";
import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";

type ReferralScreeningProps = {
  client: Client;
};

const ReferralScreening: FC<ReferralScreeningProps> = ({ client }) => {
  const form = useFormContext<ReferralFormData>();
  const { screenings, isLoading, error } = useScreenings({
    clientId: client.id,
    limit: "100",
  });
  if (isLoading) {
    return <Spinner color="primary" />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  return (
    <Controller
      control={form.control}
      name="screeningId"
      render={({ field, fieldState: { invalid, error } }) => (
        <ActionSheetWrapper
          loading={isLoading}
          renderTrigger={({ onPress }) => {
            const screening = screenings.find(
              (screening) => screening.id === field.value
            );
            const screeningDate = dayjs(screening?.createdAt).format(
              "DD/MM/YYYY"
            );
            const screeningScore = `${
              screening?.scoringResult?.aggregateScore
            } - ${getRiskInterpretation(
              screening?.scoringResult?.interpretation
            )}`;
            const selectedDisplayValue = screening
              ? `${screeningDate} - ${screeningScore}`
              : "";
            return (
              <FormControl
                isInvalid={invalid}
                size="md"
                isReadOnly
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>Screening</FormControlLabelText>
                </FormControlLabel>
                <Input className="my-1" size="md">
                  <InputField
                    placeholder="Screening"
                    {...field}
                    value={selectedDisplayValue}
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
            );
          }}
          data={screenings}
          renderItem={({ item: screening, close }) => (
            <ListTile
              key={screening.id}
              title={dayjs(screening.createdAt).format("DD/MM/YYYY")}
              description={`Score: ${
                screening.scoringResult?.aggregateScore?.toString() ?? "N/A"
              }`}
              leading={
                <Icon as={Calendar} size="xs" className="text-typography-500" />
              }
              trailing={
                <Text
                  size="2xs"
                  className={`px-2 py-1 rounded-md`}
                  style={{
                    color: getRiskColor(
                      screening.scoringResult?.interpretation
                    ),
                    backgroundColor: Color(
                      getRiskColor(screening.scoringResult?.interpretation)
                    )
                      .alpha(0.1)
                      .toString(),
                  }}
                >
                  {getRiskInterpretation(
                    screening.scoringResult?.interpretation
                  )}
                </Text>
              }
              onPress={() => {
                close();
                field.onChange(screening.id);
              }}
            />
          )}
          renderEmptyState={() => {
            if (error) {
              return <ErrorState error={error as any} />;
            }
            return <EmptyState message="No facilitiesonyo found" />;
          }}
        />
      )}
    />
  );
};

export default ReferralScreening;
