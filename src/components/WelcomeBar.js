import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeBar() {
  const navigation = useNavigation();
  
  return (
    <>
      <SafeAreaView style={{justifyContent: 'center', alignItems: 'center'}} >
        <Text style={styles.logo}>MyCookBook</Text>
      </SafeAreaView>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', padding: 10, paddingBottom: 10}}>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color="#FFF5EE" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ToolScreen')}>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFF5EE" />
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  logo: {
    color: '#FFF5EE',
    fontSize: 38,
    fontFamily: 'Satisfy_400Regular',
    marginTop: 20
  },

})