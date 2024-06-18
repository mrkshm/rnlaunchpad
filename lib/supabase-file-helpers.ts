import ImageResizer from "@bam.tech/react-native-image-resizer";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

import { supabase } from "~/lib/supabase-client";
import { safeEnvs } from "~/lib/env";

type UploadArgs = {
  fileUri: string;
  userId: string;
  bucket?: string;
};
type DeleteArgs = {
  fileName: string;
  userId: string;
  bucket?: string;
};

export function generateFilename(inputFileName: string): string {
  const originalName = inputFileName.split(".").slice(0, -1).join(".");
  const extension = inputFileName.split(".").pop();
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 7);

  const newName = `${originalName.substring(
    0,
    16
  )}-${randomString}-${timestamp}.${extension}`;

  return newName;
}

async function compressImage(uri: string, quality = 70): Promise<string> {
  try {
    const response = await ImageResizer.createResizedImage(
      uri,
      5000, // width
      5000, // height
      "JPEG",
      (quality = 20),
      0, // rotation
      undefined, // outputPath
      false, // keep meta
      {
        mode: "contain",
        onlyScaleDown: false,
      }
    );
    return response.uri;
  } catch (error) {
    console.error("Unable to resize the photo", error);
    return uri;
  }
}

export async function uploadFile({
  fileUri,
  userId,
  bucket = safeEnvs.userBucket,
}: UploadArgs): Promise<string> {
  const tempFileName = fileUri.substring(fileUri.lastIndexOf("/") + 1);
  const fileName = generateFilename(tempFileName);
  const filePath = `${userId}/${fileName}`;
  const contentType = "image/jpeg";
  const compressedUri = await compressImage(fileUri);
  const base64 = await FileSystem.readAsStringAsync(compressedUri, {
    encoding: "base64",
  });
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, decode(base64), { contentType });

  if (error) {
    throw error;
  }

  return fileName;
}

export async function deleteFile({
  fileName,
  userId,
  bucket = safeEnvs.userBucket,
}: DeleteArgs): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([`${userId}/${fileName}`]);

  if (error) {
    throw error;
  }
}
