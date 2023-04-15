import {
  ActivityIndicator,
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
import * as ScreenOrientation from "expo-screen-orientation";
import { TouchableRipple } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

const Tab = createMaterialTopTabNavigator();

const SendPicture = ({ route, navigation }) => {
  const { picture } = route.params;
  const [competitorNumber, setCompetitorNumber] = useState();
  const [resultImageUrl, setResultImageUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [impacts, setImpacts] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  ScreenOrientation.addOrientationChangeListener((event) => {
    console.log(event.orientationInfo.orientation);
    if (
      event.orientationInfo.orientation ===
        ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      event.orientationInfo.orientation ===
        ScreenOrientation.Orientation.LANDSCAPE_RIGHT
    ) {
      setIsLandscape(true);
    } else {
      setIsLandscape(false);
    }
  });

  const sendPicture = () => {
    if (isLoading) return;
    setIsLoading(true);
    fetch(`${getUrl()}/cible/uploadCible`, {
      method: "POST",
      body: picture.base64,
    })
      .then((res) => {
        setIsLoading(false);
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
        setIsLoading(false);
        Toast.show(err.message, {
          duration: 2000,
        });
        navigation.goBack();
      });
  };

  function ResultatPreview({ navigation }) {
    navigation.setOptions({
      swipeEnabled: false,
    });
    return (
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        <TargetPreview impacts={impacts}></TargetPreview>
      </View>
    );
  }
  function PhotoPreview({ navigation }) {
    navigation.setOptions({
      swipeEnabled: false,
    });
    return (
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
          backgroundColor: "black",
        }}
      >
        <ReactNativeZoomableView maxZoom={4}>
          <Image
            resizeMode={"contain"}
            style={{
              height: "100%",
              width: "100%",
              flex: 1,
            }}
            source={{ uri: resultImageUrl }}
          />
        </ReactNativeZoomableView>
      </View>
    );
  }

  if (resultImageUrl && impacts) {
    return (
      <Tab.Navigator>
        <Tab.Screen name={"Résultat"} component={ResultatPreview}></Tab.Screen>
        <Tab.Screen name={"Photo"} component={PhotoPreview}></Tab.Screen>
      </Tab.Navigator>
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
          onPress={sendPicture}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <Ionicons color={"#fff"} size={30} name={"cloud-upload"}></Ionicons>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendPicture;
