import { Colors } from "@constants/Colors";
import { useEffect, useState } from "react";
import { View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
interface Props {
  setValueF: (v: string) => void;
}
export const Dropdown: React.FC<Props> = ({ setValueF }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValueF(value);
  }, [value, setValueF]);
  return (
    <View
      style={{
        backgroundColor: Colors.IVORYWHITE,
        margin: 10,
        borderRadius: 10,
      }}
    >
      <RNPickerSelect
        placeholder={{
          label: "Select filter...",
          value: null,
          color: "#9EA0A4",
        }}
        onValueChange={(value) => setValue(value)}
        items={[
          { label: "A-Z", value: "A-Z" },
          { label: "Z-A", value: "Z-A" },
        ]}
      />
    </View>
  );
};
