import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, 
  FlatList, TextInput, KeyboardAvoidingView, Platform 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function PhotoSelect() {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const router = useRouter();

  // 사진 선택 함수
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, 
      quality: 1,
    });

    if (!result.canceled) {
      // 선택된 사진들에 코멘트 속성 추가
      const newPhotos = result.assets.map(asset => ({
        uri: asset.uri,
        comment: "" 
      }));
      setSelectedPhotos([...selectedPhotos, ...newPhotos]);
    }
  };

  // 코멘트 업데이트 함수
  const updateComment = (index, text) => {
    const updated = [...selectedPhotos];
    updated[index].comment = text;
    setSelectedPhotos(updated);
  };

  // 다음 단계로 이동 (사진과 코멘트 전달)
  const handleComplete = () => {
    router.push({
      pathname: "/diary",
      params: { 
        photos: JSON.stringify(selectedPhotos) 
      }
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>사진 선택</Text>
        <Text style={styles.headerSub}>{selectedPhotos.length}/15 선택됨</Text>
      </View>

      <FlatList
        data={selectedPhotos}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={styles.photoCard}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TextInput
              style={styles.commentInput}
              placeholder="이 사진에 대한 짧은 기억을 적어주세요."
              value={item.comment}
              onChangeText={(text) => updateComment(index, text)}
              multiline
            />
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
            <Text style={styles.addBtnText}>+ 사진 추가하기</Text>
          </TouchableOpacity>
        }
      />

      <TouchableOpacity 
        style={[styles.completeBtn, selectedPhotos.length === 0 && styles.disabledBtn]} 
        onPress={handleComplete}
        disabled={selectedPhotos.length === 0}
      >
        <Text style={styles.completeBtnText}>기록하러 가기</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingTop: 60, paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#333" },
  headerSub: { fontSize: 14, color: "#888", marginTop: 5 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  photoCard: { marginBottom: 20, backgroundColor: "#F9F9F9", borderRadius: 15, overflow: "hidden", borderWidth: 1, borderColor: "#EEE" },
  image: { width: "100%", height: 200, resizeMode: "cover" },
  commentInput: { padding: 15, fontSize: 15, color: "#444", backgroundColor: "#fff", minHeight: 60 },
  addBtn: { height: 150, backgroundColor: "#F5F5F5", borderRadius: 15, justifyContent: "center", alignItems: "center", borderStyle: "dashed", borderWidth: 1, borderColor: "#CCC" },
  addBtnText: { color: "#888", fontWeight: "600" },
  completeBtn: { position: "absolute", bottom: 30, left: 20, right: 20, backgroundColor: "#6FAF8F", padding: 18, borderRadius: 15, alignItems: "center" },
  disabledBtn: { backgroundColor: "#CCC" },
  completeBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});