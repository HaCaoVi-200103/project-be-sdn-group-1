import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Colors } from "@constants/Colors";

const CakeHistoryCard: React.FC<{ item: any }> = ({ item }) => {
  const changeDate = new Date(
    item?.update_date ? item.update_date : item.create_date
  );

  const hours = changeDate.getHours().toString().padStart(2, "0");
  const minutes = changeDate.getMinutes().toString().padStart(2, "0");
  const seconds = changeDate.getSeconds().toString().padStart(2, "0");
  const day = changeDate.getDate().toString().padStart(2, "0");
  const month = (changeDate.getMonth() + 1).toString().padStart(2, "0");
  const year = changeDate.getFullYear();

  const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item?.cake_id?.cake_name ? "Cake Name:" : "Topping Name:"}{" "}
        <Text style={styles.text}>
          {item?.cake_id?.cake_name
            ? item?.cake_id?.cake_name
            : item?.topping_id?.topping_name}
        </Text>
      </Text>
      <Text style={styles.title}>
        Change By: <Text style={styles.text}>{item?.staff_id?.full_name}</Text>
      </Text>
      <Text style={styles.title}>
        Change Date: <Text style={styles.text}>{formattedDate}</Text>
      </Text>
      <Text style={styles.title}>
        Status of Change:{" "}
        <Text style={styles.text}>
          {item?.update_date ? "Update" : "Create"}
        </Text>
      </Text>
      <Text style={styles.title}>
        Quantity of Change:{" "}
        <Text style={styles.text}>
          {!item?.his_quantity ? "None" : item?.his_quantity}
        </Text>
      </Text>
      <Text style={styles.title}>
        Price of Change:{" "}
        <Text style={styles.text}>
          {!item?.his_price ? "None" : item?.his_price}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: Colors.IVORYWHITE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontFamily: "inter-bold",
    color: Colors.CHOCOLATEBROWN,
    marginBottom: 4,
    fontSize: 16,
  },
  text: {
    fontFamily: "inter",
    color: Colors.CHOCOLATEBROWN,
    fontSize: 16,
  },
});

export default CakeHistoryCard;
