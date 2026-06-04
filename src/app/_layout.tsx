import "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DiaryProvider } from "../contexts/DiaryContext";
import { SelectedDateProvider } from "../contexts/SelectedDateContext";
import { TodoProvider } from "../contexts/TodoContext";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function AppLayout() {
  const [loaded, error] = useFonts({
    DNFBitBitv2: require("../../assets/fonts/DNFBitBitv2.ttf"),
  });

  if (error) console.log("Font Error:", error);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SelectedDateProvider>
        <DiaryProvider>
          <TodoProvider>
            <Tabs
              screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#4D96FF",
                tabBarInactiveTintColor: "#999",
                tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
                tabBarLabelStyle: { fontSize: 10, fontWeight: "bold" },
              }}
            >
              <Tabs.Screen
                name="index"
                options={{
                  title: "홈",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="home-outline" size={24} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="social"
                options={{
                  title: "일기작성",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="create-outline" size={24} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="stats"
                options={{
                  title: "통계",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="bar-chart-outline" size={24} color={color} />
                  ),
                }}
              />
              <Tabs.Screen
                name="character"
                options={{
                  title: "내 캐릭터",
                  tabBarIcon: ({ color }) => (
                    <Ionicons name="game-controller-outline" size={24} color={color} />
                  ),
                }}
              />

              <Tabs.Screen name="mypage" options={{ href: null }} />
              <Tabs.Screen
                name="signup"
                options={{ href: null, headerShown: false, tabBarStyle: { display: "none" } }}
              />
              <Tabs.Screen
                name="login"
                options={{ href: null, headerShown: false, tabBarStyle: { display: "none" } }}
              />

              <Tabs.Screen name="info" options={{ href: null, headerShown: false }} />
              <Tabs.Screen name="closet" options={{ href: null, headerShown: false }} />
              <Tabs.Screen name="achievements" options={{ href: null, headerShown: false }} />
              <Tabs.Screen name="toilet" options={{ href: null, headerShown: false }} />
              <Tabs.Screen name="fortune" options={{ href: null, headerShown: false }} />
              <Tabs.Screen name="walk" options={{ href: null, headerShown: false }} />
            </Tabs>
          </TodoProvider>
        </DiaryProvider>
      </SelectedDateProvider>
    </GestureHandlerRootView>
  );
}
