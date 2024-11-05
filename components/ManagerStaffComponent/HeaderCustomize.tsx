import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";

interface Props {
  title: string;
}
const HeaderCustomize: React.FC<Props> = ({ title }) => {
  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          marginTop: "10%",
          marginHorizontal: 20,
          alignItems: "center",
          marginBottom: 10,
        }}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back-ios" size={20} color="black" />
        <Text style={{ fontSize: 20 }}>{title}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HeaderCustomize;
