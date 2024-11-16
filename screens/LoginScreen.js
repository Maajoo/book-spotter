import { Image, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from '../ThemeContext';

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const { isDarkTheme } = useTheme();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                navigation.replace("TabNav")
            }
        })
        return unsubscribe
    }, [])

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log('Logged in with: ' + userCredentials.user.email);
            })
            .catch(error => alert(error.message))
    }

    return (
        <>
            {/* TouchableWithoutFeedback makes it so the user can close the keyboard by tapping on the screen */}
            < TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >

                {/* avoid blocking the input fields with keyboard */}
                < KeyboardAvoidingView
                    style={isDarkTheme ? styles.darkContainer : styles.container}
                    behavior="padding"
                >
                    <Image source={require('../assets/logo.png')} alt='logo' style={{ width: 200, height: 130, marginBottom: 20 }} />

                    <View style={styles.inputContainer}>
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
                            secureTextEntry // makes it so password will be shown as "•" when written
                            placeholderTextColor={isDarkTheme ? '#9a8d98' : '#9a8d98'}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        {/* LOGIN */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            style={styles.button}
                        >
                            <Text style={isDarkTheme ? styles.darkButtonText : styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        {/* REGISTER */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Register")}
                            style={[styles.button, styles.buttonOutline]} //inherit the styles from "button" and "buttonOutline" with []
                        >
                            <Text style={styles.buttonOutlineText}>Register</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAvoidingView >
            </TouchableWithoutFeedback >
        </>
    )
}

export default LoginScreen

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