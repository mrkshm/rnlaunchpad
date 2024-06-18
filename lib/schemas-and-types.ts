import * as v from "valibot";

import { Database } from "~/lib/supabase-types";
export const profileUpdateSchema = v.object({
  user_name: v.nullish(
    v.pipe(
      v.string(),
      v.minLength(3, "Please enter at least 2 characters."),
      v.maxLength(42, "Please enter fewer than 42 characters.")
    )
  ),
  email: v.nullish(v.pipe(v.string(), v.email("Please enter a valid email"))),
  image_url: v.nullish(v.string()),
  language: v.nullish(v.string()),
});

export type ProfileUpdate = v.InferOutput<typeof profileUpdateSchema>;

export type Profile = Database["public"]["Tables"]["user_profiles"]["Row"];

export enum ActivationSource {
  AccountActivation = "account_activation",
  EmailChange = "email_change",
  PasswordChange = "password_change",
}
