import { StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
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
    <View style={styles.container}>
      <Text style={styles.headerText}>Profile Screen</Text>
      <Text>Username: {username}</Text>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonText: {
    color: 'blue',
    fontSize: 16,
    marginTop: 20,
  },
});
