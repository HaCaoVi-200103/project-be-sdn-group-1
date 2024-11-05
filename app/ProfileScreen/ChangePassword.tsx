import { Alert, Button, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import HeaderCustomize from "@components/ManagerStaffComponent/HeaderCustomize";
import Input from "@components/ManagerStaffComponent/Input";
import { Colors } from "@constants/Colors";
import { router } from "expo-router";
import useCreateAxios from "@hooks/axiosHook";
import axios from "axios";
import { useAppSelector } from "@hooks/reduxHooks";
// const id = "6720a5a2588e2bd477bfd1a3";

const ChangePassword = () => {
  const profile: any = useAppSelector((state) => state.profile.profile);
  const id = profile._id;
  const navigation = useNavigation();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSendEmailCode = async () => {
    if (oldPass === "" || newPass === "" || confirm === "") {
      return Alert.alert("Missing required field!!!");
    }

    if (newPass !== confirm) {
      return Alert.alert("Password does not match password confirmation");
    }

    const res = await axios.post(
      "http://10.0.2.2:8080/api/v1/profile/check-password",
      {
        userId: id,
        password: oldPass,
      }
    );
    if (res.status === 200) {
      if (res.data) {
        return router.push({
          pathname: "/ProfileScreen/FieldCode",
          params: { newPass: newPass },
        });
      }
      return Alert.alert("Old Password is incorrect!!!");
    }

    return Alert.alert("Old Password is incorrect!!!");
  };

  return (
    <View>
      <HeaderCustomize title="Change Password" />
      <View>
        <View>
          <Input
            secure
            setValueP={setOldPass}
            placeholder="Enter old password"
            label="Old password"
          />
          <Input
            secure
            placeholder="New password"
            label="Enter new password"
            setValueP={setNewPass}
          />
          <Input
            secure
            placeholder="Enter confirm password"
            setValueP={setConfirm}
            label="Confirm"
          />
        </View>
        <View>
          <Button
            onPress={() => handleSendEmailCode()}
            color={Colors.BURGUNDYRED}
            title="UPDATE"
          ></Button>
        </View>
      </View>
    </View>
  );
};

export default ChangePassword;
