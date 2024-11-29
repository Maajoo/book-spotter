import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchBooks } from '../components/fetchBooks';
import { toggleRead } from '../components/toggleRead';
import { useTheme } from '../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons'


const ReadScreen = () => {
  const [user, setUser] = useState(null);
  const [markedAsRead, setMarkedAsRead] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { isDarkTheme } = useTheme();



  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const readCollectionRef = collection(db, "markedasread");
        const q = query(readCollectionRef, where("uid", "==", currentUser.uid));


        // listener so the read list will update correctly
        const unsubscribeSnapshot = onSnapshot(q, (querySnapshot) => {
          const readData = querySnapshot.docs.map((doc) => ({
            bookId: doc.data().bookId,
            bookTitle: doc.data().bookTitle,
          }));
          setMarkedAsRead(readData);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching readlist: ", error);
          setLoading(false);
        });

        // empty listener
        return () => unsubscribeSnapshot();
      } else {
        setUser(null);
        setMarkedAsRead([]);
        setLoading(false);
      }
    });

    // empty auth listener
    return () => unsubscribeAuth();
  }, []);


  const handleToggleRead = async (bookId, bookTitle) => {
    try {
      const updatedReadStatus = await toggleRead(db, user, bookId, bookTitle);
    } catch (error) {
      console.error("Error marking as unread:", error);
    }
  };

  //function to render the read id
  const renderReadItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.readItem}
        onPress={() => navigateToBookDetails(item.bookId)}
      >
        <Image
          style={styles.thumbnail}
          source={{
            uri: `https://books.google.com/books/content?id=${item.bookId}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
          }}
        />

        <View style={styles.bookTitleContainer}>
          <Text style={styles.bookTitle}>{item.bookTitle}</Text>
        </View>

      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{ margin: 3 }}
          onPress={async () => {
            Alert.alert(
              "Remove from Finished Books",
              "Remove this book from Finished Books?",
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
                      await handleToggleRead(item.bookId, item.bookTitle);
                    } catch (error) {
                      console.error("Error removing Finished Books:", error);
                    } finally {
                      setLoading(false);
                    }
                  },
                },
              ]
            );
          }}
        >
          <Ionicons name='book' size={40} color='#9a8d98' />
        </TouchableOpacity>
      </View>

    </View>
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
    <View style={isDarkTheme ? styles.darkContainer : styles.container}>

      <View style={styles.headerContainer}>

        <View style={{ flex: 1 }} >
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.backButton}
          >
            <Ionicons name={'caret-back-circle-outline'} size={30} color="#9a8d98" />
          </TouchableOpacity>
        </View>


        <View style={styles.titleContainer}>
          <Text style={isDarkTheme ? styles.darkTitle : styles.title}>Finished Books</Text>
        </View>

        <View style={{ flex: 1 }}></View>

      </View>


      {/* if loading == true:
            display ActivityIndicator.
          Else if
            markedasread length > 0:
              if true:
                render markedasread
              else:
                render "No read books found." */}
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          markedAsRead.length ? (
            <FlatList
              data={markedAsRead}
              renderItem={renderReadItem}
              keyExtractor={(item, index) => item.bookId + index.toString()}
              style={{ width: '100%', borderTopWidth: 1, borderColor: '#9a8d98', paddingTop: 30 }}
              ListFooterComponent={<View style={{ height: 50 }} />}
            />
          ) : (
            <Text style={isDarkTheme ? styles.darkNoFinishedBooks : styles.noFinishedBooks}>No finished books</Text>
          )
        )}
      </View>
    </View >
  );
};

export default ReadScreen;

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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    flex: 3,
    alignItems: 'center',
    width: '100%',
    width: 250,
    padding: 10,
  },
  itemContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  bookTitleContainer: {
    width: '75%',
    marginLeft: 10,
  },
  bookTitle: {
    color: '#9a8d98',
    fontSize: 20,
    fontWeight: '700',
    width: 160
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '50%',
    marginLeft: 10,
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
  readItem: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#9a8d98',
    borderRadius: 10,
  },
  thumbnail: {
    width: 50,
    height: 80,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#9a8d98',
  },
  backButton: {
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    width: 50,
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginRight: 5,
    marginLeft: 10,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  noFinishedBooks: {
    marginBottom: 300,
    textAlign: 'center',
    color: '#c9ada6',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  darkNoFinishedBooks: {
    marginBottom: 300,
    textAlign: 'center',
    color: '#4a4e68',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },
});