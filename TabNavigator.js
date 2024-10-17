import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import SettingScreen from './screens/SettingScreen';
import FavouriteScreen from './screens/FavouriteScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Favourites" component={FavouriteScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}
