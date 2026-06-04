  import { useRouter } from "expo-router";
  import React, { useState } from "react";
  import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";

  const { width } = Dimensions.get("window");

  const SHOW_GAME_ELEMENTS = true;

  export default function CharacterScreen() {
    const router = useRouter();
    const [hunger] = useState(80);
    const [clean] = useState(60);
    const [exp] = useState(40);

    return (
      <View style={styles.container}>
        <ImageBackground source={require("../img/room_background.png")} style={styles.background} resizeMode="cover">

          {SHOW_GAME_ELEMENTS && (
            <View style={styles.topHeader}>
            <View style={styles.levelCard}>
  <Text style={styles.levelText}>Lv. 3</Text>

  <View style={styles.levelBarBackground}>
    <View
      style={[
        styles.levelBarFill,
        { width: `${exp}%` }
      ]}
    />
  </View>

<Text style={styles.levelPercent}>
  40 / 100 XP
</Text>
</View>
<View style={styles.coinCard}>
  <Text style={styles.coinText}>
    1,329 C
  </Text>
</View>
            </View>
          )}

          <View style={styles.characterArea}>
            <Image source={require("../img/greenLv1.png")} style={styles.ddiyong} resizeMode="contain" />
          </View>
{SHOW_GAME_ELEMENTS && (
  <View style={styles.statusSection}>
    <View style={styles.statusCard}>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>🍪 포만감</Text>

        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              { width: `${hunger}%` }
            ]}
          />
        </View>

        <Text style={styles.percentText}>
          {hunger}%
        </Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>🫧 청결도</Text>

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
)}

          {SHOW_GAME_ELEMENTS && (
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
                <TouchableOpacity style={styles.button} onPress={() => router.push("/toilet")}>
                  <Image source={require("../img/toilet_button.png")} style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ImageBackground>
      </View>
      
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

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

  characterArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 120,
  },

  ddiyong: {
    width: 220,
    height: 220,
  },

statusSection: {
  alignItems: "center",
  marginBottom: 30,
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
    marginBottom: 3,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  button: {
    alignItems: "center",
    width: width * 0.3,
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
  flexDirection: "row",
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