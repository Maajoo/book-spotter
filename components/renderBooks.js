import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const renderBooks = ({ item, navigation }) => {

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

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("BookDetails")}
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
          <Text style={styles.title}>{title}</Text>
          {/* authors and published date */}
          <Text style={styles.authors}>{authors} · {publishedDate.substring(0, 4)}</Text>
          {/* render the shortened description */}
          <Text style={styles.description}>{shortDescription}</Text>




          {/* FOR DEV PURPOSES REMEMBER TO DELETE IN FINAL PRODUCT */}
          <Text style={styles.description}>{item.id}</Text>
          {/* FOR DEV PURPOSES REMEMBER TO DELETE IN FINAL PRODUCT */}



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
    width: 100,
    height: 150,
  },
  itemContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: "row",
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10,
  },
  authors: {
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  description: {
    fontStyle: "italic",
    fontSize: 14,
    margin: 10,
  }
});