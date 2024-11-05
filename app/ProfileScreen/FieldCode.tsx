import useCreateAxios from "@hooks/axiosHook";
import { useAppSelector } from "@hooks/reduxHooks";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Image,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
});

const CELL_COUNT = 6;
// const id = "6720a5a2588e2bd477bfd1a3";
const FieldCode = () => {
  const profile: any = useAppSelector((state) => state.profile.profile);
  const id = profile._id;
  const [value, setValue] = useState("");
  const [code, setCode] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const navigation = useNavigation();
  const { newPass } = useLocalSearchParams();
  const { createRequest } = useCreateAxios();

  const callApiSendCode = async () => {
    try {
      const res = await createRequest("post", "/profile/send-code", {
        id: id,
      });
      if (res.status === 200) {
        setCode(res.data?.code);
      }
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      callApiSendCode();
    }, [])
  );

  const callApiChangePassword = async () => {
    try {
      const res = await createRequest("post", "/profile/change-password", {
        id: id,
        password: newPass,
      });
      return res;
    } catch (error) {
      console.error(error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const verifyCode = async () => {
    try {
      if (value.length === 6) {
        if (value === code) {
          const res = await callApiChangePassword();
          if (res?.status === 201) {
            Alert.alert("Change password successfully");
            setCode("");
            setValue("");
            return router.push("/ProfileScreen");
          }
          return Alert.alert("Status code is " + res?.status);
        } else {
          Alert.alert("Code wrong!!!");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    verifyCode();
  }, [value]);

  return (
    <SafeAreaView style={styles.root}>
      <View>
        <Image
          style={{ width: "100%", height: 250, resizeMode: "stretch" }}
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM46-MVMpd6n65IVQDU7C4h_jGZpruIDQlPg&s",
          }}
        />
      </View>
      <View style={{ padding: 20 }}>
        <Text style={[styles.title, { fontWeight: "500", marginTop: 20 }]}>
          Email Code
        </Text>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={"one-time-code"}
          testID="my-code-input"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 20,
        }}
        onPress={() => callApiSendCode()}
      >
        <Text style={{ color: "#2980b9" }}>Resend ?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FieldCode;
