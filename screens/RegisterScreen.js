import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigation = useNavigation();
    const { isDarkTheme } = useTheme();

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // store the username information in 'users' firestore collection
            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: user.email
            });

            console.log('User registered with:', user.email);
            navigation.replace("TabNav");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            {/* TouchableWithoutFeedback makes it so the user can close the keyboard by tapping on the screen */}
            < TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >

                <KeyboardAvoidingView style={isDarkTheme ? styles.darkContainer : styles.container}
                    behavior="padding"
                >
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Username"
                            value={username}
                            onChangeText={text => setUsername(text)}
                            style={isDarkTheme ? styles.darkInput : styles.input}
                            placeholderTextColor={isDarkTheme ? '#9a8d98' : '#9a8d98'}
                        />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                            style={isDarkTheme ? styles.darkInput : styles.input}
                            placeholderTextColor={isDarkTheme ? '#9a8d98' : '#9a8d98'}
                        />
                        <TextInput
                            placeholder="Password"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            style={isDarkTheme ? styles.darkInput : styles.input}
                            placeholderTextColor={isDarkTheme ? '#9a8d98' : '#9a8d98'}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                            <Text style={isDarkTheme ? styles.darkButtonText : styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Login")}
                            style={[styles.button, styles.buttonOutline]} //inherit the styles from "button" and "buttonOutline" with []
                        >
                            <Text style={styles.buttonOutlineText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2e8e3',
    },
    darkContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#22223a',
    },
    inputContainer: {
        width: '80%',
    },
    input: {
        paddingLeft: 20,
        textAlign: 'left',
        borderWidth: 1,
        borderColor: '#9a8d98',
        borderRadius: 10,
        marginTop: 5,
        height: 60,
        color: '#4a4e68',
    },
    darkInput: {
        paddingLeft: 20,
        textAlign: 'left',
        borderWidth: 1,
        borderColor: '#9a8d98',
        borderRadius: 10,
        marginTop: 5,
        height: 60,
        color: '#f2e8e3',
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#9a8d98',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderColor: '#9a8d98',
        borderWidth: 2,
    },
    buttonText: {
        color: '#f2e8e3',
        fontWeight: '700',
        fontSize: 16,
    },
    darkButtonText: {
        color: '#22223a',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutlineText: {
        color: '#9a8d98',
        fontWeight: '700',
        fontSize: 16,
    },
});