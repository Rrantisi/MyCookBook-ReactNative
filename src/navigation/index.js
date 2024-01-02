import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import BottomTabs from './BottomTabs';
import SearchScreen from '../screens/SearchScreen';
import ToolScreen from '../screens/ToolScreen';
import RecipeDetails from '../screens/RecipeDetails';
import SavedScreen from '../screens/SavedScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ShoppingList from '../components/ShoppingList';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false, gestureEnabled: false}} >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={BottomTabs} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="ToolScreen" component={ToolScreen} />
        <Stack.Screen name="Detail" component={RecipeDetails} />
        <Stack.Screen name="Saved" component={SavedScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="ShoppingList" component={ShoppingList} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

