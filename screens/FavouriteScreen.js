import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const FavouriteScreen = () => {
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const favCollectionRef = collection(db, "favourites");
        const q = query(favCollectionRef, where("uid", "==", currentUser.uid));


        // listener so the favourites will update correctly
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const favs = querySnapshot.docs.map((doc) => doc.data().bookId);
          setFavourites(favs);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching favourites: ", error);
          setLoading(false);
        });

        // empty listener
        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setFavourites([]);
        setLoading(false);
      }
    });


    // empty auth listener
    return () => unsubscribeAuth();
  }, []);

  //function to render the favourite id (WILL BE CHANGED TO COVER PICTURE AND BOOK NAME IN THE FUTURE)
  const renderFavoriteItem = (bookId, index) => (
    <View key={index} style={styles.favoriteItem}>
      <Text>Book ID: {bookId}</Text>
    </View>
  );


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Favourite Books</Text>

      {/* if loading == true display ActivityIndicator else if favourites length > 0
      if true render favourites else render "No favourites found." */}
      {loading ? (
        <ActivityIndicator />
      ) : (
        favourites.length ? (
          favourites.map(renderFavoriteItem)
        ) : (
          <Text>No favourites found.</Text>
        )
      )}

    </ScrollView>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  favoriteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});