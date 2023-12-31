import React from 'react';
import MainScreen from '../screens/MainScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useIsFocused } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// Higher order function to avoid re-rendering 
// Renders MainScreen component and passes the activeTab as prop to handle bottom tab icon clicks
const MainScreenWrapper = (activeTab) => {
  return () => <MainScreen activeTab={activeTab} />;
};


export default function BottomTabs() {
  const isFocused = useIsFocused();

  const getTabBarStyle = (color) => {
    const tabBarStyle = {
      backgroundColor: isFocused ? color : '#F0F0F0',
      borderTopColor: isFocused ? 'black' : '#777777',
      borderTopWidth: 0.6, 
      paddingTop: 8
    }
    return tabBarStyle
  }

  return (
    <Tab.Navigator
      screenOptions={{
            tabBarStyle: {backgroundColor: '#F0F0F0', borderTopColor: '#2121218d', borderTopWidth: 0.5, paddingTop: 8},
            // tabBarShowLabel: false,
            tabBarActiveTintColor: '#777777',
            tabBarInactiveTintColor: '#777777'
      }} >

      {/* Home */}
      <Tab.Screen 
        name="Home"  
        component={MainScreenWrapper('home')} 
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({focused}) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={28} color='#777777' />            
            )
        }}
      />

      {/* Saved */}
      <Tab.Screen 
        name="Saved" 
        component={MainScreenWrapper('saved')} 
        options={{
          tabBarLabel: 'Saved',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <MaterialIcons name={focused ? 'bookmark' : 'bookmark-outline'} size={28} color='#777777'  />
            ),
          tabBarStyle: getTabBarStyle('#212121')
        }}
      />

      {/* Favorites */}
      <Tab.Screen 
        name="Favorites" 
        component={MainScreenWrapper('favorites')} 
        options={{
          tabBarLabel: 'Favorites',
          headerShown: false,
          tabBarIcon: ({focused}) => (
            // <MaterialIcons name={focused ? 'favorite' : 'favorite-outline'} size={28} color={focused ? '#C21E56' : '#212121d8'} />            
            <MaterialIcons name={focused ? 'favorite' : 'favorite-outline'} size={28} color='#777777' />            
            ),
          tabBarStyle: getTabBarStyle('#212121')
        }}
      />

      {/* Profile */}
      <Tab.Screen 
        name="Profile" 
        component={MainScreenWrapper('profile')} 
        options={{
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({focused}) => (
              <Ionicons name={focused ? 'md-person' : 'md-person-outline'} size={28} color='#777777' />            
            )
        }}
      />
    </Tab.Navigator>
  )
}

