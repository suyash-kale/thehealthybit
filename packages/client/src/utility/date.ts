export const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

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

export const internalFormat = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const formatDay = (date: Date): string => DAYS[date.getDay()];

export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.toLocaleString('default', { year: '2-digit' });
  return `${day} ${month} ${year}`;
};
