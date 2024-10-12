export function convertPinnedToMarkedDates(events, month, type) {
  const result = {};
  const year = new Date().getFullYear();
  const lastDay = new Date(year, month, 0).getDate();

  // 요일을 숫자로 매핑하는 객체
  const dayMap = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };

  // 시간을 '오전/오후 HH:MM' 형식으로 변환하는 함수
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return new Date(year, month - 1, 1, hours, minutes)
      .toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace("AM", "오전")
      .replace("PM", "오후");
  };

  // 날짜를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
  const formatDate = (year, month, day) =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // 이벤트 객체를 생성하는 함수
  const createEventObject = (event, formattedDate) => ({
    color: `#${event?.color}`,
    creator: event?.userName,
    date: `${formatTime(event?.startTime)} ~ ${formatTime(event?.endTime)}`,
    id: event?.id,
    marked: true,
    memo: null,
    title: event?.scheduleName,
    dayOfWeek: event?.dayOfWeek,
    type,
  });

  // 요일별 날짜를 미리 계산
  const datesByDayOfWeek = Array(7)
    .fill()
    .map(() => []);
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month - 1, day);
    datesByDayOfWeek[date.getDay()].push(day);
  }

  // 각 이벤트에 대해 처리
  events.forEach((event) => {
    // 이벤트가 발생하는 모든 날짜를 계산
    const relevantDays = event.dayOfWeek.flatMap((day) => datesByDayOfWeek[dayMap[day]]);

    // 각 관련 날짜에 대해 이벤트 객체 생성 및 결과에 추가
    relevantDays.forEach((day) => {
      const formattedDate = formatDate(year, month, day);
      if (!result[formattedDate]) {
        result[formattedDate] = [];
      }
      result[formattedDate].push(createEventObject(event, formattedDate));
    });
  });

  return result;
}
