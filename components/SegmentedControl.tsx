import React, { FC } from "react";
import { Box } from "./ui/box";
import { Button, ButtonText } from "./ui/button";

type SegmentedControlProps = {
  data?: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
};

const SegmentedControl: FC<SegmentedControlProps> = ({
  data = [],
  value,
  onChange,
}) => {
  return (
    <Box className="w-full flex-row border border-outline-200 rounded-md gap-2 p-2 bg-background-200">
      {data.map(({ label, value: v }, i) => {
        const active = v === value;
        return (
          <Button
            key={i}
            size="xs"
            action="secondary"
            className={`w-[32%] bg-background-200 ${
              active ? "bg-background-0" : "bg-background-200"
            }`}
            onPress={() => onChange?.(v)}
          >
            <ButtonText>{label}</ButtonText>
          </Button>
        );
      })}
    </Box>
  );
};

export default SegmentedControl;
