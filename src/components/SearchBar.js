import { StyleSheet, TextInput, View, Pressable} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function SearchBar({ searchQuery, setSearchQuery, setFoundMeals, setMessage }) {
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();

  const url = `https://themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;

  useEffect(() => {
    const handleSearch = async() => {
      try {  
        if(searchQuery.length === 0) {
          handleClear();
          return;
        }
  
        setMessage('')
        const response = await axios.get(url);
        const meals = response.data.meals
        if(meals){
          setFoundMeals(meals);
        } else {
          setFoundMeals([])
          setMessage('No results found for your search query.')
        }
      } catch(error) {
        console.error('Something went wrong', error)
      }
    }
   handleSearch();
  }, [searchQuery])

  const handleClear = () => {
    setSearchQuery('');
    setFoundMeals([]);
    setMessage('')
  }

  return (
    <View style={styles.searchBar}>
      <Pressable style={{paddingVertical: 14}} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-left" size={32} color="#21212180" />
      </Pressable>
      <View style={styles.searchBarInterior}>
        <TextInput placeholder="Search" placeholderTextColor="gray"  style={{fontSize: 18, width: '90%'}} value={searchQuery} onChangeText={(text) => {setSearchQuery(text)}} onFocus={() => setIsFocus(true)} autoCorrect={false}/>
        {
          isFocus && searchQuery.length > 0 && (
            <Pressable onPress={handleClear}><MaterialIcons name="clear" size={22} color="#21212180" /></Pressable>
          )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    padding: 4,
    marginHorizontal: 8, 
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  searchBarInterior: {
    backgroundColor: "white",
    borderRadius: 10,
    width: '90%',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})