import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import useCreateAxios from "../../hooks/axiosHook";

interface Cake {
  cake_name: string;
  cake_price: number;
  cake_image: string;
}

const CakeBestSellingScreen: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const { createRequest } = useCreateAxios();

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await createRequest<Cake[]>(
          "get",
          "/cakecatalog/all-cake"
        );
        const saleCakes = response.data.slice(0, 7);
        setCakes(saleCakes);
      } catch (error) {
        console.error("Error fetching best-selling cakes:", error);
      }
    };

    fetchCakes();
  }, [createRequest]);

  const renderCake = ({ item }: { item: Cake }) => (
    <View style={styles.cakeCard}>
      <Image source={{ uri: item.cake_image }} style={styles.cakeImage} />
      <Text style={styles.cakeName}>{item.cake_name}</Text>
      <Text style={styles.cakePrice}>${item.cake_price}</Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Our Best Selling</Text>
        <Text style={styles.subHeading}>This week</Text>
      </View>
      <FlatList
        data={cakes}
        renderItem={renderCake}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default CakeBestSellingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#FFF",
    marginLeft: -5,
    paddingTop: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginLeft: -15,
  },
  subHeading: {
    fontSize: 14,
    color: "#888",
  },
  listContainer: {
    paddingBottom: 20,
  },
  cakeCard: {
    width: 150,
    height: 200,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    marginRight: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cakeImage: {
    width: 140,
    height: 130,
    borderRadius: 10,
    marginBottom: 10,
  },
  cakeName: {
    fontSize: 12.5,
    fontWeight: "bold",
    textAlign: "center",
  },
  cakePrice: {
    fontSize: 14,
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
});
