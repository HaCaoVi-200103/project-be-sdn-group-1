import { View } from "react-native";
import React, { useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { getStore } from "utils/AsyncStore";
import useCreateAxios from "@hooks/axiosHook";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { addProfile } from "@redux/features/profile";
import Home from "@app/(customerTabs)/Home";

const Index = () => {
  const { createRequest } = useCreateAxios();
  const dispatch = useAppDispatch();
  const profile: any = useAppSelector((state) => state.profile.profile);

  const addProfileRedux = async () => {
    try {
      const role = await getStore("role");

      if (role.length !== 0) {
        const res = await createRequest("get", "/auth/user");
        if (res.status === 200) {
          const resp: any = res.data;
          const data = {
            _id: resp._id,
            address: resp.address,
            email: resp.email,
            full_name: resp.full_name,
            google_id: resp.google_id,
            phone_number: resp.phone_number,
            user_avatar: resp.user_avatar,
            user_name: resp.user_name,
            role: role,
          };

          dispatch(addProfile(data));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getToken = async () => {
    const token = await getStore("token");
    const flat = token.length === 0 ? false : true;
    // await removeStore("token");
    if (flat) {
      addProfileRedux();
    }
  };

  useFocusEffect(
    useCallback(() => {
      getToken().catch((error) => null);
    }, [])
  );

  if (profile.role === "customer") {
    return router.push("/Home");
  } else if (profile.role === "staff") {
    return router.push("/StaffOrderManagement");
  } else if (profile.role === "manager") {
    return router.push("/Managements");
  }
  return (
    <View>
      <Home />
    </View>
  );
};

export default Index;
