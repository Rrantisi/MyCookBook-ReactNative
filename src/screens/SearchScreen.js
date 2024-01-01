import { StyleSheet, Text, View, Pressable, SafeAreaView, Image, FlatList } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../components/SearchBar';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundMeals, setFoundMeals] = useState([]);
  // Placeholder To handle Recent Searches
  const [recentSearches, setRecentSearches] = useState([]);
  const [message, setMessage] = useState('')
  const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.textContainer}>
      <View style={{borderBottomColor: '#FFFFFF', borderBottomWidth: 1, paddingBottom: 5}}>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} foundMeals={foundMeals} setFoundMeals={setFoundMeals} setMessage={setMessage}/>
      </View>

      {/* Found meals */}
      {
        foundMeals.length > 0 && (
        <View style={styles.overlayContainer}>
          <FlatList 
            data={foundMeals.slice(0, 10)}
            keyExtractor={(item)=> item.id}
            renderItem={({item}) => (
              // TODO : handle page detail
              <Pressable key={item.idMeal} onPress={() => navigation.navigate('Detail', {recipeId: item.idMeal})}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 8, opacity: 0.75, marginVertical: 5 }}>
                  <Image source={{uri: item.strMealThumb}} style={{width: 40, height: 40, resizeMode: 'contain', borderRadius: 999}} />
                  <Text>{item.strMeal}</Text>
                </View>
              </Pressable>
            )}
          />
        </View>  
        )
      }  

      {/* No results found message */}
      {
        message && (
          <View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: 10}}>
            <Text style={styles.text}>{message}</Text>
          </View>
        )
      }

      {/* TODO: Placeholder to handle recent searches for user */}
      {
        recentSearches.length > 0 ? (
          <View>
            <Text>{recentSearches}</Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row', justifyContent: 'center', paddingVertical: 10}}>
            <Text style={styles.text}>No Recent Searches</Text>
          </View>
        )
      }

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  text: {
    color: '#21212180',
    fontSize: 20,
  },
  overlayContainer: {
    position: 'absolute',
    top: '15.4%',  
    left: '12.35%',
    right: '3.5%',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 10, 
    borderBottomRightRadius: 10,
    padding: 4, 
    elevation: 5,  // For Android shadow
    shadowColor: '#000',  // For iOS shadow
    shadowOffset: {
        width: 2,
        height: 8,
      },
    shadowOpacity: 0.10,
    shadowRadius: 5,
    zIndex: 1000
  }
})
