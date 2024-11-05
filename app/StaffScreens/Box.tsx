import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { router } from "expo-router";
import { Colors } from "@constants/Colors";
import { logout } from "utils/AsyncStore";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { addProfile } from "@redux/features/profile";
interface Props {
  avatar: string;
  fullName: string;
  email: string;
}
// const id = "6724a907f14e21cced1f60af";
const BoxProfile: React.FC<Props> = ({ avatar, email, fullName }) => {
  const profile: any = useAppSelector((state) => state.profile.profile);
  const dispatch = useAppDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          router.push({
            pathname: "/StaffScreens/ProfileCustomizeStaff",
            params: { staffId: profile._id },
          })
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 10,
            backgroundColor: "#fff",
            padding: 10,
            position: "relative",
          }}
        >
          <Image
            style={{ width: 60, height: 60, borderRadius: 100 }}
            source={{ uri: avatar }}
          />
          <View>
            <Text style={{ fontSize: 20, fontWeight: "500" }}>{fullName}</Text>
            <Text>{email}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/StaffScreens/Setting")}
          style={{ position: "absolute", right: 10, top: 25 }}
        >
          <Ionicons name="settings" size={30} color="grey" />
        </TouchableOpacity>
      </TouchableOpacity>

      <View style={{ marginVertical: 10 }}>
        <Button
          onPress={() => {
            logout();
            dispatch(addProfile({}));
          }}
          color={Colors.BURGUNDYRED}
          title="Logout"
        />
      </View>
    </SafeAreaView>
  );
};

export default BoxProfile;
