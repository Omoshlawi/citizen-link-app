import { claimFormSchema } from "@/lib/schemas";
import { Match } from "@/types/matches";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react-native";
import React, { FC } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { Button } from "../button";
import { CollapsibleFormSection, FormTextArea } from "../form-inputs";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AlertCircleIcon } from "../ui/icon";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

type ClaimFormProps = {
  match: Match;
};

const ClaimForm: FC<ClaimFormProps> = ({ match }) => {
  const form = useForm({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      securityQuestions: match.foundDocumentCase.securityQuestion.map((q) => ({
        question: q.question,
        response: "",
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "securityQuestions",
  });

  return (
    <ScrollView>
      <VStack space="lg">
        <CollapsibleFormSection title="Security Question(Proof of ownership)">
          {fields.length === 0 ? (
            <Text className="text-typography-500 text-center py-4">
              No Security Questions.
            </Text>
          ) : (
            <VStack space="md">
              {fields.map((field, index) => (
                <VStack key={field.id} className="items-END" space="sm">
                  <Controller
                    control={form.control}
                    name={`securityQuestions.${index}.question`}
                    render={({ field, fieldState: { invalid, error } }) => (
                      <FormControl
                        isInvalid={invalid}
                        size="md"
                        isDisabled={false}
                        isReadOnly={false}
                        isRequired={false}
                      >
                        <FormControlLabel>
                          <FormControlLabelText>
                            {field.value}
                          </FormControlLabelText>
                        </FormControlLabel>
                        {!!error && (
                          <FormControlError>
                            <FormControlErrorIcon
                              as={AlertCircleIcon}
                              className="text-red-500"
                            />
                            <FormControlErrorText className="text-red-500">
                              {error?.message}
                            </FormControlErrorText>
                          </FormControlError>
                        )}
                      </FormControl>
                    )}
                  />
                  <FormTextArea
                    controll={form.control}
                    name={`securityQuestions.${index}.response`}
                    placeholder="Type response here ..."
                  />
                </VStack>
              ))}
            </VStack>
          )}
        </CollapsibleFormSection>
        <CollapsibleFormSection title="Recovery details"></CollapsibleFormSection>
        <Button text="Submit Claim" suffixIcon={ArrowRight} />
      </VStack>
    </ScrollView>
  );
};

export default ClaimForm;
