import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@constants/Colors";

interface Props {
  nameIcon: any;
  colorIcon: string;
  backgoundColor: string;
  onPress: () => void;
}
const Button: React.FC<Props> = ({
  colorIcon,
  nameIcon,
  backgoundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[styles.boxAddStaff, { backgroundColor: backgoundColor }]}
    >
      <Ionicons name={nameIcon} size={24} color={colorIcon} />
      <Text style={styles.text}>Add Staff</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  boxAddStaff: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: Colors.BURGUNDYRED,
  },
  text: {
    color: Colors.IVORYWHITE,
    fontWeight: "500",
  },
});
