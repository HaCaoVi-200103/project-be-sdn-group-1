import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useCreateAxios from "../../hooks/axiosHook";
import { useRouter } from "expo-router";
import { getStore } from "utils/AsyncStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Cake {
  cake_name: string;
  cake_price: number;
  cake_image: string;
  _id: string;
  quantity?: number;
}

const ITEMS_PER_PAGE = 8;

const AllCake: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [cart, setCart] = useState<Cake[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { createRequest } = useCreateAxios();
  const router = useRouter();

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await createRequest<Cake[]>(
          "get",
          "/cakecatalog/all-cake"
        );
        setCakes(response.data);
      } catch (error) {
        return;
      }
    };
    fetchCakes();
    const fetchCart = async () => {
      const currentCart = await getStore("user_cart");
      setCart(currentCart);
    };
    fetchCart();
  }, [createRequest]);

  const addToCartS = async (cake: Cake) => {
    try {
      const storedCart = await AsyncStorage.getItem("cart");
      const currentCart = storedCart ? JSON.parse(storedCart) : [];
      const existingItemIndex = currentCart.findIndex(
        (item: Cake) => item._id === cake._id
      );
      if (existingItemIndex !== -1) {
        currentCart[existingItemIndex].quantity =
          (currentCart[existingItemIndex].quantity || 0) + 1;
      } else {
        currentCart.push({ ...cake, quantity: 1 });
      }
      await AsyncStorage.setItem("cart", JSON.stringify(currentCart));
      setCart(currentCart);
    } catch (error) {
      return Alert.alert(
        "Error",
        "There was a problem adding the item to the cart."
      );
    }
  };

  const currentPageData = cakes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderCake = ({ item }: { item: Cake }) => (
    <TouchableOpacity
      style={styles.cakeCard}
      onPress={() =>
        router.push({
          pathname: `/DetailScreens/CakeDetails`,
          params: { cakeId: item._id },
        })
      }
    >
      <Image source={{ uri: item.cake_image }} style={styles.cakeImage} />
      <Text style={styles.cakeName}>{item.cake_name}</Text>
      <Text style={styles.cakePrice}>${item.cake_price}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText} onPress={() => addToCartS(item)}>
          +
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleBack = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage * ITEMS_PER_PAGE < cakes.length)
      setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>All cakes</Text>
        <TouchableOpacity
          style={styles.cartIcon}
          onPress={() => router.push("/CustomerScreens/CartScreen")}
        >
          <Ionicons name="cart-outline" size={35} color="#FF6347" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={currentPageData}
        renderItem={renderCake}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handleBack}
          disabled={currentPage === 1}
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}
        >
          <Text style={styles.paginationText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentPage * ITEMS_PER_PAGE >= cakes.length}
          style={[
            styles.paginationButton,
            currentPage * ITEMS_PER_PAGE >= cakes.length &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.paginationText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AllCake;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 10,
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  cartIcon: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    right: -8,
    top: -5,
    backgroundColor: "#FF6347",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  cakeCard: {
    width: "47%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cakeImage: {
    width: 170,
    height: 145,
    borderRadius: 10,
  },
  cakeName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    flex: 1,
    marginTop: 5,
  },
  cakePrice: {
    fontSize: 15,
    color: "#FF6347",
    fontWeight: "bold",
    marginTop: 5,
    marginRight: 70,
  },
  addButton: {
    backgroundColor: "#FF6347",
    borderRadius: 20,
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 100,
    marginTop: -21,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 10,
  },
  paginationButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: "#DDDDDD",
  },
  paginationText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
