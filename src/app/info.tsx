import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const { width, height } = Dimensions.get("window");

//폰트 지정 코드 여기서 fontFamily 수정하면 바뀜요
const DdiyongText = (props: TextProps) => (
  <RNText {...props} style={[{ fontFamily: "DNFBitBitv2" }, props.style]}>
    {props.children}
  </RNText>
);

const genders = ["남자", "여자"];
const bloodTypes = ["A형", "B형", "O형", "AB형"];
const bloodPersonalityMap = {
  A형: "세심하고 다정한 원칙주의자",
  B형: "자유로운 영혼의 소유자",
  O형: "활발하고 리더십 넘치는 분위기 메이커",
  AB형: "종잡을 수 없는 매력의 4차원 천재",
};

export default function InfoScreen() {
  const router = useRouter();

  const [profile, setProfile] = useState({
    birth: "",
    zodiac: "",
    gender: "",
    blood: "",
    personality: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        let savedData = await AsyncStorage.getItem("ddiyo_profile");
        let finalProfile;

        if (!savedData) {
          const today = new Date();
          const birth = `${today.getFullYear()}. ${today.getMonth() + 1}. ${today.getDate()}`;
          const selectedBlood =
            bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
          const selectedPersonality =
            bloodPersonalityMap[
              selectedBlood as keyof typeof bloodPersonalityMap
            ];

          finalProfile = {
            birth: birth,
            zodiac: calculateZodiac(birth.replace(/\. /g, "-")),
            gender: genders[Math.floor(Math.random() * genders.length)],
            blood: selectedBlood,
            personality: selectedPersonality,
          };

          await AsyncStorage.setItem(
            "ddiyo_profile",
            JSON.stringify(finalProfile),
          );
        } else {
          finalProfile = JSON.parse(savedData);
        }
        setProfile(finalProfile);
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const calculateZodiac = (dateString: string) => {
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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/room_background.png")}
        style={styles.fullBackground}
      >
        <View style={styles.overlay}>
          <View style={styles.popupContainer}>
            <Image
              source={require("../img/info_popup.png")}
              style={styles.popupImage}
              resizeMode="contain"
            />

            {/* ✅ 메인 텍스트 레이어 */}
            <View style={styles.textLayer}>
              {/* 1. 제목 (상단 배치) */}
              <DdiyongText style={styles.title}>띠용이 정보</DdiyongText>

              {/* 2. 데이터 컨테이너 (내용들을 묶어서 따로 위치 조정) */}
              <View style={styles.dataContainer}>
                <View style={styles.infoRow}>
                  <DdiyongText style={styles.icon}>♥</DdiyongText>
                  <DdiyongText style={styles.label}>생일 :</DdiyongText>
                  <DdiyongText style={styles.value}>
                    {profile.birth}
                  </DdiyongText>
                </View>

                <View style={styles.infoRow}>
                  <DdiyongText style={styles.icon}>♥</DdiyongText>
                  <DdiyongText style={styles.label}>별자리 :</DdiyongText>
                  <DdiyongText style={styles.value}>
                    {profile.zodiac}
                  </DdiyongText>
                </View>

                <View style={styles.infoRow}>
                  <DdiyongText style={styles.icon}>♥</DdiyongText>
                  <DdiyongText style={styles.label}>성별 :</DdiyongText>
                  <DdiyongText style={styles.value}>
                    {profile.gender}
                  </DdiyongText>
                </View>

                <View style={styles.infoRow}>
                  <DdiyongText style={styles.icon}>♥</DdiyongText>
                  <DdiyongText style={styles.label}>혈액형 :</DdiyongText>
                  <DdiyongText style={styles.value}>
                    {profile.blood}
                  </DdiyongText>
                </View>

                <View style={styles.infoRow}>
                  <DdiyongText style={styles.icon}>♥</DdiyongText>
                  <DdiyongText style={styles.label}>성격 :</DdiyongText>
                  <DdiyongText style={[styles.value, { flex: 1 }]}>
                    {profile.personality}
                  </DdiyongText>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.replace("/character")}>
            <Image
              source={require("../img/check_button.png")}
              style={styles.checkButton}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullBackground: { width, height },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    width: width * 0.9,
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  popupImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  textLayer: {
    width: "80%",
    alignItems: "center", // 제목은 가운데 정렬되도록
    marginTop: -30, // 하트 배경 이미지 위치에 맞춰 조정
  },
  title: {
    fontSize: 20,
    color: "#1d1405",
    marginBottom: 30, // 제목과 정보 사이의 간격을 크게 벌림
    marginTop: 27,
  },
  dataContainer: {
    width: "100%",
    paddingLeft: 20, // 정보창 전체를 살짝 오른쪽으로 밀어 균형 맞춤
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10, // 줄 사이 간격
  },
  icon: {
    fontSize: 10,
    marginRight: 10,
    color: "#FF7EE2",
  },
  label: {
    fontSize: 16,
    color: "#1d1405",
    marginRight: 15,
    width: 70, // 라벨 폭을 고정해서 ':' 위치를 맞춤
  },
  value: {
    fontSize: 16,
    color: "#1d1405",
  },
  checkButton: {
    width: width * 0.5,
    height: 70,
    marginTop: -90, // 닫기 버튼을 하트 밑부분에 가깝게 올림
  },
});
