import React from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";

export default function CalendarView() {

  const router = useRouter();

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const handleDayPress = (day) => {

    const selectedDate = new Date(day.dateString);
    const now = new Date();

    // 미래 날짜 클릭 방지
    if (selectedDate > now) {
      return;
    }

    // 오늘 날짜 → 사진 선택
    if (day.dateString === todayString) {

      router.push("/photoSelect");
      return;

    }

    // 과거 날짜 → 기록 보기
    router.push({
      pathname: "/diary",
      params: { date: day.dateString }
    });

  };

  return (

    <View style={{backgroundColor:"#FFFFFF"}}>

      <Calendar
        onDayPress={handleDayPress}
        maxDate={todayString}

        theme={{
          backgroundColor:"#FFFFFF",
          calendarBackground:"#FFFFFF",
          todayTextColor:"#70C1A3",
          arrowColor:"#70C1A3",
          monthTextColor:"#333",
          textMonthFontSize:20,
          textDayFontSize:16,
          textDayHeaderFontSize:14
        }}
      />

    </View>

  );

}