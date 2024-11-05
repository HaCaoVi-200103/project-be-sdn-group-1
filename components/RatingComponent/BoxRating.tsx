import { View, StyleSheet, Image, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import BoxStar from "./BoxStar";
import useCreateAxios from "@hooks/axiosHook";
import Model from "@components/Model";
interface Props {
  image: string;
  name: string;
  cakeId: string;
}

const BoxRating: React.FC<Props> = ({ image, name, cakeId }) => {
  const [comment, setComment] = useState("");
  const [star, setStar] = useState(0);
  const { createRequest } = useCreateAxios();
  const [activeModal, setActiveModal] = useState(false);

  const handleSubmitRating = async () => {
    try {
      const data = {
        cakeId: cakeId,
        rating_value: star,
        rating_comment: comment,
        user_id: "6720a5a2588e2bd477bfd1a3",
      };
      const res = await createRequest("post", "/rating", data);
      if (res.status === 200) {
        setActiveModal(!activeModal);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Model
        setActive={setActiveModal}
        active={activeModal}
        content="Review successfull"
      />
      <View style={styles.boxHeader}>
        <Image style={styles.imageHeader} source={{ uri: image }} />
        <Text style={styles.titleHeader}>{name}</Text>
      </View>
      <View style={styles.boxMain}>
        <View>
          <Text>Product Reviews</Text>
        </View>
      </View>
      <View>
        <BoxStar setStar={setStar} star={star} />
      </View>
      <View style={styles.boxTextArea}>
        <TextInput
          placeholder="Comment"
          style={styles.textArea}
          numberOfLines={6}
          multiline={true}
          onChangeText={(v) => setComment(v)}
        />
      </View>
      <View style={styles.button}>
        <Button
          onPress={() => handleSubmitRating()}
          color={"#CE5351"}
          title="Send"
        ></Button>
      </View>
    </View>
  );
};

export default BoxRating;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  boxHeader: {
    flexDirection: "row",
    gap: 10,
    borderBottomColor: "#95a5a6",
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  imageHeader: {
    width: 50,
    height: 50,
    resizeMode: "stretch",
    borderRadius: 5,
  },
  titleHeader: {
    fontSize: 20,
  },
  boxMain: {
    marginVertical: 5,
  },
  textArea: {
    marginVertical: 5,
    textAlignVertical: "top",
  },
  boxTextArea: {
    marginVertical: 5,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 5,
    height: 100,
  },
  button: {
    marginVertical: 5,
    width: 100,
    alignSelf: "flex-end",
  },
});
