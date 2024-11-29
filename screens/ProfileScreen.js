import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';


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
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Sign Out",
          onPress: () => {
            auth
              .signOut()
              .then(() => {
                navigation.replace("Login");
              })
              .catch(error => alert(error.message));
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={isDarkTheme ? styles.darkContainer : styles.container}>
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}></View>
        <Text style={isDarkTheme ? styles.darkProfileText : styles.profileText}>Profile</Text>
        <TouchableOpacity onPress={handleSignOut}
          style={{ flex: 1, alignItems: 'center' }}>
          <Ionicons name={'exit-outline'} size={30} color="#ef6e4e" />
        </TouchableOpacity>
      </View>

      <View style={styles.usernameContainer}>
        <Text style={styles.subTitle}>Username:</Text>
        <Text style={isDarkTheme ? styles.darkText : styles.text}>{username}</Text>
      </View>

      <View style={styles.emailContainer}>
        <Text style={styles.subTitle}>Email:</Text>
        <Text style={isDarkTheme ? styles.darkText : styles.text}>{auth.currentUser?.email}</Text>
      </View>

      <View style={styles.themeContainer}>
        <Text style={styles.subTitle}>Theme:</Text>
        <Switch
          trackColor={{ true: "#4a4e68" }}
          thumbColor={isDarkTheme ? "#9a8d98" : "#9a8d98"}
          onValueChange={toggleTheme}
          value={isDarkTheme}
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Read')}
        style={isDarkTheme ? styles.darkReadButton : styles.readButton}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 50 }}>
          <Text style={styles.finishedBooksText}>Finished Books</Text>
          <Ionicons name={'book'} size={30} color="#9a8d98" style={{ marginTop: 2 }} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2e8e3',
    alignItems: 'center',
    paddingTop: 50,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#22223a',
    alignItems: 'center',
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  profileText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9a8d98',
    textAlign: 'center',
  },
  darkProfileText: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9a8d98',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#9a8d98',
    fontWeight: '500'
  },
  darkText: {
    fontSize: 18,
    color: '#9a8d98',
    fontWeight: '500'
  },
  usernameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 80,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#9a8d98',
  },
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#9a8d98',
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#9a8d98',
  },
  readButton: {
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    width: '70%',
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginTop: 50,
    justifyContent: 'center',
    marginTop: 100,
  },
  darkReadButton: {
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    width: '70%',
    borderColor: '#9a8d98',
    borderRadius: 10,
    marginTop: 50,
    justifyContent: 'center',
    backgroundColor: '#22223a',
    marginTop: 100,
  },
  finishedBooksText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 19,
    color: '#9a8d98',
    marginRight: 10,
  },
  subTitle: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#9a8d98',
    textAlign: 'center',
    alignSelf: 'center',
  },
});
