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
import { useRouter } from "expo-router";

interface Cake {
  cake_name: string;
  cake_price: number;
  cake_image: string;
}

const CakeAllScreen: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const { createRequest } = useCreateAxios();
  const router = useRouter();

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await createRequest<Cake[]>(
          "get",
          "/cakecatalog/all-cake"
        );
        const saleCakes = response.data.slice(0, 6);
        setCakes(saleCakes);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu loại bánh:", error);
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
      <Text style={styles.heading}>All cake</Text>
      <FlatList
        data={cakes}
        renderItem={renderCake}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => router.push("/DetailScreens/AllCake")}
          >
            <Text style={styles.viewMoreText}>View all cake</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default CakeAllScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cakeCard: {
    width: "47%",
    height:210,
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
    width: 160,
    height: 140,
    borderRadius: 10,
  },
  cakeName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    flex: 1,
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
  viewMoreButton: {
    backgroundColor: "#FF6347",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  viewMoreText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
