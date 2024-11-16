import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavouriteScreen from './screens/FavouriteScreen';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTheme } from './ThemeContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { isDarkTheme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'search-circle-outline';
          } else if (route.name === 'Favourites') {
            iconName = 'heart-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDarkTheme ? '#f2e8e3' : '#f2e8e3',
        tabBarInactiveTintColor: isDarkTheme ? '#9a8d98' : '#c9ada6',
        tabBarStyle: {
          backgroundColor: isDarkTheme ? '#4a4e68' : '#9a8d98',
        },
      })}>
      <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Favourites" component={FavouriteScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
