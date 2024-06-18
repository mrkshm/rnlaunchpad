import { supabase } from "~/lib/supabase-client";

export const checkIfUserWithEmailExists = async ({
  email,
}: {
  email: string;
}) => {
  const { data, error } = await supabase.rpc("email_exists", {
    email_address: email,
  });
  return { data, error };
};

export const getUserById = async ({ userId }: { userId: string }) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data, error };
};

export const getUserByEmail = async ({ email }: { email: string }) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", email)
    .single();
  return { data, error };
};
