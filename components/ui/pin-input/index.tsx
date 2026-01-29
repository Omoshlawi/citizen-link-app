"use client";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Pressable, TextInput, View } from "react-native";
import { HStack } from "../hstack";
import { Text } from "../text";

export interface PinInputConfig {
  /** Number of PIN digits (default: 4) */
  length?: number;
  /** Whether to obscure PIN digits (default: true) */
  obscureText?: boolean;
  /** Character to show when obscureText is true (default: "•") */
  obscureChar?: string;
  /** Whether to auto-focus on mount (default: true) */
  autoFocus?: boolean;
  /** Whether the input is disabled (default: false) */
  disabled?: boolean;
  /** Size variant (default: "md") */
  size?: "sm" | "md" | "lg";
  /** Visual variant (default: "outline") */
  variant?: "outline" | "filled" | "underlined";
  /** Error state (default: false) */
  isInvalid?: boolean;
  /** Spacing between PIN boxes (default: "md") */
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Custom className for container */
  containerClassName?: string;
  /** Custom className for each PIN box */
  boxClassName?: string;
}

export interface PinInputProps extends PinInputConfig {
  /** Current PIN value */
  value: string;
  /** Callback when PIN value changes */
  onChangeText: (value: string) => void;
  /** Callback when PIN is complete */
  onComplete?: (value: string) => void;
  /** Placeholder text shown when empty */
  placeholder?: string;
  /** Test ID for testing */
  testID?: string;
}

const pinInputContainerStyle = tva({
  base: "flex-row items-center justify-center",
  variants: {
    spacing: {
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-5",
    },
  },
});

const pinBoxStyle = tva({
  base: "items-center justify-center border-2 rounded-lg",
  variants: {
    size: {
      sm: "w-12 h-12",
      md: "w-12 h-12",
      lg: "w-14 h-14",
    },
    variant: {
      outline: "border-outline-300 bg-transparent",
      filled: "border-transparent bg-background-100",
      underlined:
        "border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent",
    },
    isFocused: {
      true: "border-primary-500",
      false: "",
    },
    isFilled: {
      true: "border-teal-400",
      // true: "border-primary-400",
      false: "",
    },
    isInvalid: {
      true: "border-error-500",
      false: "",
    },
    isDisabled: {
      true: "opacity-40",
      false: "",
    },
  },
});

const pinTextStyle = tva({
  base: "font-bold text-center",
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
    },
    variant: {
      outline: "text-typography-900",
      filled: "text-typography-900",
      underlined: "text-typography-900",
    },
  },
});

const PinInputComponent = React.forwardRef<TextInput, PinInputProps>(
  (
    {
      value = "",
      onChangeText,
      onComplete,
      length = 4,
      obscureText = true,
      obscureChar = "•",
      autoFocus = true,
      disabled = false,
      size = "md",
      variant = "outline",
      isInvalid = false,
      spacing = "md",
      placeholder,
      containerClassName = "",
      boxClassName = "",
      testID,
      ...props
    },
    ref
  ) => {
    const [focusedIndex, setFocusedIndex] = useState<number | null>(
      autoFocus ? 0 : null
    );
    const hiddenInputRef = useRef<TextInput | null>(null);

    // Auto-focus hidden input on mount
    useEffect(() => {
      if (autoFocus && !disabled && hiddenInputRef.current) {
        setTimeout(() => {
          hiddenInputRef.current?.focus();
        }, 100);
      }
    }, [autoFocus, disabled]);

    // Call onComplete when PIN is complete
    useEffect(() => {
      if (value.length === length && onComplete) {
        onComplete(value);
        Keyboard.dismiss();
      }
    }, [value, length, onComplete]);

    const handleBlur = useCallback(() => {
      setFocusedIndex(null);
    }, []);

    const handleBoxPress = useCallback(() => {
      if (disabled) return;
      // Focus the hidden input
      hiddenInputRef.current?.focus();
    }, [disabled]);

    const renderPinBox = (index: number) => {
      const digit = value[index] || "";
      const isFocused = focusedIndex === index;
      const isFilled = !!digit;
      const displayValue = obscureText && digit ? obscureChar : digit;

      const boxStyles = pinBoxStyle({
        size,
        variant,
        isFocused,
        isFilled,
        isInvalid,
        isDisabled: disabled,
      });

      const finalBoxClassName = boxClassName
        ? [boxStyles, boxClassName].filter(Boolean).join(" ")
        : boxStyles;

      return (
        <Pressable
          key={index}
          onPress={handleBoxPress}
          disabled={disabled}
          testID={testID ? `${testID}-box-${index}` : undefined}
        >
          <View className={finalBoxClassName}>
            {digit || (isFocused && placeholder) ? (
              <Text
                className={pinTextStyle({
                  size,
                  variant,
                })}
              >
                {displayValue || placeholder}
              </Text>
            ) : (
              <View
                className={
                  isFocused
                    ? "w-1 h-1 rounded-full bg-primary-500"
                    : "w-1 h-1 rounded-full bg-outline-300"
                }
              />
            )}
          </View>
        </Pressable>
      );
    };

    return (
      <View className={containerClassName}>
        {/* Hidden text input for better keyboard handling on mobile */}
        <TextInput
          ref={(node) => {
            hiddenInputRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<TextInput | null>).current = node;
            }
          }}
          value={value}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, "").slice(0, length);
            onChangeText(numericText);
            // Update focused index based on input length
            const newLength = numericText.length;
            if (newLength < length) {
              setFocusedIndex(newLength);
            } else if (newLength === length) {
              setFocusedIndex(null);
            }
          }}
          onFocus={() => {
            const currentLength = value.length;
            setFocusedIndex(currentLength < length ? currentLength : 0);
          }}
          onBlur={handleBlur}
          keyboardType="number-pad"
          maxLength={length}
          autoFocus={autoFocus}
          editable={!disabled}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            opacity: 0,
            zIndex: -1,
          }}
          testID={testID ? `${testID}-hidden` : undefined}
          {...props}
        />

        {/* Individual PIN boxes */}
        <View>
          <HStack className={pinInputContainerStyle({ spacing })}>
            {Array.from({ length: length }).map((_, index) =>
              renderPinBox(index)
            )}
          </HStack>
        </View>
      </View>
    );
  }
);

PinInputComponent.displayName = "PinInput";

export default PinInputComponent;
export { PinInputComponent as PinInput };
