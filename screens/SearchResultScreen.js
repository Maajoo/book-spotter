import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, TextInput, View, FlatList, Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { fetchBooks } from '../components/fetchBooks';
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from '../ThemeContext';
import { renderBooks } from '../components/renderBooks';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons'


const SearchResultScreen = () => {
  const route = useRoute();
  const { results = [] } = route.params; // default to an empty array in case results are undefined
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { isDarkTheme } = useTheme();

  // set user to "currentUser" when logged in otherwise "null"
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // cleanup subscription on unmount
  }, []);

  // function to add search to "recentSearches" database and call "fetchBooks" function when the "Search" TouchableOpacity is pressed
  const handleSearch = async () => {
    //check if user is logged in
    if (!user) {
      console.error("No user is logged in");
      return;
    }

    setLoading(true);

    // save search to recentSearches collection
    if (keyword.trim()) {
      try {
        await addDoc(collection(db, "recentSearches"), {
          keyword: keyword, // searched book name
          uid: user.uid, // associate the search with the current users ID
          timestamp: new Date(), // save the timestamp for sorting
        });
        console.log("Search saved to recentSearches collection");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }

    // call fetchBooks function
    fetchBooks(keyword)
      .then(data => {
        navigation.navigate("SearchResult", { results: data.items });
      })
      .catch(err => console.error(err))
      .finally(() => {
        setKeyword(""); // reset searchbar
        setLoading(false); //set loading to false
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={isDarkTheme ? styles.darkContainer : styles.container}>




        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.backButton}
          >
            <Ionicons name={'caret-back-circle-outline'} size={30} color="#9a8d98" />
          </TouchableOpacity>

          <TextInput
            placeholder='Write a book name here...'
            value={keyword}
            onChangeText={text => setKeyword(text)}
            style={isDarkTheme ? styles.darkInput : styles.input}
            placeholderTextColor={isDarkTheme ? '#9a8d98' : '#9a8d98'}
          />
          <TouchableOpacity
            style={styles.searchButton}
            disabled={loading}
            onPress={handleSearch}
          >
            <Ionicons name={'search-outline'} size={30} color="#9a8d98" />
          </TouchableOpacity>
        </View>




        <ActivityIndicator
          size='large'
          animating={loading}
          color={isDarkTheme ? '#4a4e68' : '#c9ada6'}
          style={{ margin: 5 }}
        />
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderBooks({ item, navigation, isDarkTheme })}
          style={{ borderTopWidth: 1, borderTopColor: '#9a8d98', width: '100%' }}
          ListFooterComponent={<View style={{ height: 50 }} />} //empty space at the end of the list
        />
      </View>
    </TouchableWithoutFeedback >
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2e8e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#22223a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
  },
  input: {
    flex: 5,
    borderWidth: 1,
    borderColor: '#9a8d98',
    borderRadius: 10,
    padding: 10,
    height: 50,
    color: '#4a4e68',
  },
  darkInput: {
    flex: 5,
    borderWidth: 1,
    borderColor: '#9a8d98',
    borderRadius: 10,
    padding: 10,
    height: 50,
    color: '#f2e8e3',
  },
  searchButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 10,
    justifyContent: 'center',
  },
  backButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginRight: 5,
    marginLeft: 10,
    justifyContent: 'center',
  },
});