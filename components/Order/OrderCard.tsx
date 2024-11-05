import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@constants/Colors";
import { router } from "expo-router";

const OrderCard: React.FC<{ item: any }> = ({ item }) => {
  const orderDate = new Date(item.order_date);

  const hours = orderDate.getHours().toString().padStart(2, "0");
  const minutes = orderDate.getMinutes().toString().padStart(2, "0");
  const seconds = orderDate.getSeconds().toString().padStart(2, "0");
  const day = orderDate.getDate().toString().padStart(2, "0");
  const month = (orderDate.getMonth() + 1).toString().padStart(2, "0");
  const year = orderDate.getFullYear();

  const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;

  return (
    <TouchableOpacity
      onPress={() =>
        router.replace({
          pathname: "/DetailScreens/OrderDetail",
          params: {
            orderId: item._id as string,
            confirm: item.staff_id ? "confirm" : "unconfirm",
          },
        })
      }
      style={styles.orderItem}
    >
      <Text style={styles.orderTitle}>Customer: {item.cus_id?.full_name}</Text>
      <Text style={styles.orderText}>Status: {item?.status}</Text>
      <Text style={styles.orderText}>
        Was Paid: {item?.was_paid == true ? "Yes" : "No"}
      </Text>
      <Text style={styles.orderText}>
        Total Price: ${item?.total_price.toLocaleString()}
      </Text>
      <Text style={styles.orderText}>Order Date: {formattedDate}</Text>
      <Text style={styles.orderText} numberOfLines={1} ellipsizeMode="tail">
        Description: {item.order_description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: Colors.IVORYWHITE,
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  orderTitle: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: Colors.BURGUNDYRED,
  },
  orderText: {
    fontFamily: "inter",
    fontSize: 14,
    color: Colors.CHOCOLATEBROWN,
  },
});

export default OrderCard;
