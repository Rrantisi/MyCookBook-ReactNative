import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Categories from '../components/Categories';
import Meals from '../components/Meals';
import { LinearGradient } from 'expo-linear-gradient';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Discover() {
  const [data, setData] = useState('');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [randomClicked, setRandomClicked] = useState(false);

  const navigation = useNavigation();

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
    <View>
      <Pressable onPress={() => setRandomClicked(!randomClicked)}>
          {
          randomClicked ? (
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, backgroundColor: '#212121'}}>
            <SimpleLineIcons name="arrow-up" size={22} color="#F0F0F0" />
            <Text style={[styles.text, {color: '#F0F0F0'}]}>Recipe Roulette</Text>
            <SimpleLineIcons name="arrow-up" size={22} color="#F0F0F0" />
          </View>
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
        <TouchableOpacity style={{height: 350, marginBottom: 2, flexGrow: 1, backgroundColor: '#ffffff'}} onPress={() => navigation.navigate('Detail', {recipeId: data.idMeal})}>
          <Image source={{ uri: data.strMealThumb}} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
        </TouchableOpacity>
      ) }
      <View style={{flexGrow: 1}}>
        <Categories categories={categories} setCategories={setCategories} setMeals={setMeals} />
      </View>
      <Meals meals={meals} />
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
    fontSize: 22,
    padding: 6,
    letterSpacing: 2.8,
    fontFamily: 'Satisfy_400Regular',
    opacity: 0.9,
  }
})

