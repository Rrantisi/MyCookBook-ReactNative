import { StyleSheet, Pressable, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import envVars from '../../env';

export default function Substitute() {
  const [query, setQuery] = useState('');
  const [substitutes, setSubstitutes] = useState([]);
  const [goClicked, setGoClicked] = useState(false);

  const apiKey = envVars.API_KEY;
  const url = `https://api.spoonacular.com/food/ingredients/substitutes?ingredientName=${query}&apiKey=${apiKey}`;

  const handleFindSubstitutes = async() => {
    try {
      setTimeout(() => {
        setGoClicked(true)
      }, 1000)
      const response = await axios.get(url);
      const data = response.data.substitutes
      if(data) {
        setSubstitutes(data)
      } 
    } catch(error) {
      console.error('Something went wrong', error)
    }
  }

  useEffect(() => {
    if (query === '') handleClear();
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setSubstitutes([]);
    setGoClicked(false);
  }

  return (
    <View style={{ marginTop: 40 }}>
      <Text style={styles.text}>Find Substitutes</Text>
      <View style={{ justifyContent: 'space-between' }}>
        <View style={{padding: 14, borderColor: '#ffffff10', borderWidth: 3, marginHorizontal: 20, marginVertical: 20, marginTop: 14, borderRadius: 10, paddingVertical: 8}}>
          <TextInput placeholder='Ingredient Name' onChangeText={setQuery} value={query} placeholderTextColor='#f0f0f090' style={{fontSize: 22,  width: '100%', paddingVertical: 14, marginVertical: 4,  color: '#f0f0f0'}}/>
        </View>

        {/* if go button clicked replace it with clear button */}
        <View style={{marginLeft: 'auto', marginRight: 'auto'}}>
          {
            goClicked ? (
              <Pressable onPress={handleClear} style={styles.button}><Text style={{color: '#F0F0F0', fontSize: 20, fontWeight: '600', textAlign: 'center'}}>Clear</Text></Pressable>
              ) : (
              <TouchableOpacity onPress={handleFindSubstitutes} style={styles.button}><Text style={{color: '#F0F0F0', fontSize: 20, fontWeight: '600', textAlign: 'center'}}>Go</Text></TouchableOpacity>
              )
          }
        </View>
      </View>
      <ScrollView>
      {
        // check if query length is > 0 and returns substitutes
        query.length > 0 && substitutes ? (
          // checks if returned substitute length is > 0 and returns substitutes
          substitutes.length > 0 ? (
            substitutes.map((substitute, index) => (
              <View key={index}>
                <Text style={[styles.textMedium, {textAlign: 'left', marginHorizontal: 14, marginVertical: 4, marginTop: 6}]}>{substitute}</Text>
              </View>
            ))
          ) : 
          // else return no substitutes found
          (
            <View>
              <Text style={[styles.textMedium, {textAlign: 'left', marginHorizontal: 14, marginTop: 12}]}>{goClicked  ? 'No Substitutes Found' : ''}</Text>
            </View>
          ) 
        ) : null
      }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#ffffff',
    letterSpacing: 1.6,
    fontSize: 24,
    padding: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#212121',
    padding: 10, 
    paddingHorizontal: 40,
    marginTop: 20,
    borderRadius: 10,
    width: 140,
  },
  textMedium: {
    color: '#F0F0F060',
    fontSize: 20,
    padding: 14,
    fontWeight: '500',
    textAlign: 'justify'
  },

})