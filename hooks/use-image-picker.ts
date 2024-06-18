import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

type ImagePickerProps = {
  initialImageUri?: string | undefined;
};
export const useImagePicker = ({
  initialImageUri = undefined,
}: ImagePickerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined | null>(
    initialImageUri
  );

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const resetImage = () => {
    if (selectedImage === initialImageUri) {
      setSelectedImage(undefined);
    } else {
      setSelectedImage(initialImageUri);
    }
  };

  return { selectedImage, pickImageAsync, resetImage };
};
