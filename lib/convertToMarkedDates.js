export function convertToMarkedDates(events) {
  const markedDates = {};

  events.forEach((event) => {
    const date = event.startTime.split("T")[0]; // Extract the date part
    if (!markedDates[date]) {
      markedDates[date] = [];
    }
    markedDates[date].push({
      marked: true,
      title: event.title,
    });
  });

  return markedDates;
}
