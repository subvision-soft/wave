import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import SendPicture from "../SendPicture/SendPicture";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

export default function Scan() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Caméra" component={Cam} />
      <Stack.Screen name="Calculer" component={SendPicture} />
    </Stack.Navigator>
  );
}
const backgroundColor = "rgba(0,0,0,0.1)";

function Cam() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { width, height } = useWindowDimensions();
  const size = Math.min(width, height) - Math.min(width, height) / 7;
  const [borderColor, setBorderColor] = useState("#fff");
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  useEffect(() => {
    console.log(isFocused);
    if (isFocused) {
      (async () => {
        console.log();
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        console.log(cameraPermission);
        setHasCameraPermission(cameraPermission.status === "granted");
      })();
    }
  }, [isFocused]);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    console.log("photo");
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    navigation.navigate("Calculer", { picture: newPhoto });
  };

  return (
    <>
      {isFocused && (
        <Camera
          style={[
            StyleSheet.absoluteFill,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#000000",
            },
          ]}
          ref={cameraRef}
          ratio={"16:9"}
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
                padding: 1,
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
                    height: 10,
                    width: 10,
                    borderWidth: 3,
                    borderRightWidth: 0,
                    borderBottomWidth: 0,
                    borderColor: borderColor,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 10,
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
                    height: 10,
                    width: 10,
                    borderWidth: 3,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    borderColor: borderColor,
                  }}
                ></View>
                <View
                  style={{
                    height: 10,
                    width: 10,
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
        </Camera>
      )}

      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100%",
          width: "100%",
          padding: 20,
        }}
      >
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePic}
        ></TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  captureButton: {
    padding: 0,
    margin: 0,
    width: 70,
    height: 70,
    borderColor: "#fff",
    borderRadius: 100,
    borderWidth: 5,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
