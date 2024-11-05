import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useCreateAxios from "../../hooks/axiosHook";
import { Colors } from "@constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CustomerModal } from "@components/CustomerModal";
import { OrderDetailCardItem } from "@components/Order/OrderDetailCardItem";

export default function OrderDetail() {
  const { createRequest } = useCreateAxios();
  const { orderId, confirm } = useLocalSearchParams();
  const [data, setData] = useState<any>();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const fetchOrder = async () => {
    try {
      const respone: any = await createRequest("get", "/orders/" + orderId, {});
      console.log(respone.data);
      setData(respone.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);
  const wasPaidOrder = async () => {
    try {
      const respone: any = await createRequest("put", "/orders/wasPaidOrder/", {
        order_id: orderId,
      });
      console.log(respone.data);
      Alert.alert("Update Succesfully", "Update was paid successfully!");
      fetchOrder();
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const doneOrder = async () => {
    try {
      const respone: any = await createRequest("put", "/orders/status/", {
        order_id: orderId,
        status: "Done",
      });
      console.log(respone.data);
      Alert.alert("Update Succesfully", "Update Status:Done successfully!");
      fetchOrder();
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const acceptOrder = async () => {
    try {
      const acecept_respone: any = await createRequest(
        "put",
        "/orders/acceptOrder/",
        {
          order_id: orderId,
        }
      );
      console.log(acecept_respone.data);
      const changeStatus_respone: any = await createRequest(
        "put",
        "/orders/status/",
        {
          order_id: orderId,
          status: "Shipping",
        }
      );
      console.log(changeStatus_respone.data);
      Alert.alert("Accpet Succesfully", "Accept Order successfully!");
      fetchOrder();
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const orderDate = new Date(data?.order?.order_date);

  const hours = orderDate.getHours().toString().padStart(2, "0");
  const minutes = orderDate.getMinutes().toString().padStart(2, "0");
  const seconds = orderDate.getSeconds().toString().padStart(2, "0");
  const day = orderDate.getDate().toString().padStart(2, "0");
  const month = (orderDate.getMonth() + 1).toString().padStart(2, "0");
  const year = orderDate.getFullYear();

  const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  return (
    <View style={styles.container}>
      <View style={styles.orderDetailContent}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="arrow-back"
            onPress={() => router.back()}
            size={28}
            color={Colors.CHOCOLATEBROWN}
          />
          <Text style={styles.orderDetailTitle}>Order Detail</Text>
        </View>
        <Text style={styles.orderDetailCardTitle}>Order Information:</Text>
        <View style={styles.orderHeaderCard}>
          <View style={styles.flexContent}>
            <View style={styles.flexContent}>
              <Text style={styles.orderDetailLabel}>Customer: </Text>
              <Text style={styles.orderDetailText}>
                {data?.order?.cus_id?.full_name}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.showCusInfoBtn}
              >
                <Text style={styles.showCusInfoBtnText}>More Info</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.flexContent}>
              <Text style={styles.orderDetailLabel}>Order Date: </Text>
              <Text style={styles.orderDetailText}>{formattedDate}</Text>
            </View>
          </View>
          <View style={styles.flexContent}>
            <View style={styles.flexContent}>
              <Text style={styles.orderDetailLabel}>Total Price: </Text>
              <Text style={styles.orderDetailText}>
                $ {data?.order?.total_price}
              </Text>
            </View>
            <View style={styles.flexContent}>
              <Text style={styles.orderDetailLabel}> Was Paid: </Text>
              <Text style={styles.orderDetailText}>
                {data?.order?.was_paid ? "Yes" : "No"}
              </Text>
            </View>
            <View style={styles.flexContent}>
              <Text style={styles.orderDetailLabel}>Status: </Text>
              <Text style={styles.orderDetailText}>{data?.order?.status}</Text>
            </View>
          </View>
          <Text style={styles.orderDetailLabel}>Description:</Text>
          <Text style={styles.orderDetailText} ellipsizeMode="tail">
            {data?.order?.order_description}
          </Text>
        </View>
        <Text style={styles.orderDetailItemTitle}>Product Items: </Text>
        <FlatList
          data={data?.listOrderItem}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderDetailCardItem item={item} />}
          // keyExtractor={(item: any) => item.id}
        />
      </View>
      <View style={[styles.flexContent, styles.buttonContainer]}>
        <TouchableOpacity
          onPress={() => wasPaidOrder()}
          style={[
            styles.orderDetailButton,
            { backgroundColor: Colors.SANDSTONE },
            data?.order?.was_paid ? { opacity: 0.7 } : { opacity: 1 },
          ]}
          disabled={data?.order?.was_paid}
        >
          <Text style={[styles.orderDetailButtonText]}>Was Paid</Text>
        </TouchableOpacity>

        {data?.order?.status != "Pending" ? (
          <TouchableOpacity
            onPress={() => doneOrder()}
            style={[
              styles.orderDetailButton,
              data?.order?.status == "Done" ? { opacity: 0.7 } : { opacity: 1 },
            ]}
            disabled={data?.order?.status == "Done"}
          >
            <Text style={[styles.orderDetailButtonText]}>Done</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.orderDetailButton}
            onPress={() => acceptOrder()}
          >
            <Text style={styles.orderDetailButtonText}>Accept Order</Text>
          </TouchableOpacity>
        )}
      </View>
      <CustomerModal
        customer={data?.order?.cus_id}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  showCusInfoBtnText: {
    fontFamily: "inter",
    padding: 5,
    paddingTop: 1,
    paddingBottom: 1,
    fontSize: 16,
    color: Colors.CHOCOLATEBROWN,
  },
  showCusInfoBtn: {
    marginLeft: 10,
    backgroundColor: Colors.IVORYWHITE,
    borderRadius: 10,
  },
  orderDetailContent: {
    flex: 1,
    marginBottom: 30,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
  },
  orderDetailButton: {
    flex: 1,
    backgroundColor: Colors.BURGUNDYRED,
  },
  orderDetailButtonText: {
    fontFamily: "inter",
    fontSize: 16,
    padding: 10,
    textAlign: "center",
    color: Colors.IVORYWHITE,
  },
  orderHeaderCard: {
    backgroundColor: Colors.BURGUNDYRED,
    borderRadius: 10,
    padding: 15,
  },
  flexContent: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  orderDetailItemTitle: {
    fontFamily: "unna-bold",
    fontSize: 22,
    color: Colors.CHOCOLATEBROWN,
    marginTop: 10,
  },
  orderDetailCardTitle: {
    fontFamily: "unna-bold",
    fontSize: 22,
    color: Colors.CHOCOLATEBROWN,
    marginBottom: 5,
  },
  orderDetailLabel: {
    fontFamily: "inter-bold",
    fontSize: 14,
    color: Colors.IVORYWHITE,
  },
  orderDetailText: {
    fontFamily: "inter",
    fontSize: 14,
    color: Colors.IVORYWHITE,
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 5,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  orderDetailTitle: {
    fontFamily: "unna-bold",
    fontSize: 26,
    color: Colors.CHOCOLATEBROWN,
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
  },
});
