import { StyleSheet, Image, Text, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRecipe from '../components/AddRecipe';
import { useNavigation } from '@react-navigation/native';
import { arrayUnion , updateDoc,  getDoc, deleteDoc, doc, arrayRemove} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

export default function RecipeDetails(props) {
  const [recipeDetails, setRecipeDetails] = useState([]);
  const [editClicked, setEditClicked] = useState(false);
  const [favoriteClicked, setFavoriteClicked] = useState(false);
  const [savedClicked, setSavedClicked] = useState(false);
  const [isUserData, setIsUserData] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const navigation = useNavigation();

  const { route } = props;
  const { recipeId } = route.params;

  const handleDeleteRecipe = async() => {
    await deleteDoc(doc(db, "recipes", recipeId));
    navigation.goBack();
  }

  // Handle add Recipe to Saved Items
  const handleSave = async() => {
    const recipeRef = doc(db, "recipes", recipeId);
    const userDocRef = doc(db, "users", `${auth.currentUser.uid}`);
    try {
      if(!savedClicked) {
        await updateDoc(userDocRef, {
          saved: arrayUnion(recipeRef.id)
        })
        setSavedClicked(true)
      } else {
        await updateDoc(userDocRef, {
          saved: arrayRemove(recipeRef.id)
        })
        setSavedClicked(false);
      }      
    } catch(e) {
      console.log(e)
    }
  }

  // Handle add Recipe to Favorites
  const handleAddFavorite = async() => {
    const recipeRef = doc(db, "recipes", recipeId);
    const userDocRef = doc(db, "users", `${auth.currentUser.uid}`);
    try {
      if(!favoriteClicked){
        await updateDoc(userDocRef, {
          favorites: arrayUnion(recipeRef.id)
        })
        setFavoriteClicked(true);  
      } else {
        await updateDoc(userDocRef, {
          favorites: arrayRemove(recipeRef.id)
        })
        setFavoriteClicked(false);  
      }
    } catch(e) {
      console.log(e)
    }
  }

  // Handle add Item to Shopping List
  const handleAddToShoppingList = async (ingredientName) => {
    const userDocRef = doc(db, "users", `${auth.currentUser.uid}`);

    setCheckedIngredients(prevState => ({
      ...prevState,
      [ingredientName]: !prevState[ingredientName]
    }));

    if(!checkedIngredients[ingredientName]) {
      await updateDoc(userDocRef, {
        shoppingList: arrayUnion(ingredientName) 
      })
     } else {
      await updateDoc(userDocRef, {
        shoppingList: arrayRemove(ingredientName)
      })
     }
  };

  useEffect(() => {
    // Check if recipe is fetched from user data or api using recipeId (user data have longer recipeId)
    setIsUserData(recipeId.length > 16)
    const fetchRecipe = async() => {
      try {
        if(isUserData){
          const docRef = doc(db, "recipes", recipeId);
          const docSnap = await getDoc(docRef);
          setRecipeDetails(docSnap.data())
        } else {
          const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
          const allData = response.data.meals[0];
          let recipeIngredients = [];

          for(let i = 1; i <= 20; i++){
            const ingredient = allData[`strIngredient${i}`]
            const measure = allData[`strMeasure${i}`]

            if(ingredient && measure){
              recipeIngredients.push({amount: `${measure}`, name: `${ingredient}`})
            }
          }

          setRecipeDetails({ 
            photo: response.data.meals[0].strMealThumb,
            name: response.data.meals[0].strMeal,
            category: response.data.meals[0].strCategory,
            area: response.data.meals[0].strArea,
            tags: response.data.meals[0].strTags,
            youtube: response.data.meals[0].strYoutube,
            instructions: response.data.meals[0].strInstructions,
            ingredients: recipeIngredients
          })    
        }

        const userDocRef = doc(db, "users", `${auth.currentUser.uid}`);
        const userDocSnap = await getDoc(userDocRef); // Fetch user document snapshot
        const savedRecipes = userDocSnap.data().saved || [];
        const favoriteRecipes = userDocSnap.data().favorites || []; 

        // checks if the user has the recipe saved and/or in favorites
        const isRecipeSaved = savedRecipes.includes(recipeId);
        const isFavorite = favoriteRecipes.includes(recipeId);
        setSavedClicked(isRecipeSaved);
        setFavoriteClicked(isFavorite);
      } catch(e){
        console.log('An Error has occurred', e)
      }
    }
    fetchRecipe();
  }, [isUserData, recipeId])

  return (
    <SafeAreaView>
      {/* Icons Container */}
      <View style={styles.iconsContainer}>
      <View >
        {isUserData &&
          <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4}}>
            {editClicked ? (
                <TouchableOpacity onPress={() => setEditClicked(false)}><MaterialIcons name="cancel" size={22} color="#21212180" /></TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setEditClicked(true)}><Feather name="edit" size={20} color="#21212180" /></TouchableOpacity>
              )}
            <TouchableOpacity onPress={handleDeleteRecipe}><MaterialIcons name="delete" size={24} color="#21212180"/></TouchableOpacity>
          </View>      
        }
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign name="back" size={24} color="#21212180" style={{marginLeft: 10}}/>
      </TouchableOpacity>
      </View>

      {/* Edit Recipe */}
      { editClicked ? (
          <ScrollView>
            <AddRecipe route={route} navigation={navigation} />
          </ScrollView>
      ):(
      /* Recipe Details */
         <ScrollView>
          {/* Save and Add to Favorites icons */}
          <View style={{flexDirection: 'row', zIndex: 1000}}>
            <TouchableOpacity style={{position: 'absolute', marginTop: 10, left: '2%'}} onPress={handleSave}>
              <MaterialIcons name='bookmark' size={34} color={savedClicked ? 'black' : '#f0f0f0'} style={styles.recipeIcon}/>
            </TouchableOpacity>
            <TouchableOpacity style={{position: 'absolute', marginTop: 10 , right: '2%'}}>
              <MaterialIcons name='favorite' size={34} color={favoriteClicked ? '#FF0000' : '#f0f0f0'} onPress={handleAddFavorite} style={styles.recipeIcon}/>            
            </TouchableOpacity>
          </View>

          {/* Recipe Image */}
          <View style={{width: '100%', height: 480}}>
          {recipeDetails.photo && (
              <Image source={{uri: recipeDetails.photo}} style={{width: '100%', height: '100%', resizeMode: 'cover', position: 'relative'}} />
          )}
          </View>

          {/* Recipe Name */}
          <Text style={styles.text}>{recipeDetails.name}</Text>

          {/* Recipe Ingredients */}
          <Text style={[styles.textMedium, {marginTop: 15, marginHorizontal: 14}]}>Ingredients</Text>
          {recipeDetails.ingredients && recipeDetails.ingredients.map((ingredient, index) => (
            <View key={index} style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
              <Fontisto name={checkedIngredients[ingredient.name] ? 'checkbox-active' : 'checkbox-passive'} size={18} color="#21212180" style={{marginLeft: 24}} onPress={() => handleAddToShoppingList(ingredient.name)}/>
              <Text style={styles.textSmall}>{ingredient.amount} {ingredient.name}</Text>
            </View>
          ))}

          {/* Recipe Instructions */}
          <Text style={[styles.textMedium, {marginTop: 15, marginHorizontal: 14}]}>Instructions</Text>
          {isUserData && recipeDetails.instructions && recipeDetails.instructions.map((instruction) => (
            <Text style={[styles.textSmall, {marginHorizontal: 18}]}>{instruction}</Text> 
          ))}
          {!isUserData && recipeDetails.instructions && (
            <Text style={[styles.textSmall, {marginHorizontal: 18}]}>{recipeDetails.instructions}</Text> 
          )}

          {/* Other Recipe Info */}
          <View style={{flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 15, alignItems: 'center', marginVertical: 20}}>
            <View style={{backgroundColor: '#FFB74D', borderRadius: '50%',  alignItems: 'center'}}>
              <View style={{backgroundColor: 'white', paddingVertical: 15, borderTopLeftRadius: '50%', borderTopRightRadius: '50%'}}>
              <Ionicons name="md-timer-outline" size={30} color="#21212180" style={{paddingVertical: 5, paddingHorizontal: 22}}/>
              </View>
              <Text style={[styles.textMedium, styles.textIcon]}>{recipeDetails.cookingTime || 'N/A'}</Text> 
            </View>
            <View style={{backgroundColor: '#FFB74D', borderRadius: '50%',  alignItems: 'center'}}>
              <View style={{backgroundColor: 'white', paddingVertical: 15, borderTopLeftRadius: '50%', borderTopRightRadius: '50%'}}>
              <MaterialCommunityIcons name="thermometer-lines" size={30} color="#21212180" style={{paddingVertical: 5, paddingHorizontal: 22}}/>              
            </View>
              <Text style={[styles.textMedium, styles.textIcon]}>{recipeDetails.bakingDegree || 'N/A'}</Text> 
            </View>
            <View style={{backgroundColor: '#FFB74D', borderRadius: '50%', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{backgroundColor: 'white', paddingVertical: 15, borderTopLeftRadius: '50%', borderTopRightRadius: '50%'}}>
              <Ionicons name="people" size={30} color="#21212180" style={{paddingVertical: 5, paddingHorizontal: 22}}/>            
            </View>
            <Text style={[styles.textMedium, styles.textIcon]}>{recipeDetails.servingSize || 'N/A'}</Text>
            </View>
            <View style={{backgroundColor: '#FFB74D', borderRadius: '50%', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{backgroundColor: 'white', paddingVertical: 15, borderTopLeftRadius: '50%', borderTopRightRadius: '50%'}}>
              <MaterialCommunityIcons name="altimeter" size={30} color="#21212180" style={{paddingVertical: 5, paddingHorizontal: 22}}/>            
            </View>
            <Text style={[styles.textMedium, styles.textIcon]}>Easy</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    color: '#21212180',
    fontSize: 30,
    fontWeight: '700',
    marginHorizontal: 14,
    textAlign: 'center',
    marginTop: 16,
    marginVertical: 8
  },
  textMedium: {
    color: '#21212180',
    fontSize: 20,
    padding: 14,
    fontWeight: '700'
  },
  textIcon: {
    paddingVertical: 10,
    color: '#FFFFFF'
  },
  textSmall: {
    color: '#21212180',
    fontSize: 18,
    paddingHorizontal: 14,
    fontWeight: '500',
    paddingVertical: 4
  },
  iconsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginHorizontal: 18, 
    marginVertical: 5
  },
  recipeIcon: {
    backgroundColor: '#21212145',
    padding: 5
  }
})

