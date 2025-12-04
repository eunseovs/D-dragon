import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4D96FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        }
      }}
    >
      {/* 1. 홈 */}
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />

      {/* 2. 내 캐릭터 (character.tsx로 변경됨!) */}
      <Tabs.Screen
        name="character"
        options={{
          title: '내 캐릭터',
          tabBarIcon: ({ color }) => <Ionicons name="happy-outline" size={24} color={color} />,
        }}
      />

      {/* 3. 통계AI */}
      <Tabs.Screen
        name="stats"
        options={{
          title: '통계AI',
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart-outline" size={24} color={color} />,
        }}
      />

      {/* 4. 소셜 */}
      <Tabs.Screen
        name="social"
        options={{
          title: '소셜',
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
        }}
      />

      {/* 5. 마이페이지 */}
      <Tabs.Screen
        name="mypage"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />

      {/* 탭에 보이지 않는 화면들 (숨김 처리) */}
      <Tabs.Screen
        name="addtask"
        options={{ href: null }} 
      />
      <Tabs.Screen
        name="diary"
        options={{ href: null }} 
      />
      {/* calendar.tsx는 이제 안 쓰므로 연결을 끊거나 지워도 됩니다 */}
      <Tabs.Screen
        name="calendar"
        options={{ href: null }} 
      />
    </Tabs>
  );
}