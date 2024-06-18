import { Tabs } from "expo-router";
import { useLingui } from "@lingui/react";

import { ThemeToggle } from "~/components/theme-toggle";
import { Home } from "~/lib/icons/home";
import { Send } from "~/lib/icons/send";

export default function PrivateLayout() {
  const { i18n } = useLingui();
  return (
    <Tabs>
      <Tabs.Screen
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <Home className="text-foreground" />,
          title: "Home",
          headerRight: () => <ThemeToggle />,
        }}
        name="home"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Send className="text-foreground" />,
          title: "Profile & Settings",
          headerRight: () => <ThemeToggle />,
        }}
        name="profile"
      />
      <Tabs.Screen
        options={{ href: null, tabBarLabel: "Reset Password" }}
        name="change-password"
      />
      <Tabs.Screen
        options={{
          href: null,
          headerShown: true,
          tabBarLabel: "Change Email",
          title: "Change Email",
          tabBarIconStyle: { transform: [{ rotate: "90deg" }] },
          tabBarIcon: () => <Send color={"#333"} />,
        }}
        name="change-email"
      />
    </Tabs>
  );
}
