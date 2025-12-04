import React from 'react';
import { View, StyleSheet } from 'react-native';
import MatrixCard from './MatrixCard';
import { Colors } from '../../constants/Colors';

export default function MatrixGrid() {
  return (
    <View style={styles.container}>
      {/* 1행 */}
      <View style={styles.row}>
        <MatrixCard 
          title="중요하고 급함" 
          color={Colors.urgentImportant} 
          tasks={['내일까지 보고서 작성하기']} 
        />
        <MatrixCard 
          title="중요하지만 급하지 않음" 
          color={Colors.important} 
          tasks={['프로젝트 담당자와 네트워킹 하기']} 
        />
      </View>

      {/* 2행 */}
      <View style={styles.row}>
        <MatrixCard 
          title="급하지만 중요하지 않음" 
          color={Colors.urgent} 
          tasks={['오후에 있는 회의 참여하기']} 
        />
        <MatrixCard 
          title="급하지도 중요하지도 않음" 
          color={Colors.neither} 
          tasks={['유튜브 보기']} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
});