import {
  useFaqTopics,
  useFrequentlyAskedQuestions,
} from "@/hooks/useFrequentlyAskedQuestions";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { ErrorState } from "../state-full-widgets";
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "../ui/accordion";
import { Box } from "../ui/box";
import { Button, ButtonText } from "../ui/button";
import { Divider } from "../ui/divider";
import { Heading } from "../ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { VStack } from "../ui/vstack";

const FAQTabPannel = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { questions, error, isLoading } =
    useFrequentlyAskedQuestions(selectedCategory);
  const {
    topics,
    error: topicsError,
    isLoading: topicsLoading,
  } = useFaqTopics(true);

  if (isLoading || topicsLoading) {
    return <Spinner />;
  }

  if (error || topicsError) {
    return <ErrorState error={error || topicsError} />;
  }

  return (
    <VStack space="md" className="flex-1">
      <Input>
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField placeholder="Search frequently asked questions..." />
      </Input>
      <Heading size="sm">Browse by category</Heading>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row w-full grow-0"
      >
        {topics.map((category) => (
          <Button
            key={category.id}
            size="xs"
            className={`${
              selectedCategory === category.id
                ? "bg-teal-500"
                : "bg-teal-100 text-teal-500"
            } mr-2`}
            onPress={() => setSelectedCategory(category.id)}
          >
            <ButtonText
              size="xs"
              className={
                selectedCategory === category.id
                  ? "text-white"
                  : "text-teal-500"
              }
            >
              {category.name}
            </ButtonText>
          </Button>
        ))}
      </ScrollView>
      <Box className="flex-1">
        <Accordion
          size="md"
          variant="unfilled"
          type="single"
          isCollapsible={true}
          isDisabled={false}
        >
          {questions.map((q, i) => (
            <React.Fragment key={q.id}>
              <AccordionItem value={String(i)}>
                <AccordionHeader>
                  <AccordionTrigger>
                    {({ isExpanded }: { isExpanded: boolean }) => (
                      <>
                        <AccordionTitleText>{q.question}</AccordionTitleText>
                        {isExpanded ? (
                          <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                        ) : (
                          <AccordionIcon
                            as={ChevronDownIcon}
                            className="ml-3"
                          />
                        )}
                      </>
                    )}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  <AccordionContentText>{q.answer}</AccordionContentText>
                </AccordionContent>
              </AccordionItem>
              {i !== questions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Accordion>
      </Box>
    </VStack>
  );
};

export default FAQTabPannel;
