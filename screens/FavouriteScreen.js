import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchBooks } from '../components/fetchBooks';
import { toggleFavorite } from '../components/toggleFavourite';
import { sendBookRecommendation } from '../components/sendEmail';
import { useTheme } from '../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons'
import { toggleRead } from '../components/toggleRead';
import Toast from 'react-native-root-toast';

const FavouriteScreen = () => {

  const [user, setUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { isDarkTheme } = useTheme();
  const [isRead, setIsRead] = useState({});


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

        // listener for the read status
        const readCollectionRef = collection(db, "markedasread");
        const readQuery = query(readCollectionRef, where("uid", "==", currentUser.uid));
        const unsubscribeReadSnapshot = onSnapshot(readQuery, (querySnapshot) => {
          const readStatus = {};
          querySnapshot.docs.forEach((doc) => {
            readStatus[doc.data().bookId] = true;
          });
          setIsRead(readStatus);
        }, (error) => {
          console.error("Error fetching read status: ", error);
        });

        // empty listener
        return () => {
          unsubscribeSnapshot();
          unsubscribeReadSnapshot();
        };
      } else {
        setUser(null);
        setFavourites([]);
        setLoading(false);
      }
    });

    // empty auth listener
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      checkReadStatus();
    }
  }, [user, favourites]);

  const checkReadStatus = async () => {
    const status = {};
    for (const book of favourites) {
      const docRef = doc(db, "markedasread", `${user.uid}_${book.bookId}`);
      const docSnapshot = await getDoc(docRef);
      status[book.bookId] = docSnapshot.exists();
    }
    setIsRead(status);
  };

  const handleToggleRead = async (bookId, bookTitle) => {
    try {
      const updatedReadStatus = await toggleRead(db, user, bookId, bookTitle);
      setIsRead((prevStatus) => ({
        ...prevStatus,
        [bookId]: updatedReadStatus,
      }));
      if (updatedReadStatus) {
        Toast.show('Added to Finished Books', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      } else {
        Toast.show('Removed from Finished Books', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  // function to handle email sending
  const handleSendEmail = async (book) => {
    let bookDetails = {
      title: book.bookTitle,
      authors: book.authors,
      description: book.description,
    };

    // fetch missing details to form the email
    if (!bookDetails.authors || !bookDetails.description) {
      try {
        const bookData = await fetchBooks(null, book.bookId);
        bookDetails.authors = bookData.volumeInfo.authors.join(", ") || "Unknown Author";
        bookDetails.description = bookData.volumeInfo.description || "No description available.";
      } catch (error) {
        console.error("Error fetching additional book details:", error);
        return;
      }
    }

    sendBookRecommendation(bookDetails);
  };


  const handleToggleFavorite = async (bookId, bookTitle) => {
    try {
      const updatedFavoriteStatus = await toggleFavorite(db, user, bookId, bookTitle);
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };


  //function to render the favourite id
  const renderFavoriteItem = ({ item }) => (
    // conditional render width to avoid render breaking when there is only one favourite
    <View style={[favourites.length === 1 ? { width: '100%' } : { width: '50%' }]}>
      <TouchableOpacity
      style={styles.favouriteItem}
      onPress={() => navigateToBookDetails(item.bookId)}
      >
        <View
          style={{ alignItems: 'center', marginBottom: 10 }}
          onPress={() => navigateToBookDetails(item.bookId)}
        >
          <Image
            style={styles.thumbnail}
            source={{
              uri: `https://books.google.com/books/content?id=${item.bookId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
            }}
          />
          <Text style={styles.bookTitle}>{item.bookTitle}</Text>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttonContainer}>

          {/* READ */}
          <TouchableOpacity
            style={{ margin: 3 }}

            // conditional alert message for adding books to Finished Books list
            onPress={async () => {
              try {
                await handleToggleRead(item.bookId, item.bookTitle);
              } catch (error) {
                console.error("Error toggling Finished Books status:", error);
              }
            }}
          >
            {isRead[item.bookId] ? <Ionicons name='book' size={40} color='#9a8d98' /> : <Ionicons name='book-outline' size={40} color='#9a8d98' />}
          </TouchableOpacity>

          {/* DELETE FROM FAVOURITES */}
          <TouchableOpacity
            style={{ margin: 3 }}
            onPress={async () => {
              Alert.alert(
                "Remove from Favourites",
                "Are you sure you want to remove this book from your favourites?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: async () => {
                      setLoading(true);
                      try {
                        await handleToggleFavorite(item.bookId, item.bookTitle);
                      } catch (error) {
                        console.error("Error removing from favourites:", error);
                      }
                      finally {
                        setLoading(false);
                      }
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name='heart' size={40} color='#9a8d98' />
          </TouchableOpacity>

          {/* RECOMMEND / EMAIL */}
          <TouchableOpacity
            style={{ margin: 3 }}
            onPress={() => handleSendEmail(item)}
          >
            <Ionicons name='mail-outline' size={40} color='#9a8d98' />
          </TouchableOpacity>
        </View>

      </TouchableOpacity>
    </View>
  );

  const navigateToBookDetails = async (bookId) => {
    try {
      // call fetchBooks with bookId to fetch detailed information
      const bookData = await fetchBooks(null, bookId);

      // structure item to include volumeInfo and saleInfo
      const item = {
        id: bookId,
        volumeInfo: bookData.volumeInfo || {},
        saleInfo: bookData.saleInfo || {},
      };

      navigation.navigate("BookDetails", { item });
    } catch (error) {
      console.error("Error fetching book details: ", error);
    }
  };

  return (
    <View style={isDarkTheme ? styles.darkContainer : styles.container}>
      <View style={styles.titleContainer}>
        <Text style={isDarkTheme ? styles.darkTitle : styles.title}>Favourite Books</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size='large'
          animating={loading}
          color={isDarkTheme ? '#4a4e68' : '#c9ada6'}
          style={{ marginTop: 10 }}
        />
      ) : (
        favourites.length ? (
          <FlatList
            style={{ borderTopWidth: 1, padding: 10, borderColor: '#9a8d98', alignSelf: 'center' }}
            data={favourites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item, index) => item.bookId + index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        ) : (
          <Text style={isDarkTheme ? styles.darkNoFavourites : styles.noFavourites}>No favourites</Text>
        )
      )}

    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f2e8e3',
    justifyContent: 'center',
  },
  darkContainer: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#22223a',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    width: 250,
    padding: 10,
    alignSelf: 'center',
  },
  favouriteItem: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#9a8d98',
    width: 170,
  },
  thumbnail: {
    borderWidth: 1,
    borderColor: '#9a8d98',
    borderRadius: 10,
    width: 100,
    height: 150,
  },
  row: {
    justifyContent: 'space-between',
  },
  title: {
    color: '#9a8d98',
    fontSize: 30,
    fontWeight: '700',
  },
  darkTitle: {
    color: '#9a8d98',
    fontSize: 30,
    fontWeight: '700',
  },
  bookTitle: {
    paddingTop: 10,
    textAlign: 'center',
    color: '#9a8d98',
    fontSize: 20,
    fontWeight: '700',
    flexWrap: 'wrap',
    width: 160
  },
  darkBookTitle: {
    color: '#9a8d98',
    fontSize: 20,
    fontWeight: '700',
  },
  noFavourites: {
    textAlign: 'center',
    color: '#c9ada6',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  darkNoFavourites: {
    textAlign: 'center',
    color: '#4a4e68',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});