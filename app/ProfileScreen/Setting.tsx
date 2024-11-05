import { View, Button } from "react-native";
import React from "react";
import { router, useNavigation } from "expo-router";
import HeaderCustomize from "@components/ManagerStaffComponent/HeaderCustomize";
import { Colors } from "@constants/Colors";
import { useAppSelector } from "@hooks/reduxHooks";
// const customerId = "6720a5a2588e2bd477bfd1a3";

const Setting = () => {
  const navigation = useNavigation();
  const profile: any = useAppSelector((state) => state.profile.profile);
  const customerId = profile._id;
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
              pathname: "/ProfileScreen/ProfileCustomizeCustomer",
              params: { id: customerId },
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
