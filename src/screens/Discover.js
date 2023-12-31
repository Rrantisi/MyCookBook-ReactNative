import { StyleSheet, View, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Categories from '../components/Categories';
import Meals from '../components/Meals';

export default function Discover() {
  const [data, setData] = useState('');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);

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
    <View style={styles.textContainer}>
      <ScrollView>
        {data.strMealThumb && (
          // TODO: add navigation to detail page
          <TouchableOpacity style={{height: 400, marginBottom: 2}}>
            <Image source={{ uri: data.strMealThumb}} style={{width: '100%', height: '100%', resizeMode: 'cover'}} />
          </TouchableOpacity>
        )}
        <View>
          <Categories categories={categories} setCategories={setCategories} setMeals={setMeals} />
        </View>
        <View>
          <Meals meals={meals} setMeals={setMeals} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'rgba(0, 0, 0, 0.45)',
    fontSize: 55,
  }
})