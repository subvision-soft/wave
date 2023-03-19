import { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import * as React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const backgroundColor = "rgba(0,0,0,0.3)";
const QrCode = ({ onScan }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [previouslyScanned, setPreviouslyScanned] = useState("");
  const { width, height } = useWindowDimensions();
  const size = Math.min(width, height) - Math.min(width, height) / 4;
  const [borderColor, setBorderColor] = useState("#fff");

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    console.log(data);
    if (data === previouslyScanned) {
      return;
    }
    setScanned(true);
    fetch("http://" + data + "/api/subapp")
      .then((response) => {
        if (response.status === 200) {
          // global.url = "http://" + data + "/api";
          // onScan("http://" + data + "/api");
          setBorderColor("#00ff00");
          setTimeout(() => {
            onScan("data");
          }, 1000);
        }
      }, [])
      .catch((error) => {
        setBorderColor("#ff0000");
        setPreviouslyScanned(data);
        setTimeout(() => {
          setScanned(false);
          setBorderColor("#fff");
        }, 1000);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView
      style={{
        width: width,
        height: height,
        backgroundColor: "#000",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[
          //Make the element cover the whole screen
          StyleSheet.absoluteFill,
          {
            alignItems: "center",
          },
        ]}
      >
        <View
          style={{
            width: width,
            height: (height - size) / 2,
            backgroundColor: backgroundColor,
          }}
        ></View>
        <View
          style={{
            width: width,
            height: size,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: (width - size) / 2,
              backgroundColor: backgroundColor,
            }}
          ></View>

          <View
            style={{
              width: size,
              height: size,
              borderWidth: 1,
              borderColor: borderColor,
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 3,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",

                flex: 1,
              }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 3,
                  borderRightWidth: 0,
                  borderBottomWidth: 0,
                  borderColor: borderColor,
                }}
              ></View>
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 3,
                  borderLeftWidth: 0,
                  borderBottomWidth: 0,
                  borderColor: borderColor,
                }}
              ></View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",

                flex: 1,
              }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 3,
                  borderRightWidth: 0,
                  borderTopWidth: 0,
                  borderColor: borderColor,
                }}
              ></View>
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderWidth: 3,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  borderColor: borderColor,
                }}
              ></View>
            </View>
          </View>

          <View
            style={{
              width: (width - size) / 2,
              backgroundColor: backgroundColor,
            }}
          ></View>
        </View>

        <View
          style={{
            width: width,
            height: (height - size) / 2,
            backgroundColor: backgroundColor,
          }}
        ></View>
      </BarCodeScanner>
      <TouchableOpacity
        onPress={() => onScan()}
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          gap: 5,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Quitter
        </Text>
        <Ionicons
          color={"#fff"}
          size={18}
          name={"close-circle-outline"}
        ></Ionicons>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default QrCode;
