import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@constants/Colors";
import { useRouter } from "expo-router";

interface Topping {
  _id: string;
  topping_image: string;
  topping_name: string;
  topping_type: string;
  topping_price: number;
  topping_quantity: number;
}

interface ToppingCardProps {
  Topping: Topping;
}

const ToppingCard: React.FC<ToppingCardProps> = ({ Topping }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/DetailScreens/ToppingManagementDetail",
          params: { id: Topping?._id },
        })
      }
    >
      <Image source={{ uri: Topping.topping_image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.ToppingName}>{Topping.topping_name}</Text>
        {/* <Text style={styles.text}>{Topping.Topping_type}</Text> */}
        <View style={styles.quantityAndPrice}>
          <Text style={styles.quantity}>
            Quantity: {Topping.topping_quantity}
          </Text>
          <Text style={styles.price}>${Topping.topping_price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 5,
    width: "48%",
    borderWidth: 1,
    borderColor: Colors.FOGGYGRAY,
  },
  image: {
    borderRadius: 20,
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  quantityAndPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContent: {
    margin: "5%",
  },
  ToppingName: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "inter-bold",
    color: Colors.CHOCOLATEBROWN,
    flexDirection: "column",
    justifyContent: "space-between",
    height: 50,
  },
  quantity: {
    fontSize: 16,
    fontFamily: "inter-medium",
    color: Colors.BRICKRED,
  },
  price: {
    fontSize: 16,
    fontFamily: "inter-medium",
    color: Colors.BURGUNDYRED,
  },
});

export default ToppingCard;
