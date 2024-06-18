import { Text } from "react-native";
import { t } from "@lingui/macro";

import { Button } from "~/components/ui/button";
import { useAuth } from "~/context/auth-provider";

const LogoutButton = () => {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };
  return (
    <Button onPress={handleSignOut} className="bg-background self-end">
      <Text className="text-foreground">{t`Logout`}</Text>
    </Button>
  );
};

export default LogoutButton;
