import { Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { sendBookRecommendation } from '../components/sendEmail';
import { toggleFavorite } from '../components/toggleFavourite';
import { toggleRead } from '../components/toggleRead';
import { useTheme } from '../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import he from 'he';
import Toast from 'react-native-root-toast';

const BookDetailsScreen = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [user, setUser] = useState(null); // state for the user that is logged in
  const { isDarkTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const description = item.volumeInfo?.description || "No description available."; // if description not available render "No description available."
  const authors = item.volumeInfo?.authors?.join(', ') || "Unknown Author"; // if authors not available render "Unknown Author"
  const publishedDate = item.volumeInfo?.publishedDate || "Unknown Date"; // if publish date not available render "Unknown Date"
  const title = item.volumeInfo?.title || "Untitled"; // if title not available render "Untitled"
  const publisher = item.volumeInfo?.publisher || "Unknown Publisher";
  const ISBNs = item.volumeInfo?.industryIdentifiers ? item.volumeInfo.industryIdentifiers.map((id) => `${id.identifier}`).join(', ') : "Unknown ISBN";
  const pageCount = item.volumeInfo?.pageCount || "Unknown Page Count";
  const categories = item.volumeInfo?.categories || "Unknown Categories";
  const retailPrice = item.saleInfo.retailPrice?.amount || "Unknown Retail Price";
  const buyLink = item.saleInfo?.buyLink || "Unknown buyLink";
  const saleability = item.saleInfo?.saleability || "Saleability not available";
  const id = item?.id || "book id not available";
  const uid = user?.uid || "not logged in";

  // decode problematic HTML entities that are found... ADD MORE IF NEEDED
  let decodedDescription = typeof description === 'string' ? he.decode(description.replace(/<[^>]+>/g, ''))
    .replace(/Õ/g, '’')
    .replace(/Ò/g, '“')
    .replace(/Ó/g, '”')
    .replace(/Ð/g, '–') : "No description available.";

  // remove empty space from start of the description if present
  if (decodedDescription.startsWith(' ')) {
    decodedDescription = decodedDescription.trimStart();
  }

  // setUser to the user that is logged in
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  // check if the book is in favourites when user opens bookdetails
  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, id]);

  // function to check if the book is already in favourites collection
  const checkIfFavorite = async () => {
    const docRef = doc(db, "favourites", `${uid}_${id}`);
    const docSnapshot = await getDoc(docRef);

    setIsFavorite(docSnapshot.exists());
  };

  const handleToggleFavorite = async () => {
    // conditional alert message for adding books to Favourites
    setLoading(true);
    try {
      const updatedFavoriteStatus = await toggleFavorite(db, user, id, title);
      setIsFavorite(updatedFavoriteStatus);
      if (updatedFavoriteStatus) {
        Toast.show('Added to Favourite Books', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      } else {
        Toast.show('Removed from Favourite Books', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      console.error("Error toggling Favourite Books status:", error);
    } finally {
      setLoading(false);
    }
  };

  const favouriteButtonText = isFavorite ? <Ionicons name={'heart'} size={30} color="#9a8d98" /> : <Ionicons name={'heart-outline'} size={30} color="#9a8d98" />;

  // check if the book is in favourites when user opens bookdetails
  useEffect(() => {
    if (user) {
      checkIfRead();
    }
  }, [user, id]);

  // function to check if the book is already in favourites collection
  const checkIfRead = async () => {
    const docRef = doc(db, "markedasread", `${uid}_${id}`);
    const docSnapshot = await getDoc(docRef);

    setIsRead(docSnapshot.exists());
  };

  const handleToggleRead = async () => {
    // conditional alert message for adding books to Favourites
    setLoading(true);
    try {
      const updatedReadStatus = await toggleRead(db, user, id, title);
      setIsRead(updatedReadStatus);
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
      console.error("Error toggling Finished Books status:", error);
    } finally {
      setLoading(false);
    }
  };

  const readButtonText = isRead ? <Ionicons name={'book'} size={30} color="#9a8d98" /> : <Ionicons name={'book-outline'} size={30} color="#9a8d98" />;

  // Function to handle email sending
  const handleSendEmail = () => {
    const bookDetails = {
      title,
      authors,
      description,
    };
    sendBookRecommendation(bookDetails);
  };

  return (
    <View style={isDarkTheme ? styles.darkContainer : styles.container}>
      <ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name={'caret-back-circle-outline'} size={30} color="#9a8d98" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favouriteButton}
          >
            {favouriteButtonText}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleToggleRead}
            style={styles.readButton}
          >
            {readButtonText}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSendEmail}
            style={styles.mailButton}
          >
            <Ionicons name={'mail-outline'} size={30} color="#9a8d98" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentTopContainer}>
          <Image
            style={styles.thumbnail}
            source={{
              uri: `https://books.google.com/books/content?id=${item.id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
            }}
          />

          <View style={styles.contentTopTextContainer}>
            <View style={{ borderBottomWidth: 1, borderColor: '#9a8d98' }}>
              <Text style={isDarkTheme ? styles.darkHeaderSubTitles : styles.headerSubTitles}>Title</Text>
              <Text style={isDarkTheme ? styles.darkTitle : styles.title}>{title}</Text>
            </View>

            <View style={{ borderBottomWidth: 1, borderColor: '#9a8d98' }}>
              <Text style={isDarkTheme ? styles.darkHeaderSubTitles : styles.headerSubTitles}>Authors</Text>
              <Text style={isDarkTheme ? styles.darkAuthors : styles.authors}>{authors}</Text>
            </View>

            <View style={{ borderBottomWidth: 1, borderColor: '#9a8d98' }}>
              <Text style={isDarkTheme ? styles.darkHeaderSubTitles : styles.headerSubTitles}>Publisher</Text>
              <Text style={isDarkTheme ? styles.darkPublisher : styles.publisher}>{publisher}</Text>
            </View>

            <View>
              <Text style={isDarkTheme ? styles.darkHeaderSubTitles : styles.headerSubTitles}>Release Date</Text>
              <Text style={isDarkTheme ? styles.darkPublishDate : styles.publishDate}>{publishedDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={isDarkTheme ? styles.darkSubTitle : styles.subTitle}>Description</Text>
          <Text style={isDarkTheme ? styles.darkInfoText : styles.infoText}>{decodedDescription}</Text>

          <Text style={isDarkTheme ? styles.darkSubTitle : styles.subTitle}>ISBN</Text>
          <Text style={isDarkTheme ? styles.darkInfoText : styles.infoText}>{ISBNs}</Text>

          <Text style={isDarkTheme ? styles.darkSubTitle : styles.subTitle}>Page Count</Text>
          <Text style={isDarkTheme ? styles.darkInfoText : styles.infoText}>{pageCount}</Text>

          <Text style={isDarkTheme ? styles.darkSubTitle : styles.subTitle}>Categories</Text>
          <Text style={isDarkTheme ? styles.darkInfoText : styles.infoText}>{categories}</Text>

          {saleability === "FOR_SALE" ? (
            <TouchableOpacity
              onPress={() => Linking.openURL(buyLink)}
              style={isDarkTheme ? styles.darkBuyButton : styles.buyButton}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}></View>
                <Text style={isDarkTheme ? styles.darkPrice : styles.price}>{retailPrice} €</Text>
                <Ionicons name={'cart-outline'} size={30} color={isDarkTheme ? "#22223a" : "#f2e8e3"} style={{ flex: 1 }} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={isDarkTheme ? styles.darkNotBuyButton : styles.notBuyButton}>
              <Text style={isDarkTheme ? styles.darkNotForSale : styles.notForSale}>Not for sale</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default BookDetailsScreen;

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
  thumbnail: {
    borderWidth: 1,
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginRight: 20,
    width: 100,
    height: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 50,
  },
  contentTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    marginBottom: 40,
  },
  contentTopTextContainer: {
    alignSelf: 'center',
    width: '90%',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '95%',
    marginBottom: 100,
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
  favouriteButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginRight: 5,
    justifyContent: 'center',
  },
  readButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginRight: 5,
    justifyContent: 'center',
  },
  mailButton: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginRight: 5,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a4e68',
    marginBottom: 3,
  },
  darkTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f2e8e3',
    marginBottom: 3,
  },
  authors: {
    fontSize: 16,
    color: '#4a4e68',
    marginBottom: 3,
    fontWeight: '500',
  },
  darkAuthors: {
    fontSize: 16,
    color: '#f2e8e3',
    marginBottom: 3,
    fontWeight: '500',
  },
  publisher: {
    fontSize: 16,
    color: '#4a4e68',
    marginBottom: 3,
    fontWeight: '500',
  },
  darkPublisher: {
    fontSize: 16,
    color: '#f2e8e3',
    marginBottom: 3,
    fontWeight: '500',
  },
  publishDate: {
    fontSize: 16,
    color: '#4a4e68',
    fontWeight: '500',
  },
  darkPublishDate: {
    fontSize: 16,
    color: '#f2e8e3',
    fontWeight: '500',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a4e68',
    marginBottom: 3,
    marginTop: 20,
  },
  darkSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2e8e3',
    marginBottom: 3,
    marginTop: 20,
  },
  buyButton: {
    height: 50,
    alignSelf: 'center',
    width: '80%',
    backgroundColor: '#22223a',
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkBuyButton: {
    height: 50,
    alignSelf: 'center',
    width: '80%',
    backgroundColor: '#c9ada6',
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notForSale: {
    color: '#c9ada6',
    fontSize: 16,
    fontWeight: '700',
  },
  darkNotForSale: {
    color: '#4a4e68',
    fontSize: 16,
    fontWeight: '700',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f2e8e3',
    flex: 1,
    textAlign: 'center',
  },
  darkPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22223a',
    flex: 1,
    textAlign: 'center',
  },
  headerSubTitles: {
    fontSize: 15,
    color: '#9a8d98',
    fontStyle: 'italic',
    marginBottom: 3,
  },
  darkHeaderSubTitles: {
    fontSize: 15,
    color: '#9a8d98',
    fontStyle: 'italic',
    marginBottom: 3,
  },
  notBuyButton: {
    height: 50,
    alignSelf: 'center',
    width: '80%',
    borderColor: '#c9ada6',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkNotBuyButton: {
    height: 50,
    alignSelf: 'center',
    width: '80%',
    borderColor: '#4a4e68',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: '#4a4e68',
  },
  darkInfoText: {
    color: '#9a8d98',
  },
});