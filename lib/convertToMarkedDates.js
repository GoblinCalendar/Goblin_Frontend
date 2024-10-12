export function convertToMarkedDates(events) {
  const markedDates = {};

  events.forEach((event) => {
    const date = event.startTime.split("T")[0]; // Extract the date part
    if (!markedDates[date]) {
      markedDates[date] = [];
    }

    const startDate = new Date(event?.startTime);
    const endDate = new Date(event?.endTime);

    const getStartHours = startDate?.getHours();
    const getStartMinutes = startDate?.getMinutes();

    const getEndHours = endDate?.getHours();
    const getEndMinutes = endDate.getMinutes();

    markedDates[date].push({
      marked: true,
      type: event?.type,
      id: event?.id,
      color: "#DDE9EE",
      title: event?.title,
      memo: event?.note,
      creator: event?.creator,
      selectedDate: date,
      date: `${getStartHours < 11 ? "오전" : "오후"} ${(getStartHours < 11
        ? getStartHours
        : getStartHours === 12
        ? 12
        : getStartHours - 12
      )?.toString()}:${getStartMinutes?.toString()?.padStart(2, "0")} ~ ${
        getEndHours < 11 ? "오전" : "오후"
      } ${(getEndHours < 11
        ? getEndHours
        : getEndHours === 12
        ? 12
        : getEndHours - 12
      )?.toString()}:${getEndMinutes?.toString()?.padStart(2, "0")}`,
    });
  });

  return markedDates;
}
