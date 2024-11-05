import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import OrderStatistic from "@app/Statistics/OrderStatistic";
import StaffStatistic from "@app/Statistics/StaffStatistic";
import CakeStatistic from "@app/Statistics/CakeStatistic";

const Drawer = createDrawerNavigator();

export default function Management() {
  return (
    <Drawer.Navigator initialRouteName="Management Order">
      <Drawer.Screen name="Order Statistic" component={OrderStatistic} />
      <Drawer.Screen name="Staff Statistic" component={StaffStatistic} />
      <Drawer.Screen name="Cake Statistic" component={CakeStatistic} />
    </Drawer.Navigator>
  );
}
