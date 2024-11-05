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
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import axios, { AxiosResponse } from "axios";
import useCreateAxios from "@hooks/axiosHook";
import { Colors } from "@constants/Colors";
import Feather from "@expo/vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Cake {
  cake_image: string;
  cake_name: string;
  cake_description: string;
  cake_type: string;
  cake_price: number;
  cake_quantity: number;
}
interface Topping {
  _id: string;
  topping_name: string;
}

const AddCake: React.FC = () => {
  const router = useRouter();
  const [cake, setCake] = useState<Cake>({
    cake_image: "",
    cake_name: "",
    cake_description: "",
    cake_type: "",
    cake_price: 0,
    cake_quantity: 0,
  });
  const [thisCakeToppings, setThisCakeToppings] = useState<Topping[]>([]);
  const [allToppings, setAllToppings] = useState<Topping[]>([]);
  const [selectedTopping, setSelectedTopping] = useState<string | null>(null);
  const { createRequest } = useCreateAxios();

  useFocusEffect(
    useCallback(() => {
      fetchAllTopping();
    }, [])
  );

  const fetchAllTopping = async () => {
    try {
      const response: AxiosResponse<Topping[]> = await createRequest(
        "post",
        "/toppings/pagination"
      );

      if (response && response.data) {
        const toppings = response.data;
        setAllToppings(toppings);
      } else {
        console.error("Invalid data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching toppings:", error);
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
      setCake((prevCake) => ({
        ...prevCake,
        cake_image: selectedImage.uri,
      }));
    }
  };

  const handleRemoveTopping = (toppingId: string) => {
    setThisCakeToppings((prevToppings) =>
      prevToppings.filter((topping) => topping._id !== toppingId)
    );
  };

  const handleAddCake = async () => {
    try {
      const formData = new FormData();
      formData.append("cake_name", cake.cake_name);
      formData.append("cake_description", cake.cake_description);
      formData.append("cake_type", cake.cake_type);
      formData.append("cake_price", String(cake.cake_price));
      formData.append("cake_quantity", String(cake.cake_quantity));

      if (cake.cake_image) {
        formData.append("file", {
          uri: cake.cake_image,
          name: "cake_image.jpg",
          type: "image/jpeg",
        });
      }

      thisCakeToppings.forEach((topping) => {
        formData.append("toppings", topping._id);
      });

      await axios.post(`http://10.0.2.2:8080/api/v1/cakes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Cake added successfully!");
      router.back();
    } catch (error) {
      console.error("Error adding cake:", error);
    }
  };

  const handleChange = (field: keyof Cake, value: string | number) => {
    setCake((prevCake) => ({ ...prevCake, [field]: value }));
  };

  const handleAddTopping = () => {
    if (selectedTopping) {
      const toppingToAdd = allToppings.find(
        (t) => t.topping_name === selectedTopping
      );
      if (toppingToAdd && !thisCakeToppings.includes(toppingToAdd)) {
        setThisCakeToppings((prev) => [...prev, toppingToAdd]);
        setSelectedTopping(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} color="black" />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {cake.cake_image ? (
            <Image source={{ uri: cake.cake_image }} style={styles.image} />
          ) : (
            <View style={styles.nullImage}></View>
          )}
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
                value={cake.cake_name}
                onChangeText={(text) => handleChange("cake_name", text)}
                placeholder="Cake Name"
              />
              <View style={styles.titleNameContainer}>
                <Text style={styles.titleName}>Name</Text>
              </View>
            </View>
            <View>
              <TextInput
                style={styles.inputType}
                value={cake.cake_type}
                onChangeText={(text) => handleChange("cake_type", text)}
                placeholder="Cake Type"
              />
              <View style={styles.titleNameContainer}>
                <Text style={styles.titleName}>Type</Text>
              </View>
            </View>
          </View>
          <View>
            <TextInput
              style={styles.input}
              value={cake.cake_description}
              multiline
              numberOfLines={4}
              onChangeText={(text) => handleChange("cake_description", text)}
              placeholder="Cake Description"
            />
            <View style={styles.titleDescriptionContainer}>
              <Text style={styles.titleName}>Description</Text>
            </View>
          </View>

          <View style={styles.inputPriceAndQuantity}>
            <View>
              <TextInput
                style={styles.inputPrice}
                value={String(cake.cake_price)}
                onChangeText={(text) => {
                  if (text.trim() === "") {
                    handleChange("cake_price", 0);
                  } else {
                    handleChange("cake_price", parseFloat(text));
                  }
                }}
                placeholder="Cake Price"
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
                value={String(cake.cake_quantity)}
                onChangeText={(text) => {
                  if (text.trim() === "") {
                    handleChange("cake_quantity", 0);
                  } else {
                    handleChange("cake_quantity", parseInt(text));
                  }
                }}
                placeholder="Cake Quantity"
                keyboardType="numeric"
              />
              <View style={styles.titleQuantityContainer}>
                <Text style={styles.titleName}>Quantity</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.thisToppingContainer}>
          <Text style={styles.titleName}>Current Toppings:</Text>
          <View style={styles.toppingItems}>
            {thisCakeToppings[0] && thisCakeToppings?.length > 0 ? (
              thisCakeToppings.map((topping) => (
                <View key={topping?._id} style={styles.toppingItemContainer}>
                  <Text style={styles.toppingItem}>
                    {topping?.topping_name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveTopping(topping?._id)}
                    style={styles.removeToppingButton}
                  >
                    <Text style={styles.removeToppingText}>x</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>No toppings added.</Text>
            )}
          </View>
        </View>

        <View style={styles.pickerToppingContainer}>
          <Picker
            selectedValue={selectedTopping}
            onValueChange={(itemValue) => setSelectedTopping(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a topping" value={null} />
            {allToppings
              .filter(
                (topping) =>
                  !thisCakeToppings.find((t) => t?._id === topping?._id)
              ) // Filter out existing toppings
              .map((topping) => (
                <Picker.Item
                  key={topping?._id}
                  label={topping?.topping_name}
                  value={topping?.topping_name}
                />
              ))}
          </Picker>
          {/* <Button title="Add Topping" onPress={handleAddTopping} /> */}
          <TouchableOpacity
            onPress={handleAddTopping}
            style={styles.addToppingContainer}
          >
            <Text>Add Topping</Text>
            <Ionicons
              name="add-circle-sharp"
              size={24}
              color={Colors.FOGGYGRAY}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={handleAddCake}
            style={styles.addButtonContainer}
          >
            <Text>Add Cake</Text>
            <FontAwesome
              name="plus-circle"
              size={30}
              color={Colors.CHOCOLATEBROWN}
            />
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
  nullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    backgroundColor: Colors.FOGGYGRAY,
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
  addButtonContainer: {
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
    top: 35,
    left: 20,
    zIndex: 1,
  },
  buttons: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default AddCake;
