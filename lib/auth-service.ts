import type {
  SignInWithPasswordlessCredentials,
  EmailOtpType,
} from "@supabase/supabase-js";

import { supabase } from "~/lib/supabase-client";

type LoginArgs = {
  email: string;
  password: string;
};

type OtpVerificationArgs = {
  email: string;
  token: string;
  type?: EmailOtpType;
};

export const signUp = async ({ email, password }: LoginArgs) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { error };
};

export const signInWithPassword = async ({ email, password }: LoginArgs) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const verifyOtp = async ({
  email,
  token,
  type = "email",
}: OtpVerificationArgs) => {
  console.log("auth service has", email, type, token);
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });
  console.log("auth service result is", data, error);
  return { error };
};

export const signInWithOtp = async (
  credentials: SignInWithPasswordlessCredentials
): Promise<{ error: Error | null }> => {
  if ("email" in credentials) {
    const { error } = await supabase.auth.signInWithOtp({
      email: credentials.email,
    });
    return { error };
  } else {
    return { error: new Error("No email in credentials") };
  }
};

export const changePassword = async ({
  password,
}: {
  password: string;
}): Promise<{ error: Error | null }> => {
  console.log("changing", password);
  const { error } = await supabase.auth.updateUser({ password });
  return { error };
};

export const changeEmail = async ({
  email,
}: {
  email: string;
}): Promise<{ error: Error | null }> => {
  console.log("changing", email);
  const { error } = await supabase.auth.updateUser({ email });
  return { error };
};
