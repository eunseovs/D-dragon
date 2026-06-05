  import { useRouter, useLocalSearchParams } from "expo-router";
  import React, { useState } from "react";
  import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
  import { useCharacter } from "../contexts/CharacterContext";

  const { width } = Dimensions.get("window");

  const SHOW_GAME_ELEMENTS = true;

  export default function CharacterScreen() {
    const { egg } = useLocalSearchParams();
    const router = useRouter();
    const [hunger] = useState(80);
    const { clean } = useCharacter();
    const {
  level,
  exp,
  coin,
  addExp,
  addCoin,
} = useCharacter();

    let characterImage;

if (egg === "0") {
// 빨강

if (level === 1) {
characterImage = require("../img/redEgg.png");
} else if (level === 2) {
characterImage = require("../img/redEggLv2.png");
} else if (level === 3) {
characterImage = require("../img/redEggLv3.png");
} else if (level < 15) {
characterImage = require("../img/redLv1.png");
} else if (level < 30) {
characterImage = require("../img/redLv2.png");
} else {
characterImage = require("../img/redLv3.png");
}

} else if (egg === "1") {
// 파랑

if (level === 1) {
characterImage = require("../img/blueEgg.png");
} else if (level === 2) {
characterImage = require("../img/blueEggLv2.png");
} else if (level === 3) {
characterImage = require("../img/blueEggLv3.png");
} else if (level < 15) {
characterImage = require("../img/blueLv1.png");
} else if (level < 30) {
characterImage = require("../img/blueLv2.png");
} else {
characterImage = require("../img/blueLv3.png");
}

} else {
// 초록

if (level === 1) {
characterImage = require("../img/greenEgg.png");
} else if (level === 2) {
characterImage = require("../img/greenEggLv2.png");
} else if (level === 3) {
characterImage = require("../img/greenEggLv3.png");
} else if (level < 15) {
characterImage = require("../img/greenLv1.png");
} else if (level < 30) {
characterImage = require("../img/greenLv2.png");
} else {
characterImage = require("../img/greenLv3.png");
}
}

    return (
      <View style={styles.container}>
        <ImageBackground source={require("../img/room_background.png")} style={styles.background} resizeMode="cover">

          {SHOW_GAME_ELEMENTS && (
            <View style={styles.topHeader}>
            <View style={styles.levelCard}>
            <Text style={styles.levelText}>
  Lv. {level}
</Text>

  <View style={styles.levelBarBackground}>
    <View
      style={[
        styles.levelBarFill,
        { width: `${(exp / (level * 20)) * 100}%` }
      ]}
    />
  </View>

<Text style={styles.levelPercent}>
  {exp} / {level * 20} XP
</Text>
</View>

<View style={styles.rightPanel}>

  <View style={styles.coinCard}>
    <Text style={styles.coinText}>
      C {coin}
    </Text>
  </View>

<TouchableOpacity
  style={styles.debugButton}
  onPress={() => {
  addExp(20);
  addCoin(20);
}}
>
    <Text style={styles.debugButtonText}>
      +20 XP
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
  style={styles.debugButton}
  onPress={() => {
    addExp(500);
  }}
>
  <Text style={styles.debugButtonText}>
    +500 XP
  </Text>
</TouchableOpacity>


</View>
            </View>
          )}

          <View style={styles.characterArea}>
  <Image
    source={characterImage}
    style={
      level <= 3
        ? styles.eggImage
        : styles.characterImage
    }
    resizeMode="contain"
  />
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
    marginTop: 85,
  },

eggImage: {
  width: 150,
  height: 150,
  marginTop: 50,
},

characterImage: {
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
debugButton: {
  marginTop: 20,
  backgroundColor: "#D9C7F7",
  borderRadius: 12,
  paddingVertical: 5,
  alignItems: "center",
},

debugButtonText: {
  color: "#555",
  fontSize: 12,
  fontWeight: "700",
},

});