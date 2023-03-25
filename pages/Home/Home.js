import {
  View,
  Text,
  Image,
  Button,
  Modal,
  TouchableOpacity,
  Touchable,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StyleSheet,
  ImageBackground,
} from "react-native";
import logo from "../../assets/logo_l_white.png";
import Card from "../../components/Card/Card";
import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import PopupDialog from "react-native-popup-dialog";
import { DialogButton, DialogContent } from "react-native-popup-dialog/src";
import QrCode from "../QrCode/QrCode";
import MaterialCommunityIcon from "react-native-paper/src/components/MaterialCommunityIcon";
import getUrl from "../../utils/NetworkUtils";

import background from "../../assets/background.png";

const Home = function ({ navigation }) {
  const [adress, setAdress] = useState(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const isFocused = useIsFocused();
  const popupDialog = useRef(null);

  navigation.setOptions({
    headerShown: false,
  });

  useEffect(() => {
    setAdress(global.adress);
  }, [isFocused]);

  useEffect(() => {
    setAdress(global.adress);
  }, []);

  useEffect(() => {
    // navigation.setOptions({
    //   headerShown: !isVisible,
    // });
  }, [isVisible]);

  return (
    <ImageBackground
      resizeMode={"cover"}
      source={background}
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
        padding: 10,
      }}
    >
      <Modal animationType={"slide"} transparent={true} visible={isVisible}>
        <View style={styles.container}>
          <QrCode
            onScan={() => {
              setAdress(global.adress);
              setIsVisible(false);
            }}
          />
        </View>
      </Modal>
      <Image
        source={logo}
        resizeMode={"contain"}
        style={{ width: "80%", height: 100, padding: 10 }}
      />
      <Card
        onPress={() => {
          setIsVisible(true);
        }}
        bgColor={adress ? "rgba(73,180,12,0.1)" : "rgba(220,24,24,0.1)"}
        borderColor={adress ? "#0d9a0d" : "#dc1818"}
      >
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <MaterialCommunityIcon
            name={adress ? "wifi" : "wifi-off"}
            size={50}
            color={adress ? "#0d9a0d" : "#dc1818"}
          />
          <Text
            style={{
              color: adress ? "#0d9a0d" : "#dc1818",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            {adress ? `${global.adress}` : "Non connecté"}
          </Text>
        </View>
      </Card>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
});

export default Home;
