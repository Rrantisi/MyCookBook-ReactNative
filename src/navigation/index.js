import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false, gestureEnabled: false}} >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

