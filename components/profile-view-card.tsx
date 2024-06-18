import { t } from "@lingui/macro";
import { View } from "react-native";

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
import { Text } from "~/components/ui/text";
import { useAuth } from "~/context/auth-provider";
import { useImage } from "~/hooks/use-image";

type ProfileViewCardProps = {
  toggleEditMode: () => void;
};
export default function ProfileViewCard({
  toggleEditMode,
}: ProfileViewCardProps) {
  const { session, profile } = useAuth();
  const { data: userImage } = useImage({
    path: `${session?.user.id}/${profile?.image_url}` ?? "",
  });
  return (
    <Card className="w-full max-w-sm p-6 rounded-2xl">
      <CardHeader className="items-center">
        <Avatar alt="Rick Sanchez's Avatar" className="w-24 h-24">
          <AvatarImage source={{ uri: userImage }} />
          <AvatarFallback>
            <Text className="text-black">{profile?.email?.charAt(0)}M</Text>
          </AvatarFallback>
        </Avatar>
        <View className="p-3" />
        <CardTitle className="pb-2 text-center">
          {profile?.user_name ?? profile?.email}
        </CardTitle>
        <View className="flex-row">
          <CardDescription className="text-base font-semibold">
            {profile?.email}
          </CardDescription>
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex-row justify-around gap-3">
          <View className="items-center">
            <Text className="text-sm text-muted-foreground">Dimension</Text>
            <Text className="text-xl font-semibold">C-137</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-muted-foreground">Age</Text>
            <Text className="text-xl font-semibold">70</Text>
          </View>
          <View className="items-center">
            <Text className="text-sm text-muted-foreground">Species</Text>
            <Text className="text-xl font-semibold">Human</Text>
          </View>
        </View>
      </CardContent>
      <CardFooter className="flex-row justify-center pb-0">
        <Button
          variant="outline"
          className="shadow shadow-foreground/5"
          onPress={toggleEditMode}
        >
          <Text>{t`Update`}</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
