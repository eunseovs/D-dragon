import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDB } from "../database";

export default function Layout() {
  useEffect(() => {
    initDB();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}