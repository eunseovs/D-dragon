import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// 폰트 로딩 전까지 화면이 멋대로 넘어가지 않게 방지
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  // 폰트 불러오기 로직 추가
  const [loaded, error] = useFonts({
    DNFBitBitv2: require("../../assets/fonts/DNFBitBitv2.ttf"),
  });
  if (error) console.log("Font Error:", error);

  // 폰트 로딩 완료 시 스플래시 화면 숨기기
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // 폰트가 아직 로딩 중이라면 아무것도 렌더링하지 않음
  if (!loaded && !error) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4D96FF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "bold",
        },
      }}
    >
      {/* 1. 홈 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      {/* 2. 내 캐릭터 */}
      <Tabs.Screen
        name="character"
        options={{
          title: "내 캐릭터",
          tabBarIcon: ({ color }) => (
            <Ionicons name="happy-outline" size={24} color={color} />
          ),
        }}
      />

      {/* 3. 통계AI */}
      <Tabs.Screen
        name="stats"
        options={{
          title: "통계AI",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={24} color={color} />
          ),
        }}
      />

      {/* 4. 소셜 */}
      <Tabs.Screen
        name="social"
        options={{
          title: "소셜",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      />

      {/* 5. 마이페이지 */}
      <Tabs.Screen
        name="mypage"
        options={{
          title: "마이페이지",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />

      {/* --- 하단 탭 바에서 숨겨지는 화면들 --- */}
      <Tabs.Screen name="addtask" options={{ href: null }} />
      <Tabs.Screen name="diary" options={{ href: null }} />
      <Tabs.Screen name="calendar" options={{ href: null }} />

      {/* --- 내 캐릭터에서 이동하는 화면들 --- */}
      <Tabs.Screen name="info" options={{ href: null, headerShown: false }} />
      <Tabs.Screen name="closet" options={{ href: null, headerShown: false }} />
      <Tabs.Screen
        name="achievements"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen name="toilet" options={{ href: null, headerShown: false }} />
      <Tabs.Screen
        name="fortune"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen name="walk" options={{ href: null, headerShown: false }} />
    </Tabs>
  );
}
