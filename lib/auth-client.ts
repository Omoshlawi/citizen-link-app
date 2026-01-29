import { expoClient } from "@better-auth/expo/client";
import {
  adminClient,
  jwtClient,
  phoneNumberClient,
  twoFactorClient,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "./constants";

export const authClient = createAuthClient({
  baseURL: BASE_URL, // Base URL of your Better Auth backend.
  // baseURL: "http://10.76.170.25:600", // Base URL of your Better Auth backend.
  // baseURL: "http://192.168.1.115:600", // Base URL of your Better Auth backend.
  trustedOrigins: ["citizenlinkapp://"],
  plugins: [
    expoClient({
      scheme: "citizenlinkapp",
      storagePrefix: "citizenlinkapp",
      storage: SecureStore,
    }),
    adminClient(),
    usernameClient(),
    phoneNumberClient(),
    jwtClient(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        router.push("/two-factor");
      },
    }),
  ],
});
