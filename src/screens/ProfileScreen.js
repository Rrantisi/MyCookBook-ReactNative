import { StyleSheet, Text, Pressable, View, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import AuthComponent from '../components/AuthComponent';
import { auth, db } from '../../firebase';
import { getDocs, collection, query, where, doc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [createdAt, setCreatedAt] = useState('');
  const [userName, setUserName] = useState('');
  const [totalCreations, setTotalCreations] = useState(0)

  // Fetch User Data from DB
  const fetchData = async () => {
    try {
      const users = collection(db, "users");
      const docSnap = await getDocs(users);

      docSnap.forEach((doc)=> {
        if(user){
          if (doc.id === user.uid){
            setUserName(doc.data().displayName)
            const date = doc.data().createdAt.toDate();
            const formattedDate = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`
            setCreatedAt(formattedDate)
          }  
        }
      })
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };
  
  fetchData();

  useEffect(() => {
    handleFetchCreations();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUserName('');
      setCreatedAt('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Fetch Total Number of Recipes created by user
  const handleFetchCreations = async() => {
    const q = query(collection(db, "recipes"), where ("userId", "==", auth.currentUser.uid));

    // get the documents that match the query
    const querySnapshot = await getDocs(q);
    setTotalCreations(querySnapshot.size)
  }

  return (
    <View style={{backgroundColor: '#F9F9F9'}}>
      <ScrollView>
        {user ? (
        <>
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0', paddingVertical: 8, marginVertical: 1}}>
          <Text style={{ padding: 2, marginBottom: 20, fontSize: 16, color: '#21212180', fontWeight: '500'}}>Profile</Text>
          <MaterialCommunityIcons name="home-heart" size={50} color="#B71C1C" />            
          <Text style={[styles.text, {paddingBottom: 0}]}>Hi, {userName}</Text>
          <Pressable onPress={handleLogout}><Text style={{color: '#21212180'}}>Not {userName}? Logout</Text></Pressable>
          <Text style={styles.textMedium}>Your Status</Text>
          <View style={{backgroundColor: '#FF5722', borderRadius: 999, width: 70, height: 70, justifyContent: 'center', alignItems: 'center'}}><Text style={{color: 'white', fontSize: 20}}>1</Text></View>
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>At a glance</Text>
          <Text style={styles.textSmall}>Member Since: <Text style={{fontStyle: 'italic', fontSize: 16, fontWeight: '700'}}>{createdAt}</Text></Text>
          <Text style={styles.textSmall}>Email: <Text style={{fontStyle: 'italic', fontSize: 16, fontWeight: '700'}}>{auth.currentUser.email}</Text></Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.text}>Total Creations</Text>
          <Text style={styles.textSmall}>{totalCreations} {totalCreations == 1 ? 'Recipe' : 'Recipes'}</Text>
        </View>
        <View style={styles.container}>
          {/* -Placeholders- TODO: Add Achievements  */}
          <Text style={styles.text}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <View style={[styles.achievementContainer, {backgroundColor: '#FF5722', opacity: 1}]}><Text style={{color: 'white', fontSize: 20}}>1</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#E53935'}]}><Text style={{color: 'white', fontSize: 20}}>2</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#1E88E5'}]}><Text style={{color: 'white', fontSize: 20}}>3</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#388E3C'}]}><Text style={{color: 'white', fontSize: 20}}>4</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#CED1D3'}]}><Text style={{color: 'white', fontSize: 20}}>5</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#CCCCCC'}]}><Text style={{color: 'white', fontSize: 20}}>6</Text></View>
          </ScrollView>
        </View>
        </>
        ) : (
          <AuthComponent />
        )
      }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
    paddingVertical: 10
  },
  achievementContainer: {
    borderRadius: 999,
    width: 70, 
    height: 70,
    justifyContent: 'center', 
    alignItems: 'center',
    marginHorizontal: 4,
    opacity: 0.2
  },
  text: {
    color: '#21212180',
    fontSize: 22,
    padding: 14,
    fontWeight: '700'
  },
  textMedium: {
    color: '#21212180',
    fontSize: 20,
    padding: 14,
    fontWeight: '700'
  },
  textSmall: {
    color: '#21212180',
    fontSize: 18,
    padding: 2,
    fontWeight: '500'
  }
})