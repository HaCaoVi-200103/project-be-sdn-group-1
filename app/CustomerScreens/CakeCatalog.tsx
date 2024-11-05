import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";
import useCreateAxios from "../../hooks/axiosHook";

interface Cake {
  cake_type: string;
  cake_description: string;
  cake_image: string;
}

const Catalog: React.FC = () => {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const { createRequest } = useCreateAxios();

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const response = await createRequest<Cake[]>(
          "get",
          "/cakecatalog/catalog"
        );
        setCakes(response.data);
      } catch (error) {
        return;
      }
    };
    fetchCakes();
  }, [createRequest]);

  const renderCake = ({ item }: { item: Cake }) => (
    <View style={styles.cakeCard}>
      <Image source={{ uri: item.images[0] }} style={styles.cakeImage} />
      <Text style={styles.cakeType}>{item.cake_type}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Categories</Text>
      <FlatList
        data={cakes}
        renderItem={renderCake}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Catalog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFF",
    marginLeft: -10,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subheading: {
    fontSize: 14,
    color: "#888",
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  cakeCard: {
    width: 150,
    height: 185,
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cakeImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 10,
  },
  cakeType: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
