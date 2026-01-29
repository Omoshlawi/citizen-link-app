import React from "react";
import { Button, ButtonIcon, ButtonText } from "./ui/button";
import { HStack } from "./ui/hstack";
import { ChevronLeftIcon, ChevronRightIcon } from "./ui/icon";
import { Text } from "./ui/text";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  showPagination?: boolean;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 0,
  totalCount = 0,
  onPageChange,
  isLoading = false,
  showPagination = true,
}: PaginationProps) => {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const handlePrev = () => {
    if (!isFirstPage) onPageChange?.(currentPage - 1);
  };

  const handleNext = () => {
    if (!isLastPage) onPageChange?.(currentPage + 1);
  };

  if (!showPagination) return null;

  return (
    <HStack className="w-full items-center justify-between px-4 pt-4 border-t border-typography-300">
      {/* Previous Button */}
      <Button
        size="xs"
        variant="outline"
        action="secondary"
        isDisabled={isFirstPage || isLoading}
        onPress={handlePrev}
        className={`border-typography-500 ${isFirstPage ? "opacity-50" : ""}`}
      >
        <ButtonIcon as={ChevronLeftIcon} className="mr-1 text-typography-700" />
        <ButtonText className="text-typography-700 font-medium">
          Prev
        </ButtonText>
      </Button>

      {/* Page Info */}
      <HStack className="flex-col items-center">
        <Text size="xs" className="font-bold">
          Page {currentPage} of {totalPages}
        </Text>
        <Text size="xs" className="text-typography-500">
          {totalCount} results
        </Text>
      </HStack>

      {/* Next Button */}
      <Button
        size="xs"
        variant="outline"
        action="secondary"
        isDisabled={isLastPage || isLoading}
        onPress={handleNext}
        className={`border-typography-500 ${isLastPage ? "opacity-50" : ""}`}
      >
        <ButtonText className="text-typography-700 font-medium">
          Next
        </ButtonText>
        <ButtonIcon
          as={ChevronRightIcon}
          className="ml-1 text-typography-700"
        />
      </Button>
    </HStack>
  );
};

export default Pagination;
