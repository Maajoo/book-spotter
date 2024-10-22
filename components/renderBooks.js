import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const renderBooks = ({ item, navigation }) => {

  // If there is no description available print "No description available."
  let description = item.volumeInfo.description || "No description available.";

  // check if the description length is over 180 characters,
  // if so only render 180 characters and add "..." to the end.
  if (description.length > 180) {
    description = description.substring(0, 180) + '...'
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
          <Text style={styles.title}>{item.volumeInfo.title}</Text>

          {/* "?.join(', ')" applies ", " in between of the authors in case there is more than 1 author */}
          <Text style={styles.authors}>{item.volumeInfo.authors?.join(', ')} · {item.volumeInfo.publishedDate.substring(0, 4)}</Text>

          <Text style={styles.description}>{description}</Text>

          <Text style={styles.description}>{item.id}</Text>

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