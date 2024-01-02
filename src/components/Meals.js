import { FlatList, StyleSheet, Image, View, Pressable, Text } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Meals({meals}) {
  const navigation = useNavigation();

  return (
    <FlatList 
      contentContainerStyle={{ flexGrow: 1 }}
      data={meals}
      keyExtractor={(item) => item.idMeal}
      renderItem={({item}) => (
        <Pressable key={item.idMeal} onPress={() => navigation.navigate('Detail', {recipeId: item.idMeal})}>
          <View style={styles.mealImageContainer}>
            <Image source={{uri: item.strMealThumb}} style={styles.mealImage} />
          </View>
          <Text style={{position: 'absolute', fontSize: 24, color: 'white', fontWeight: '800', backgroundColor: '#2121214c', padding: 8, width: '60%'}}>{item.strMeal}</Text>
        </Pressable>
      )}
    />
  )
}

const styles = StyleSheet.create({
  mealImageContainer: {
    height: 120, 
    width: '100%',
    position: 'relative',
    marginVertical: 0.5
  },
  mealImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.85
  }
})