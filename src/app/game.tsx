import * as React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function GameScreen() {
  return (
    <View style={styles.container}>
      {/* 1. 배경화면 경로 확인 */}
      <ImageBackground
        source={require("../img/background.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* 2. 중앙 캐릭터 (greenLv1.png 확인완료) */}
        <View style={styles.characterContainer}>
          <Image
            source={require("../img/greenLv1.png")}
            style={styles.ddiyong}
            resizeMode="contain"
          />
        </View>

        {/* 3. 하단 메뉴 버튼 (파일명 100% 일치시킴) */}
        <View style={styles.bottomMenu}>
          <View style={styles.buttonRow}>
            {/* 정보보기 (info.png) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("정보보기")}
            >
              <Image source={require("../img/info.png")} style={styles.icon} />
            </TouchableOpacity>

            {/* 꾸미기 (closet.png) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("꾸미기")}
            >
              <Image
                source={require("../img/closet.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* 업적 (achievements.png) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("업적")}
            >
              <Image
                source={require("../img/achievements.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            {/* 오늘의 운세 (fortune.png) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("오늘의 운세")}
            >
              <Image
                source={require("../img/fortune.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* 화장실 가기 (toilet.png) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("화장실 가기")}
            >
              <Image
                source={require("../img/toilet.png")}
                style={styles.icon}
              />
            </TouchableOpacity>

            {/* 산책 가기 (walk.png) */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => Alert.alert("산책 가기")}
            >
              <Image source={require("../img/walk.png")} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  characterContainer: {
    position: "absolute",
    top: "55%",
    alignItems: "center",
  },
  ddiyong: {
    width: 180,
    height: 180,
  },
  bottomMenu: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  button: { alignItems: "center", justifyContent: "center" },
  icon: {
    width: width * 0.28,
    height: width * 0.28,
    resizeMode: "contain",
  },
});
