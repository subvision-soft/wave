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
} from "react-native";
import logo from "../../assets/adaptive-icon.png";
import Card from "../../components/Card/Card";
import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import PopupDialog from "react-native-popup-dialog";
import { DialogButton, DialogContent } from "react-native-popup-dialog/src";
import QrCode from "../QrCode/QrCode";
import MaterialCommunityIcon from "react-native-paper/src/components/MaterialCommunityIcon";
import getUrl from "../../utils/NetworkUtils";

const Home = function ({ navigation }) {
  const [adress, setAdress] = useState(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const isFocused = useIsFocused();
  const popupDialog = useRef(null);

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
    <View>
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
      <Card
        onPress={() => {
          setIsVisible(true);
        }}
        bgColor={adress ? "rgb(235,255,224)" : "#ffe4e4"}
        borderColor={adress ? "#49b40c" : "#dc1818"}
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
            color={adress ? "#49b40c" : "#dc1818"}
          />
          <Text
            style={{
              color: adress ? "#49b40c" : "#dc1818",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            {adress ? `${global.adress}` : "Non connecté"}
          </Text>
        </View>
      </Card>
    </View>
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
