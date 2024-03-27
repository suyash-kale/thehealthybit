export const getWeek = (currentDate: Date = new Date()): Array<Date> => {
  const currentDay = currentDate.getDay();
  const firstDay = new Date(currentDate);
  firstDay.setDate(currentDate.getDate() - currentDay + 1);
  return [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const nextDay = new Date(firstDay);
    nextDay.setDate(firstDay.getDate() + i);
    return nextDay;
  });
};
