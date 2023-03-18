import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
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
      <Stack.Screen name="Scanner" component={Cam} />
      <Stack.Screen name="Calculer" component={SendPicture} />
    </Stack.Navigator>
  );
}

function Cam() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const { width } = useWindowDimensions();
  const height = Math.round((width * 16) / 9);
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
            },
          ]}
          ref={cameraRef}
          ratio={"16:9"}
        >
          <View
            style={{
              height: Math.min(height, width) - 40,
              width: Math.min(height, width) - 40,
              borderWidth: 5,
              borderColor: "rgba(255,255,255,0.8)",
              borderRadius: 30,
              borderStyle: "dotted",
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
