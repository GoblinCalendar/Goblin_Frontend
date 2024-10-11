export const mergeMarkedDates = (generalMarkedDates, pinnedMarkedDates) => {
  const merged = { ...pinnedMarkedDates }; // Start with pinnedMarkedDates

  // Loop through generalMarkedDates and merge arrays, with pinnedMarkedDates first
  for (const key in generalMarkedDates) {
    if (merged[key]) {
      // If the key exists in pinnedMarkedDates, prepend the arrays
      merged[key] = [...pinnedMarkedDates[key], ...generalMarkedDates[key]];
    } else {
      // If the key doesn't exist, simply add the key-value pair
      merged[key] = generalMarkedDates[key];
    }
  }

  return merged;
};
