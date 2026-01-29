import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { SCREENING_FORM_STEPS } from "@/lib/constants";
import {
  getBooleanDisplayValue,
  getRiskColor,
  getRiskInterpretation,
  getSmokingDisplayValue,
} from "@/lib/helpers";
import { RiskFactor, RiskInterpretation, Screening } from "@/types/screening";
import Color from "color";
import dayjs from "dayjs";
import { router } from "expo-router";
import { ArrowRightIcon, Info } from "lucide-react-native";
import React, { FC, useMemo } from "react";
import VariableValue from "../VariableValue";

type ScreeningResultsProps = {
  screening: Screening;
};
const ScreeningResults: FC<ScreeningResultsProps> = ({ screening }) => {
  const values = useMemo<
    { variable: string; value: string | number; factor: RiskFactor }[]
  >(() => {
    return [
      {
        variable: "Age",
        value: screening.client?.dateOfBirth
          ? dayjs().diff(dayjs(screening.client?.dateOfBirth), "years")
          : "N/A",
        factor: RiskFactor.AGE,
      },
      {
        variable: "Age at first intercourse",
        value: screening.firstIntercourseAge,
        factor: RiskFactor.EARLY_SEXUAL_DEBUT,
      },
      {
        variable: "Lifetime partners",
        value: screening.lifeTimePatners,
        factor: RiskFactor.MULTIPLE_PARTNERS,
      },
      {
        variable: "HIV diagnosis",
        value: getBooleanDisplayValue(screening.everDiagnosedWithHIV),
        factor: RiskFactor.SEXUALLY_TRANSMITTED_INFECTION,
      },
      {
        variable: "HPV diagnosis",
        value: getBooleanDisplayValue(screening.everDiagnosedWithHPV),
        factor: RiskFactor.SEXUALLY_TRANSMITTED_INFECTION,
      },
      {
        variable: "STI diagnosis",
        value: getBooleanDisplayValue(screening.everDiagnosedWithSTI),
        factor: RiskFactor.SEXUALLY_TRANSMITTED_INFECTION,
      },
      {
        variable: "Number of births",
        value: screening.totalBirths,
        factor: RiskFactor.PARITY,
      },

      {
        variable: "Screened before",
        value: getBooleanDisplayValue(screening.everScreenedForCervicalCancer),
        factor: RiskFactor.NEVER_SCREENED,
      },
      {
        variable: "OCP>5 years",
        value: getBooleanDisplayValue(
          screening.usedOralContraceptivesForMoreThan5Years
        ),
        factor: RiskFactor.ORAL_CONTRACEPTIVES,
      },
      {
        variable: "Smoking History",
        value: getSmokingDisplayValue(screening.smoking),
        factor: RiskFactor.SMOKING,
      },
      {
        variable: "Family History",
        value: getBooleanDisplayValue(
          screening.familyMemberDiagnosedWithCervicalCancer
        ),
        factor: RiskFactor.FAMILY_HISTORY,
      },
    ];
  }, [screening]);

  return (
    <VStack space="md" className="flex-1 items-center">
      <Heading size="xs" className="text-start w-full">
        {SCREENING_FORM_STEPS[10]}
      </Heading>
      <VStack space="sm">
        {values.map((value, i) => {
          const score = screening.scoringResult?.breakdown.find(
            (factor) => factor.factor === value.factor
          )?.score;
          return (
            <VariableValue
              key={i}
              value={value.value}
              variable={value.variable}
              score={score}
            />
          );
        })}

        <Divider />

        <HStack space="sm" className="w-full justify-between items-center mt-4">
          <Heading size="lg">Total Score</Heading>
          <Text
            className={`px-2 py-1 rounded-md`}
            style={{
              color: getRiskColor(screening.scoringResult?.interpretation),
            }}
          ></Text>
          <Heading
            size="lg"
            style={{
              color: getRiskColor(screening.scoringResult?.interpretation),
            }}
          >
            {screening.scoringResult?.aggregateScore}
          </Heading>
        </HStack>
        <Card
          size="sm"
          variant="elevated"
          className="p-4 gap-2 bg-background-0 items-center justify-center flex-row"
          style={{
            backgroundColor: Color(
              getRiskColor(screening.scoringResult?.interpretation)
            )
              .alpha(0.1)
              .toString(),
          }}
        >
          <Icon
            as={Info}
            size="xs"
            className="p-2"
            color={getRiskColor(screening.scoringResult?.interpretation)}
          />
          <Text
            className={`px-2 py-1 rounded-md`}
            style={{
              color: getRiskColor(screening.scoringResult?.interpretation),
            }}
          >
            {getRiskInterpretation(screening.scoringResult?.interpretation)}
          </Text>
        </Card>
        {screening.scoringResult?.interpretation ===
          RiskInterpretation.HIGH_RISK && (
          <Button
            action="primary"
            size="sm"
            className="w-full bg-teal-500 justify-between rounded-none"
            onPress={() => {
              router.push({
                pathname: "/add-referral",
                params: {
                  client: screening.client?.id,
                  facility: "",
                  facilitySearch: "",
                  screening: screening.id,
                  search: screening.client?.nationalId,
                },
              });
            }}
          >
            <ButtonText>Refer Client</ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        )}
        {screening.scoringResult?.interpretation ===
          RiskInterpretation.MEDIUM_RISK && (
          <Button
            action="primary"
            size="sm"
            className="w-full bg-teal-500 justify-between rounded-none"
            onPress={() => {
              router.push({
                pathname: "/follow-up",
                params: {
                  appointmentTime: dayjs(screening.createdAt)
                    .add(6, "months")
                    .toISOString(),
                  screeningId: screening.id,
                  startDate: screening.createdAt,
                },
              });
            }}
          >
            <ButtonText>Folloup in 6 months for re screening</ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        )}
        {screening.scoringResult?.interpretation ===
          RiskInterpretation.LOW_RISK && (
          <Button
            action="primary"
            size="sm"
            className="w-full bg-teal-500 justify-between rounded-none"
            onPress={() => {
              router.push({
                pathname: "/follow-up",
                params: {
                  appointmentTime: dayjs(screening.createdAt)
                    .add(5, "years")
                    .toISOString(),
                  screeningId: screening.id,
                  startDate: dayjs(screening.createdAt)
                    .add(3, "years")
                    .toISOString(),
                },
              });
            }}
          >
            <ButtonText>Folloup in 3 to 5 years fo re screening</ButtonText>
            <ButtonIcon as={ArrowRightIcon} />
          </Button>
        )}
      </VStack>
    </VStack>
  );
};

export default ScreeningResults;
