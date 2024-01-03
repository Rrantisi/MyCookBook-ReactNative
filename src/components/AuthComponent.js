import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { View, TextInput, Text, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function AuthComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(true);

  const navigation = useNavigation();

  // Sign In Function
  const signIn = async() => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      if(user){
        setTimeout(() => {
          navigation.navigate('Main')
        }, 1000)
      }
    } catch (error) {
      console.error('Error signing in:', error.message); 
    } finally {
      setLoading(false);
    }
  }

  // Sign Up Function
  const signUp = async() => {
    setLoading(true);
    try {
      if(email === "" || password === ""){
        Alert.alert(
          "Invalid Details",
          "Please Fill out all the fields",
          [
            {
              text: "Cancel",
              onPress: () => console.log('cancel pressed'),
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => console.log('ok pressed')
            }
          ],
          {cancelable: false}
        )
      }
      await createUserWithEmailAndPassword(auth, email, password).then(userCredentials => {
        const user = userCredentials._tokenResponse.email;
        const uid = auth.currentUser.uid;

        setDoc(doc(db, "users", `${uid}`), {
          email: user,
          displayName: displayName,
          createdAt: serverTimestamp(),
        })
      })
        
      if(user){
        setTimeout(() => {
          navigation.navigate('Main')
        }, 1000)
      }
    } catch (error) {
      console.error('Error signing in:', error.message); 
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      { !signedUp ? (
        <>
          <Text style={styles.text}>Sign Up</Text>
          <TextInput placeholder="Name" placeholderTextColor={'gray'} color={'black'} onChangeText={setDisplayName} style={styles.textInput} />
        </>
        ) : (
        <>
          <Text style={styles.text}>Sign In</Text>
        </>
        )
      }

    <TextInput placeholder="Email" placeholderTextColor={'gray'} color={'black'} onChangeText={setEmail} style={styles.textInput} />
      <TextInput placeholder="Password" placeholderTextColor={'gray'} color={'black'} secureTextEntry onChangeText={setPassword} style={styles.textInput} />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
        {signedUp ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={signIn} style={styles.button}>
              <Text style={{color: 'white', fontSize: 18}}> Sign In </Text>
            </TouchableOpacity>
            <Button title="Sign up for a new account" color="black" onPress={() => setSignedUp(false)} />
          </View>
          ) : (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={signUp} style={styles.button}>
              <Text style={{color: 'white', fontSize: 18}}> Sign Up </Text>
            </TouchableOpacity>
            <Button title="Already have an account?" color="black" onPress={() => setSignedUp(true)} />
          </View>
          )
        }
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  text: {
    color: '#21212180',
    fontSize: 22,
    padding: 14,
    fontWeight: '600',
  },
  textInput: {
    padding: 10,
    fontSize: 20,
    borderColor: '#21212180',
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    flexDirection: 'row',
    width: '80%',
  },
  button: {
    padding: 10,
    paddingHorizontal: 28,
    marginVertical: 14,
    backgroundColor: '#212121d8',
    borderRadius: 10,
  },
})