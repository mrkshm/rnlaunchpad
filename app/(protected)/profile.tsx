import { useReducer } from "react";
import { Text, View } from "react-native";
import { t } from "@lingui/macro";

import LanguageSwitcher from "~/components/language-switcher";
import ProfileEditCard from "~/components/profile-edit-card";
import ProfileViewCard from "~/components/profile-view-card";
import LogoutButton from "~/components/logout-button";

export default function Profile() {
  const [editMode, toggleEditMode] = useReducer((state) => !state, false);

  return (
    <>
      <View className="flex items-center pt-4">
        <LanguageSwitcher />
        <Text>Testing translation: {t`Change Email`}</Text>
      </View>
      <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
        {editMode ? (
          <ProfileEditCard toggleEditMode={toggleEditMode} />
        ) : (
          <ProfileViewCard toggleEditMode={toggleEditMode} />
        )}
        <LogoutButton />
      </View>
    </>
  );
}
