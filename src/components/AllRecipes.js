import { StyleSheet, Image, Text, View, FlatList, Pressable, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function AllRecipes() {
  const navigation = useNavigation();
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const recipes = [];

        const q = query(collection(db, "recipes"), where ("userId", "==", auth.currentUser.uid));

        // get the documents that match the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          querySnapshot.forEach((doc) => {
            recipes.push({ id: doc.id, ...doc.data() });
          })

        } else {
          recipes.push({ message: 'Add Your First Recipe' })
        }

        setAllRecipes(recipes)
        setLoading(false);
      } catch(e) {
        console.log('Error fetching user recipes:', e)
      }
    }

    fetchAllRecipes();
  }, []);

  return (
    <View>
      {
        loading && (
          <View style={{justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#21212120'}}>
            <ActivityIndicator size="large" />
          </View>
        )
      }
      <FlatList
        data={allRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Pressable key={item.id} onPress={() => navigation.navigate('Detail', {recipeId: item.id})} style={{flexDirection: index % 2 === 0 ? 'row' : 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, backgroundColor: index % 3 === 0 ? '#21212120' : '#21212110', marginVertical: 2}}>
            <View style={{width: 110, height: 110, marginVertical: 10, backgroundColor: index % 3 === 0 ? '#333333' : '#FFFFFF', borderRadius: 999, padding: 4, shadowColor: '#212121', shadowOpacity: 0.3, justifyContent: 'center', alignItems: 'center'}}>
              {item.photo ? (
                <Image source={{uri: item.photo}} style={{width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 999}}/>
              ) : (
                <FontAwesome name="photo" size={50} color="#33333380"/>
              )}
            </View>
            <View>
              <Text style={styles.text}>{item.message? item.message : item.name}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#21212185',
    fontSize: 28, 
    fontWeight: '500',
    letterSpacing: 0.6
  }
})