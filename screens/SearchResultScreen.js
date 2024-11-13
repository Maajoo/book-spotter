import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { renderBooks } from "../components/renderBooks"
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

const SearchResultScreen = ({ route }) => {
  const { results = [] } = route.params; // default to to an empty array in case results are undefined
  const navigation = useNavigation();

  return (
    <>
      {/* button to navigate back to HomeScreen */}
      <TouchableOpacity
        style={styles.returnContainer}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name={'caret-back-circle-outline'} size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.container}>
        <FlatList
          data={results}
          keyExtractor={(item) => item.id} // add unique id for all items on the flatlist
          renderItem={({ item }) => renderBooks({ item, navigation })} // call renderBooks, destructure item and pass item and navigation to the function.
          ListEmptyComponent={<Text>No results found</Text>}  // handle empty data
        />
        <StatusBar style='auto' />
      </View>
    </>
  );
};

export default SearchResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 30,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  returnContainer: {
    paddingLeft: 30,
    paddingTop: 50,
  }
});
