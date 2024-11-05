import {
  Alert,
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import Input from "@components/ManagerStaffComponent/Input";
import useCreateAxios from "@hooks/axiosHook";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import HeaderCustomize from "@components/ManagerStaffComponent/HeaderCustomize";
import { Colors } from "@constants/Colors";

const UpdateStaff = () => {
  const { staffId } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile]: any = useState(null);
  const { createRequest } = useCreateAxios();
  const navigation = useNavigation();

  const fetchApiStaffByID = async () => {
    try {
      const res = await createRequest("get", `/staff/${staffId}`);

      if (res.status === 200) {
        const data: any = res.data;
        setName(data.staff_name);
        setPassword(data.password);
        setFullName(data.full_name);
        setAddress(data.address);
        setPhone(data.phone_number);
        setAvatar(data.staff_avatar);
        setEmail(data.email);
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchApiStaffByID();
    }, [])
  );

  const verifyPhoneNumber = (phone: string) => {
    const regex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
    return regex.test(phone);
  };

  const handleAddStaff = async () => {
    try {
      if (
        name === "" ||
        password === "" ||
        fullName === "" ||
        phone === "" ||
        address === ""
      ) {
        return Alert.alert("Warning", "Missing field");
      } else {
        if (!verifyPhoneNumber(phone)) {
          return Alert.alert("Warning", "Phone number is wrong!!!");
        } else if (password.length < 6) {
          return Alert.alert(
            "Warning",
            "Password must be minimun 6 charactor!!!"
          );
        }
      }
      if (file === null) {
        const res = await createRequest(
          "put",
          `/staff/${staffId}`,
          {
            staff_name: name,
            password: password,
            phone_number: phone,
            full_name: fullName,
            address: address,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (res.status === 201) {
          return router.push("/ManagementScreens/ManageStaff");
        }
        return Alert.alert("Update Fail");
      }

      const formData = new FormData();
      formData.append("staff_name", name);
      formData.append("password", password);
      formData.append("phone_number", phone);
      formData.append("full_name", fullName);
      formData.append("address", address);
      formData.append("file", {
        uri: avatar,
        name: "avatar.jpg",
        type: "image/jpeg",
      });
      console.log("form data: ", formData);
      //   const res = await createRequest("put", `/staff/${staffId}`, formData, {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   });
      const res = await axios.put(
        `http://10.0.2.2:8080/api/v1/staff/${staffId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 201) {
        return router.push("/ManagementScreens/ManageStaff");
      }
    } catch (error) {
      console.error(error);
      return Alert.alert("Errro Fail Cos FIle");
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result);
      setAvatar(result.assets[0].uri);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <HeaderCustomize title="Update Staff" />

      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => pickImage()}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Image
            style={{ width: 80, height: 80, borderRadius: 100 }}
            source={{
              uri:
                avatar !== ""
                  ? avatar
                  : "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/customerImages%2Fz5996646852783_53556339af7a8aa947ed5a54f19c2e9c.jpg?alt=media&token=691aef06-a818-4c50-bb80-0144cc1e1778",
            }}
          />
          <MaterialIcons
            style={{
              backgroundColor: "#dfe6e9",
              color: "#fff",
              borderRadius: 100,
              position: "absolute",
              padding: 5,
              bottom: 0,
              right: "40%",
            }}
            name="edit"
            size={24}
            color="black"
          />
        </TouchableOpacity>
        <Input
          defaultValue={name}
          setValueP={setName}
          placeholder="Enter name"
          label="Name"
        />
        <Input
          disable={true}
          defaultValue={email}
          setValueP={() => {}}
          placeholder="Enter email"
          label="Email"
        />
        <Input
          secure
          placeholder="Enter password"
          label="Password"
          defaultValue={"nfdjnaoinrefd"}
          setValueP={setPassword}
        />
        {/* <Input secure placeholder="Enter " label="Confirm password" setValueP={setConfirm}  /> */}
        <Input
          placeholder="Enter fullname"
          label="Full name"
          setValueP={setFullName}
          defaultValue={fullName}
        />
        <Input
          placeholder="Enter phone"
          label="Phone"
          setValueP={setPhone}
          defaultValue={phone}
        />
        <Input
          placeholder="Enter address"
          label="Address"
          setValueP={setAddress}
          defaultValue={address}
        />
      </View>
      <View>
        <Button
          onPress={() => handleAddStaff()}
          color={Colors.BURGUNDYRED}
          title="UPDATE"
        ></Button>
      </View>
    </View>
  );
};

export default UpdateStaff;
