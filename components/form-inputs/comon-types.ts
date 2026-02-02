import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl } from "../ui/form-control";

export type FormInputProps<T extends FieldValues> =  {
    name: FieldPath<T>;
    label?: string;
    controll: Control<T>;
    formControlProps?: Partial<React.ComponentProps<typeof FormControl>>;
    helperText?: string;
  };