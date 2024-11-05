import { View, StyleSheet, SafeAreaView } from "react-native";
import React, { useCallback, useState } from "react";
import BoxRating from "@components/RatingComponent/BoxRating";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { RouteProp, useRoute } from "@react-navigation/native";
interface DataRating {
  name: string;
  image: string;
  _id: string;
}

// type ScreenBRouteParams = {
//   userId: string;
// };
const Rating = () => {
  // const route = useRoute<RouteProp<{ params: ScreenBRouteParams }, "params">>();
  // const { userId } = route.params;
  const [data, setData] = useState<DataRating[]>([
    {
      image:
        "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/CakeImages%2F1730216983226_logo.jpeg?alt=media&token=dedfe536-9af7-4489-a6c0-426a51411968",
      name: "Chocolate",
      _id: "672104199c2303f77b4117d8",
    },
  ]);

  const getDataStore = async () => {
    try {
      const list = await AsyncStorage.getItem("dataToRating");
      if (!list) {
        // setData([]);
      } else {
        const parse = JSON.parse(list);
        setData(parse);

        await AsyncStorage.removeItem("dataToRating");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getDataStore();
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {data.length > 0 &&
          data.map((item, index) => (
            <>
              <BoxRating
                cakeId={item._id}
                key={index}
                name={item.name}
                image={item.image}
              />
            </>
          ))}
      </View>
    </SafeAreaView>
  );
};

export default Rating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
