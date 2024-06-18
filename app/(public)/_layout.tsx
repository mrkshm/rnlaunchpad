import { Tabs } from "expo-router";

import { ThemeToggle } from "~/components/theme-toggle";
import { ArrowLeft } from "~/lib/icons/arrow-left";
import { Home } from "~/lib/icons/home";
import { Send } from "~/lib/icons/send";
import { SendHorizontal } from "~/lib/icons/send-horizontal";

export default function PublicLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <Home className="text-foreground" />,
          title: "Home",
          headerRight: () => <ThemeToggle />,
        }}
        name="welcome"
      />
      <Tabs.Screen
        options={{
          headerShown: false,
          tabBarLabel: "Sign Up",
          tabBarIcon: () => <SendHorizontal className="text-foreground" />,
          title: "Sign Up",
        }}
        name="sign-up"
      />
      <Tabs.Screen
        options={{
          headerShown: false,
          tabBarLabel: "Sign In",
          tabBarIcon: () => <Send className="text-foreground" />,
          title: "Sign In",
        }}
        name="sign-in"
      />
      <Tabs.Screen
        options={{ href: null, tabBarLabel: "Activate" }}
        name="confirm"
      />
      <Tabs.Screen
        options={{ href: null, tabBarLabel: "Reset Password" }}
        name="reset-password"
      />
      <Tabs.Screen
        options={{
          headerShown: false,
          title: "Terms and Conditions",
          href: null,
        }}
        name="terms-and-conditions"
      />
    </Tabs>
  );
}
