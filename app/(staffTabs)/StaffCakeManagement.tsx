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
import CakeCard from "@components/CakeManagement/CakeCard";
import { Colors } from "@constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SearchBar } from "react-native-elements";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

interface Cake {
  _id: string;
  cake_image: string;
  cake_name: string;
  cake_type: string;
  cake_price: number;
  cake_quantity: number;
}

interface CakesResponse {
  totalCakes: number;
  cakes: Cake[];
}

interface CakeType {
  id: string;
  name: string;
}

const StaffCakeManagement: React.FC = () => {
  const numberCakesInPerPage = 6;
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [filteredCakes, setFilteredCakes] = useState<Cake[]>(cakes);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [cakeTypes, setCakeTypes] = useState<CakeType[]>([]); // State to hold cake types
  const { createRequest } = useCreateAxios();

  const fetchCakes = async (
    page: number,
    minPrice?: number,
    maxPrice?: number
  ) => {
    try {
      const start = (page - 1) * numberCakesInPerPage;
      const end = page * numberCakesInPerPage;
      const response: AxiosResponse<CakesResponse> = await createRequest(
        "post",
        "/cakes/pagination",
        { start, end, min_price: minPrice, max_price: maxPrice }
      );
      const { totalCakes, cakes } = response.data;
      setCakes(cakes);
      setTotalPage(Math.ceil(totalCakes / numberCakesInPerPage));
      setFilteredCakes(cakes);
    } catch (error) {
      console.error("Error fetching cakes:", error);
    }
  };

  const fetchCakeTypes = async () => {
    try {
      const response: AxiosResponse<CakeType[]> = await createRequest(
        "post",
        "/cakes/types"
      );
      setCakeTypes(response.data);
    } catch (error) {
      console.error("Error fetching cake types:", error);
    }
  };

  const searchCakes = async (
    page: number,
    cake_name: string,
    minPrice?: number,
    maxPrice?: number,
    cake_type?: string
  ) => {
    try {
      const start = (page - 1) * numberCakesInPerPage;
      const end = page * numberCakesInPerPage;
      const response: AxiosResponse<CakesResponse> = await createRequest(
        "post",
        "/cakes/search",
        {
          start,
          end,
          cake_name,
          min_price: minPrice,
          max_price: maxPrice,
          cake_type,
        }
      );
      const { totalCakes, cakes } = response.data;
      setCakes(cakes);
      setTotalPage(Math.ceil(totalCakes / numberCakesInPerPage));
      setFilteredCakes(cakes);
    } catch (error) {
      console.error("Error searching cakes:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCakeTypes();
      if (search || minPrice || maxPrice || selectedType !== "All") {
        const min = minPrice ? parseFloat(minPrice) : undefined;
        const max = maxPrice ? parseFloat(maxPrice) : undefined;
        searchCakes(currentPage, search, min, max, selectedType);
      } else {
        fetchCakes(currentPage);
      }
    }, [search, currentPage, minPrice, maxPrice, selectedType])
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

  const renderItem = ({ item }: { item: Cake }) => {
    return <CakeCard cake={item} />;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleAndAdd}>
        <Text style={styles.title}>Cake Management</Text>
        <TouchableOpacity onPress={() => router.push("/DetailScreens/AddCake")}>
          <Ionicons name="add-circle" size={40} color={Colors.CHOCOLATEBROWN} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchAndFilterType}>
        <SearchBar
          placeholder="Search Cake"
          onChangeText={updateSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
        />
        <Picker
          selectedValue={selectedType}
          onValueChange={(itemValue) => {
            setSelectedType(itemValue);
          }}
          style={styles.picker}
        >
          <Picker.Item style={styles.pickerItem} label="All" value="All" />
          {cakeTypes.map((type) => (
            <Picker.Item
              key={type.id}
              style={styles.pickerItem}
              label={type.name}
              value={type.name}
            />
          ))}
        </Picker>
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
      {filteredCakes.length > 0 ? (
        <FlatList
          data={filteredCakes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.cakeListContainer}
        />
      ) : (
        <Text style={styles.null}>No Cake Found!!!</Text>
      )}
    </SafeAreaView>
  );
};

export default StaffCakeManagement;

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
  cakeListContainer: {
    paddingTop: 185,
    paddingBottom: 20,
    paddingHorizontal: "2%",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: "60%",
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
    justifyContent: "space-between",
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
  picker: {
    borderWidth: 5,
    borderColor: Colors.CHOCOLATEBROWN,
    borderRadius: 10,
    width: 140,
    height: 10,
    backgroundColor: Colors.IVORYWHITE,
  },
  pickerItem: {
    fontFamily: "inter",
    fontSize: 14,
  },
  null: {
    marginTop: 200,
    textAlign: "center",
    fontSize: 30,
    color: Colors.BRICKRED,
  },
});
