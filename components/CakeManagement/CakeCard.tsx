import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "@constants/Colors";
import { useRouter } from "expo-router";

interface Cake {
  _id: string;
  cake_image: string;
  cake_name: string;
  cake_type: string;
  cake_price: number;
  cake_quantity: number;
}

interface CakeCardProps {
  cake: Cake;
}

const CakeCard: React.FC<CakeCardProps> = ({ cake }) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/DetailScreens/CakeManagementDetail",
          params: { id: cake?._id },
        })
      }
    >
      <Image source={{ uri: cake.cake_image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.cakeName}>{cake.cake_name}</Text>
        {/* <Text style={styles.text}>{cake.cake_type}</Text> */}
        <View style={styles.quantityAndPrice}>
          <Text style={styles.quantity}>Quantity: {cake.cake_quantity}</Text>
          <Text style={styles.price}>${cake.cake_price}</Text>
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
  cakeName: {
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

export default CakeCard;
