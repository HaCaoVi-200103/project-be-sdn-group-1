import { Colors } from "@constants/Colors";
import { Image, StyleSheet, Text, View } from "react-native";

export const OrderDetailCardItem: React.FC<{ item: any }> = ({ item }) => {
  return (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.orderDetailCardItemTitle}>
          {item?.cake?.cake_name}
        </Text>
        {item?.cake?.cake_image && (
          <Image
            style={styles.itemImage}
            source={{ uri: item.cake.cake_image }}
          />
        )}
        <View style={styles.flexContent}>
          <View style={styles.flexContent}>
            <Text style={styles.orderDetailCardItemLable}>Quantity: </Text>
            <Text style={styles.orderDetailCardItemText}>
              {item.cio_quantity}
            </Text>
          </View>
          <View style={styles.flexContent}>
            <Text style={styles.orderDetailCardItemLable}>Price: </Text>
            <Text style={styles.orderDetailCardItemText}>
              ${item.cio_price}
            </Text>
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.orderDetailCardItemTitle}>Toppings</Text>
        {item?.toppings?.map((topping: any, index: any) => (
          <View key={index}>
            <Text style={styles.orderDetailCardItemLable}>
              {topping?.topping?.topping_name}
            </Text>
            <View style={styles.flexContent}>
              <View style={[styles.flexContent, { marginRight: 10 }]}>
                <Text
                  style={[styles.orderDetailCardItemLable, styles.toppingItem]}
                >
                  Quantity:
                </Text>
                <Text
                  style={[styles.orderDetailCardItemText, styles.toppingItem]}
                >
                  {topping?.toppingCake.tc_quantity}
                </Text>
              </View>
              <View style={styles.flexContent}>
                <Text
                  style={[styles.orderDetailCardItemLable, styles.toppingItem]}
                >
                  Price:
                </Text>
                <Text
                  style={[styles.orderDetailCardItemText, styles.toppingItem]}
                >
                  ${topping?.toppingCake.tc_price}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: Colors.FOGGYGRAY,
    borderRadius: 8,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  orderDetailCardItemTitle: {
    textAlign: "center",
    fontFamily: "unna-bold",
    fontSize: 20,
    marginBottom: 5,
    color: Colors.CHOCOLATEBROWN,
  },
  flexContent: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  orderDetailCardItemLable: {
    fontFamily: "inter-bold",
    fontSize: 16,
    color: Colors.CHOCOLATEBROWN,
  },
  orderDetailCardItemText: {
    fontFamily: "inter",
    fontSize: 16,
    color: Colors.CHOCOLATEBROWN,
  },
  toppingItem: {
    fontSize: 14,
  },
  itemImage: {
    width: 200,
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
});
