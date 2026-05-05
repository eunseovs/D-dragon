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

export default function WalkScreen() {
  const router = useRouter();
  const [hunger] = useState(80);
  const [clean] = useState(60);
  const [exp] = useState(40);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/walk_background.png")}
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
              source={require("../img/greenLvGauge.png")}
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

        {/* 산책 캐릭터 영역 */}
        <View style={styles.characterArea}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>킁킁.. 풀냄새가 좋네용!</Text>
          </View>
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

        {/* 하단 버튼 (산책 전용: 방으로 가기 포함) */}
        <View style={styles.bottomMenu}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <Image
                source={require("../img/info_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image
                source={require("../img/closet_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image
                source={require("../img/achievements_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            {/* 오늘의 운세 */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/fortune")}
            >
              <Image
                source={require("../img/fortune_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* ✅ [방으로 가기] - router.back() 대신 replace로 확실하게 수정! */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/character")}
            >
              <Image
                source={require("../img/room_button.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
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
  bubble: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#76BA1B",
  },
  bubbleText: { fontSize: 16, fontWeight: "bold", color: "#444" },
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
