import { Event } from "./types";
export function getAlarmDate(events: Event[]): string | null {
  if (!events.length) {
    return null;
  }

  const firstEvents: Event[] = [];

  const firstEventDate = events[0].start.toISOString();

  for (const event of events) {
    const eventDate = event.start.toISOString();
    if (firstEventDate !== eventDate) {
      break;
    }

    firstEvents.push(event);
  }

  const isPersonalMeeting = firstEvents.some(
    (event) => event.calendarId === process.env.PERSONAL_CALENDAR_ID,
  );

  const minutesOffset = isPersonalMeeting
    ? parseInt(process.env.PERSONAL_OFFSET ?? "30")
    : parseInt(process.env.WORK_OFFSET ?? "30");

  const alarmIsoDate = events[0].start
    .subtract(minutesOffset, "minutes")
    .utc(true)
    .toISOString();

  const personalMeetingLogMessage = "You have a personal meeting tomorrow at";
  const workMeetingLogMessage = "You have a personal meeting tomorrow at";

  const logMessage = isPersonalMeeting
    ? personalMeetingLogMessage
    : workMeetingLogMessage;

  console.log(`${logMessage}: ${alarmIsoDate}`);

  return alarmIsoDate;
}
