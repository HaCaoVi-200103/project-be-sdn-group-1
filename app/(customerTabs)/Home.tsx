import Catalog from "../CustomerScreens/CakeCatalog";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import CakeBestSellingScreen from "../CustomerScreens/CakeSale";
import CakeAllScreen from "../CustomerScreens/CakeSixScreen";
import { router } from "expo-router";
import { useAppSelector } from "@hooks/reduxHooks";

const Home = () => {
  const profile: any = useAppSelector((state) => state.profile.profile);
  console.log("PROFILE :", profile.user_avatar);

  const data = [
    {
      id: "1",
      component: (
        <GreetingSection
          avatar={
            profile.user_avatar
              ? profile.user_avatar
              : "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/customerImages%2Fz5996646852783_53556339af7a8aa947ed5a54f19c2e9c.jpg?alt=media&token=691aef06-a818-4c50-bb80-0144cc1e1778"
          }
          id={profile._id}
          flat={profile._id ? true : false}
        />
      ),
    },
    { id: "2", component: <SearchSection /> },
    { id: "3", component: <OfferSection /> },
    { id: "4", component: <CakeBestSellingScreen /> },
    { id: "5", component: <Catalog /> },
    { id: "6", component: <CakeAllScreen /> },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => item.component}
      contentContainerStyle={styles.flatListContainer}
    />
  );
};

const GreetingSection = ({ flat, id, avatar }) => (
  <View style={{ marginTop: 20 }}>
    <Text style={styles.greeting}>Hi there!</Text>
    <Text style={styles.subtitle}>What are you looking for today?</Text>
    <View>
      {!flat ? (
        <TouchableOpacity onPress={() => router.push("(auth)/sign-in")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/ProfileScreen/ProfileCustomizeCustomer",
              params: { id: id },
            })
          }
        >
          <Image
            style={[
              {
                height: 50,
                width: 50,
                borderRadius: 100,
                marginBottom: 10,
              },
              styles.loginLink,
            ]}
            source={{
              uri: avatar,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const SearchSection = () => (
  <View style={styles.searchContainer}>
    <Ionicons
      name="search-outline"
      size={20}
      color="#B0B0B0"
      style={styles.searchIcon}
    />
    <TextInput
      style={styles.searchInput}
      placeholder="Search cake, cookies, anything..."
      placeholderTextColor="#B0B0B0"
    />
  </View>
);

const OfferSection = () => (
  <View style={styles.offerContainer}>
    <Image
      source={
        require("../../assets/images/cakeSample.jpg")
          ? require("../../assets/images/cakeSample.jpg")
          : ""
      }
      style={styles.offerImage}
    />
    <View style={styles.offerTextContainer}>
      <Text style={styles.offerTitle}>Cake Tart Strawberries</Text>
      <Text style={styles.offerDiscount}>up to 50% OFF!</Text>
    </View>
  </View>
);

export default Home;
const styles = StyleSheet.create({
  flatListContainer: {
    padding: 20,
    backgroundColor: "#FFF",
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loginLink: {
    fontSize: 25,
    color: "#FF6347",
    fontWeight: "bold",
    marginLeft: 300,
    marginTop: -40,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
  },
  offerContainer: {
    flexDirection: "row",
    backgroundColor: "#FEE9E2",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  offerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  offerTextContainer: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 25,
  },
  offerDiscount: {
    fontSize: 20,
    color: "#FF6347",
    marginLeft: 25,
  },
});
