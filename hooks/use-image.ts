import { useQuery } from "@tanstack/react-query";

import { safeEnvs } from "~/lib/env";
import { supabase } from "~/lib/supabase-client";

type GetSignedUrlArgs = {
  path: string;
  bucket?: string;
};

async function getSignedUrl({
  path,
  bucket = safeEnvs.userBucket,
}: GetSignedUrlArgs) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

export function useImage({ path, bucket }: GetSignedUrlArgs) {
  const queryInfo = useQuery({
    queryFn: () => getSignedUrl({ path, bucket }),
    queryKey: ["picture", path],
    staleTime: 60 * 60 * 24,
    gcTime: 60 * 60 * 24,
  });
  return queryInfo;
}
