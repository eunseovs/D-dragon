import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#79b39a",
        tabBarInactiveTintColor: "#666",

        tabBarStyle: {
          backgroundColor: "#D9D9D9",
          height: 80,
          paddingTop: 10,
          paddingBottom: 10
        },

        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        },

        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 3
        }
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="social"
        options={{
          title: "일기작성",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create-outline" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "통계",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="mypage"
        options={{
          title: "더보기",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="character"
        options={{ href: null }}
      />

    </Tabs>
  );
}