import { useCharacter } from "../contexts/CharacterContext";
import React, { useState } from "react";
import {
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const SHOW_GAME_ELEMENTS = true;

export default function ToiletScreen() {
  const router = useRouter();

  const {
  clean,
  setClean,
  level,
  exp,
  coin,
} = useCharacter();

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
    marginTop: 37,
  }}
>
  <View style={styles.topHeader}>
  <View style={styles.levelCard}>
    <Text style={styles.levelText}>
      Lv. {level}
    </Text>

    <View style={styles.levelBarBackground}>
      <View
        style={[
          styles.levelBarFill,
          {
            width: `${(exp / (level * 20)) * 100}%`,
          },
        ]}
      />
    </View>

    <Text style={styles.levelPercent}>
      {exp} / {level * 20} XP
    </Text>
  </View>

  <View style={styles.coinCard}>
    <Text style={styles.coinText}>
      C {coin}
    </Text>
  </View>
</View>
      {poops.map((poop) => (
        <TouchableOpacity
  key={poop.id}
  style={{
    position: "absolute",
    top: poop.top,
    left: poop.left,
    zIndex: 9999,
  }}>
          <Image
            source={require("../img/poop.png")}
            style={styles.poop}
          />
        </TouchableOpacity>
      ))}

      <View style={styles.characterArea}>
  <Image
    source={require("../img/greenLv1.png")}
    style={styles.ddiyong}
    resizeMode="contain"
  />
</View>

<View style={styles.statusSection}>
  <View style={styles.statusCard}>

    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>
        🍪 포만감
      </Text>

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: "80%" }
          ]}
        />
      </View>

      <Text style={styles.percentText}>
        80%
      </Text>
    </View>

    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>
        🫧 청결도
      </Text>

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${clean}%` }
          ]}
        />
      </View>

      <Text style={styles.percentText}>
        {clean}%
      </Text>
    </View>

  </View>
</View>

      <View style={styles.bottomMenu}>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/info")}>
                  <Image source={require("../img/info_button.png")} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/closet")}>
                  <Image source={require("../img/closet_button.png")} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/achievements")}>
                  <Image source={require("../img/achievements_button.png")} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/fortune")}>
                  <Image source={require("../img/fortune_button.png")} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/walk")}>
                  <Image source={require("../img/walk_button.png")} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/character")}>
                  <Image source={require("../img/room_button.png")} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
              </View>
            </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

    poop: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

topHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginTop: 65,
  paddingHorizontal: 15,
},

  characterArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 85,
  },

  ddiyong: {
    width: 220,
    height: 220,
  },

statusSection: {
  alignItems: "center",
  marginBottom: 226,
},

statusCard: {
  width: width * 0.85,
  alignSelf: "center",
  backgroundColor: "rgba(255,255,255,0.75)",
  borderRadius: 24,
  paddingVertical: 6,
  paddingHorizontal: 16,
},

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },

  statusLabel: {
    width: 70,
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },

  barBackground: {
    flex: 1,
    height: 10,
  backgroundColor: "rgba(239, 219, 230, 0.6)",
    borderRadius: 999,
    overflow: "hidden",
    marginHorizontal: 10,
  },

  barFill: {
    height: "100%",
    backgroundColor: "#C8E6D5",
    borderRadius: 999,
  },

  percentText: {
    width: 40,
    textAlign: "right",
    fontSize: 13,
    color: "#666",
  },

  bottomMenu: {
  position: "absolute",
  bottom: 4,
  width: "100%",
  alignItems: "center",
},

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 9.5,
  },

  button: {
    alignItems: "center",
    width: width * 0.333,
  },

  icon: {
    width: width * 0.22,
    height: width * 0.22,
  },

  levelCard: {
  width: 150,
},

levelText: {
  fontSize: 18,
  fontWeight: "700",
  color: "#555",
  marginBottom: 6,
},

levelBarBackground: {
  height: 12,
  backgroundColor: "rgba(239, 219, 230, 0.6)",
  borderRadius: 999,
  overflow: "hidden",
},

levelBarFill: {
  height: "100%",
  backgroundColor: "#C8E6D5",
  borderRadius: 999,
},

levelPercent: {
  marginTop: 4,
  fontSize: 12,
  color: "#777",
  textAlign: "right",
},

coinCard: {
  alignItems: "center",
  backgroundColor: "#ffdd6e",
  paddingHorizontal: 16,
  paddingVertical: 5,
  borderRadius: 16,
},

coinText: {
  fontSize: 15,
  fontWeight: "700",
  color: "#777",
},


});