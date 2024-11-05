import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import { getStore, removeStore, setStore } from "utils/AsyncStore";
interface CartItem {
  _id: string;
  cake_name: string;
  cake_price: number;
  cake_image: string;
  quantity: number;
}

const CartScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const cart = await getStore("cart");
      setCartItems(cart || []);
    };
    fetchCart();
  }, []);

  const updateQuantity = async (id: string, delta: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        const newQuantity = item.quantity + delta;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; // Đảm bảo số lượng không nhỏ hơn 1
      }
      return item;
    });
    setCartItems(updatedCart);
    await setStore("cart", JSON.stringify(updatedCart)); // Lưu lại trạng thái mới vào AsyncStorage
  };

  const clearCart = async () => {
    try {
      await removeStore("cart");
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {item.cake_image ? (
        <Image source={{ uri: item.cake_image }} style={styles.cartItemImage} />
      ) : (
        <Text style={styles.imageErrorText}>Image not available</Text>
      )}
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.cake_name}</Text>
        <Text style={styles.cartItemPrice}>${item.cake_price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item._id, -1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.cartItemQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item._id, 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={true}
      />
      <Button title="Clear Cart" onPress={clearCart} />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cartItemPrice: {
    fontSize: 15,
    color: "#FF6347",
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: "#FF6347",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  cartItemQuantity: {
    fontSize: 16,
    color: "#333",
  },
  imageErrorText: {
    fontSize: 12,
    color: "#FF0000",
  },
});
