export const convertToTimeGrid = (scheduleData) => {
  let timeGrid = [
    [0],
    [0],
    [0],
    [0],
    [1],
    [1],
    [1],
    [1],
    [2],
    [2],
    [2],
    [2],
    [3],
    [3],
    [3],
    [3],
    [4],
    [4],
    [4],
    [4],
    [5],
    [5],
    [5],
    [5],
    [6],
    [6],
    [6],
    [6],
    [7],
    [7],
    [7],
    [7],
    [8],
    [8],
    [8],
    [8],
    [9],
    [9],
    [9],
    [9],
    [10],
    [10],
    [10],
    [10],
    [11],
    [11],
    [11],
    [11],
    [12],
    [12],
    [12],
    [12],
    [13],
    [13],
    [13],
    [13],
    [14],
    [14],
    [14],
    [14],
    [15],
    [15],
    [15],
    [15],
    [16],
    [16],
    [16],
    [16],
    [17],
    [17],
    [17],
    [17],
    [18],
    [18],
    [18],
    [18],
    [19],
    [19],
    [19],
    [19],
    [20],
    [20],
    [20],
    [20],
    [21],
    [21],
    [21],
    [21],
    [22],
    [22],
    [22],
    [22],
    [23],
    [23],
    [23],
    [23],
  ];

  let maxColumns = 0;
  let scheduleIndex = 0;

  for (const { id, title, startTime, endTime, backgroundColor } of scheduleData) {
    const [startHour, startMinute] = startTime.split(":").map((t) => parseInt(t));
    const [endHour, endMinute] = endTime.split(":").map((t) => parseInt(t));

    //15분 단위 => 행: 4칸 단위, 열: 1칸 단위

    //격자 찍기
    /* 
        예)
        00:00 -> 2:30

        startHour = 2
        startMinute = 30
        endHour = 3
        endMinute = 30

    */

    const startPoint = startHour * 4 + (startMinute > 0 ? startMinute / 15 : 0);
    const endPoint = endHour * 4 + (endMinute > 0 ? endMinute / 15 : 0);

    const totalDurationInMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
    const durationHours = parseInt(totalDurationInMinutes / 60);
    const durationMinutes = parseInt(totalDurationInMinutes % 60);

    const pxPerHour = 48;

    let cursor = 1;

    //시간 찍기
    for (let i = startPoint; i < endPoint; i++) {
      //겹치면 옆으로 이동
      while (typeof timeGrid[i]?.[cursor] !== "undefined") {
        if (typeof timeGrid[i][cursor] !== "string" && timeGrid[i][cursor] !== id)
          timeGrid[i][cursor] = 0;
        cursor++;
      }
      timeGrid[i][cursor] = id;
      cursor > maxColumns && (maxColumns = cursor);
    }

    for (let i = startPoint; i < endPoint; i++) {
      let index = 1;
      while (index < cursor) {
        if (typeof timeGrid[i]?.[index] !== "string" || timeGrid[i]?.[index] === id) {
          timeGrid[i][index] = 0;
        }
        index++;
      }

      timeGrid[i][index] = id;

      // startPoint, endPoint
      scheduleData[scheduleIndex].startPoint = startPoint;
      scheduleData[scheduleIndex].endPoint = endPoint;
      // 높이 계산
      scheduleData[scheduleIndex].calculatedHeight =
        pxPerHour * durationHours + 4 * 2 + pxPerHour * (durationMinutes / 60 || 1) - 8;
      // 몇 번 이동해야 되는지 기록
      scheduleData[scheduleIndex].push = cursor - 1;
      // yOffset
      scheduleData[scheduleIndex].yOffset =
        startMinute > 0 ? pxPerHour * (startMinute / 60) + 4 : 4;
      // 총 몇 분
      scheduleData[scheduleIndex].totalMinutes = durationMinutes;
    }

    scheduleIndex++;
  }

  scheduleIndex = 0; //인덱스 초기화

  for (const { id, startPoint, endPoint, push } of scheduleData) {
    let divider = 1,
      currentColumn = push + 1,
      adjacentColumns = new Set();

    for (let i = startPoint; i < endPoint; i++) {
      let cursor = 1;
      let nextColumn = currentColumn + cursor;
      let previousColumn = currentColumn - cursor;

      while (typeof timeGrid[i]?.[nextColumn] !== "undefined") {
        adjacentColumns.add(nextColumn);
        nextColumn++;
      }

      while (typeof timeGrid[i]?.[previousColumn] !== "undefined" && previousColumn > 0) {
        adjacentColumns.add(previousColumn);
        previousColumn--;
      }

      divider = adjacentColumns.size === 0 ? 1 : adjacentColumns.size + 1;
      // 열 개수
      scheduleData[scheduleIndex].columns = divider;

      // console.log(
      //   id + ", " + adjacentColumns.size + ": " + Array.from(adjacentColumns) + " - " + divider
      // );
    }

    scheduleIndex++;
  }

  console.log(timeGrid);

  return [scheduleData, maxColumns];
};
