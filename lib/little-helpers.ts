import { ActivationSource } from "~/lib/schemas-and-types";

export const removeNullishValues = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value != null)
  );
};

export const filterUnchangedValues = (
  newObj: Record<string, any>,
  oldObj: Record<string, any>
) => {
  return Object.fromEntries(
    Object.entries(newObj).filter(([key, value]) => value !== oldObj[key])
  );
};

export function getRedirectUrlAndVerificationType(
  source?: string | string[]
): [string, "email" | "email_change"] {
  const sourceValue = Array.isArray(source) ? source[0] : source;

  switch (sourceValue) {
    case ActivationSource.PasswordChange:
      return ["/(protected)/change-password", "email"];
    case ActivationSource.EmailChange:
      return ["/(protected)/home", "email_change"];
    default:
      return ["/(protected)/home", "email"];
  }
}
