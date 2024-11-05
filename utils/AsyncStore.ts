import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";

export const getStore = async (name: string) => {
  try {
    const list = await AsyncStorage.getItem(name);
    if (list) {
      const parse = JSON.parse(list);
      return parse;
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const removeStore = async (name: string) => {
  await AsyncStorage.removeItem(name);
  return true;
};


export const setStore = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};


export const logout = async () => {
  GoogleSignin.signOut();
  await removeStore("token");
  await removeStore("role")
  return router.push("/");
};



