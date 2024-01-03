import { StyleSheet, Pressable, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import AddRecipe from '../components/AddRecipe';
import AllRecipes from '../components/AllRecipes';
import { withAuthentication } from '../components/withAuthentication';

const MyKitchen = () => {
  const navigation = useNavigation();

  const [buttonPressed, setButtonPressed] = useState(false)

  return (
    <View style={{flex: 1}}>
        <>
        { buttonPressed ? (
          <>
          <Pressable onPress={() => {setButtonPressed(!buttonPressed)}} style={styles.container}>  
            <Feather name="minus-circle" size={20} color="#F0F0F080" />        
            <Text style={styles.text}>Hide</Text>
          </Pressable>        
          <ScrollView>
            <AddRecipe route={''} navigation={navigation} setButtonPressed={setButtonPressed}/>
          </ScrollView>
          </>
        ) : (
          <>
          <Pressable onPress={() => {setButtonPressed(!buttonPressed)}} style={styles.container}>          
            <Ionicons name="add-circle-outline" size={20} color="#F0F0F080" />  
            <Text style={styles.text}>Add New Recipe</Text>
          </Pressable>        
          <AllRecipes />
          </>
        )}
        </>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#F0F0F080',
    fontSize: 16,
    paddingHorizontal: 8,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 8,
    paddingVertical: 8,
    backgroundColor: '#212121'
  }
})

export default withAuthentication(MyKitchen);