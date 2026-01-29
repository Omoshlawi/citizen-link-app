import {
  changePasswordSchema,
  emailSignInSchema,
  forgotPasswordSchema,
  phoneNumberSignInSchema,
  registerSchema,
  usernameSignInSchema,
} from "@/constants/schemas";
import z from "zod";

export type EmailSignInFormData = z.infer<typeof emailSignInSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PhoneNumberSignInFormData = z.infer<typeof phoneNumberSignInSchema>;
export type UsernameSignInFormData = z.infer<typeof usernameSignInSchema>;

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
