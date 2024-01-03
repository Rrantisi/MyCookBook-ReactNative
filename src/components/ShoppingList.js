import { ActivityIndicator, StyleSheet, Text,  View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { Fontisto } from '@expo/vector-icons';

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShoppingListItems = async() => {
  
      try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          const items = userDocSnap.data().shoppingList || [];
          setItems(items);
          setLoading(false);
        } catch(e){
          console.log(e)
        }
      }
      fetchShoppingListItems();
  }, [])

  return (
    <View style={{height: '100%', marginTop: 30}}>
      <Text style={styles.text}>Shopping List</Text>
      {loading && (
        <View>
          <ActivityIndicator size="large" />
        </View>
      )}
      <View style={{marginVertical: 30}}>
      {
        items.map((item, index) => (
          <View key={index} style={styles.itemWrapper}>
            <Fontisto name={items[item.name] ? 'checkbox-active' : 'checkbox-passive'} size={18} color="#F0F0F0" style={{marginLeft: 15}} onPress={() => handleRemoveFromFavorite(item.name)}/>
            <Text key={index} style={styles.textMedium}>{item}</Text>
          </View>
        ))
      }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#ffffff',
    letterSpacing: 1.2,
    fontSize: 24,
    padding: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  textMedium: {
    color: '#F0F0F0',
    fontSize: 20,
    paddingVertical: 14,
    fontWeight: '500',
  },
  itemWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F0F0F010',
    gap: 15,
    marginVertical: 2
  }
})