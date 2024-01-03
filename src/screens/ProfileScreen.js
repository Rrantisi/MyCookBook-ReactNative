import { StyleSheet, Text, Pressable, View, ScrollView, SafeAreaView,ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { auth, db } from '../../firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { withAuthentication } from '../components/withAuthentication';

// TODO: add auth check 
const ProfileScreen = () => {
  const [createdAt, setCreatedAt] = useState('');
  const [userName, setUserName] = useState('');
  const [totalCreations, setTotalCreations] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [totalListItems, setTotalListItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const user = auth.currentUser || null;

  // Fetch User Data from DB
  const fetchData = async () => {
    try {
      const users = collection(db, "users");
      const docSnap = await getDocs(users);

      docSnap.forEach((doc)=> {
        if (doc.id === user.uid){
          setUserName(doc.data().displayName)
          const date = doc.data().createdAt.toDate();
          const formattedDate = `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`
          setCreatedAt(formattedDate)
          setTotalSaved(doc.data().saved.length)
          setTotalFavorites(doc.data().favorites.length)
          setTotalListItems(doc.data().shoppingList.length)
          setLoading(false);
        }
      })
    } catch (error) {
      console.error("Error getting documents: ", error);
      setLoading(false);
    }
  };
  
  fetchData();

  useEffect(() => {
    handleFetchCreations();
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
    try {
      const q = query(collection(db, "recipes"), where ("userId", "==", auth.currentUser.uid));

      // get the documents that match the query
      const querySnapshot = await getDocs(q);
      setTotalCreations(querySnapshot.size)
  
    } catch(e){
      console.error('Something Went Wrong', e);
    }
  }

  return (
    <ScrollView>
      {/* Loading Activity Indicator */}
      { loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
        </View>  
      ) : (
      <SafeAreaView style={{flexGrow: 1, backgroundColor: '#F9F9F9'}}>
        <>
        {/* Welcome Message, Logout button, user status */}
        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F0F0', paddingVertical: 8, marginVertical: 1}}>
          <Text style={{ padding: 2, marginBottom: 20, fontSize: 16, color: '#21212180', fontWeight: '500'}}>Profile</Text>
          <MaterialCommunityIcons name="home-heart" size={50} color="#B71C1C" />            
          <Text style={[styles.text, {paddingBottom: 0}]}>Hi, {userName}</Text>
          <Pressable onPress={handleLogout}><Text style={{color: '#21212180'}}>Not {userName}? Logout</Text></Pressable>

          {/* Placeholder for user */}
          {/* <Text style={styles.textMedium}>Your Status</Text>
          <View style={[styles.achievementContainer, {backgroundColor: '#FF5722', opacity: 1}]}><Text style={styles.achievementText}>1</Text></View> */}
        </View>

        {/* Member since date and user email address */}
        <View style={styles.containerV}>
          <Text style={styles.text}>At a glance</Text>
          <Text style={styles.textSmall}>Member Since: <Text style={{fontStyle: 'italic', fontSize: 16, fontWeight: '700'}}>{createdAt}</Text></Text>
          <Text style={styles.textSmall}>Email: <Text style={{fontStyle: 'italic', fontSize: 16, fontWeight: '700'}}>{auth.currentUser.email}</Text></Text>
        </View>

        {/* Total Recipe Creation by user */}
        <View style={styles.containerV}>
          <Text style={styles.text}>Total Creations</Text>
          <Text style={styles.textSmall}>{totalCreations} {totalCreations == 1 ? 'Recipe' : 'Recipes'}</Text>
        </View>

        {/* Total Saved Recipes by user */}
        <View style={styles.containerH}>
          <Text style={styles.text}>Saved Recipes:</Text>
          <Pressable onPress={() => {navigation.navigate('Saved')}}>
            <Text style={[styles.textSmall, {textDecorationLine: 'underline'}]}>{totalSaved}</Text>
          </Pressable>
        </View>

        {/* Total Favorite Recipes by user */}
        <View style={styles.containerH}>
          <Text style={styles.text}>Favorites:</Text>
          <Pressable onPress={() => navigation.navigate('Favorites')}>
            <Text style={[styles.textSmall, {textDecorationLine: 'underline'}]}>{totalFavorites}</Text>
          </Pressable>
        </View>

        {/* Total Items in Shopping List by user */}
        <View style={styles.containerH}>
          <Text style={styles.text}>Shopping List Items:</Text>
          <Text style={[styles.textSmall, {textDecorationLine: 'underline'}]}>{totalListItems}</Text>
        </View>

        {/* -Placeholders- TODO: Add Achievements  */}
        {/* <View style={styles.container}>
          <Text style={styles.text}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal: 20, paddingVertical: 10}}>
            <View style={[styles.achievementContainer, {backgroundColor: '#FF5722', opacity: 1}]}><Text style={styles.achievementText}>1</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#E53935'}]}><Text style={styles.achievementText}>2</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#1E88E5'}]}><Text style={styles.achievementText}>3</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#388E3C'}]}><Text style={styles.achievementText}>4</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#CED1D3'}]}><Text style={styles.achievementText}>5</Text></View>
            <View style={[styles.achievementContainer, {backgroundColor: '#CCCCCC'}]}><Text style={styles.achievementText}>6</Text></View>
          </ScrollView>
        </View> */}
        </>      
      </SafeAreaView>
    )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  containerV: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
    paddingVertical: 14
  },
  containerH: {
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1,
    paddingVertical: 14
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
  achievementText: {
    color: '#FFFFFF', 
    fontSize: 20
  },
  text: {
    color: '#21212180',
    fontSize: 22,
    padding: 16,
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

export default withAuthentication(ProfileScreen);