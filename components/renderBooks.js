import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fetchBooks } from './fetchBooks';

export const renderBooks = ({ item, navigation, isDarkTheme }) => {

  // make optional renders in cases where data is not available
  const description = item.volumeInfo?.description || "No description available."; // if description not available render "No description available."
  const authors = item.volumeInfo?.authors?.join(', ') || "Unknown Author"; // if authors not available render "Unknown Author"
  const publishedDate = item.volumeInfo?.publishedDate || "Unknown Date"; // if publish date not available render "Unknown Date"
  const title = item.volumeInfo?.title || "Untitled"; // if title not available render "Untitled"

  // create a new variable for the shortened description that will add '...' tot the end if the description is longer than 180 letters
  let shortDescription = description
  if (shortDescription.length > 180) {
    shortDescription = shortDescription.substring(0, 180) + '...';
  }

  const handlePress = async () => {
    try {
      // fetch detailed information using the selfLink
      const detailedData = await fetchBooks(null, item.id);
      const detailedItem = {
        id: item.id,
        volumeInfo: detailedData.volumeInfo || {},
        saleInfo: detailedData.saleInfo || {},
      };

      // Navigate to BookDetailsScreen with the detailed information
      navigation.navigate("BookDetails", { item: detailedItem });
    } catch (error) {
      console.error("Error fetching detailed book information:", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ flex: 1, width: '95%', alignSelf: 'center' }}
    >
      <View style={styles.itemContainer}>
        {/* book cover picture */}
        <Image
          style={styles.thumbnail}
          source={{
            uri: `https://books.google.com/books/content?id=${item.id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
          }}
        />
        <View style={styles.textContainer}>
          <Text style={isDarkTheme ? styles.darkTitle : styles.title}>{title}</Text>
          {/* authors and published date */}
          <Text style={isDarkTheme ? styles.darkAuthors : styles.authors}>{authors} · {publishedDate.substring(0, 4)}</Text>
          {/* render the shortened description */}
          <Text style={isDarkTheme ? styles.darkDescription : styles.description}>{shortDescription}</Text>

        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    width: '75%'
  },
  thumbnail: {
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#9a8d98',
    borderRadius: 5,
    width: 100,
    height: 150,
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#9a8d98',
    borderRadius: 5,
    flexDirection: "row",
  },
  title: {
    color: '#4a4e68',
    width: '90%',
    fontSize: 15,
    fontWeight: "800",
  },
  darkTitle: {
    color: '#9a8d98',
    width: '90%',
    fontSize: 15,
    fontWeight: "800",
  },
  authors: {
    color: '#4a4e68',
    fontWeight: "500",
    fontStyle: "italic",
    width: '90%',
    marginBottom: 10,
    fontSize: 14,
  },
  darkAuthors: {
    color: '#9a8d98',
    fontWeight: "500",
    fontStyle: "italic",
    width: '90%',
    marginBottom: 10,
    fontSize: 14,
  },
  description: {
    color: '#9a8d98',
    flex: 1,
    fontWeight: "300",
    width: '90%',
    fontStyle: "italic",
    fontSize: 14,
  },
  darkDescription: {
    color: '#4a4e68',
    flex: 1,
    fontWeight: "300",
    width: '90%',
    fontStyle: "italic",
    fontSize: 14,
  },
});