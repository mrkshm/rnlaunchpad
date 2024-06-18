import { deleteFile, uploadFile } from "~/lib/supabase-file-helpers";

type ImageUpdateHandlerProps = {
  selectedImage: string | null | undefined;
  signedImageUrl: string | null | undefined;
  profileImage: string | null | undefined;
  userId: string;
};

export async function handleImageUpdate({
  selectedImage,
  signedImageUrl,
  profileImage,
  userId,
}: ImageUpdateHandlerProps) {
  let newFileUrl: string | null | undefined = null;

  if (!selectedImage && profileImage) {
    await deleteFile({
      fileName: profileImage,
      userId,
    });
  } else if (selectedImage === signedImageUrl) {
    newFileUrl = undefined;
  } else if (selectedImage && selectedImage !== signedImageUrl) {
    profileImage &&
      (await deleteFile({
        fileName: profileImage,
        userId,
      }));
    newFileUrl = await uploadFile({
      fileUri: selectedImage,
      userId,
    });
  }

  return newFileUrl;
}
