import { StyleSheet, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
interface Props {
  setValueS: (v: string) => void;
}
const Search: React.FC<Props> = ({ setValueS }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    setValueS(search);
  }, [search, setValueS]);
  return (
    <View style={styles.container}>
      <TextInput onChangeText={(v) => setSearch(v)} placeholder="Search" />
      <AntDesign name="search1" size={20} color="#636e72" />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: Colors.IVORYWHITE,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
