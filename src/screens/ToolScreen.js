import { SafeAreaView, StyleSheet, Pressable, Text, View, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Timer from '../components/Timer';
import Substitute from '../components/Substitute';
import Conversion from '../components/Conversion';
import ShoppingList from '../components/ShoppingList';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import bgImage from '../../assets/images/bg1.png';

// Defines components object for all the tools in tool screen
const components = {
  clock: <Timer />,
  substitute: <Substitute />,
  convert: <Conversion />,
  addToList: <ShoppingList />
}

export default function ToolScreen() {
  const [key, setKey] = useState('clock');
  const [isImageLoaded, setImageLoaded] = useState(false);

  const navigation = useNavigation();

  const handleToolClick = (key) => {
    setKey(key)
  }

  const handleImageLoad = () => {
    // Image has loaded, update the state
    setImageLoaded(true);
  };

  return (
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
    <SafeAreaView style={{backgroundColor: '#00000090'}}>

      {/* Back button */}
      <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-left" size={32} color="#f0f0f0" />
        </Pressable>
        <Text style={{color: '#f0f0f0', paddingHorizontal: 6}}>Go Back</Text>
      </View>

      {/* Tool Bar */}
      <View>
        <View style={styles.toolBar}>

          {/* Timer */}
          <TouchableOpacity onPress={() => handleToolClick('clock')} style={{borderColor: '#21212110', borderWidth: 0.5, padding: 2, borderRadius: 9}}>
            <View style={{borderColor: key == 'clock' ? '#ffffff30' : '#ffffff10', borderWidth: 4, padding: 12,  justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
              <MaterialCommunityIcons name="timer-outline" size={30} color={key == 'clock' ? 'white' : '#ffffff90'} />
            </View>
          </TouchableOpacity>

          {/* Substitute */}
          <TouchableOpacity onPress={() => handleToolClick('substitute')} style={{borderColor: '#21212110', borderWidth: 0.5, padding: 2, borderRadius: 9}}>
            <View style={{borderColor: key == 'substitute' ? '#ffffff30' : '#ffffff10', borderWidth: 4, padding: 12, borderRadius: 20}}>
              <Entypo name="cycle" size={30} color={key == 'substitute' ? 'white' : '#ffffff90'} />
            </View>
          </TouchableOpacity>

          {/* Convert */}
          <TouchableOpacity onPress={() => handleToolClick('convert')} style={{ borderColor: '#21212110', borderWidth: 0.5, padding: 2, borderRadius: 9}}>
            <View style={{borderColor: key == 'convert' ? '#ffffff30' : '#ffffff10', borderWidth: 4, padding: 12, borderRadius: 20}}>
              <FontAwesome5 name="exchange-alt" size={30} color={key == 'convert' ? 'white' : '#ffffff90'} />
            </View>
          </TouchableOpacity>

          {/* Shopping List */}
          <TouchableOpacity onPress={() => handleToolClick('addToList')} style={{ borderColor: '#21212110', borderWidth: 0.5, padding: 2, borderRadius: 9}}>
            <View style={{borderColor: key == 'addToList' ? '#ffffff30' : '#ffffff10', borderWidth: 4, padding: 12, borderRadius: 20}}>
              <Ionicons name={'md-list-outline'} size={30} color={key == 'addToList' ? 'white' : '#ffffff90'} />
            </View>
            </TouchableOpacity>
        </View>
      </View>

      {/* Render component */}
      <View style={{backgroundColor: '#f0f0f010', height: '100%'}}>
        {components[key]}
      </View>      
    </SafeAreaView>
      )}
  </ImageBackground>    
  )
}

const styles = StyleSheet.create({
  toolBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderBottomColor: '#d0d0d010',
    borderBottomWidth: 2,
    paddingVertical: 8
  },
})