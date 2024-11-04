import { Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'


const BookDetailsScreen = ({ route }) => {

  const { item } = route.params;
  const navigation = useNavigation();

  const description = item.volumeInfo?.description || "No description available."; // if description not available render "No description available."
  const authors = item.volumeInfo?.authors?.join(', ') || "Unknown Author"; // if authors not available render "Unknown Author"
  const publishedDate = item.volumeInfo?.publishedDate || "Unknown Date"; // if publish date not available render "Unknown Date"
  const title = item.volumeInfo?.title || "Untitled"; // if title not available render "Untitled"
  const publisher = item.volumeInfo?.publisher || "Unknown Publisher"
  const ISBNs = item.volumeInfo?.industryIdentifiers ? item.volumeInfo.industryIdentifiers.map((id) => `${id.identifier}`).join(', ') : "Unknown ISBN";
  const pageCount = item.volumeInfo?.pageCount || "Unknown Page Count"
  const categories = item.volumeInfo?.categories || "Unknown Categories"
  const listPrice = item.saleInfo.listPrice?.amount || "Unknown List Price"
  const retailPrice = item.saleInfo.retailPrice?.amount || "Unknown Retail Price"
  const buyLink = item.saleInfo?.buyLink || "Unknown buyLink"
  const saleability = item.saleInfo?.saleability || "Saleability not available"

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Ionicons name={'caret-back-circle-outline'} size={24} color="black" />
      </TouchableOpacity>
      <Text>{title}</Text>
      <Image
        style={styles.thumbnail}
        source={{
          uri: `https://books.google.com/books/content?id=${item.id}&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
        }}
      />
      <Text>{authors}</Text>
      <Text>{publisher}</Text>
      <Text>{publishedDate}</Text>
      <Text>{description}</Text>
      <Text>ISBN: {ISBNs}</Text>
      <Text>{pageCount}</Text>
      <Text>{categories}</Text>

      {/* Conditional render that checks if the book is for sale */}
      {saleability === "FOR_SALE" ? (
        <>
          <Text>{listPrice}</Text>
          <Text>{retailPrice}</Text>
          <Text
            style={{ color: 'blue', textDecorationLine: 'underline' }}
            onPress={() => Linking.openURL(buyLink)}
          >
            Buy Link
          </Text>
        </>
      ) : (
        <Text>Not for sale</Text>
      )}
    </ScrollView>
  )
}

export default BookDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 30,
    paddingTop: 50,
  },
  thumbnail: {
    width: 100,
    height: 150,
  },
})