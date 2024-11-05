import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useCreateAxios from "@hooks/axiosHook";
import { useFocusEffect } from "expo-router";
import ProductHistoryCard from "@components/ProductHistory/CakeHistoryCard";
import { Colors } from "@constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { SearchBar } from "react-native-elements";

export default function ManagmentProductHistory() {
  const { createRequest } = useCreateAxios();
  const numberOfOnePage = 4;
  const [productHistoryData, setProductHistoryData] = useState();
  const [filterProduct, setFilterProduct] = useState("Cake");
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState();

  const fetchCake = async () => {
    try {
      let response: any = await createRequest(
        "post",
        "/productHistory/getAllCakeHistory",
        {
          start: (pageIndex - 1) * numberOfOnePage + 1,
          end: pageIndex * numberOfOnePage,
          search,
        }
      );
      setTotalPage(Math.ceil(parseInt(response.data.total) / numberOfOnePage));
      setProductHistoryData(response.data.productHistories);
    } catch (error) {
      console.error("Error fetching product history:", error);
    }
  };

  const fetchTopping = async () => {
    try {
      let response: any = await createRequest(
        "post",
        "/productHistory/getAllToppingHistory",
        {
          start: (pageIndex - 1) * numberOfOnePage + 1,
          end: pageIndex * numberOfOnePage,
          search,
        }
      );
      setTotalPage(Math.ceil(parseInt(response.data.total) / numberOfOnePage));
      setProductHistoryData(response.data.productHistories);
    } catch (error) {
      console.error("Error fetching product history:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPageIndex(1);
      setFilterProduct("Cake");
      fetchCake();
    }, [])
  );

  useEffect(() => {
    if (filterProduct === "Cake") {
      fetchCake();
    } else {
      fetchTopping();
    }
  }, [pageIndex]);

  useEffect(() => {
    setPageIndex(1);
    if (filterProduct) {
      if (filterProduct === "Cake") {
        fetchCake();
      } else {
        fetchTopping();
      }
    }
  }, [filterProduct]);
  useEffect(() => {
    if (filterProduct === "Cake") {
      fetchCake();
    } else {
      fetchTopping();
    }
  }, [search]);
  return (
    <View>
      <Picker
        selectedValue={filterProduct}
        style={styles.picker}
        onValueChange={(itemValue) => setFilterProduct(itemValue)}
      >
        <Picker.Item label="Cake" value="Cake" />
        <Picker.Item label="Topping" value="Topping" />
      </Picker>
      <View style={styles.searchPaginationContainer}>
        <SearchBar
          placeholder="Search Order ..."
          onChangeText={(value) => setSearch(value)}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
        />
        <View style={styles.pagination}>
          <Text style={styles.orderText}>Page</Text>
          <Ionicons
            name="chevron-back-outline"
            disabled={pageIndex === 1}
            size={20}
            onPress={() => setPageIndex(pageIndex - 1)}
            color={pageIndex === 1 ? Colors.SANDSTONE : Colors.CHOCOLATEBROWN}
          />
          <Text style={styles.orderText}>
            {pageIndex} of {totalPage === 0 ? 1 : totalPage}
          </Text>
          <Ionicons
            name="chevron-forward"
            disabled={pageIndex === totalPage}
            size={20}
            onPress={() => setPageIndex(pageIndex + 1)}
            color={
              pageIndex === totalPage ? Colors.SANDSTONE : Colors.CHOCOLATEBROWN
            }
          />
        </View>
      </View>

      <FlatList
        data={productHistoryData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductHistoryCard item={item} />}
        keyExtractor={(item: any) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 50,
    width: "50%",
    alignSelf: "center",
    marginVertical: 10,
  },
  searchPaginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  searchInputContainer: {
    backgroundColor: Colors.IVORYWHITE,
    borderRadius: 10,
  },
  searchInput: {
    fontSize: 16,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderText: {
    fontFamily: "inter",
    fontSize: 16,
    color: Colors.CHOCOLATEBROWN,
    marginHorizontal: 5,
  },
});
