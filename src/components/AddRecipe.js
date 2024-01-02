import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, SafeAreaView } from 'react-native';
import React, {useEffect, useState} from 'react';
import { collection, doc, arrayUnion, addDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AddRecipe({ route, navigation, setButtonPressed }) {
  const [isEdit, setIsEdit] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [recipeImage, setRecipeImage] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientAmount, setIngredientAmount] = useState(0);
  const [cookingTime, setCookingTime] = useState(0);
  const [servingSize, setServingSize] = useState(0);
  const [bakingDegree, setBakingDegree] = useState(0);

  // Checks if recipe already exists then all fields would be populated with recipe details to be edited
  useEffect(() => {
    if (route.params && route.params.recipeId) {
      const {recipeId} = route.params;
      setRecipeId(recipeId);
      setIsEdit(true)

      const fetchExistingDetails = async() => {
        try {
          const docRef = doc(db, "recipes", recipeId);
          const docSnap = await getDoc(docRef);
          const existingData = docSnap.data();

          setRecipeName(existingData.name)
          setRecipeImage(existingData.photo)
          setIngredients(existingData.ingredients || []);
          setInstructions(existingData.instructions || []);
          setCookingTime(existingData.cookingTime || 0);
          setServingSize(existingData.servingSize || 0)
          setBakingDegree(existingData.bakingDegree || 0)
        }catch(e){
          console.log(e)
        }
      }
      fetchExistingDetails();
    }
  }, [])

  // handles image picking using ImagePicker
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setRecipeImage(result.assets[0].uri)
    } else {
      alert('You did not select any image.');
    }
  };

  const handleAddRecipe = async() => {
    try {
      const recipesDocRef = collection(db, "recipes");
      const newRecipeRef = await addDoc(recipesDocRef, {
        name: recipeName,
        photo: recipeImage,
        ingredients: ingredients,
        instructions: instructions,
        cookingTime: cookingTime,
        servingSize: servingSize,    
        bakingDegree: bakingDegree,    
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      })
      const userDocRef = doc(db, "users", `${auth.currentUser.uid}`);
      await updateDoc(userDocRef, {
        recipes: arrayUnion(newRecipeRef.id)
      })
      setRecipeName('');
      setRecipeImage('');
      setIngredients([]);
      setInstructions([]);
      setCookingTime(0);
      setServingSize(0);
      setBakingDegree(0);
      setButtonPressed(false);
    } catch(e) {
      console.log(e)
    }
  }

  const handleEditRecipe = async () => {
    const data = {
      name: recipeName,
      photo: recipeImage,
      ingredients: ingredients,
      instructions: instructions,
      cookingTime: cookingTime,
      servingSize: servingSize,
      bakingDegree: bakingDegree,
    }
    try {
      const recipesRef = doc(db, "recipes", recipeId);
      await updateDoc(recipesRef, data);
      navigation.goBack();
  
    } catch(e){
      console.log(e)
    }
  }

  // handles adding each ingredient in ingredients array
  const handleAddIngredient = () => {
    if(ingredientName.trim() !== '' && ingredientAmount.trim() !== ''){
      setIngredients([...ingredients, {name: ingredientName, amount:ingredientAmount}]);
      setIngredientName('');
      setIngredientAmount('');  
    }
  }

  // handles deleting ingredient or instruction from their respective arrays
  const handleDeleteProp = async (prop, index) => {
    prop.splice(index, 1);
  }

  // handles adding each instruction in instructions array
  const handleAddInstruction = () => {
    if(instruction.trim() !== ''){
      setInstructions([...instructions, instruction]);
      setInstruction('');  
    }
  }

  return (
    <KeyboardAvoidingView>
      {/* Recipe name and Image upload */}
      <View style={styles.recipeNameContainer}>
        <TextInput autoCorrect={false} defaultValue={recipeName} placeholder='Recipe Name' onChangeText={setRecipeName} style={[styles.textInput, {width: '85%'}]}/>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Feather name="upload" size={22} color="#21212180" onPress={pickImageAsync} />      
          <Text style={[styles.text, {fontSize: 12}]}>Photo</Text>
        </View>
      </View>

      {/* Ingredients */}
      <View style={{backgroundColor: '#F0F0F0', marginVertical: 1, paddingVertical: 18}}>
        <Text style={styles.text}>Ingredients</Text>
        {ingredients && ingredients.map((ingredient, index) => (
          <View key={index} style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 25, gap: 8, paddingVertical: 2}}>
            <Text style={{fontSize: 16, color: '#21212180'}}>{ingredient.amount} {ingredient.name}</Text>
            <Text onPress={() => handleDeleteProp(ingredients, index)} style={{fontSize: 16, color: '#21212180'}}>X</Text>
          </View>
        ))}
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
          <TextInput autoCorrect={false} placeholder='Ingredient Name' defaultValue={ingredientName} onChangeText={setIngredientName} style={styles.textInput}/>
          <TextInput autoCorrect={false} placeholder='Ingredient Amount' value={ingredientAmount} onChangeText={setIngredientAmount} style={styles.textInput}/>
          <View>
            <MaterialIcons name="add-circle-outline" size={26} color="#21212180" onPress={handleAddIngredient}/>
          </View>
        </View>
      </View>

      {/* Instructions */}
      <View style={{backgroundColor: '#F0F0F0', marginVertical: 1, paddingVertical: 18}}>
        <Text style={styles.text}>Instructions</Text>
        {instructions && instructions.map((instruction, index) => (
          <View key={index} style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 25, paddingVertical: 2, gap: 8}}>
            <Text style={{fontSize: 16, color: '#21212180'}}>{instruction}</Text>
            <Text onPress={() => handleDeleteProp(instructions, index)} style={{fontSize: 16, color: '#21212180'}}>X</Text>
          </View>
        ))}
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 14, gap: 12}}>
          <TextInput autoCorrect={false} placeholder='Add instruction..' value={instruction} onChangeText={setInstruction} style={[styles.textInput, {width: '85%'}]}/>
          <MaterialIcons name="add-circle-outline" size={26} color="#21212180" onPress={handleAddInstruction} />
        </View>
      </View>

      {/* Cooking Time */}
      <View style={{backgroundColor: '#F0F0F0', paddingVertical: 28, marginVertical: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Text style={styles.text}>Cooking Time</Text>
          <Entypo name="time-slot" size={20} color="#21212180" />
        </View>
        <View style={{marginLeft: 12}}>
          <TextInput autoCorrect={false} placeholder='Add cooking time...' value={String(cookingTime)} onChangeText={setCookingTime} style={[styles.textInput, {width: '85%'}]}/>
        </View>
      </View>

      {/* Serving Size */}
      <View style={{backgroundColor: '#F0F0F0', paddingVertical: 28, marginVertical: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Text style={styles.text}>Serving Size</Text>
          <Ionicons name="people-circle-outline" size={26} color="#21212180" />
        </View>
        <View style={{marginLeft: 12}}>
          <TextInput autoCorrect={false} placeholder='Add serving size...' value={String(servingSize)} onChangeText={setServingSize} style={[styles.textInput, {width: '85%'}]}/>
        </View>
      </View>

      {/* Baking Degree */}
      <View style={{backgroundColor: '#F0F0F0', paddingVertical: 28, marginVertical: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Text style={styles.text}>Baking Degree</Text>
          <MaterialCommunityIcons name="thermometer-lines" size={26} color="#21212180" />              
        </View>
        <View style={{marginLeft: 12}}>
          <TextInput autoCorrect={false} placeholder='Add baking degree...' value={String(bakingDegree)} onChangeText={setBakingDegree} style={[styles.textInput, {width: '85%'}]}/>
        </View>
      </View>

      {/* Add Recipe / Update Recipe Button */}
      <Pressable style={styles.button} onPress={() => isEdit? handleEditRecipe() : handleAddRecipe()}>
        <View style={{backgroundColor: '#33333390', padding: 10, paddingHorizontal: 18, borderRadius: 8}}>
          <Text style={{fontSize: 20, color: '#F0F0F0', fontWeight: '700'}}>{isEdit? 'Update Recipe' : 'Add Recipe'}</Text>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 20,
    color: '#21212180',
    fontWeight: '500', 
    borderBottomColor: '#21212180',
    borderBottomWidth: 0.2,
    paddingVertical: 14,
  },
  recipeNameContainer: {
    backgroundColor: '#F0F0F0',
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 1, 
    paddingVertical: 18, 
    paddingHorizontal: 20
  },
  text: {
    color: '#21212180',
    fontSize: 22,
    padding: 12,
    fontWeight: '700'
  },
  button: {
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    padding: 6, 
    width: '100%'
    // marginLeft: 'auto',
    // marginRight: 'auto',
    // marginVertical: 5,
    // paddingHorizontal: 20,
    // borderRadius: 20
  }
})