import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Text as RNText,
  StyleSheet,
  TextProps,
  TouchableOpacity,
  View,
} from "react-native";
import { dailyFortunes, luckyColors, luckyItems } from "./fortunes";

const { width, height } = Dimensions.get("window");

const DdiyongText = (props: TextProps) => (
  <RNText {...props} style={[{ fontFamily: "DNFBitBitv2" }, props.style]}>
    {props.children}
  </RNText>
);

export default function FortuneScreen() {
  const router = useRouter();

  const [isResultShown, setIsResultShown] = useState(false);
  const [userZodiac, setUserZodiac] = useState(""); // 별자리 이름용
  const [pureFortune, setPureFortune] = useState(""); // 운세 글용
  const [luckySet, setLuckySet] = useState(""); // 행운 아이템용

  const calculateZodiac = (dateString: string) => {
    if (!dateString) return "신비주의 용";
    const [year, month, day] = dateString.split("-").map(Number);
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return "물병자리";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
      return "물고기자리";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return "양자리";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return "황소자리";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21))
      return "쌍둥이자리";
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22))
      return "게자리";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
      return "사자자리";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 23))
      return "처녀자리";
    if ((month === 9 && day >= 24) || (month === 10 && day <= 22))
      return "천칭자리";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 22))
      return "전갈자리";
    if ((month === 11 && day >= 23) || (month === 12 && day <= 24))
      return "사수자리";
    return "염소자리";
  };

  const handleShowFortune = async () => {
    try {
      const savedData = await AsyncStorage.getItem("ddiyo_profile");
      let zodiac = "신비주의 용";
      if (savedData) {
        const profile = JSON.parse(savedData);
        zodiac = profile.zodiac || calculateZodiac(profile.birth);
      }

      const today = new Date();
      const dateSeed =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();
      const zodiacBonus = zodiac.charCodeAt(0);

      const fortuneIndex = (dateSeed + zodiacBonus) % dailyFortunes.length;
      const itemIndex = (dateSeed * zodiacBonus) % luckyItems.length;
      const colorIndex = (dateSeed + zodiacBonus * 2) % luckyColors.length;

      // ✅ 따로따로 저장!
      setUserZodiac(`✨ ${zodiac} ✨`);
      setPureFortune(dailyFortunes[fortuneIndex]);
      setLuckySet(`🍀 ${luckyColors[colorIndex]} / ${luckyItems[itemIndex]}`);

      setIsResultShown(true);
    } catch (e) {
      setPureFortune("띠용이가 졸려서 운세를 못 읽고 있어.. 😴");
      setIsResultShown(true);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/fortune_background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          {isResultShown && (
            <View style={styles.resultContainer}>
              <Image
                source={require("../img/fortune_result.png")}
                style={styles.resultImage}
                resizeMode="stretch" // contain 대신 stretch를 써야 꽉 차게 커짐!
              />
              <View style={styles.textOverlay}>
                {/* 별자리 이름 (크고 굵게!) */}
                <DdiyongText style={styles.zodiacTitle}>
                  {userZodiac}
                </DdiyongText>

                {/* 운세 본문 */}
                <DdiyongText style={styles.fortuneContent}>
                  {pureFortune}
                </DdiyongText>

                {/* 행운 세트 (포인트 컬러!) */}
                <DdiyongText style={styles.luckyText}>{luckySet}</DdiyongText>
              </View>
            </View>
          )}

          <View
            style={isResultShown ? styles.checkButtonArea : styles.buttonArea}
          >
            {!isResultShown ? (
              <TouchableOpacity onPress={handleShowFortune}>
                <Image
                  source={require("../img/fortune_check_button.png")}
                  style={styles.actionButton}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => router.replace("/character")}>
                <Image
                  source={require("../img/check_button.png")}
                  style={styles.actionButton}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { width: width, height: height },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // 결과 팝업 크기를 왕창 키움!
  resultContainer: {
    width: width, // 가로 꽉 차게!
    height: height * 0.8, // 세로 화면의 80%!
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 120, // 닫기 버튼 자리를 위해 밑 여백 살짝 줄임
  },
  resultImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  textOverlay: {
    // 팝업이 커졌으니 안쪽 여백도 키우고 위치 조정
    paddingHorizontal: 60, // 양옆 여백 넉넉히
    marginTop: 45, //ㅇㅅ 글자뭉탱이 옮기는거
    justifyContent: "center",
    alignItems: "center",
  },
  fortuneText: {
    fontSize: 22, // [알잘딱 4] 팝업이 커졌으니 글자도 시원하게 22!
    textAlign: "center",
    lineHeight: 30, // 글자가 커졌으니 줄 간격도 늘림
  },
  buttonArea: {
    position: "absolute",
    bottom: 200,
  },

  // 결과 뜬 후 "확인" 버튼 위치
  checkButtonArea: {
    position: "absolute",
    bottom: 150,
  },

  actionButton: {
    width: width * 0.5,
    height: 70,
  },

  zodiacTitle: {
    fontSize: 24,
    color: "#28284f",
    marginBottom: 30, // 본문이랑 간격 벌리기
  },
  fortuneContent: {
    fontSize: 16,
    color: "#28284f",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 15, // 아이템이랑 간격 벌리기
  },
  luckyText: {
    fontSize: 16,
    color: "#28284f",
  },
});
