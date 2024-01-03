import { StyleSheet, Text, View, Pressable, Image, ScrollView, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function Favorites() {
  const [recipeInfo, setRecipeInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch Recipe Info using recipeId retrieved in user's favorites recipes in db
  const fetchRecipeInfo = async(recipeId) => {
    try {
      // Check if recipe is from myKitchen (user data)
      if(recipeId.length > 16){
        const docRef = doc(db, "recipes", recipeId);
        const docSnap = await getDoc(docRef);
        const recipeData = {id: recipeId, ...docSnap.data()}
        setRecipeInfo(prevState => [...prevState, recipeData]);
      } else {
      // Else fetch recipe details from api
        const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const allData = response.data.meals[0];
        setRecipeInfo(prevState => [...prevState, allData]);
      }  
  } catch(e){
      console.log(e)
    }  
  }

  useEffect(() => {
    // Fetch Favorites Recipes Ids from db
    const fetchFavoritesRecipes = async() => {
      try {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          const favorites = userDocSnap.data().favorites || [];

          setRecipeInfo([])

          favorites.forEach(recipe => {
            fetchRecipeInfo(recipe)
          })

          setIsLoading(false);
        } catch(e){
          console.log(e)
        }
      }
      fetchFavoritesRecipes();
  }, [])

  return (
    <ScrollView>
      <Text style={styles.text}>Favorites</Text>
        { isLoading && (
          <View>
            <ActivityIndicator size="large"/>
          </View>  
        )}
        
        {recipeInfo.map((recipe, index) => (
          <Pressable key={index} onPress={() => navigation.navigate('Detail', {recipeId: recipe.id || recipe.idMeal})} style={styles.recipeContainer}>

            {/* Recipe Image */}
            <View style={styles.imageContainer}>
              <Image source={{uri: recipe.photo || recipe.strMealThumb}} style={styles.image}/>
            </View>

            <View>
              {/* Recipe Name */}
              <Text style={styles.textLarge}>
                {recipe.name || recipe.strMeal}
              </Text>

              {/* Recipe Origin */}
              <Text style={styles.textSmall}>
                {recipe.strArea || 'My Kitchen'}
              </Text>
            </View>
          </Pressable>
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    fontSize: 25, 
    padding: 10
  },
  textLarge: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '600',
    marginTop: 10
  },
  textSmall: {
    color: '#F0F0F090',
    fontSize: 14, 
    marginVertical: 4
  },
  image: {
    width: '100%', 
    height: '100%',
    resizeMode: 'stretch',
    borderRadius: 10
  },
  imageContainer: {
    marginVertical: 0.5,
    width: 80, 
    height: 80,
    borderRadius: 10
  },
  recipeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
    marginVertical: 2,
    backgroundColor: '#21212180',
    padding: 15
  }
})

