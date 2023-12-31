import { StyleSheet, View, SafeAreaView, ActivityIndicator, ImageBackground } from 'react-native';
import React, {useState} from 'react';
import bgImage from '../../assets/images/bg1.png';
import HomeScreen from '../screens/HomeScreen';
import SavedScreen from '../screens/SavedScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeBar from '../components/WelcomeBar';

export default function MainScreen({ activeTab }) {
  const [isImageLoaded, setImageLoaded] = useState(false);

  // defines the components object to be used for rendering activeTab component:
  const components = {
    home: <HomeScreen />,
    saved: <SavedScreen />,
    favorites: <FavoritesScreen />,
    profile: <ProfileScreen />
  }

  // handles bg image loading
  const handleImageLoad = () => {
    // Image has loaded, update the state
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
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  )}

  {isImageLoaded && (
    <View style={styles.componentContainer}>
       <WelcomeBar />
        {components[activeTab]}
    </View>
  )}
  </ImageBackground>

  </View>
  )
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
  componentContainer: {
    flex: 1,
    backgroundColor: '#00000073'
  }
});