import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import {Provider} from "react-native-paper";

function HomeScreen() {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Home Screen</Text>
		</View>
	);
}

const Tab = createBottomTabNavigator();

function App() {
	return (
		<Provider>
			<NavigationContainer>
				<Tab.Navigator>
					<Tab.Screen name={"Home"} component={}></Tab.Screen>
				</Tab.Navigator>
			</NavigationContainer>
		</Provider>
	);
}

export default App;