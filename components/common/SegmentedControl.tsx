import { default as RNSegmentedControl } from "@react-native-segmented-control/segmented-control";
import React, { FC, useMemo } from "react";

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
  const valueIndex = useMemo(() => {
    const index = data.findIndex((d) => d.value === value);
    if (index < 0) return undefined;
    return index;
  }, [data, value]);
  return (
    <RNSegmentedControl
      values={data.map((d) => d.label)}
      selectedIndex={valueIndex}
      onChange={({ nativeEvent: { selectedSegmentIndex } }) =>
        onChange?.(data[selectedSegmentIndex].value)
      }
    />
  );
};

export default SegmentedControl;
