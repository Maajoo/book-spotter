import { StyleSheet, Text, View } from 'react-native'
import { auth } from '../firebaseConfig'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {

  const navigation = useNavigation(); // navigation

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <View style={styles.container}>
        {/* "?" to check if currentUser is undefined, if it is then just leave it as undefined to avoid crashing the app */}
        <Text>Email: {auth.currentUser?.email}</Text>
        <TouchableOpacity
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
})