import {
  getRiskColor,
  getRiskInterpretation,
  getRiskPercentage,
} from "@/lib/helpers";
import { Client } from "@/types/client";
import Color from "color";
import { Check, TriangleAlert } from "lucide-react-native";
import React, { FC } from "react";
import { Card } from "../ui/card";
import { Heading } from "../ui/heading";
import { HStack } from "../ui/hstack";
import { Icon } from "../ui/icon";
import { Progress, ProgressFilledTrack } from "../ui/progress";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type RiskTratificationProps = {
  client: Client;
};

const RiskTratification: FC<RiskTratificationProps> = ({ client }) => {
  const risk = client.screenings?.[0]?.scoringResult?.aggregateScore ?? 0;
  const riskPercentage = getRiskPercentage(
    client.screenings?.[0]?.scoringResult?.interpretation
  );
  const symptoms =
    client.screenings?.[0]?.scoringResult?.breakdown.map(
      (factor) => factor.reason
    ) ?? [];
  return (
    <Card size="sm" variant="elevated" className="p-2 gap-3">
      <Heading size="xs">AI Risk Tratification</Heading>
      <HStack className="justify-between items-center">
        <Text size="2xs" className="text-typography-500">
          Risk Level
        </Text>
        <Text
          className="px-2  rounded-full"
          style={{
            color: getRiskColor(
              client.screenings?.[0]?.scoringResult?.interpretation
            ),
            backgroundColor: Color(
              getRiskColor(
                client.screenings?.[0]?.scoringResult?.interpretation
              )
            )
              .alpha(0.1)
              .toString(),
          }}
          size="2xs"
        >
          {getRiskInterpretation(
            client.screenings?.[0]?.scoringResult?.interpretation
          )}
        </Text>
      </HStack>
      <Progress
        value={riskPercentage}
        size="xs"
        orientation="horizontal"
        className="w-full "
      >
        <ProgressFilledTrack
          style={{
            backgroundColor: getRiskColor(
              client.screenings?.[0]?.scoringResult?.interpretation
            ),
          }}
        />
      </Progress>
      <HStack className="justify-between items-center">
        <Text size="2xs" className="text-typography-500">
          Risk Score
        </Text>
        <Text
          size="2xs"
          style={{
            color: getRiskColor(
              client.screenings?.[0]?.scoringResult?.interpretation
            ),
          }}
        >
          {risk}
        </Text>
      </HStack>
      <Text size="2xs" className="text-typography-500 ">
        Based on demographics, clinical and symptoms data
      </Text>
      <Card
        className="w-full flex flex-col gap-2"
        style={{
          backgroundColor: Color(
            getRiskColor(client.screenings?.[0]?.scoringResult?.interpretation)
          )
            .alpha(0.1)
            .toString(),
        }}
      >
        <HStack space="md">
          <Icon
            as={TriangleAlert}
            size="2xs"
            style={{
              color: getRiskColor(
                client.screenings?.[0]?.scoringResult?.interpretation
              ),
            }}
          />
          <Text
            size="2xs"
            className="font-bold"
            style={{
              color: getRiskColor(
                client.screenings?.[0]?.scoringResult?.interpretation
              ),
            }}
          >
            Current Symptoms
          </Text>
        </HStack>
        <VStack space="sm">
          {symptoms.map((symptom, index) => (
            <HStack key={index} space="md">
              <Icon
                as={Check}
                size="2xs"
                style={{
                  color: getRiskColor(
                    client.screenings?.[0]?.scoringResult?.interpretation
                  ),
                }}
              />
              <Text
                size="2xs"
                style={{
                  color: getRiskColor(
                    client.screenings?.[0]?.scoringResult?.interpretation
                  ),
                }}
              >
                {symptom}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Card>
    </Card>
  );
};

export default RiskTratification;
