import { ActivityIndicator, TouchableOpacity, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { searchBooks } from '../components/searchBooks'


const HomeScreen = () => {

    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleFetch = () => {
        setLoading(true);
        searchBooks(keyword)
            .then(data => {
                navigation.navigate("SearchResult", { results: data.items });
            })
            .catch(err => console.error(err))
            .finally(() => {
                setKeyword("");
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Write a book name here...'
                value={keyword}
                onChangeText={text => setKeyword(text)}
            />
            <TouchableOpacity
                style={styles.buttonText}
                disabled={loading}
                onPress={handleFetch}
                >
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <ActivityIndicator
                size='large'
                animating={loading}
            />
            <StatusBar style='auto' />
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: 'lightblue',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color: 'lightblue',
        fontWeight: '700',
        fontSize: 16,
    },
})