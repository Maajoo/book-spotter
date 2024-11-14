import { ActivityIndicator, Button, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchBooks } from '../components/fetchBooks';
import { toggleRead } from '../components/toggleRead';
import { sendBookRecommendation } from '../components/sendEmail';

const ReadScreen = () => {
  const [user, setUser] = useState(null);
  const [markedAsRead, setMarkedAsRead] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


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


  const handleToggleRead = async (bookId, bookTitle) => {
    try {
      const updatedReadStatus = await toggleRead(db, user, bookId, bookTitle);
    } catch (error) {
      console.error("Error marking as unread:", error);
    }
  };


  //function to render the read id
  const renderReadItem = ({ item }) => (
    <TouchableOpacity style={styles.readItem}
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
        title="Remove from Read list"
        onPress={() => handleToggleRead(item.bookId, item.bookTitle)}
      />
      <Button
        title="Recommend this Book"
        onPress={() => handleSendEmail(item)}
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
    <View style={styles.readListContainer}>
      <Text style={styles.title}>Read Books</Text>

      {/* if loading == true display ActivityIndicator else if markedasread length > 0
      if true render markedasread else render "No read books found." */}

      {loading ? (
        <ActivityIndicator />
      ) : (
        markedAsRead.length ? (
          <FlatList
            data={markedAsRead}
            renderItem={renderReadItem}
            keyExtractor={(item, index) => item.bookId + index.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        ) : (
          <Text>No read books found.</Text>
        )
      )}

    </View>
  );
};

export default ReadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 20,
  },
  readListContainer: {
    marginTop: 100,
    marginBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  readItem: {
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