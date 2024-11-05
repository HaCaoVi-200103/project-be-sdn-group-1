import { StyleSheet, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
const CustomerTabLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarAllowFontScaling: true,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Text style={styles.icon}>🏡</Text>,
        }}
      />
      <Tabs.Screen
        name="Order"
        options={{
          tabBarLabel: "Order",
          tabBarIcon: ({ color }) => <Text style={styles.icon}>🍰</Text>,
        }}
      />
      <Tabs.Screen
        name="AboutStore"
        options={{
          tabBarLabel: "Store",
          tabBarIcon: ({ color }) => <Text style={styles.icon}>🏪</Text>,
        }}
      />
      <Tabs.Screen
        name="Others"
        options={{
          tabBarLabel: "Others",
          tabBarIcon: ({ color }) => <Text style={styles.icon}>🪧</Text>,
        }}
      />
    </Tabs>
  );
};

export default CustomerTabLayout;

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
});