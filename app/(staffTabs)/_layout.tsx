import { StyleSheet, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Fontisto from "@expo/vector-icons/Fontisto";

const StaffTabLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
      }}
    >
      <Tabs.Screen
        name="StaffOrderManagement"
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color }) => (
            <Ionicons name="newspaper-outline" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="StaffCakeManagement"
        options={{
          tabBarLabel: "Cakes",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cupcake" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="StaffToppingManagement"
        options={{
          tabBarLabel: "Toppings",
          tabBarIcon: ({ color }) => (
            <Fontisto name="raspberry-pi" size={24} color={color} />
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

export default StaffTabLayout;

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
});
