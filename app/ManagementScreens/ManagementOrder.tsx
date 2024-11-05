import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import useCreateAxios from "../../hooks/axiosHook";
import OrderCard from "../../components/Order/OrderCard";
import { Colors } from "@constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SearchBar } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";

const StaffOrderManagement = () => {
  const { createRequest } = useCreateAxios();
  const numberOrderPage = 5;
  const [orderFilter, setOrderFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [numberPage, setNumberPage] = useState(1);
  const [order, setOrder] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [wasPaidFilter, setWasPaidFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let response: any;
        if (!isSearch && wasPaidFilter == "All" && statusFilter == "All") {
          console.log("bb");
          const start = numberOrderPage * pageIndex + 1;
          const end = numberOrderPage * (pageIndex + 1);
          if (orderFilter === "Confirm") {
            response = await createRequest("post", "/orders/confirmedOrder", {
              start,
              end,
            });
          } else if (orderFilter === "UnConfirm") {
            response = await createRequest("post", "/orders/unConfirmedOrder", {
              start,
              end,
            });
          } else {
            response = await createRequest("post", "/orders/allOrder", {
              start,
              end,
            });
          }
        } else {
          console.log("aa");
          const start = numberOrderPage * pageIndex + 1;
          const end = numberOrderPage * (pageIndex + 1);
          if (orderFilter === "Confirm") {
            response = await createRequest("post", "/orders/filter", {
              start,
              end,
              flag: "confirmed",
              wasPaid:
                wasPaidFilter == "All"
                  ? "All"
                  : wasPaidFilter == "Paid"
                  ? true
                  : false,
              status: statusFilter,
              search,
            });
          } else {
            response = await createRequest("post", "/orders/filter", {
              start,
              end,
              flag: "unconfirmed",
              wasPaid:
                wasPaidFilter == "All"
                  ? "All"
                  : wasPaidFilter == "Paid"
                  ? true
                  : false,
              status: statusFilter,
              search,
            });
          }
        }
        setOrder(response.data.orders);
        console.log(response.data);
        setNumberPage(Math.ceil(response.data.totalCount / numberOrderPage));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [orderFilter, pageIndex, isSearch, wasPaidFilter, statusFilter]);
  useEffect(() => {
    console.log(isSearch);
    if (!search) setIsSearch(false);
  }, [search]);
  return (
    <View style={styles.container}>
      <Text style={styles.orderTitle}>Order Management</Text>
      <View style={styles.header}>
        <SearchBar
          placeholder="Search Order ..."
          onChangeText={(value) => setSearch(value)}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
        />
        <TouchableOpacity
          onPress={() => {
            setIsSearch(search ? true : false), setPageIndex(0);
          }}
          style={styles.searchLableContainer}
        >
          <Text style={styles.searchLable}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Picker
          selectedValue={statusFilter}
          onValueChange={(itemValue) => {
            setStatusFilter(itemValue);
          }}
          style={styles.picker}
        >
          <Picker.Item style={styles.pickerItem} label="All" value="All" />
          <Picker.Item
            style={styles.pickerItem}
            label="Pending"
            value="Pending"
          />
          <Picker.Item
            style={styles.pickerItem}
            label="Shipping"
            value="Shipping"
          />
          <Picker.Item style={styles.pickerItem} label="Done" value="Done" />
        </Picker>

        <Picker
          selectedValue={wasPaidFilter}
          onValueChange={(itemValue) => {
            setWasPaidFilter(itemValue);
          }}
          style={styles.picker}
        >
          <Picker.Item style={styles.pickerItem} label="All" value={"All"} />
          <Picker.Item style={styles.pickerItem} label="Paid" value={"Paid"} />
          <Picker.Item
            style={styles.pickerItem}
            label="Unpaid"
            value={"Unpaid"}
          />
        </Picker>

        <View style={styles.pagination}>
          <Text style={styles.orderText}>Page</Text>
          <Ionicons
            name="chevron-back-outline"
            disabled={pageIndex == 0}
            size={20}
            onPress={() => setPageIndex(pageIndex - 1)}
            color={pageIndex == 0 ? Colors.SANDSTONE : Colors.CHOCOLATEBROWN}
          />
          <Text style={styles.orderText}>
            {pageIndex + 1} of {numberPage == 0 ? 1 : numberPage}
          </Text>
          <Ionicons
            name="chevron-forward"
            disabled={pageIndex == numberPage - 1}
            size={20}
            onPress={() => setPageIndex(pageIndex + 1)}
            color={
              pageIndex == numberPage - 1
                ? Colors.SANDSTONE
                : Colors.CHOCOLATEBROWN
            }
          />
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => {
            setOrderFilter("All");
            setPageIndex(0);
          }}
          style={[
            orderFilter == "All"
              ? styles.activeFilterBtn
              : styles.unActiveFilterBtn,
            { marginRight: 10, width: 50 },
          ]}
        >
          <Text
            style={
              orderFilter == "All"
                ? styles.activeFilterText
                : styles.unactiveFilterText
            }
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOrderFilter("Confirm");
            setPageIndex(0);
          }}
          style={[
            orderFilter == "Confirm"
              ? styles.activeFilterBtn
              : styles.unActiveFilterBtn,
            { marginRight: 10 },
          ]}
        >
          <Text
            style={
              orderFilter == "Confirm"
                ? styles.activeFilterText
                : styles.unactiveFilterText
            }
          >
            Cofirmed Order
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOrderFilter("UnConfirm");
            setPageIndex(0);
          }}
          style={
            orderFilter == "UnConfirm"
              ? styles.activeFilterBtn
              : styles.unActiveFilterBtn
          }
        >
          <Text
            style={
              orderFilter == "UnConfirm"
                ? styles.activeFilterText
                : styles.unactiveFilterText
            }
          >
            Uncofirmed Order
          </Text>
        </TouchableOpacity>
      </View>
      {order?.length > 0 ? (
        <FlatList
          data={order}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderCard item={item} />}
          keyExtractor={(item: any) => item._id}
        />
      ) : (
        <Text>Empty Order</Text>
      )}
    </View>
  );
};

export default StaffOrderManagement;

const styles = StyleSheet.create({
  searchLableContainer: {
    borderWidth: 1,
    backgroundColor: "black",
    borderRadius: 10,
  },
  searchLable: {
    fontFamily: "inter",
    color: Colors.IVORYWHITE,
    fontSize: 14,
    padding: 6,
    textAlign: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  filterContainer: {
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  activeFilterBtn: {
    backgroundColor: Colors.BURGUNDYRED,
    borderRadius: 10,
    width: 160,
  },
  activeFilterText: {
    color: Colors.IVORYWHITE,
    padding: 10,
    textAlign: "center",
    fontFamily: "inter",
    fontSize: 16,
  },
  unactiveFilterText: {
    color: Colors.CHOCOLATEBROWN,
    padding: 10,
    textAlign: "center",
    fontFamily: "inter",
    fontSize: 16,
  },
  unActiveFilterBtn: {
    color: Colors.CHOCOLATEBROWN,
    width: 160,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.CHOCOLATEBROWN,
  },
  container: {
    flex: 1,
    marginTop: 0,
    padding: 16,
  },
  orderText: {
    fontFamily: "inter",
    fontSize: 16,
    color: Colors.CHOCOLATEBROWN,
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  orderTitle: {
    fontFamily: "unna-bold",
    fontSize: 24,
    color: Colors.CHOCOLATEBROWN,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: 310,
    alignSelf: "center",
    padding: 0,
  },
  searchInputContainer: {
    backgroundColor: Colors.IVORYWHITE,
    height: 35,
    borderRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.CHOCOLATEBROWN,
  },
  searchInput: {
    fontFamily: "inter",
    fontSize: 14,
    color: Colors.CHOCOLATEBROWN,
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
});
