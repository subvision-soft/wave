import { Button, TextInput, TouchableOpacity, View } from "react-native";

import { Text } from "react-native";
import { Title } from "react-native-paper";
import { useState } from "react";
import QrCode from "../QrCode/QrCode";
import InputLabel from "react-native-paper/src/components/TextInput/Label/InputLabel";
import Ionicons from "react-native-vector-icons/Ionicons";

const Settings = () => {
  const [showQrCode, setShowQrCode] = useState(false);
  const [url, setUrl] = useState(global.url);

  if (showQrCode) {
    return (
      <View
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        <QrCode
          onScan={(url) => {
            setShowQrCode(false);
          }}
        ></QrCode>
        <Button title={"Annuler"} onPress={() => setShowQrCode(false)}></Button>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        padding: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextInput
          style={{
            width: "100%",
            borderColor: "#1ca1d8",
            borderWidth: 2,
            borderRadius: 50,
            paddingRight: 20,
            paddingLeft: 20,
            paddingTop: 10,
            paddingBottom: 10,
            flex: 1,
          }}
          value={global.url}
        ></TextInput>
        <TouchableOpacity>
          <Ionicons
            name="qr-code"
            size={30}
            color="#fff"
            style={{
              marginLeft: 10,
              padding: 10,
              backgroundColor: "#1ca1d8",
              borderRadius: 50,
            }}
            onPress={() => {
              setShowQrCode(true);
            }}
          ></Ionicons>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;
