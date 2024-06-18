import * as v from "valibot";

const EnvSchema = v.object({
  supabasePublicAnonKey: v.string(),
  supabaseUrl: v.string(),
  userBucket: v.string(),
  mixpanelToken: v.string(),
  enableAnalytics: v.boolean(),
  enableErrorReporting: v.boolean(),
});

const unsafeEnvs = {
  supabasePublicAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  userBucket: process.env.EXPO_PUBLIC_SUPABASE_USER_BUCKET,
  mixpanelToken: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN,
  enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === "true",
  enableErrorReporting:
    process.env.EXPO_PUBLIC_ENABLE_ERROR_REPORTING === "true",
};

export const safeEnvs = v.parse(EnvSchema, unsafeEnvs);
