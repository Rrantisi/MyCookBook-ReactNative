import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Categories({ categories, setCategories, setMeals }) {
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    fetchData();
    handleFetchMeals();
    handleCategoryClick();
  }, []);

  // handles fetch Categories data
  const fetchData = async () => {
    try {
      const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php');
      const categories = response.data.categories;
      setCategories(categories)        
    } catch (error) {
      console.log(error);
    }
  };

  // handles fetch meals based on category click and sets default category
  const handleFetchMeals = async(category="Beef") => {
    try{
      const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      const meals = response.data.meals
      setMeals(meals)
    } catch(e) {
      console.log(e)
    }
  }

  // handles category click and sets meals to empty array before each call to prevent rendering meals from previously clicked categories
  const handleCategoryClick = async(category="Beef") => {
    setMeals([]);
    setActiveCategory(category)
    handleFetchMeals(category);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {categories.map(category => (
        <TouchableOpacity key={category.idCategory} style={styles.categoryContainer} onPress={() => handleCategoryClick(category.strCategory)}>
          <View style={[styles.catImageContainer, {borderColor: activeCategory === category.strCategory? '#D1D1D130':'#f7f7f7', backgroundColor: activeCategory === category.strCategory? '#f0f0f0' : '#F0F0F0'}]}>
            <Image source={{uri: category.strCategoryThumb}} style={styles.catImage}/>
          </View>
          <View>
            <Text style={{color: activeCategory === category.strCategory? '#212121':'#808080', fontSize: 18, fontWeight: '500'}}>{category.strCategory}</Text>
          </View>
        </TouchableOpacity>
      ))}

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  categoryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10
  },
  catImageContainer: {
    height: 80,
    width: 80,
    borderRadius: 999, 
    borderWidth: 8,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  catImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 999
  },
})