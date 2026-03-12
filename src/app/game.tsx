import React from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function GameScreen() {
  return (
    <ImageBackground
      source={require("../../background.jpg")}
      style={styles.container}
    >
      {/* 중앙 띠용이 */}
      <View style={styles.characterContainer}>
        <Image
          source={require("../../greenLv1.png")}
          style={styles.ddiyong}
          resizeMode="contain"
        />
      </View>

      {/* 하단 메뉴 버튼 */}
      <View style={styles.bottomMenu}>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => Alert.alert("정보")}>
            <Image source={require("../../info.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("꾸미기")}>
            <Image source={require("../../closet.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("업적")}>
            <Image
              source={require("../../achievements.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => Alert.alert("운세")}>
            <Image source={require("../../fortune.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("화장실")}>
            <Image source={require("../../toilet.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert("산책")}>
            <Image source={require("../../walk.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  characterContainer: { position: "absolute", top: "55%" },
  ddiyong: { width: 180, height: 180 },
  bottomMenu: { position: "absolute", bottom: 40, width: "100%" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  icon: { width: 90, height: 90, resizeMode: "contain" },
});
