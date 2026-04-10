import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
// ✅ Expo Router를 사용하여 경로 이동
import { useRouter } from "expo-router";

// --- 1. 타입 정의 ---
type ItemType = "wing" | "hige" | "glass" | "ring" | "tie";

interface ClothesItem {
  id: string;
  type: ItemType;
  image: any;
  posIdx: number;
  name: string;
}

// --- 2. 아이템 데이터 ---
const CLOTHES_DATA: ClothesItem[] = [
  {
    id: "1",
    type: "wing",
    name: "악마날개",
    image: require("../img/devilWing.png"),
    posIdx: 0,
  },
  {
    id: "2",
    type: "hige",
    name: "수염",
    image: require("../img/hige.png"),
    posIdx: 1,
  },
  {
    id: "3",
    type: "glass",
    name: "선글라스",
    image: require("../img/sunglass.png"),
    posIdx: 2,
  },
  {
    id: "4",
    type: "glass",
    name: "안경",
    image: require("../img/glass.png"),
    posIdx: 3,
  },
  {
    id: "5",
    type: "ring",
    name: "천사링",
    image: require("../img/engelRing.png"),
    posIdx: 4,
  },
  {
    id: "6",
    type: "tie",
    name: "넥타이",
    image: require("../img/tie.png"),
    posIdx: 5,
  },
];

// --- 3. 선반 위치 (네가 노가다로 맞춘 소중한 좌표!) ---
const SHELF_POSITIONS = [
  { top: 150, left: 120 }, // 0: 악마날개
  { top: 460, left: 240 }, // 1: 수염
  { top: 420, left: 240 }, // 2: 선글라스
  { top: 410, left: 120 }, // 3: 안경
  { top: 520, left: 100 }, // 4: 엔젤링
  { top: 270, left: 320 }, // 5: 넥타이
];

const Closet = () => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ImageBackground
      source={require("../img/closet_background.jpg")}
      style={styles.container}
    >
      <View style={styles.closetGrid}>
        {CLOTHES_DATA.map((item: ClothesItem) => {
          const pos = SHELF_POSITIONS[item.posIdx];
          const isSelected = selectedId === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.shelfItem, { top: pos.top, left: pos.left }]}
              onPress={() => setSelectedId(isSelected ? null : item.id)}
            >
              {/* ✅ ㅇㅅ --- 선택 손가락 (아이템 선택 시에만 등장) --- */}
              {isSelected && (
                <Image
                  source={require("../img/select_hand.png")}
                  style={styles.selectHand}
                />
              )}

              <Image source={item.image} style={styles.itemImage} />
            </TouchableOpacity>
          );
        })}

        {/* ✅ 선택된 아이템이 있을 때만 버튼이 보임! 꾹! */}
        {selectedId && (
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => router.replace("/character")} // ✅ character.tsx로 이동!
          >
            <Image
              source={require("../img/select_egg_button.png")}
              style={styles.selectBtnImg}
            />
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

// --- 4. 스타일 (네가 수정한 값들 100% 반영!) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  closetGrid: {
    flex: 1,
    position: "relative",
    width: "100%",
  },
  shelfItem: {
    position: "absolute",
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
  },

  // ✅ ㅇㅅ --- 선택 손가락 ---
  selectHand: {
    position: "absolute",
    top: -40, // 아이템 이미지보다 위로 올림
    width: 60,
    height: 60,
    resizeMode: "contain",
    zIndex: 10,
  },

  // ✅ ㅇㅅ --- 아이템 크기 ---
  itemImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  // ✅ ㅇㅅ --- 버튼 위치 ---
  selectButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    alignItems: "center",
  },

  // ✅ ㅇㅅ --- 버튼 크기 ---
  selectBtnImg: {
    width: 170,
    height: 80,
    resizeMode: "contain",
  },
});

export default Closet;
