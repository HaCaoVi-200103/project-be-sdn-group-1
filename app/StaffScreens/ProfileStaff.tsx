import { SafeAreaView } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import useCreateAxios from "@hooks/axiosHook";
import BoxProfile from "./Box";
import { useAppSelector } from "@hooks/reduxHooks";
// const staffId = "6724a907f14e21cced1f60af";

const ProfileStaff = () => {
  const profile: any = useAppSelector((state) => state.profile.profile);
  const staffId = profile._id;
  const navigation = useNavigation();
  const { createRequest } = useCreateAxios();
  const [data, setData]: any = useState(null);
  const fetchApiCustomerfByID = async () => {
    try {
      const res = await createRequest("get", `/staff/${staffId}`);
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchApiCustomerfByID();
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
      <BoxProfile
        avatar={
          data
            ? data.staff_avatar
            : "https://firebasestorage.googleapis.com/v0/b/sweetbites-28804.appspot.com/o/customerImages%2Fz5996646852783_53556339af7a8aa947ed5a54f19c2e9c.jpg?alt=media&token=691aef06-a818-4c50-bb80-0144cc1e1778"
        }
        email={data ? data.email : ""}
        fullName={data ? data.full_name : ""}
      />
    </SafeAreaView>
  );
};

export default ProfileStaff;
