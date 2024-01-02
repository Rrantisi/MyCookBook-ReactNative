import { StyleSheet, Text, SafeAreaView, View, TextInput, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timerInterval;

    if (isActive) {
      timerInterval = setInterval(renderTime, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };

  }, [isActive, seconds, minutes, hours]);

  const renderTime = () => {
    let updatedSeconds = parseInt(seconds) - 1;
    let updatedMinutes = parseInt(minutes);
    let updatedHours = parseInt(hours);

    if (updatedSeconds < 0) {
      updatedMinutes--;
      updatedSeconds = 59;
    }

    if (updatedMinutes < 0) {
      updatedHours--;
      updatedMinutes = 59;
    }

    if (updatedHours < 0) {
      updatedHours = 0;
    }

    setSeconds(updatedSeconds < 10 ? `0${updatedSeconds}` : `${updatedSeconds}`);
    setMinutes(updatedMinutes < 10 ? `0${updatedMinutes}` : `${updatedMinutes}`);
    setHours(updatedHours < 10 ? `0${updatedHours}` : `${updatedHours}`);
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  }
  
  return (
    <SafeAreaView style={{alignItems: 'center', justifyContent: 'flex-start', marginTop: 40, height: '100%'}}>
      <Text style={[styles.text]}>Cooking Timer</Text>
        <View style={styles.timerContainer}>
          <TextInput placeholder='0 Hours' keyboardType='numeric' value={hours} onChangeText={setHours} placeholderTextColor={'#F0F0F0'} style={{fontSize: 28, color: '#F0F0F0'}} />
          <Text style={styles.text}>:</Text>
          <TextInput placeholder='0 Min' keyboardType='numeric' value={minutes} onChangeText={setMinutes} placeholderTextColor={'#F0F0F0'} style={{fontSize: 28, color: '#F0F0F0'}} />
          <Text style={styles.text}>:</Text>
          <TextInput placeholder='0 Sec' keyboardType='numeric' value={seconds} onChangeText={setSeconds} placeholderTextColor={'#F0F0F0'} style={{fontSize: 28, color: '#F0F0F0'}} />
        </View>  
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginVertical: 20}}>
        <Pressable onPress={() => setIsActive(!isActive)} style={styles.button}><Text style={{color: '#F0F0F0', textAlign: 'center', fontSize: 20, fontWeight: '600'}}>{isActive ? 'Pause' : 'Go'}</Text></Pressable>
        <Pressable onPress={handleReset} style={styles.button}><Text style={{color: '#F0F0F0', textAlign: 'center', fontSize: 20, fontWeight: '600'}}>Reset</Text></Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#ffffff',
    letterSpacing: 1.2,
    fontSize: 24,
    padding: 14,
    fontWeight: '600',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 20, 
    padding: 20,
    paddingHorizontal: 38,
    borderRadius: 10,
    borderColor: '#ffffff10',
    borderWidth: 3
  },
  button: {
    backgroundColor: '#212121',
    padding: 10, 
    paddingHorizontal: 40,
    borderRadius: 10,
    width: 140
  }
})