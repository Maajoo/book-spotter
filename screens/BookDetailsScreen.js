import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'


const BookDetailsScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("SearchResult")}
      >
        <Ionicons name={'caret-back-circle-outline'} size={24} color="black" />
      </TouchableOpacity>
      {/* https://www.googleapis.com/books/v1/volumes/{item.id} */}
      <Text>title</Text>
      <Text>authors</Text>
      <Text>publisher</Text>
      <Text>publishedDate</Text>
      <Text>description</Text>
      <Text>ISBN</Text>
      <Text>pageCount</Text>
      <Text>categories</Text>
      <Text>listPrice</Text>
      <Text>retailPrice</Text>
      <Text>buyLink</Text>
    </View>
  )
}

export default BookDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 30,
    paddingTop: 50,
    paddingBottom: 30,
  },
})