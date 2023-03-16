import { useEffect, useState } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import * as React from "react";

const QrCode = ({ onScan }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [previouslyScanned, setPreviouslyScanned] = useState("");
  const { width, height } = useWindowDimensions();

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
          global.url = "http://" + data + "/api";
          onScan("http://" + data + "/api");
        }
      }, [])
      .catch((error) => {
        setPreviouslyScanned(data);
        setScanned(false);
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-end",

        alignItems: "center",
        display: "flex",
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[
          StyleSheet.absoluteFillObject,
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <View
          style={{
            height: Math.min(height, width) - Math.min(height, width) / 5,
            width: Math.min(height, width) - Math.min(height, width) / 5,
            borderWidth: 5,
            borderColor: "rgba(255,255,255,0.8)",
            borderRadius: 30,
            borderStyle: "dotted",
          }}
        ></View>
      </BarCodeScanner>
    </View>
  );
};

export default QrCode;
