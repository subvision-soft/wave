import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-native-paper";
import Home from "./pages/Home/Home";
import Ionicons from "react-native-vector-icons/Ionicons";
import Scan from "./pages/Scan/Scan";
import SendPicture from "./pages/SendPicture/SendPicture";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();

function App() {
  return (
    <Provider>
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
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
