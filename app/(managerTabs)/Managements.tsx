import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ManagementOrder from "../ManagementScreens/ManagementOrder";
import StaffCakeManagement from "@app/(staffTabs)/StaffCakeManagement";
import ManageStaff from "@app/ManagementScreens/ManageStaff";
import ManagmentProductHistory from "@app/ManagementScreens/ManagmentProductHistory";

const Drawer = createDrawerNavigator();

export default function Management() {
  return (
    <Drawer.Navigator initialRouteName="Management Order">
      <Drawer.Screen name="Management Order" component={ManagementOrder} />
      <Drawer.Screen name="Management Cake" component={StaffCakeManagement} />
      <Drawer.Screen name="Management Staff" component={ManageStaff} />
      <Drawer.Screen
        name="Managment Product History"
        component={ManagmentProductHistory}
      />
    </Drawer.Navigator>
  );
}
