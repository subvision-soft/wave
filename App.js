import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-native-paper";
import Home from "./pages/Home/Home";
import Ionicons from "react-native-vector-icons/Ionicons";
import Scan from "./pages/Scan/Scan";
import SendPicture from "./pages/SendPicture/SendPicture";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import QrCode from "./pages/QrCode/QrCode";
import Settings from "./pages/Settings/Settings";

const Tab = createBottomTabNavigator();

function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [previouslyScanned, setPreviouslyScanned] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    setUrl(global.url);
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  if (!url) {
    return (
      <QrCode
        onScan={(url) => {
          setUrl(url);
        }}
      ></QrCode>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case "Accueil":
                iconName = focused ? "home" : "home-outline";
                break;
              case "Camera":
                iconName = focused ? "camera" : "camera-outline";
                break;
              case "Paramètres":
                iconName = focused ? "settings" : "settings-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name={"Accueil"} component={Home} />
        <Tab.Screen
          options={{ headerShown: false }}
          name={"Camera"}
          component={Scan}
        />
        <Tab.Screen name={"Paramètres"} component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
