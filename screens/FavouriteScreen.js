import { ActivityIndicator, Button, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchBooks } from '../components/fetchBooks';
import { toggleFavorite } from '../components/toggleFavourite';

const FavouriteScreen = () => {
  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(true);


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const favCollectionRef = collection(db, "favourites");
        const q = query(favCollectionRef, where("uid", "==", currentUser.uid));


        // listener so the favourites will update correctly
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const favouritesData = querySnapshot.docs.map((doc) => ({
            bookId: doc.data().bookId,
            bookTitle: doc.data().bookTitle,
          }));
          setFavourites(favouritesData);
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






  const handleToggleFavorite = async (bookId, bookTitle) => {
    try {
      const updatedFavoriteStatus = await toggleFavorite(db, user, bookId, bookTitle);
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };


  //function to render the favourite id
  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity style={styles.favouriteItem}
      onPress={() => navigateToBookDetails(item.bookId)}
    >
      <Image
        style={styles.thumbnail}
        source={{
          uri: `https://books.google.com/books/content?id=${item.bookId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
        }}
      />
      <Text>{item.bookTitle}</Text>
      <Text>{item.bookId}</Text>
      <Button
        title="Remove from Favorites"
        onPress={() => handleToggleFavorite(item.bookId, item.bookTitle)}
      />
    </TouchableOpacity>
  );

  const navigateToBookDetails = async (bookId) => {
    try {
      // Call fetchBooks with bookId to fetch detailed information
      const bookData = await fetchBooks(null, bookId);

      // Structure item to include volumeInfo and saleInfo
      navigation.navigate("BookDetails", {
        item: {
          id: bookId,
          volumeInfo: bookData.volumeInfo || {},
          saleInfo: bookData.saleInfo || {},
        },
      });
    } catch (error) {
      console.error("Error fetching book details: ", error);
    }
  };

  return (
    <View style={styles.favouritesContainer}>
      <Text style={styles.title}>Favourite Books</Text>

      {/* if loading == true display ActivityIndicator else if favourites length > 0
      if true render favourites else render "No favourites found." */}

      {loading ? (
        <ActivityIndicator />
      ) : (
        favourites.length ? (
          <FlatList
            data={favourites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item, index) => item.bookId + index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        ) : (
          <Text>No favourites found.</Text>
        )
      )}

    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 20,
  },
  favouritesContainer: {
    marginTop: 100,
    marginBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  favouriteItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 10,
  },
  thumbnail: {
    width: 100,
    height: 150,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});