import Constants from "expo-constants";

export const BASE_URL = "http://192.168.1.105:2000";
// export const BASE_URL = "http://localhost:2000";

export const STATUS_BAR_HEIGHT = Constants.statusBarHeight;

export const SCREENING_FORM_STEPS = [
  "Client Search",
  "Sexual And Reproductive Health History",
  "Diagnosis History(HIV, HPV, STI)",
  "Obstetrics History",
  "Screening History",
  "Constraceptive Use",
  "Smoking History",
  "Family History",
  "Review And Submit",
  "Screening Results",
];

export const SCREENING_FORM_BOOLEAN_OPTIONS = [
  { label: "Yes", value: "YES" },
  { label: "No", value: "NO" },
  { label: "Not Sure", value: "NOT_SURE" },
];

export const SMOKING_OPTIONS = [
  { label: "Yes, Currently", value: "CURRENTLY" },
  { label: "No, Never", value: "NEVER" },
  { label: "Yes, in the Past", value: "PAST" },
];

export const PHONE_NUMBER_REGEX = /^(\+?254|0)((7|1)\d{8})$/;
export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";
