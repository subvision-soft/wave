import { Text } from "react-native-paper";
import { Image, View } from "react-native";
import { useEffect } from "react";

const SendPicture = ({ route, navigation }) => {
  const { picture } = route.params;
  useEffect(() => {
    console.log(picture);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
      }}
    >
      <Image
        resizeMode={"contain"}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "blue",
        }}
        source={{ uri: "data:image/png;base64," + picture.base64 }}
      />
    </View>
  );
};

export default SendPicture;
