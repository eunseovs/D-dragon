import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { initDB } from "../database";

export default function Layout() {
  const [loaded, error] = useFonts({
    DNFBitBitv2: require("../assets/fonts/DNFBitBitv2.ttf"),
  });

  useEffect(() => {
    initDB();
  }, []);

  if (!loaded && !error) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
