import { ActivityIndicator, TouchableOpacity, StatusBar, StyleSheet, Text, TextInput, View, FlatList, Keyboard, TouchableWithoutFeedback, Image, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { fetchBooks } from '../components/fetchBooks'
import { getDocs, collection, addDoc, query, where, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from '../ThemeContext';


const HomeScreen = () => {

    const [keyword, setKeyword] = useState("");  // keyword to search for books
    const [loading, setLoading] = useState(false); // state for the loading element
    const [recent, setRecent] = useState([]); // recent searches
    const [user, setUser] = useState(null); // state for the user that is logged in
    const navigation = useNavigation(); // navigation
    const { isDarkTheme } = useTheme();



    // set user to "currentUser" when logged in otherwise "null"
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // cleanup subscription on unmount
    }, []);


    // dismiss keyboard when screen the user navigates away from HomeScreen
    // to avoid the keyboard blocking the TabNavigator when the user returns
    useFocusEffect(
        useCallback(() => {
            return () => {
                Keyboard.dismiss();
            };
        }, [])
    );


    // load the recent searches for the current user when the screen is focused
    useFocusEffect(
        useCallback(() => {
            const fetchRecentSearches = async () => {
                // check if user is not logged in
                if (!user) return;

                try {
                    // get the recent searches from the database
                    const recentSearchesCollection = collection(db, "recentSearches");

                    // filter the recent searches to only the ones that have the same user id as the currently logged in user
                    const userSearchesQuery = query(
                        recentSearchesCollection,
                        where("uid", "==", user.uid)
                    );

                    // retrieve the objects from the query searches as a QuerySnapshot
                    const querySnapshot = await getDocs(userSearchesQuery);

                    // create a new array of objects "searches" where each object is a QuerySnapshot including the objects id 
                    const searches = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }))

                    // sort searches by timestamp in descending order (most recent first)
                    searches.sort((a, b) => b.timestamp - a.timestamp)

                    // only show the 5 most recent searches
                    const recentSearches = searches.slice(0, 5);
                    setRecent(recentSearches);

                    // delete older than the 5 latest searches
                    if (searches.length > 5) {
                        const searchesToDelete = searches.slice(5);
                        await Promise.all(searchesToDelete.map(async (search) => {
                            console.log("Search '" + search.keyword + "' deleted from database");
                            await deleteDoc(doc(db, "recentSearches", search.id));
                        }));
                    }
                } catch (error) {
                    console.error("Error fetching recent searches: ", error);
                }
            };

            // Call the fetch function
            fetchRecentSearches();
        }, [user])
    );

    // function to add search to "recentSearches" database and call "fetchBooks" function when the "Search" TouchableOpacity is pressed
    const handleSearch = async () => {
        //check if user is logged in
        if (!user) {
            console.error("No user is logged in");
            return;
        }

        setLoading(true);

        // save search to recentSearches collection
        if (keyword.trim()) {
            try {
                await addDoc(collection(db, "recentSearches"), {
                    keyword: keyword, // searched book name
                    uid: user.uid, // associate the search with the current users ID
                    timestamp: new Date(), // save the timestamp for sorting
                });
                console.log("Search saved to recentSearches collection");
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }

        // call fetchBooks function
        fetchBooks(keyword)

            //navigate to SearchResultScreen
            .then(data => {
                navigation.navigate("SearchResult", { results: data.items });
            })
            .catch(err => console.error(err))
            .finally(() => {
                setKeyword(""); // reset searchbar
                setLoading(false); //set loading to false
            });
    };

    return (
        <>
            {/* TouchableWithoutFeedback makes it so the user can close the keyboard by tapping on the screen */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
                <View style={isDarkTheme ? styles.darkContainer : styles.container}>
                    <Image source={require('../assets/logo.png')} alt='logo' style={{ width: 200, height: 130, marginBottom: 20 }} />
                    <TextInput
                        placeholder='Write a book name here...'
                        value={keyword}
                        onChangeText={text => setKeyword(text)}
                        style={isDarkTheme ? styles.darkInput : styles.input}
                        placeholderTextColor={isDarkTheme ? '#9a8d98' : '#9a8d98'}
                    />
                    <TouchableOpacity
                        style={isDarkTheme ? styles.darkButton : styles.button}
                        disabled={loading}
                        onPress={handleSearch}
                    >
                        <Text style={isDarkTheme ? styles.darkButtonText : styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                    <ActivityIndicator
                        size='large'
                        animating={loading}
                        color={isDarkTheme ? '#4a4e68' : '#c9ada6'}
                        style={{ marginTop: 10 }}
                    />

                    <View style={{ flexDirection: 'row', width: '80%', marginBottom: 10 }}>

                        {/* empty view to align title and button correctly */}
                        <View
                            style={{ flex: 1 }}
                        />

                        {/* title */}
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text
                                style={[styles.recentTitle, { textAlign: 'center' }]}
                            >Recent</Text>
                        </View>

                        {/* clear history button */}
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={async () => {
                                    Alert.alert(
                                        "Clear history",
                                        "Are you sure you want to clear your search history?",
                                        [
                                            {
                                                text: "Cancel",
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK",
                                                onPress: async () => {

                                                    setLoading(true);
                                                    if (!user) {
                                                        console.error("No user is logged in");
                                                        return;
                                                    }

                                                    try {
                                                        const recentSearchesCollection = collection(db, "recentSearches");
                                                        const userSearchesQuery = query(
                                                            recentSearchesCollection,
                                                            where("uid", "==", user.uid)
                                                        );
                                                        const querySnapshot = await getDocs(userSearchesQuery);
                                                        const searchesToDelete = querySnapshot.docs.map((doc) => doc.id);

                                                        await Promise.all(searchesToDelete.map(async (id) => {
                                                            await deleteDoc(doc(db, "recentSearches", id));
                                                        }));

                                                        setRecent([]);
                                                        console.log("All recent searches cleared");
                                                    } catch (error) {
                                                        console.error("Error clearing recent searches: ", error);
                                                    }
                                                    finally {
                                                        setLoading(false);
                                                    }
                                                }
                                            }
                                        ]
                                    );
                                }}
                                style={{ borderWidth: 1, borderRadius: 10, borderColor: '#9a8d98', padding: 5 }}
                            >
                                <Text
                                    style={isDarkTheme ? styles.darkClearHistory : styles.clearHistory}
                                >
                                    Clear{'\n'}history
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={isDarkTheme ? styles.darkRecentContainer : styles.recentContainer}>
                        <FlatList
                            data={recent}
                            scrollEnabled={false} // disable scrolling in the flatlist
                            keyExtractor={(item) => item.id} // add unique id for all items on the flatlist
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    onPress={async () => {
                                        setLoading(true); // show the loading indicator
                                        try {
                                            // call fetchBooks function with the clicked keyword
                                            const data = await fetchBooks(item.keyword);

                                            // navigate to SearchResultScreen with the search results
                                            navigation.navigate("SearchResult", { results: data.items });
                                        } catch (err) {
                                            console.error(err);
                                        } finally {
                                            setLoading(false); // hide the loading indicator after search
                                        }
                                    }}
                                    style={isDarkTheme ? styles.darkRecentObjectContainer : styles.recentObjectContainer}
                                >
                                    {/* render search history */}
                                    <Text style={isDarkTheme ? styles.darkRecentText : styles.recentText}>{item.keyword}</Text>
                                </TouchableOpacity>
                            )}
                            // if there is no recent searches show "No recent searches"
                            ListEmptyComponent={() => (
                                <Text style={isDarkTheme ? styles.darkNoSearchesText : styles.noSearchesText}>No recent searches</Text>
                            )}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback >
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2e8e3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    darkContainer: {
        flex: 1,
        backgroundColor: '#22223a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#9a8d98',
        width: '80%',
        padding: 10,
    },
    darkRecentContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#9a8d98',
        width: '80%',
        padding: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#9a8d98',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        width: '80%',
        height: 60,
        color: '#4a4e68',
    },
    darkInput: {
        borderWidth: 1,
        borderColor: '#9a8d98',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginTop: 5,
        width: '80%',
        height: 60,
        color: '#f2e8e3',
    },
    button: {
        backgroundColor: '#9a8d98',
        width: '50%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    darkButton: {
        backgroundColor: '#9a8d98',
        width: '50%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#f2e8e3',
        fontWeight: '700',
        fontSize: 16,
    },
    darkButtonText: {
        color: '#4a4e68',
        fontWeight: '700',
        fontSize: 16,
    },
    recentText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#f2e8e3',
        textAlign: 'center',
    },
    darkRecentText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4a4e68',
        textAlign: 'center',
    },
    recentObjectContainer: {
        backgroundColor: '#9a8d98',
        justifyContent: 'center',
        height: 35,
        padding: 10,
        margin: 5,
        borderRadius: 10,
    },
    darkRecentObjectContainer: {
        backgroundColor: '#9a8d98',
        justifyContent: 'center',
        height: 35,
        padding: 10,
        margin: 5,
        borderRadius: 10,
    },
    noSearchesText: {
        color: '#c9ada6',
        textAlign: 'center',
        fontStyle: 'italic',
        margin: 5,
    },
    darkNoSearchesText: {
        color: '#4a4e68',
        textAlign: 'center',
        fontStyle: 'italic',
        margin: 5,
    },
    recentTitle: {
        color: '#9a8d98',
        fontSize: 30,
        fontWeight: '700',
    },
    darkRecentTitle: {
        color: '#9a8d98',
        fontSize: 30,
        fontWeight: '700',
    },
    clearHistory: {
        color: '#9a8d98',
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: '500',
    },
    darkClearHistory: {
        color: '#9a8d98',
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: '500',
    }
})
