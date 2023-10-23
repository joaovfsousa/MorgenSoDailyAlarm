import dayjs from "dayjs";

export type Calendar = {
  id: string;
  accountId: string;
};

export type Event = {
  title: string;
  start: dayjs.Dayjs;
  timeZone: string;
  calendarId: string;
};
