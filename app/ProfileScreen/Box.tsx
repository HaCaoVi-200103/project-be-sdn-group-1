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
import { addProfile } from "@redux/features/profile";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
interface Props {
  avatar: string;
  fullName: string;
  email: string;
}
// const id = "6720a5a2588e2bd477bfd1a3";
const BoxProfile: React.FC<Props> = ({ avatar, email, fullName }) => {
  const dispatch = useAppDispatch();
  const profile: any = useAppSelector((state) => state.profile.profile);
  const id = profile._id;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          router.push({
            pathname: "/ProfileScreen/ProfileCustomizeCustomer",
            params: { id: id },
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
          onPress={() => router.push("ProfileScreen/Setting")}
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
