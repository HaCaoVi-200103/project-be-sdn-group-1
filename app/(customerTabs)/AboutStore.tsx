import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Store = {
  store_name: string;
  open_hours: string;
  address: string;
  image: string;
  phone_number: string;
};

const AboutStore: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:8080/api/v1/stores');
        console.log('Fetched data:', response.data);
        setStores(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stores</Text>
          <Text style={styles.subtitle}>Some stores you might be interested in</Text>

      <FlatList
        data={stores}
        keyExtractor={(item) => item.store_name}
        renderItem={({ item }) => (
          <View style={styles.storeCard}>
            <Image source={{ uri: item.image }} style={styles.storeImage} />
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{item.store_name}</Text>
              <Text style={styles.storeDetails}>📍 {item.address}</Text>
              <Text style={styles.storeDetails}>🕒 {item.open_hours}</Text>
              <Text style={styles.storeDetails}>📞 {item.phone_number}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
    marginTop:15,
  },
    subtitle: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  storeImage: {
    width: '100%',
    height: 160,
  },
  storeInfo: {
    padding: 15,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 5,
  },
  storeDetails: {
    fontSize: 16,
    color: '#7f8c8d',
    marginVertical: 2,
  },
});

export default AboutStore;  
