// 날짜 조정 함수
export function adjustDate(date: Date, hoursOffset: number): Date {
  return new Date(date.getTime() + hoursOffset * 60 * 60 * 1000);
}
