import { parseISO, format, isToday, isYesterday } from 'date-fns';

export const formatTaskDate = (date: Date): string => {
  if (isToday(date)) {
    return `today at ${format(date, 'HH:mm')}`;
  }
  
  if (isYesterday(date)) {
    return `yesterday at ${format(date, 'HH:mm')}`;
  }
  
  // For older dates: "Monday 21st July at 18:00"
  return format(date, "EEEE do MMMM 'at' HH:mm");
};

export const parseTaskDate = (dateString: string): Date => {
  return parseISO(dateString);
};