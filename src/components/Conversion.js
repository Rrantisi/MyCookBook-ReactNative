import { StyleSheet, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import envVars from '../../env';

export default function Conversion() {
  const [ingredientName, setIngredientName] = useState('');
  const [sourceAmount, setSourceAmount] = useState(0);
  const [sourceUnit, setSourceUnit] = useState('');
  const [targetUnit, setTargetUnit] = useState('');
  const [result, setResult] = useState('');
  const [goClicked, setGoClicked] = useState(false);

  const apiKey = envVars.API_KEY;
  const url = `https://api.spoonacular.com/recipes/convert?ingredientName=${ingredientName}&sourceAmount=${sourceAmount}&sourceUnit=${sourceUnit}&targetUnit=${targetUnit}&apiKey=${apiKey}`;

  const handleConversion = async() => {
    try {
      setTimeout(() => {
        setGoClicked(true)
      }, 1000)
      const response = await axios.get(url);
      const data = response.data.answer
      if(data) setResult(data)
    } catch(error) {
      console.error('Something went wrong', error)
    }
  }

  const handleClear = () => {
    setIngredientName('');
    setSourceAmount('');
    setSourceUnit('');
    setTargetUnit('');
    setResult('')
    setGoClicked(false);
  }

  return (
    <View style={{ marginTop: 40 }}>
      <Text style={styles.text}>Convert Amounts</Text>
      <View style={{justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, marginVertical: 20}}>

        {/* Ingredient Name */}
        <TextInput placeholder='Ingredient Name' onChangeText={setIngredientName} value={ingredientName} placeholderTextColor='#f0f0f090' style={styles.inputContainer}/> 
        
        {/* Source Amount */}
        <TextInput placeholder='Amount' onChangeText={setSourceAmount} value={sourceAmount} placeholderTextColor='#f0f0f090' style={styles.inputContainer}/>
        
        {/* Source Unit */}
        <TextInput placeholder='Unit' onChangeText={setSourceUnit} value={sourceUnit} placeholderTextColor='#f0f0f090' style={styles.inputContainer}/>
        <Text style={styles.text}>To:</Text>

        {/* Target Unit */}
        <TextInput placeholder='Target Unit' onChangeText={setTargetUnit} value={targetUnit} placeholderTextColor='#f0f0f090' style={styles.inputContainer}/>

      {/* Once go button is clicked show clear button */}
      {
       goClicked ? (
        <Pressable onPress={handleClear} style={styles.button}><Text style={{color: '#F0F0F0', fontSize: 20, fontWeight: '600'}}>Clear</Text></Pressable>
          ) : (
        <Pressable onPress={handleConversion} style={styles.button}><Text style={{color: '#F0F0F0', fontSize: 20, fontWeight: '600'}}>Convert</Text></Pressable>
          )
      }
      </View>

      {/* Conversion Result */}
      {
        result ? (
          <View>
            <Text style={[styles.textMedium, {textAlign: 'left'}]}>{result}</Text>
          </View>
        ) : (
          <View>
            <Text>{goClicked  ? 'Something Went Wrong' : ''}</Text>
          </View>
        )
      }
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
  textMedium: {
    color: '#F0F0F060',
    fontSize: 20,
    alignSelf: 'center',
    padding: 14,
    fontWeight: '700'
  },
  button: {
    backgroundColor: '#212121',
    padding: 10, 
    paddingHorizontal: 40,
    marginTop: 20,
    borderRadius: 8,
  },
  inputContainer: {
    fontSize: 22,
    borderColor: '#ffffff10',
    borderWidth: 3,
    paddingHorizontal:14,
    borderRadius: 10,
    marginVertical: 8,
    width: '90%',
    paddingVertical: 16,
    color: '#f0f0f0'
  }
})
