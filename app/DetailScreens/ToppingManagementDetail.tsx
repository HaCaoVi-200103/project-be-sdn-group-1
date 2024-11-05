import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios, { AxiosResponse } from "axios";
import useCreateAxios from "@hooks/axiosHook";
import { Colors } from "@constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Topping {
  _id: string;
  topping_image: string;
  topping_name: string;
  topping_description: string;
  topping_price: number;
  topping_quantity: number;
}

const ToppingDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [Topping, setTopping] = useState<Topping | null>(null);
  const { createRequest } = useCreateAxios();

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchToppingDetail();
      }
    }, [id])
  );

  const fetchToppingDetail = async () => {
    try {
      const response: AxiosResponse<{ topping: Topping }> = await createRequest(
        "get",
        `/toppings/${id}`
      );

      if (response && response.data) {
        console.log("data: ", response.data);

        const topping = response.data;

        setTopping(topping);
        console.log(topping);
      } else {
        console.error("Invalid data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching Topping details:", error);
    }
  };

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      const selectedImage = pickerResult.assets[0];
      setTopping((prevTopping) =>
        prevTopping
          ? { ...prevTopping, topping_image: selectedImage.uri }
          : null
      );
    }
  };

  const handleUpdate = async () => {
    if (!Topping) return;

    try {
      const formData = new FormData();
      formData.append("topping_name", Topping.topping_name);
      formData.append("topping_description", Topping.topping_description);
      formData.append("topping_price", String(Topping.topping_price));
      formData.append("topping_quantity", String(Topping.topping_quantity));

      if (Topping.topping_image && typeof Topping.topping_image === "string") {
        formData.append("file", {
          uri: Topping.topping_image,
          name: "topping_image.jpg",
          type: "image/jpeg",
        });
      }

      console.log("Check: ", formData);

      await axios.put(`http://10.0.2.2:8080/api/v1/toppings/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // await createRequest("put", `/Toppings/${id}`, formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      alert("Topping updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating Topping:", error);
    }
  };

  const handleDelete = async () => {
    if (!Topping) return;

    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this Topping?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            await axios.delete(`http://10.0.2.2:8080/api/v1/toppings/${id}`, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            router.back();
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleChange = (field: keyof Topping, value: string | number) => {
    setTopping((prevTopping) =>
      prevTopping ? { ...prevTopping, [field]: value } : null
    );
  };

  if (!Topping) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image source={{ uri: Topping.topping_image }} style={styles.image} />
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImageUpload}
          >
            <Feather name="upload" size={100} color={Colors.CHOCOLATEBROWN} />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputNameAndType}>
            <View>
              <TextInput
                style={styles.inputName}
                value={Topping.topping_name}
                onChangeText={(text) => handleChange("topping_name", text)}
                placeholder="Topping Name"
              />
              <View style={styles.titleNameContainer}>
                <Text style={styles.titleName}>Name</Text>
              </View>
            </View>
          </View>
          <View>
            <TextInput
              style={styles.input}
              value={Topping.topping_description}
              multiline
              numberOfLines={4}
              onChangeText={(text) => handleChange("topping_description", text)}
              placeholder="Topping Description"
            />
            <View style={styles.titleDescriptionContainer}>
              <Text style={styles.titleName}>Description</Text>
            </View>
          </View>

          <View style={styles.inputPriceAndQuantity}>
            <View>
              <TextInput
                style={styles.inputPrice}
                value={String(Topping.topping_price)}
                onChangeText={(text) => {
                  if (text.trim() === "") {
                    handleChange("topping_price", 0);
                  } else {
                    handleChange("topping_price", parseFloat(text));
                  }
                }}
                placeholder="Topping Price"
                keyboardType="numeric"
              />
              <View style={styles.titleNameContainer}>
                <Text style={styles.titleName}>Price</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.titleName}>$</Text>
              </View>
            </View>
            <View>
              <TextInput
                style={styles.inputQuantity}
                value={String(Topping.topping_quantity)}
                onChangeText={(text) => {
                  if (text.trim() === "") {
                    handleChange("topping_quantity", 0);
                  } else {
                    handleChange("topping_quantity", parseInt(text));
                  }
                }}
                placeholder="Topping Quantity"
                keyboardType="numeric"
              />
              <View style={styles.titleQuantityContainer}>
                <Text style={styles.titleName}>Quantity</Text>
              </View>
            </View>
          </View>
        </View>

        {/* <Button title="Update Topping" onPress={handleUpdate} /> */}
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={handleUpdate}
            style={styles.editToppingContainer}
          >
            <Text>Edit Topping</Text>
            <FontAwesome name="edit" size={30} color={Colors.CHOCOLATEBROWN} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteToppingContainer}
          >
            <Text>Delete Topping</Text>
            <Ionicons name="trash" size={30} color={Colors.CHOCOLATEBROWN} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.IVORYWHITE,
    flex: 1,
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 20,
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
  uploadButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
  },
  inputContainer: {
    padding: 20,
  },
  input: {
    borderColor: Colors.SANDSTONE,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    position: "relative",
  },
  inputQuantity: {
    width: 120,
    borderColor: Colors.SANDSTONE,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    position: "relative",
  },
  inputPrice: {
    borderColor: Colors.SANDSTONE,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 27,
    marginVertical: 10,
    fontSize: 16,
    position: "relative",
  },
  inputNameAndType: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputPriceAndQuantity: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputName: {
    width: 200,
    borderColor: Colors.SANDSTONE,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    position: "relative",
  },
  titleNameContainer: {
    position: "absolute",
    backgroundColor: Colors.IVORYWHITE,
    left: 10,
    top: -5,
    width: 60,
  },
  titleQuantityContainer: {
    position: "absolute",
    backgroundColor: Colors.IVORYWHITE,
    left: 10,
    top: -5,
    width: 90,
  },
  titleDescriptionContainer: {
    position: "absolute",
    backgroundColor: Colors.IVORYWHITE,
    left: 10,
    top: -5,
    width: 120,
  },
  priceContainer: {
    position: "absolute",
    backgroundColor: Colors.IVORYWHITE,
    left: 13,
    top: 19,
    width: 10,
  },
  titleName: {
    fontSize: 20,
    textAlign: "center",
    fontFamily: "inter-medium",
    color: Colors.CHOCOLATEBROWN,
  },
  inputType: {
    width: 130,
    borderColor: Colors.SANDSTONE,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    position: "relative",
  },
  thisToppingContainer: {
    marginHorizontal: 50,
  },
  toppingItem: {
    fontSize: 16,
    marginVertical: 2,
  },
  picker: {
    height: 50,
    width: "70%",
    marginBottom: 10,
  },
  toppingItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  toppingItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 7,
  },
  removeToppingButton: {
    marginLeft: 3,
    backgroundColor: Colors.CHOCOLATEBROWN,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
  },
  removeToppingText: {
    color: Colors.IVORYWHITE,
    fontWeight: "bold",
  },
  pickerToppingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginHorizontal: 10,
  },
  addToppingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.SANDSTONE,
    borderRadius: 20,
    width: "30%",
  },
  editToppingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.FOGGYGRAY,
    borderRadius: 10,
    width: "30%",
    height: 50,
    borderWidth: 1,
    borderColor: Colors.CHOCOLATEBROWN,
  },
  deleteToppingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.BRICKRED,
    borderRadius: 10,
    width: "35%",
    height: 50,
    borderWidth: 1,
    borderColor: Colors.CHOCOLATEBROWN,
  },
  backIcon: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 1,
  },
  buttons: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default ToppingDetail;
