import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import SearchIcon from '../../assets/search_black.svg';
import IconGray from '../../assets/icon_gray.svg';
import colors from '../../styles/colors';
import ClockGray from '../../assets/clock_gray.svg';
import CalendarGray from '../../assets/calendar_gray.svg';
import apiClient from "../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../../context/UserContext";
import { useRouter } from 'expo-router';

export default function Search() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);  // 검색 후 보여줄 데이터를 저장
  const [originalData, setOriginalData] = useState([]);  // 전체 데이터를 저장할 상태
  const [isSearching, setIsSearching] = useState(false); // 검색 중인지 여부
  const { groupId } = useContext(UserContext);
  const router = useRouter();

  // 날짜 형식을 변환하는 함수 (오전/오후 형식으로)
  const formatTime = (startDateTime, endDateTime) => {
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? '오후' : '오전';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0시일 때 12시로 표시
      return `${ampm} ${hours}:${minutes}`;
    };

    const formattedStart = formatDate(startDateTime);
    const formattedEnd = formatDate(endDateTime);

    return `${formattedStart} ~ ${formattedEnd}`;
  };

  // selectedDates에서 가장 이른 날짜와 가장 늦은 날짜를 찾는 함수
  const formatSelectedDates = (selectedDates) => {
    if (selectedDates.length === 0) return '';
    const sortedDates = selectedDates.sort();
    const earliestDate = new Date(sortedDates[0]);
    const latestDate = new Date(sortedDates[sortedDates.length - 1]);

    const formatDate = (date) => `${date.getMonth() + 1}.${date.getDate()}`;

    return `${formatDate(earliestDate)} ~ ${formatDate(latestDate)}`;
  };

  // API에서 데이터를 불러오는 함수
  const fetchCalendarData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await apiClient.get(`/api/groups/${groupId}/calendar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedData = response.data.map(item => ({
        id: item.id,
        title: item.title,
        time: formatTime(
          item.selectedDateTimes[0].startDateTime,
          item.selectedDateTimes[0].endDateTime
        ),
        selectedDates: formatSelectedDates(item.selectedDates),
      }));
      setOriginalData(formattedData);  // 원본 데이터를 저장
    } catch (error) {
      console.error('캘린더 데이터를 가져오는 중 오류 발생:', error);
  
      // 에러 응답 본문 확인
      if (error.response) {
        console.error('에러 응답 상태 코드:', error.response.status); // 상태 코드
        console.error('에러 응답 본문:', error.response.data); // 에러 본문
      } else {
        console.error('응답을 받지 못했습니다. 네트워크 오류일 수 있습니다.');
      }
    }
  };

  useEffect(() => {
    fetchCalendarData(); // 컴포넌트가 로드될 때 API 호출
  }, []);

  // 검색어에 따라 데이터를 필터링하는 함수
  const handleSearch = (text) => {
    setSearchText(text);
    setIsSearching(true);  // 검색을 시작했음을 표시

    if (text) {
      const newData = originalData.filter(item =>
        item.title.includes(text)  // 일정 이름에 검색어가 포함된 데이터만 필터링
      );
      setFilteredData(newData);
    } else {
      setFilteredData([]); // 검색어가 없으면 결과를 초기화
    }
  };

  // 빈 상태를 렌더링하는 컴포넌트
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <IconGray width={120} height={120} style={{ opacity: 0.5 }} />
      <Text style={styles.emptyStateText}>일정 이름을 검색해보세요!</Text>
      <TouchableOpacity onPress={() => router.push('/HostEventConfirm')} style={styles.button}>
        <Text style={styles.buttonText}>일정 확정</Text>
      </TouchableOpacity>
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
        <Text style={styles.resultCalendarTime}>{item.selectedDates}</Text>
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
      
      {/* 검색 결과 또는 빈 상태 */}
      {filteredData.length === 0 ? (
        renderEmptyState()  // 검색 결과가 없으면 빈 상태를 표시
      ) : (
        <FlatList
          data={filteredData}  // 검색 결과 데이터를 표시
          keyExtractor={item => item.id.toString()}
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
