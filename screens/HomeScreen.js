import { ActivityIndicator, TouchableOpacity, StatusBar, StyleSheet, Text, TextInput, View, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { searchBooks } from '../components/searchBooks'
import { getDocs, collection, addDoc, query, where, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from "firebase/auth";


const HomeScreen = () => {

    const [keyword, setKeyword] = useState("");  // keyword to search for books
    const [loading, setLoading] = useState(false); // state for the loading element
    const [recent, setRecent] = useState([]); // recent searches
    const [user, setUser] = useState(null); // state for the user that is logged in
    const navigation = useNavigation(); // navigation



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

    // function to add search to "recentSearches" database and call "searchBooks" function when the "Search" TouchableOpacity is pressed
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

        // call searchBooks function
        searchBooks(keyword)

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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <TextInput
                        placeholder='Write a book name here...'
                        value={keyword}
                        onChangeText={text => setKeyword(text)}
                    />
                    <TouchableOpacity
                        style={styles.buttonText}
                        disabled={loading}
                        onPress={handleSearch}
                    >
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                    <ActivityIndicator
                        size='large'
                        animating={loading}
                    />
                    <StatusBar style='auto' />

                    <FlatList
                        data={recent}
                        keyExtractor={(item) => item.id} // add unique id for all items on the flatlist
                        renderItem={({ item }) => (

                            <TouchableOpacity
                                onPress={async () => {
                                    setLoading(true); // show the loading indicator
                                    try {
                                        // call searchBooks function with the clicked keyword
                                        const data = await searchBooks(item.keyword);

                                        // Navigate to SearchResultScreen with the search results
                                        navigation.navigate("SearchResult", { results: data.items });
                                    } catch (err) {
                                        console.error(err);
                                    } finally {
                                        setLoading(false); // hide the loading indicator after search
                                    }
                                }}
                            >
                                {/* render search history */}
                                <Text>{item.keyword}</Text>
                            </TouchableOpacity>)}
                    />
                </View>
            </TouchableWithoutFeedback >
        </>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
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