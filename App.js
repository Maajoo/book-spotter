import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import TabNavigator from './TabNavigator';
import SearchResultScreen from './screens/SearchResultScreen';
import BookDetailsScreen from './screens/BookDetailsScreen';
import RegisterScreen from './screens/RegisterScreen';
import ReadScreen from './screens/ReadScreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
          <Stack.Screen options={{ headerShown: false }} name="TabNav" component={TabNavigator} />
          <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
          <Stack.Screen options={{ headerShown: false }} name="SearchResult" component={SearchResultScreen} />
          <Stack.Screen options={{ headerShown: false }} name="BookDetails" component={BookDetailsScreen} />
          <Stack.Screen options={{ headerShown: false }} name="Read" component={ReadScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;