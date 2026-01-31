import { caseFilterSchema } from "@/lib/schemas";
import { CaseFilterFormData } from "@/types/cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, SlidersHorizontal } from "lucide-react-native";
import React, { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../button";
import { FormSelectInput } from "../form-inputs";
import { Heading } from "../ui/heading";
import { VStack } from "../ui/vstack";

type CaseFilterFormProps = {
  filters?: CaseFilterFormData;
  onFiltersChange?: (filters: CaseFilterFormData) => void;
};
const CaseFilterForm: FC<CaseFilterFormProps> = ({
  filters,
  onFiltersChange,
}) => {
  const form = useForm({
    resolver: zodResolver(caseFilterSchema),
    defaultValues: filters,
  });
  const onSubmit: SubmitHandler<CaseFilterFormData> = (data) => {
    onFiltersChange?.(data);
  };
  return (
    <VStack className="px-4 w-full" space="lg">
      <Heading className="text-center">Case Filters</Heading>
      <FormSelectInput
        controll={form.control}
        label="Case type"
        name="caseType"
        data={[
          { label: "Lost document case", value: "LOST" },
          { label: "Found document case", value: "FOUND" },
        ]}
      />
      <Button
        text="Apply Filters"
        suffixIcon={ArrowRight}
        prefixIcon={SlidersHorizontal}
        onPress={form.handleSubmit(onSubmit)}
      />
    </VStack>
  );
};

export default CaseFilterForm;
