import { View, Button } from "react-native";
import React from "react";
import { router, useNavigation } from "expo-router";
import HeaderCustomize from "@components/ManagerStaffComponent/HeaderCustomize";
import { Colors } from "@constants/Colors";
import { useAppSelector } from "@hooks/reduxHooks";

const Setting = () => {
  const navigation = useNavigation();
  const profile: any = useAppSelector((state) => state.profile.profile);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View>
      <HeaderCustomize title="Setting" />
      <View style={{ marginVertical: 10 }}>
        <Button
          onPress={() =>
            router.push({
              pathname: "/StaffScreens/ProfileCustomizeStaff",
              params: { staffId: profile._id },
            })
          }
          color={Colors.BURGUNDYRED}
          title="Update Profile"
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <Button
          onPress={() => router.push("/ProfileScreen/ChangePassword")}
          color={Colors.BURGUNDYRED}
          title="Change Password"
        />
      </View>
    </View>
  );
};

export default Setting;
