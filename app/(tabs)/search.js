import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import SearchIcon from '../../assets/search_black.svg';
import IconGray from '../../assets/icon_gray.svg';
import colors from '../../styles/colors';
import ClockGray from '../../assets/clock_gray.svg';
import CalendarGray from '../../assets/calendar_gray.svg';

export default function Search() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // 임의의 데이터 목록
  const data = [
    { id: '1', title: '1차 대면 회의', time: '오후 1:00 ~ 오후 5:00' },
    { id: '2', title: '2차 대면 회의', time: '오전 8:00 ~ 오전 11:00' },
    { id: '3', title: '3차 대면 회의', time: '오후 6:30 ~ 오후 8:15' },
  ];

  // 검색어에 따라 데이터를 필터링하는 함수
  const handleSearch = (text) => {
    setSearchText(text);

    if (text) {
      const newData = data.filter(item => 
        item.title.includes(text)
      );
      setFilteredData(newData);
    } else {
      setFilteredData([]);
    }
  };

  // 빈 상태를 렌더링하는 컴포넌트
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <IconGray width={120} height={120} style={{ opacity: 0.5 }} />
      <Text style={styles.emptyStateText}>일정 이름을 검색해보세요!</Text>
    </View>
  );

  // 검색 결과를 렌더링하는 컴포넌트
  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <View style={styles.resultItemHeader}>
        <View style={styles.dot} />
        <Text style={styles.resultTitle}>{item.title}</Text>
      </View>
      <View style={styles.resultTime}>
        <CalendarGray width={12} height={12} />
        <Text style={styles.resultCalendarTime}>{item.time}</Text>
        <Text style={styles.devide}>ㅣ</Text>
        <ClockGray width={12} height={12} />
        <Text style={styles.resultClockTime}>{item.time}</Text>
      </View>
    </View>
  );

  // 리스트 항목 사이에 선을 추가하는 구분선 컴포넌트
  const renderSeparator = () => (
    <View style={styles.separator} />
  );
  
  return (
    <View style={styles.container}>
      {/* 검색창 */}
      <View style={[styles.searchContainer, { borderColor: isFocused ? colors.skyBlue : colors.lightGrayBG }]}>
        <SearchIcon width={20} height={20} marginLeft={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="일정 이름을 검색해보세요"
          placeholderTextColor={colors.font04Gray}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={handleSearch}
        />
      </View>
      
      {/* 검색 결과 */}
      {filteredData.length === 0 && !searchText ? (
        renderEmptyState() // 검색어가 없을 때 빈 상태 표시
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          style={styles.resultList}
          ItemSeparatorComponent={renderSeparator}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGrayBG,
    borderRadius: 12,
    width: 335,
    height: 48,
    alignSelf: 'center',
    marginTop: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.black,
  },
  emptyStateContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: 160,
    position: 'absolute',
    top: 250,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.font04Gray,
    marginTop: 16,
  },
  resultList: {
    marginTop: 20,
    width: 335,
    alignSelf: 'center',
  },
  resultItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 60,
    marginTop: 25,
  },
  resultItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.listDotBlue,
    marginLeft: 4,
  },
  resultTitle: {
    fontSize: 14,
    color: colors.black,
    marginLeft: 20,
  },
  resultTime: {
    flexDirection: 'row',
    marginLeft: 31,
    marginTop: 10,
    alignItems: 'center',
  },
  resultCalendarTime: {
    fontSize: 11,
    color: colors.font03Gray,
    marginLeft: 3,
  },
  resultClockTime: {
    fontSize: 11,
    color: colors.font03Gray,
    marginLeft: 3,
  },
  devide: {
    fontSize: 10,
    color: colors.fontGray,
    marginHorizontal: 3,
  },
  separator: {
    height: 1,
    width: 335,
    backgroundColor: colors.ButtonDisableGray,
    marginVertical: 10,
  },
});
