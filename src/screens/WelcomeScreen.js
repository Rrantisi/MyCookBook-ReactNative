import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import bgImage from '../../assets/images/bg.png';
import Animated, {
  BounceInRight,
  BounceInLeft,
  BounceInDown
} from 'react-native-reanimated';
import { useFonts, Satisfy_400Regular } from '@expo-google-fonts/satisfy';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [isImageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
      // Navigate to main page once logo has loaded
      setTimeout(() => {
        navigation.navigate('Main')
      }, 6000)
    }, [])

  const [fontsLoaded, fontError] = useFonts({
    Satisfy_400Regular,
  });
  
  if (!fontsLoaded && !fontError) {
      return null;
  }
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bgImage} 
        style={styles.backgroundImage}
        resizeMode="cover"
        onLoad={handleImageLoad} >

      {!isImageLoaded && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {isImageLoaded && (
      <View style={styles.logoContainer}>
        <View style={{flexDirection: 'row'}}>
          <Animated.View entering={BounceInLeft.delay(600).duration(1000)}><Text style={styles.logo}>My</Text></Animated.View>
          <Animated.View entering={BounceInDown.delay(1200).duration(1000)}><Text style={styles.logo}>Cook</Text></Animated.View>
          <Animated.View entering={BounceInRight.delay(1800).duration(1000)}><Text style={styles.logo}>Book</Text></Animated.View>
        </View>    
          <StatusBar style="auto" />
        </View>
        )}
        </ImageBackground>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  logo: {
    color: 'white',
    fontSize: 45,
    fontFamily: 'Satisfy_400Regular',
  }
});