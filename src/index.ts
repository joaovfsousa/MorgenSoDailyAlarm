import "dotenv/config";
import { getNextDayEvents } from "./get-next-day-events";
import { getAlarmDate } from "./get-alarm-date";
import { scheduleInAlexa } from "./schedule-in-alexa";

export async function run() {
  const events = await getNextDayEvents();

  const alarmDate = getAlarmDate(events);

  if (!alarmDate) {
    console.warn("No events found");
    return;
  }

  await scheduleInAlexa(alarmDate);
}

// run()
