import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./pages/Home/Home";
import Ionicons from "react-native-vector-icons/Ionicons";
import Scan from "./pages/Scan/Scan";
import { RootSiblingParent } from "react-native-root-siblings";

const Tab = createBottomTabNavigator();

function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              switch (route.name) {
                case "Accueil":
                  iconName = focused ? "home" : "home-outline";
                  break;
                case "Caméra":
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
            name={"Caméra"}
            component={Scan}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}

export default App;
