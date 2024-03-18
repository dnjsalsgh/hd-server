import dayjs from 'dayjs';

export const isOneDayDifference = (date1: string, date2: string): boolean => {
  const day1 = dayjs(date1).startOf('day');
  const day2 = dayjs(date2).startOf('day');
  const difference = day2.diff(day1, 'day');

  return Math.abs(difference) >= 1;
};
