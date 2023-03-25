import {
  Button,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import getUrl from "../../utils/NetworkUtils";
import TargetPreview from "../../components/targetpreview/TargetPreview";
import Toast from "react-native-root-toast";
import QrCode from "../QrCode/QrCode";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableRipple } from "react-native-paper";

const SendPicture = ({ route, navigation }) => {
  const { picture } = route.params;
  const [competitorNumber, setCompetitorNumber] = useState();
  const [resultImageUrl, setResultImageUrl] = useState();
  const [impacts, setImpacts] = useState();
  const [isVisible, setIsVisible] = useState(false);

  if (resultImageUrl && impacts) {
    return (
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setIsVisible(true);
          }}
          style={{
            flex: 1,
          }}
        >
          <Image
            resizeMode={"cover"}
            style={{
              flex: 1,
            }}
            source={{ uri: resultImageUrl }}
          />
        </TouchableOpacity>

        <Modal animationType={"slide"} transparent={true} visible={isVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.8)",
            }}
          >
            <Image
              resizeMode={"contain"}
              style={{
                flex: 1,
                width: "100%",
              }}
              source={{ uri: resultImageUrl }}
            />
            <TouchableOpacity
              onPress={() => {
                setIsVisible(false);
              }}
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                gap: 5,
              }}
            >
              <Ionicons
                color={"#fff"}
                size={40}
                name={"close-circle-outline"}
              ></Ionicons>
            </TouchableOpacity>
          </View>
        </Modal>

        <TargetPreview impacts={impacts}></TargetPreview>
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
        resizeMode={"cover"}
        style={{
          flex: 1,
          borderColor: "rgba(255,255,255,0.7)",
        }}
        source={{ uri: "data:image/png;base64," + picture.base64 }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          width: "100%",
          bottom: 0,
          padding: 20,
          position: "absolute",
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 5,
            borderColor: "#fff",
            borderRadius: 50,

            height: 70,
            width: 70,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            console.log("send");
            fetch(`${getUrl()}/cible/uploadCible`, {
              method: "POST",
              body: picture.base64,
            })
              .then((res) => {
                const ok = res.ok;

                if (!ok) {
                  return res.text().then((text) => {
                    throw new Error(text);
                  });
                } else {
                  res.json().then(async (json) => {
                    setResultImageUrl("data:image/png;base64," + json.image);
                    setImpacts(json.impacts);
                  });
                }
              })
              .catch((err) => {
                Toast.show(err.message, {
                  duration: 2000,
                });
                navigation.goBack();
              });
          }}
        >
          <Ionicons color={"#fff"} size={30} name={"cloud-upload"}></Ionicons>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendPicture;
