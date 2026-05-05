import 'react-native-gesture-handler';

import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
// import EggScreen from './src/screens/EggScreen'; // 게임 요소 - 보류 중
import MatrixScreen from './src/screens/MatrixScreen';
import StatsScreen from './src/screens/StatsScreen';
import { TodoProvider } from './src/contexts/TodoContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ label }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
    <Text style={{ color: '#AAA', fontSize: 15 }}>{label} 준비 중</Text>
  </View>
);

const TAB_ICONS = {
  Matrix:    'home-outline',
  Diary:     'create-outline',
  Stats:     'bar-chart-outline',
  Character: 'paw-outline',
  More:      'ellipsis-horizontal',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#3A9E6A',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarStyle: {
          height: 64,
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          backgroundColor: '#FFFFFF',
        },
        tabBarIcon: ({ color }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={24} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Matrix"    component={MatrixScreen} />
      <Tab.Screen name="Diary"     children={() => <PlaceholderScreen label="일기" />} />
      <Tab.Screen name="Stats"     component={StatsScreen} />
      <Tab.Screen name="Character" children={() => <PlaceholderScreen label="캐릭터" />} />
      <Tab.Screen name="More"      children={() => <PlaceholderScreen label="더보기" />} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <TodoProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signup">
          <Stack.Screen name="Login"  component={LoginScreen}  options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main"   component={MainTabs}     options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}
