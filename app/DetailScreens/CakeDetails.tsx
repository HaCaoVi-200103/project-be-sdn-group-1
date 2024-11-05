import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useCreateAxios from "../../hooks/axiosHook";
import { useRouter, useLocalSearchParams } from "expo-router";

interface CakeDetailProps {
  cake_id: string;
  cake_name: string;
  cake_price: number;
  cake_image: string;
  cake_type: string;
  cake_description: string;
}

const CakeDetail: React.FC = () => {
  const [cake, setCake] = useState<CakeDetailProps | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { createRequest } = useCreateAxios();
  const { cakeId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCakeDetail = async () => {
      try {
        const response = await createRequest<CakeDetailProps>(
          "get",
          `/cakecatalog/details/${cakeId}`
        );
        setCake(response.data);
      } catch (error) {
        console.error("Error", error);
      }
    };
    if (cakeId) fetchCakeDetail();
  }, [cakeId, createRequest]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!cake) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}></View>
      <Image source={{ uri: cake.cake_image }} style={styles.cakeImage} />
      <Text style={styles.cakeName}>{cake.cake_name}</Text>
      <Text style={styles.cakeType}>{cake.cake_type}</Text>
      <Text style={styles.cakePrice}>${cake.cake_price}</Text>
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityText}>Quantity:</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleDecrease}
        >
          <Ionicons name="remove" size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.quantityNumber}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleIncrease}
        >
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.cakeDescriptionContainer}>
        <Text style={styles.cakeDescriptionLabel}>Description</Text>
        <Text style={styles.cakeDescription}>{cake.cake_description}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.placeOrderButton}>
          <Text style={styles.placeOrderText}>Buy now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CakeDetail;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 10,
  },
  cartIconContainer: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 15,
  },
  cakeImage: {
    width: "100%",
    height: 380,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover",
  },
  cakeName: {
    fontSize: 30,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  cakeType: {
    fontSize: 20,
    fontWeight: "500",
    color: "#777",
    marginBottom: 10,
    textAlign: "center",
  },
  cakePrice: {
    fontSize: 20,
    color: "#FF6347",
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    marginBottom: 20,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  quantityButton: {
    backgroundColor: "#FF6347",
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  quantityNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 15,
  },
  cakeDescriptionContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  cakeDescriptionLabel: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
    marginLeft: -2,
    textAlign: "center",
  },
  cakeDescription: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  placeOrderButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  placeOrderText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#A9A9A9",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
