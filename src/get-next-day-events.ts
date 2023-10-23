import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";
import { getCalendarEvents } from "./get-calendar-events";
import { Calendar, Event } from "./types";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

function getNextDayStartAndEndDateTime() {
  const today = dayjs().tz(process.env.TIMEZONE).add(0, "day");

  const start = today.startOf("day").tz(process.env.START_OF_DAY_TZ).utc(true);

  const end = today.endOf("day").tz(process.env.END_OF_DAY_TZ).utc(true);

  return [start, end].map((date) => date.toDate());
}

export async function getNextDayEvents(): Promise<Event[]> {
  const [start, end] = getNextDayStartAndEndDateTime();

  const calendars = [
    {
      accountId: process.env.PERSONAL_ACCOUNT_ID,
      id: process.env.PERSONAL_CALENDAR_ID,
    },
    {
      accountId: process.env.WORK1_ACCOUNT_ID,
      id: process.env.WORK1_CALENDAR_ID,
    },

    {
      accountId: process.env.WORK2_ACCOUNT_ID,
      id: process.env.WORK2_CALENDAR_ID,
    },
  ] as Calendar[];

  const promises = calendars.map((calendar) => {
    return getCalendarEvents({
      calendarIds: [calendar.id],
      accountId: calendar.accountId,
      start,
      end,
    });
  });

  const events = await Promise.all(promises);

  return events
    .flatMap((events) => events.data.events)
    .map(
      (event) =>
        ({
          start: dayjs.tz(event.start, event.timeZone).tz(process.env.TIMEZONE),
          title: event.title,
          timeZone: event.timeZone,
          calendarId: event.calendarId,
        }) as Event,
    )
    .filter((event) => {
      const today = dayjs().tz(process.env.TIMEZONE);

      return event.start.isBetween(today.startOf("day"), today.endOf("day"));
    })
    .sort((a, b) => (a.start > b.start ? 1 : -1));
}
