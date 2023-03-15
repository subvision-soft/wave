import { Text } from "react-native-paper";
import { Button, Image, TextInput, View } from "react-native";
import { useEffect, useState } from "react";

var BASE64_MARKER = ";base64,";

const SendPicture = ({ route, navigation }) => {
  const { picture } = route.params;
  const [competitorNumber, setCompetitorNumber] = useState();
  const [resultImageUrl, setResultImageUrl] = useState();

  if (resultImageUrl) {
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
            borderWidth: 5,
            borderColor: "rgba(255,255,255,0.7)",
          }}
          source={{ uri: resultImageUrl }}
        />
      </View>
    );
  }

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
          borderWidth: 5,
          borderColor: "rgba(255,255,255,0.7)",
        }}
        source={{ uri: "data:image/png;base64," + picture.base64 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <TextInput
          keyboardType={"numeric"}
          placeholder={"Numéro de compétiteur"}
          value={competitorNumber}
          onChangeText={(text) => {
            setCompetitorNumber(text.replace(/[^0-9]/g, ""));
          }}
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            borderRadius: 10,
            flex: 1,
            padding: 10,
          }}
        ></TextInput>
        <Button
          onPress={() => {
            console.log("send");
            fetch(`http://192.168.1.42:8080/api/cible/uploadCible`, {
              method: "POST",
              body: picture.base64,
            }).then((res) => {
              const ok = res.ok;
              res.text().then(async (json) => {
                if (ok) {
                  setResultImageUrl("data:image/jpeg;base64," + json);
                  console.log(json);
                } else {
                  console.log("error");
                }
              });
            });
          }}
          disabled={!competitorNumber}
          title={"Envoyer"}
        ></Button>
      </View>
    </View>
  );
};

export default SendPicture;
