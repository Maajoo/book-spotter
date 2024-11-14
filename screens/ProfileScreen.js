import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const { isDarkTheme, toggleTheme } = useTheme();
  const navigation = useNavigation();

  // fetch username from Firestore
  useEffect(() => {
    const fetchUsername = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } else {
          console.log('No such document!');
        }
      }
    };
    fetchUsername();
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={isDarkTheme ? styles.darkContainer : styles.container}>
      <Text style={isDarkTheme ? styles.darkHeaderText : styles.headerText}>Profile Screen</Text>
      <Text style={isDarkTheme ? styles.darkText : styles.text}>Username: {username}</Text>
      <Text style={isDarkTheme ? styles.darkText : styles.text}>Email: {auth.currentUser?.email}</Text>

      <Switch
        trackColor={{ true: "grey", false: "lightblue" }}
        thumbColor={isDarkTheme ? "lightblue" : "grey"}
        onValueChange={toggleTheme}
        value={isDarkTheme}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('Read')}>
        <Text style={isDarkTheme ? styles.darkText : styles.text}>Read</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignOut}>
        <Text style={isDarkTheme ? styles.darkButtonText : styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  darkHeaderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  darkText: {
    fontSize: 18,
    color: 'white',
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  darkButtonText: {
    fontSize: 18,
    color: 'white',
  },
});
