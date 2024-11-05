import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Input from "./Input";
import useCreateAxios from "@hooks/axiosHook";
import { Colors } from "@constants/Colors";
interface Props {
  active: boolean;
  setActive: (v: boolean) => void;
  refetch: () => void;
}
const Model: React.FC<Props> = ({ active, setActive, refetch }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const { createRequest } = useCreateAxios();

  const verifyPhoneNumber = (phone: string) => {
    const regex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;
    return regex.test(phone);
  };

  const fetchApiAddStaff = async (data: {}) => {
    try {
      const res = await createRequest("post", "/staff", data);
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const handleAddStaff = async () => {
    try {
      if (
        email === "" ||
        name === "" ||
        password === "" ||
        fullName === "" ||
        phone === "" ||
        address === ""
      ) {
        return Alert.alert("Warning", "Missing field");
      } else {
        if (!email.endsWith("@gmail.com")) {
          return Alert.alert("Warning", "Email must be end is @gmail.com");
        } else if (!verifyPhoneNumber(phone)) {
          return Alert.alert("Warning", "Phone number is wrong!!!");
        } else if (password.length < 6) {
          return Alert.alert(
            "Warning",
            "Password must be minimun 6 charactor!!!"
          );
        } else if (password !== confirm) {
          return Alert.alert(
            "Warning",
            "Password and confirm password not correct!!!"
          );
        }
      }
      const data = {
        staff_name: name,
        password: password,
        phone_number: phone,
        email: email,
        full_name: fullName,
        address: address,
      };
      const res = await fetchApiAddStaff(data);

      if (res?.status === 200) {
        setActive(!active);
        refetch();
        return Alert.alert("Success", "Add Staff Successfull");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={active}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setActive(!active);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Add Staff</Text>
              <View>
                <Input
                  setValueP={setName}
                  placeholder="Enter name"
                  label="Name"
                />
                <Input
                  setValueP={setEmail}
                  placeholder="Enter email"
                  label="Email"
                />
                <Input
                  secure
                  placeholder="Enter password"
                  label="Password"
                  setValueP={setPassword}
                />
                <Input
                  secure
                  placeholder="Enter confirm password"
                  label="Confirm password"
                  setValueP={setConfirm}
                />
                <Input
                  placeholder="Enter fullname"
                  label="Full name"
                  setValueP={setFullName}
                />
                <Input
                  placeholder="Enter phone"
                  label="Phone"
                  setValueP={setPhone}
                />
                <Input
                  placeholder="Enter address"
                  label="Address"
                  setValueP={setAddress}
                />
              </View>
              <View style={styles.boxButton}>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: Colors.CHOCOLATEBROWN },
                  ]}
                  onPress={() => setActive(!active)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: Colors.BURGUNDYRED },
                  ]}
                  onPress={() => handleAddStaff()}
                >
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    width: "50%",
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
  },
  boxButton: {
    flexDirection: "row",
    gap: 10,
  },
});

export default Model;
