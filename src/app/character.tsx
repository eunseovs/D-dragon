import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CharacterScreen() {
  const router = useRouter();
  const [hunger] = useState(80);
  const [clean] = useState(60);
  const [exp] = useState(40);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/room_background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* 상단 헤더 */}
        <View style={styles.topHeader}>
          <View style={styles.levelWrapper}>
            <View style={styles.levelGaugeContainer}>
              <View style={[styles.levelFill, { width: `${exp}%` }]} />
            </View>
            <Image
              source={require("../img/blueLvGauge.png")}
              style={styles.levelFrame}
              resizeMode="contain"
            />
          </View>
          <ImageBackground
            source={require("../img/coin.png")}
            style={styles.coinBg}
            resizeMode="contain"
          >
            <Text style={styles.coinText}>1,329 C</Text>
          </ImageBackground>
        </View>

        {/* 캐릭터 영역 */}
        <View style={styles.characterArea}>
          <Image
            source={require("../img/greenLv1.png")}
            style={styles.ddiyong}
          />
        </View>

        {/* 상태 게이지 */}
        <View style={styles.statusSection}>
          <View style={styles.stateWrapper}>
            <View style={styles.stateColorLayer}>
              <View
                style={[styles.hungerFill, { width: `${hunger * 0.32}%` }]}
              />
              <View style={[styles.cleanFill, { width: `${clean * 0.32}%` }]} />
            </View>
            <Image
              source={require("../img/greenStateGauge.png")}
              style={styles.stateFrame}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* 하단 버튼 (6개) */}
        <View style={styles.bottomMenu}>
          <View style={styles.buttonRow}>
            {/* 1. 정보보기 */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/info")}
            >
              <Image
                source={require("../img/info_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* 2. 꾸미기 (옷장) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/closet")}
            >
              <Image
                source={require("../img/closet_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* 3. 업적 */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/achievements")}
            >
              <Image
                source={require("../img/achievements_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            {/* 4. 오늘의 운세 (이미 잘 되어있음!) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/fortune")}
            >
              <Image
                source={require("../img/fortune_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* 5. 산책하기 (이미 잘 되어있음!) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/walk")}
            >
              <Image
                source={require("../img/walk_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* 6. 화장실 가기 */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/toilet")}
            >
              <Image
                source={require("../img/toilet_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    paddingHorizontal: 15,
  },
  coinBg: {
    width: 140,
    height: 50,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,
  },
  coinText: { color: "#555", fontWeight: "bold", fontSize: 16 },
  levelWrapper: { width: 150, height: 60, justifyContent: "center" },
  levelFrame: { width: "100%", height: "100%", zIndex: 2 },
  levelGaugeContainer: {
    position: "absolute",
    left: 45,
    top: 26,
    width: 78,
    height: 10,
    backgroundColor: "#eee",
    zIndex: 1,
  },
  levelFill: { height: "100%", backgroundColor: "#58CCFF" },
  characterArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  ddiyong: { width: 220, height: 220, resizeMode: "contain" },
  statusSection: { alignItems: "center", marginBottom: 20 },
  stateWrapper: { width: width * 0.9, height: 100 },
  stateFrame: { width: "100%", height: "100%", zIndex: 2 },
  stateColorLayer: {
    position: "absolute",
    zIndex: 1,
    top: "43%",
    flexDirection: "row",
    width: "100%",
    paddingLeft: "26%",
  },
  hungerFill: { height: 14, backgroundColor: "#76BA1B", borderRadius: 5 },
  cleanFill: {
    height: 14,
    backgroundColor: "#FF9800",
    borderRadius: 5,
    marginLeft: "18%",
  },
  bottomMenu: { paddingBottom: 40 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  button: { alignItems: "center", width: width * 0.3 },
  icon: { width: width * 0.22, height: width * 0.22, resizeMode: "contain" },
});
