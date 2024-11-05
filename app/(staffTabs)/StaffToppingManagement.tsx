import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useCreateAxios from "@hooks/axiosHook";
import { AxiosResponse } from "axios";
import ToppingCard from "@components/ToppingManagement/ToppingCard";
import { Colors } from "@constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SearchBar } from "react-native-elements";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

interface Topping {
  _id: string;
  topping_image: string;
  topping_name: string;
  topping_type: string;
  topping_price: number;
  topping_quantity: number;
}

interface ToppingsResponse {
  totalToppings: number;
  toppings: Topping[];
}

const StaffToppingManagement: React.FC = () => {
  const numberToppingsInPerPage = 4;
  const [Toppings, setToppings] = useState<Topping[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const { createRequest } = useCreateAxios();

  const fetchAndFilterToppings = async (
    page: number,
    Topping_name?: string,
    minPrice?: number,
    maxPrice?: number
  ) => {
    try {
      const start = (page - 1) * numberToppingsInPerPage;
      const end = page * numberToppingsInPerPage;

      const response: AxiosResponse<ToppingsResponse> = await createRequest(
        "post",
        "/toppings/search",
        {
          start,
          end,
          topping_name: Topping_name || "",
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
        }
      );

      const { totalToppings, toppings } = response.data;

      setToppings(toppings);
      setTotalPage(Math.ceil(totalToppings / numberToppingsInPerPage));
    } catch (error) {
      console.error("Error fetching and filtering Toppings:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const min = minPrice ? parseFloat(minPrice) : undefined;
      const max = maxPrice ? parseFloat(maxPrice) : undefined;
      fetchAndFilterToppings(currentPage, search, min, max);
    }, [search, currentPage, minPrice, maxPrice])
  );

  const updateSearch = (searchText: string) => {
    setSearch(searchText);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (text: string) => {
    setMinPrice(text);
  };

  const handleMaxPriceChange = (text: string) => {
    setMaxPrice(text);
  };

  const renderItem = ({ item }: { item: Topping }) => {
    return <ToppingCard Topping={item} />;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleAndAdd}>
        <Text style={styles.title}>Topping Management</Text>
        <TouchableOpacity
          onPress={() => router.push("/DetailScreens/AddTopping")}
        >
          <Ionicons name="add-circle" size={40} color={Colors.CHOCOLATEBROWN} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchAndFilterType}>
        <SearchBar
          placeholder="Search Topping"
          onChangeText={updateSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
        />
      </View>
      <View style={styles.filterPriceAndPagination}>
        <View style={styles.filterPrice}>
          <Text style={styles.filterPriceTxt}>Price From $</Text>
          <TextInput
            style={styles.filterPriceInput}
            value={minPrice}
            onChangeText={handleMinPriceChange}
            keyboardType="numeric"
          />
          <Text style={styles.filterPriceTxt}> To $</Text>
          <TextInput
            style={styles.filterPriceInput}
            value={maxPrice}
            onChangeText={handleMaxPriceChange}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.pagination}>
          <Text style={styles.paginationTxt}>Page: </Text>
          <Text style={styles.paginationTxt}>
            {totalPage > 0 ? currentPage : 0} of {totalPage}
          </Text>
          <MaterialIcons
            onPress={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            name="keyboard-arrow-left"
            size={30}
            color={currentPage === 1 ? Colors.SANDSTONE : Colors.CHOCOLATEBROWN}
          />
          <MaterialIcons
            onPress={() =>
              currentPage < totalPage && setCurrentPage(currentPage + 1)
            }
            name="keyboard-arrow-right"
            size={30}
            color={
              currentPage === totalPage
                ? Colors.SANDSTONE
                : Colors.CHOCOLATEBROWN
            }
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stickyHeader}>{renderHeader()}</View>
      {Toppings?.length > 0 ? (
        <FlatList
          data={Toppings}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.ToppingListContainer}
        />
      ) : (
        <Text style={styles.null}>No Topping Found!!!</Text>
      )}
    </SafeAreaView>
  );
};

export default StaffToppingManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 1,
  },
  columnWrapper: {
    justifyContent: "space-around",
    marginVertical: "1%",
  },
  header: {
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: Colors.FOGGYGRAY,
    width: "100%",
    height: 180,
  },
  title: {
    fontFamily: "inter-bold",
    fontSize: 25,
  },
  titleAndAdd: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ToppingListContainer: {
    paddingTop: 185,
    paddingBottom: 20,
    paddingHorizontal: "2%",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: "98%",
  },
  searchInputContainer: {
    backgroundColor: Colors.FOGGYGRAY,
    borderRadius: 15,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.CHOCOLATEBROWN,
    height: 40,
  },
  searchAndFilterType: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  filterPriceAndPagination: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "55%",
  },
  filterPriceTxt: {
    fontSize: 16,
  },
  filterPriceInput: {
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: Colors.CHOCOLATEBROWN,
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
  },
  paginationTxt: {
    fontSize: 16,
  },
  null: {
    marginTop: 200,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "inter-medium",
  },
});
