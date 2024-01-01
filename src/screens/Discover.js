import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Categories from '../components/Categories';
import Meals from '../components/Meals';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';

export default function Discover() {
  const [data, setData] = useState('');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [randomClicked, setRandomClicked] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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
    <ScrollView nestedScrollEnabled={true}>
      <Pressable onPress={() => setRandomClicked(!randomClicked)}>
        <LinearGradient colors={['#212121', '#21212180', '#f0f0f0', '#ffffff']}>
          {
          randomClicked ? (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <AntDesign name="caretup" size={24} color="#A30000" />
              <Text style={styles.text}>Recipe Roulette</Text>
              <AntDesign name="caretup" size={24} color="#A30000" />
            </View>
            ) : (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <AntDesign name="caretdown" size={24} color="#A30000" />
              <Text style={styles.text}>Recipe Roulette</Text>
              <AntDesign name="caretdown" size={24} color="#A30000" />
            </View>
            )
          }
        </LinearGradient>
      </Pressable>
      {randomClicked && data.strMealThumb && (
        // TODO: add navigation to detail page
        <TouchableOpacity style={{height: 400, marginBottom: 2, flex: 1}}>
          <Image source={{ uri: data.strMealThumb}} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
        </TouchableOpacity>
      ) }
      <Categories categories={categories} setCategories={setCategories} setMeals={setMeals} />
      <Meals meals={meals} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: '#8B0000',
    textAlign: 'center',
    fontSize: 20,
    padding: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  }
})

