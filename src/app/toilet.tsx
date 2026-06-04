import React, { useState } from "react";
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useCharacter } from "../contexts/CharacterContext";

export default function ToiletScreen() {
  const router = useRouter();

  const { clean, setClean } = useCharacter();

  const [poops, setPoops] = useState([
    { id: 1, top: 300, left: 80 },
    { id: 2, top: 420, left: 250 },
    { id: 3, top: 520, left: 140 },
  ]);

  const cleanPoop = (id) => {
    setPoops((prev) => prev.filter((p) => p.id !== id));
    setClean((prev) => Math.min(prev + 10, 100));
  };

  return (
    <ImageBackground
  source={require("../img/toilet_background.png")}
  style={styles.background}
  imageStyle={{
    marginTop: 38,
  }}
>
      {poops.map((poop) => (
        <TouchableOpacity
          key={poop.id}
          style={{
            position: "absolute",
            top: poop.top,
            left: poop.left,
          }}
          onPress={() => cleanPoop(poop.id)}
        >
          <Image
            source={require("../img/poop.png")}
            style={styles.poop}
          />
        </TouchableOpacity>
      ))}

      <View style={styles.topBox}>
        <Text style={styles.cleanText}>
          청결도 : {clean}%
        </Text>
      </View>

      <View style={styles.bottomMenu}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/character")}
        >
          <Text style={styles.buttonText}>
            방으로 가기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setClean((prev) => Math.max(prev - 10, 0))
          }
        >
          <Text style={styles.buttonText}>
            💩 테스트
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

topHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginTop: 65,
  paddingHorizontal: 15,
},

  poop: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  topBox: {
    marginTop: 70,
    alignItems: "center",
  },

  cleanText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },

  bottomMenu: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 5,
  },

  buttonText: {
    fontWeight: "bold",
  },
});