import { StyleSheet, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";

const ManagerTabLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="Managements"
        options={{
          tabBarLabel: "Managements",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="table-settings"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Statistic"
        options={{
          tabBarLabel: "Statistic",
          tabBarIcon: ({ color }) => (
            <AntDesign name="areachart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default ManagerTabLayout;

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
});
