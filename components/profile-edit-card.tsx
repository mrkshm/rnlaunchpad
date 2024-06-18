import { Link } from "expo-router";
import { t, Trans } from "@lingui/macro";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, Pressable, View } from "react-native";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { useProfile } from "~/hooks/use-profile";
import { useImage } from "~/hooks/use-image";
import { useImagePicker } from "~/hooks/use-image-picker";
import { handleImageUpdate } from "~/lib/image-update-handler";
import { Pencil } from "~/lib/icons/pencil";
import { X } from "~/lib/icons/x";
import { useAuth } from "~/context/auth-provider";
import {
  profileUpdateSchema,
  type ProfileUpdate,
} from "~/lib/schemas-and-types";

type ProfileViewCardProps = {
  toggleEditMode: () => void;
};

export default function ProfileEditCard({
  toggleEditMode,
}: ProfileViewCardProps) {
  const { profile, session } = useAuth();
  const [originalImageName, setOriginalImageName] = useState(
    profile?.image_url
  );
  const { data: signedImageUrl } = useImage({
    path: `${session?.user.id}/${originalImageName}` ?? "",
  });
  const { updateProfile } = useProfile();
  const [isPending, setIsPending] = useState(false);

  const { selectedImage, pickImageAsync, resetImage } = useImagePicker({
    initialImageUri: signedImageUrl,
  });
  const form = useForm<ProfileUpdate>({
    resolver: valibotResolver(profileUpdateSchema),
    defaultValues: {
      user_name: profile?.user_name,
    },
  });

  function resetForm() {
    form.reset({
      user_name: profile?.user_name,
    });
    resetImage();
  }
  async function handleUpdate() {
    form.handleSubmit(async (values) => {
      setIsPending(true);
      if (!session?.user.id) return;

      const newFileUrl = await handleImageUpdate({
        selectedImage,
        signedImageUrl,
        profileImage: profile?.image_url,
        userId: session.user.id,
      });

      updateProfile({ ...values, image_url: newFileUrl });
      setIsPending(false);
      resetForm();
      toggleEditMode();
    })();
  }

  function handleReset() {
    resetForm();
    toggleEditMode();
  }
  return (
    <Card className="w-full max-w-sm p-6 rounded-2xl">
      {isPending && (
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <CardHeader className="items-center">
        <View className="flex absolute right-12 top-10 gap-2">
          <Pressable onPress={pickImageAsync}>
            <Pencil />
          </Pressable>
          <Pressable onPress={resetImage}>
            <X />
          </Pressable>
        </View>
        <Pressable onPress={pickImageAsync}>
          <Avatar alt="Your Avatar" className="w-24 h-24">
            {selectedImage ? (
              <AvatarImage source={{ uri: selectedImage }} />
            ) : (
              <AvatarFallback>
                <Text>{profile?.email?.charAt(0)}</Text>
              </AvatarFallback>
            )}
          </Avatar>
        </Pressable>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <View className="gap-4 py-2 w-full">
            <FormField
              control={form.control}
              name="user_name"
              render={({ field }) => (
                <FormInput
                  label={t`Username`}
                  placeholder={t`Username`}
                  autoCapitalize="none"
                  autoCorrect={false}
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </View>
        </Form>
        <View>
          <View className="py-4 px-2 flex-row gap-2 justify-between">
            <Link href="/(protected)/change-email">
              <Text>{t`Change Email`}</Text>
            </Link>
            <Link href="/(protected)/change-password">
              <Text>{t`Change Password`}</Text>
            </Link>
          </View>
        </View>
      </CardContent>
      <CardFooter className="flex-col gap-3 pb-0">
        <View />
        <View className="self-end flex flex-row gap-4">
          <Button
            variant="outline"
            className="shadow shadow-foreground/5"
            onPress={handleReset}
            disabled={isPending}
          >
            <Text>{t`Cancel`}</Text>
          </Button>
          <Button
            variant="outline"
            className="shadow shadow-foreground/5"
            onPress={handleUpdate}
            disabled={isPending}
          >
            <Text>{isPending ? t`Saving...` : <Trans>Save</Trans>}</Text>
          </Button>
        </View>
      </CardFooter>
    </Card>
  );
}
