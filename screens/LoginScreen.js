import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import { useNavigation } from '@react-navigation/native'

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                navigation.replace("TabNav")
            }
        })
        return unsubscribe
    }, [])

    // handleSignUp
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log('Registered: ' + userCredentials.user.email);
            })
            .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                console.log('Logged in with: ' + userCredentials.user.email);
            })
            .catch(error => alert(error.message))
    }

    return (
        //avoid blocking the input fields with keyboard
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry // Makes it so password will be shown as "•" when written
                />
            </View>

            <View style={styles.buttonContainer}>
                {/* LOGIN */}
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* REGISTER */}
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]} //Inherit the styles from "button" and "buttonOutline" with []
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: 'lightblue',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: 'lightblue',
        borderWidth: 2,
    },
    buttonOutlineText: {
        color: 'lightblue',
        fontWeight: '700',
        fontSize: 16,
    },
})