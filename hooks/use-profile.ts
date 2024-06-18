import invariant from "tiny-invariant";
import * as v from "valibot";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useAuth } from "~/context/auth-provider";
import {
  filterUnchangedValues,
  removeNullishValues,
} from "~/lib/little-helpers";
import { notifyUser } from "~/lib/notify-user";
import { queryClient } from "~/lib/query-client";
import { profileUpdateSchema } from "~/lib/schemas-and-types";
import type { ProfileUpdate } from "~/lib/schemas-and-types";
import { supabase } from "~/lib/supabase-client";

// Supabase Helper Functions
const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .select()
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
};

type UpdateProps = {
  userId: string;
  profile: Partial<ProfileUpdate>;
};
const updateUserProfile = async ({ userId, profile }: UpdateProps) => {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ ...removeNullishValues(profile), image_url: profile.image_url })
    .eq("user_id", userId)
    .select();
  if (error) throw error;
  return data;
};

export const useProfile = () => {
  const { user, fetchProfile, profile: currentProfile } = useAuth();

  const getProfile = async (userId: string) => {
    const { data, error } = await useQuery({
      queryFn: () => fetchUserProfile(userId),
      queryKey: ["profile", userId],
    });
    return { data, error };
  };

  const mutation = useMutation({
    mutationFn: (profile: Partial<ProfileUpdate>) => {
      const safeProfile = v.safeParse(profileUpdateSchema, profile);
      if (!safeProfile.success) {
        notifyUser({
          title: "Validation Error",
          message: `Error updating profile: ${safeProfile.issues.join(", ")}`,
        });
        throw new Error(
          `Error updating profile: ${safeProfile.issues.join(", ")}`
        );
      }
      invariant(currentProfile, "Current profile must be loaded to update");
      const updatedProfile = filterUnchangedValues(
        safeProfile.output,
        currentProfile
      );
      console.log("updating inside mutation ", updatedProfile);
      invariant(user, "User must be logged in to update profile");
      return updateUserProfile({
        userId: user.id,
        profile: updatedProfile,
      });
    },
    onError: (error) => {
      notifyUser({
        message: `Error updating profile: ${error.message}`,
        title: "Profile Update Error",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user?.id],
      });
      fetchProfile();
    },
  });

  const updateProfile = (profile: Partial<ProfileUpdate>) => {
    console.log("starting to update with values ", profile);
    mutation.mutate(profile);
  };

  return { getProfile, updateProfile, ...mutation };
};
