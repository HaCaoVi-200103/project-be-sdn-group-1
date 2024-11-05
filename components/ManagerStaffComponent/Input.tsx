import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@constants/Colors";
interface Props {
  placeholder: string;
  setValueP: (v: string) => void;
  secure?: boolean;
  defaultValue?: string;
  label?: string;
  disable?: boolean;
}
const Input: React.FC<Props> = ({
  placeholder,
  setValueP,
  secure,
  defaultValue,
  label,
  disable,
}) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValueP(value);
  }, [value]);
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.label}>
        <Text>{label}</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          editable={!disable ? true : false}
          secureTextEntry={secure}
          style={styles.input}
          onChangeText={(v) => setValue(v)}
          placeholder={placeholder}
          value={defaultValue}
        />
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.IVORYWHITE,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
  },
  input: {
    width: "100%",
  },
  label: {
    paddingHorizontal: 10,
  },
});
