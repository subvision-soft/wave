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

const Home = function ({ navigation }) {
  const [url, setUrl] = useState(undefined);
  const [isVisible, setIsVisible] = useState(false);
  const isFocused = useIsFocused();
  const popupDialog = useRef(null);

  useEffect(() => {
    setUrl(global.url);
  }, [isFocused]);

  useEffect(() => {
    setUrl(global.url);
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
              setIsVisible(false);
            }}
          />
        </View>
      </Modal>
      <Card
        onPress={() => {
          setIsVisible(true);
        }}
        style={
          url
            ? {
                backgroundColor: "#49b40c",
              }
            : {
                backgroundColor: "#ececec",
              }
        }
      >
        <Text
          style={
            url
              ? {
                  color: "white",
                }
              : {
                  color: "black",
                }
          }
        >
          Home
        </Text>
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
