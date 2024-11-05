import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
interface Props {
  star: number;
  setStar: (value: number) => void;
}
const BoxStar: React.FC<Props> = ({ star, setStar }) => {
  return (
    <View style={styles.starBox}>
      {[...Array(5)].map((__, index) => (
        <>
          <AntDesign
            key={index + 1}
            onPress={() => setStar(index + 1)}
            style={[styles.iconStar, star > index && styles.activeStar]}
            name="star"
            size={24}
          />
        </>
      ))}
    </View>
  );
};

export default BoxStar;

const styles = StyleSheet.create({
  starBox: {
    marginVertical: 5,
    flexDirection: "row",
    gap: 10,
  },
  iconStar: {
    fontSize: 35,
    color: "#bdc3c7",
  },
  activeStar: {
    color: "#f39c12",
  },
});
