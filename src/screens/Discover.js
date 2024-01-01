import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Categories from '../components/Categories';
import Meals from '../components/Meals';
import { LinearGradient } from 'expo-linear-gradient';
import { SimpleLineIcons } from '@expo/vector-icons';
import SwipeGesture from 'react-native-swipe-gestures';

export default function Discover() {
  const [data, setData] = useState('');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [randomClicked, setRandomClicked] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSwipeUp = () => {
    // Swipe-up gesture detected
    setRandomClicked(false)
  };

  // Render activity indicator if data hasn't loaded yet.
  {!data.strMealThumb && (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      <ActivityIndicator size="large" />
    </View>
  )}

  // handle fetch data for random meal section
  const fetchData = async () => {
    try {
      const response = await axios.get('https://themealdb.com/api/json/v1/1/random.php');
      setData(response.data.meals[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View nestedScrollEnabled={true}>
      {/* placeholder for swip gesture implementation */}
      {/* <SwipeGesture
        onSwipeUp={handleSwipeUp}
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
        }}
      > */}
      <Pressable onPress={() => setRandomClicked(!randomClicked)}>
          {
          randomClicked ? (
          <LinearGradient colors={['#212121', '#333333', '#21212190', '#21212110']}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20}}>
              <SimpleLineIcons name="arrow-up" size={22} color="#f0f0f0" />
              <Text style={[styles.text, {color: '#f0f0f0'}]}>Recipe Roulette</Text>
              <SimpleLineIcons name="arrow-up" size={22} color="#f0f0f0" />
            </View>
          </LinearGradient>
            ) : (
          <LinearGradient colors={['#21212180', '#f0f0f0', '#ffffff']}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20}}>
              <SimpleLineIcons name="arrow-down" size={22} color="#FFB74D" />
              <Text style={styles.text}>Recipe Roulette</Text>
              <SimpleLineIcons name="arrow-down" size={22} color="#FFB74D" />
            </View>
          </LinearGradient>
            )
          }
      </Pressable>
      {randomClicked && data.strMealThumb && (
        // TODO: add navigation to detail page
        <TouchableOpacity style={{height: 350, marginBottom: 2, flexGrow: 1, backgroundColor: '#ffffff', padding: 2}}>
          <Image source={{ uri: data.strMealThumb}} style={{width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 8}} />
        </TouchableOpacity>
      ) }
      <View style={{flexGrow: 1}}>
        <Categories categories={categories} setCategories={setCategories} setMeals={setMeals} />
      </View>
      <Meals meals={meals} />
      {/* </SwipeGesture> */}
    </View>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 26,
    padding: 6,
    letterSpacing: 2.8,
    fontFamily: 'Satisfy_400Regular',
    opacity: 0.9
  }
})

