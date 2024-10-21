import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import FavouriteScreen from './screens/FavouriteScreen';
import Ionicons from '@expo/vector-icons/Ionicons'

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
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
      })}>
      <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Favourites" component={FavouriteScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
