import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import MatrixScreen from "../screens/MatrixScreen";

export default function Index() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    AsyncStorage.getItem("auth_user").then((val) => {
      setStatus(val ? "loggedIn" : "guest");
    });
  }, []);

  if (status === "loading") return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  if (status === "guest") return <Redirect href="/signup" />;
  return <MatrixScreen />;
}
